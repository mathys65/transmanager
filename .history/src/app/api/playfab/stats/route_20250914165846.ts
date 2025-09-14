// src/app/api/playfab/stats/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PlayFabServer } from "@/lib/playfabServer";

export async function GET() {
  const cookieStore = cookies();
  const playfabId = cookieStore.get("playfab_id")?.value;

  if (!playfabId) {
    return NextResponse.json({ error: "Aucun joueur connecté" }, { status: 401 });
  }

  const out = await new Promise<any>((resolve, reject) => {
    PlayFabServer.GetPlayerStatistics({ PlayFabId: playfabId }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

  // Format PlayFab: { Statistics: [{ StatisticName, Value, Version }, ...] }
  const statsArr: Array<{ StatisticName: string; Value: number }> =
    out?.data?.Statistics ?? [];
  const stats: Record<string, number> = {};
  for (const s of statsArr) stats[s.StatisticName] = s.Value;

  return NextResponse.json({ stats });
}
