// src/lib/level.ts
import { getPlayFabServer } from "@/lib/playfab/playfabServer";
import { getConfig } from "./featureGates";

export async function readLevel(playfabId: string) {
  const Server = getPlayFabServer();
  const st = await new Promise<any>((ok,ko) =>
    Server.GetPlayerStatistics({ PlayFabId: playfabId }, (e,r)=> e?ko(e):ok(r))
  );
  const stats: Record<string, number> = {};
  for (const s of (st?.data?.Statistics ?? [])) stats[s.StatisticName] = s.Value;
  return { level: stats.Level ?? 1, xp: stats.XP ?? 0 };
}

export async function canUse(playfabId: string, feature: string) {
  const { gates } = await getConfig();
  const { level } = await readLevel(playfabId);
  const min = gates[feature] ?? 1;  // par défaut accessible au lvl 1
  return { allowed: level >= min, level, min };
}
