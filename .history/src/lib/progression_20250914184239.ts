import { getPlayFabServer } from "@/lib/playfabServer";

export type Curve = number[] | undefined;

// Palier requis pour passer du niveau "level" au suivant.
// Si une LevelCurve (TitleData["LevelCurve"]) existe, on l'utilise.
// Sinon fallback: besoin = 1000 * level.
export function reqForLevel(level: number, curve?: Curve): number {
  if (level <= 0) level = 1;
  if (curve && curve[level - 1] != null) {
    const v = Number(curve[level - 1]);
    return Number.isFinite(v) && v > 0 ? v : level * 1000;
  }
  return level * 1000;
}

export async function readCurve(Server: any): Promise<number[] | undefined> {
  const title = await new Promise<any>((resolve, reject) => {
    Server.GetTitleData({ Keys: ["LevelCurve"] }, (e: any, r: any) => (e ? reject(e) : resolve(r)));
  });
  const raw = title?.data?.Data?.LevelCurve;
  try { return raw ? JSON.parse(raw) : undefined; } catch { return undefined; }
}

export async function readStats(Server: any, playFabId: string) {
  const stats = await new Promise<any>((resolve, reject) => {
    Server.GetPlayerStatistics(
      { PlayFabId: playFabId, StatisticNames: ["Level", "XP"] },
      (e: any, r: any) => (e ? reject(e) : resolve(r))
    );
  });
  const map = new Map((stats?.data?.Statistics ?? []).map((s: any) => [s.StatisticName, s.Value]));
  const level = Math.max(1, Number(map.get("Level") ?? 1));
  const xp    = Math.max(0, Number(map.get("XP") ?? 0)); // XP local au niveau
  return { level, xp };
}

export async function writeStats(Server: any, playFabId: string, level: number, xp: number) {
  await new Promise<void>((resolve, reject) => {
    Server.UpdatePlayerStatistics(
      {
        PlayFabId: playFabId,
        Statistics: [
          { StatisticName: "Level", Value: level },
          { StatisticName: "XP",    Value: xp    },
        ],
      },
      (e: any) => (e ? reject(e) : resolve())
    );
  });
}

// Ajoute deltaXp (peut être grand) et "carry" sur autant de niveaux que nécessaire.
// L'XP stockée reste TOUJOURS locale au niveau courant.
// Ex: lvl=4, xp=0, delta=4001  => lvl=5, xp=1.
export async function grantXpAndLevelUp(playFabId: string, deltaXp: number) {
  const Server = getPlayFabServer();
  const curve = await readCurve(Server);

  let { level, xp } = await readStats(Server, playFabId);

  // normalisation delta
  if (!Number.isFinite(deltaXp)) deltaXp = 0;
  deltaXp = Math.trunc(deltaXp);
  // anti-extrêmes
  if (deltaXp > 10_000_000) deltaXp = 10_000_000;
  if (deltaXp < -10_000_000) deltaXp = -10_000_000;

  // appliquer delta (XP locale); pas de négatif
  xp = Math.max(0, xp + deltaXp);

  // carry multi-niveaux
  let safety = 0;
  while (true) {
    const need = reqForLevel(level, curve);
    if (xp >= need) {
      xp -= need;     // on "consomme" le palier
      level += 1;     // on monte d'un niveau
      if (level > 9999) { level = 9999; xp = 0; break; }
    } else {
      break;
    }
    if (++safety > 100000) { // sécurité théorique
      break;
    }
  }

  await writeStats(Server, playFabId, level, xp);

  const xpForNext = reqForLevel(level, curve);
  const xpIntoLevel = xp;
  const progress = xpForNext > 0 ? Math.min(1, xpIntoLevel / xpForNext) : 0;

  return { level, xp, xpIntoLevel, xpForNext, progress };
}
