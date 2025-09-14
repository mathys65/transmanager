import { getPlayFabServer } from "./getPlayFabServer";

export async function ensureBaseStats(playFabId: string) {
  const Server = getPlayFabServer();

  // 1) Lire les stats existantes
  const stats = await new Promise<any>((resolve, reject) => {
    Server.GetPlayerStatistics(
      { PlayFabId: playFabId, StatisticNames: ["Level", "XP"] },
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });

  const current = new Map(
    (stats?.data?.Statistics ?? []).map((s: any) => [s.StatisticName, s.Value])
  );
  const hasLevel = current.has("Level");
  const hasXP = current.has("XP");

  // 2) Si manquantes, définir Level=1 et XP=0
  if (!hasLevel || !hasXP) {
    await new Promise<void>((resolve, reject) => {
      Server.UpdatePlayerStatistics(
        {
          PlayFabId: playFabId,
          Statistics: [
            { StatisticName: "Level", Value: hasLevel ? current.get("Level") : 1 },
            { StatisticName: "XP", Value: hasXP ? current.get("XP") : 0 },
          ],
        },
        (err) => (err ? reject(err) : resolve())
      );
    });
  }
}
