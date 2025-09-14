import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfabServer";

export async function POST() {
  const c = cookies();
  const playFabId = c.get("playfab_id")?.value;
  if (!playFabId) {
    return NextResponse.json({ error: "Non authentifié (cookie playfab_id manquant)" }, { status: 401 });
  }

  const Server = getPlayFabServer();

  // Force Level=1 & XP=0
  await new Promise<void>((resolve, reject) => {
    Server.UpdatePlayerStatistics(
      {
        PlayFabId: playFabId,
        Statistics: [
          { StatisticName: "Level", Value: 1 },
          { StatisticName: "XP", Value: 0 },
        ],
      },
      (err: any) => (err ? reject(err) : resolve())
    );
  });

  // Relit pour renvoyer l'état
  const statsRes: any = await new Promise((resolve, reject) => {
    Server.GetPlayerStatistics(
      { PlayFabId: playFabId, StatisticNames: ["Level", "XP"] },
      (err: any, res: any) => (err ? reject(err) : resolve(res))
    );
  });

  const map = new Map((statsRes?.data?.Statistics ?? []).map((s: any) => [s.StatisticName, s.Value]));
  return NextResponse.json({ level: map.get("Level") ?? null, xp: map.get("XP") ?? null });
}
