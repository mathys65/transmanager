import { getPlayFabServer } from "@/lib/playfabServer";

export async function ensureBaseStats(playFabId: string) {
  const Server = getPlayFabServer();

  const statsRes: any = await new Promise((resolve, reject) => {
    Server.GetPlayerStatistics(
      { PlayFabId: playFabId, StatisticNames: ["Level", "XP"] },
      (err: any, res: any) => (err ? reject(err) : resolve(res))
    );
  });

  const current = new Map(
    (statsRes?.data?.Statistics ?? []).map((s: any) => [s.StatisticName, s.Value])
  );

  // fallback automatique
  const level = current.get("Level") ?? 1;
  const xp = current.get("XP") ?? 0;

  await new Promise<void>((resolve, reject) => {
    Server.UpdatePlayerStatistics(
      {
        PlayFabId: playFabId,
        Statistics: [
          { StatisticName: "Level", Value: level },
          { StatisticName: "XP", Value: xp }
        ],
      },
      (err: any) => (err ? reject(err) : resolve())
    );
  });
}
