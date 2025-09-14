// src/lib/progression.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPlayFabServer } from "@/lib/playfab/playfabServer";

export async function ensureBaseStats(playfabId: string) {
  const Server = getPlayFabServer();

  // Lire les stats actuelles
  const st = await new Promise<any>((ok, ko) =>
    Server.GetPlayerStatistics({ PlayFabId: playfabId }, (e: any, r: any) => (e ? ko(e) : ok(r)))
  );
  const arr: Array<{ StatisticName: string; Value: number }> = st?.data?.Statistics ?? [];
  const map: Record<string, number> = {};
  for (const s of arr) map[s.StatisticName] = s.Value;

  const updates: Array<{ StatisticName: string; Value: number }> = [];

  const currentLevel = Number.isFinite(map.Level) ? map.Level : null;
  if (!currentLevel || currentLevel < 1) {
    updates.push({ StatisticName: "Level", Value: 1 });
  }

  const currentXP = Number.isFinite(map.XP) ? map.XP : null;
  if (currentXP == null || currentXP < 0) {
    updates.push({ StatisticName: "XP", Value: 0 });
  }

  if (updates.length > 0) {
    await new Promise<void>((ok, ko) =>
      Server.UpdatePlayerStatistics(
        { PlayFabId: playfabId, Statistics: updates },
        (e: any) => (e ? ko(e) : ok())
      )
    );
  }

  return {
    updated: updates.length > 0,
    level: currentLevel && currentLevel >= 1 ? currentLevel : 1,
    xp: currentXP && currentXP >= 0 ? currentXP : 0,
  };
}
