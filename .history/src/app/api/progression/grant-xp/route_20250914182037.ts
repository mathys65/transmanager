// src/app/api/progression/grant-xp/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfab/playfabServer";
import { getConfig, } from "@/lib/featureGates";
import { readLevel } from "@/lib/level";

export async function POST(req: Request) {
  const playfabId = cookies().get("playfab_id")?.value;
  if (!playfabId) return NextResponse.json({ error: "401" }, { status: 401 });

  const { amount } = await req.json(); // ex. { amount: 50 }
  const Server = getPlayFabServer();

  // 1) add XP
  await new Promise((ok,ko)=>
    Server.UpdatePlayerStatistics({
      PlayFabId: playfabId,
      Statistics: [{ StatisticName: "XP", Value: amount }] // valeur absolue ? non → on préfère incrément
    }, (e)=> e?ko(e):ok(null))
  );

  // 2) recalc level
  const { curve } = await getConfig();
  const { xp } = await readLevel(playfabId);

  // cumule la courbe
  let next = 1, sum = 0;
  while (curve[String(next+1)] != null) {
    sum += Number(curve[String(next+1)]); // XP requise pour passer au niveau suivant
    if (xp >= sum) next++; else break;
  }

  await new Promise((ok,ko)=>
    Server.UpdatePlayerStatistics({
      PlayFabId: playfabId,
      Statistics: [{ StatisticName: "Level", Value: next }]
    }, (e)=> e?ko(e):ok(null))
  );

  return NextResponse.json({ ok: true, xp, level: next });
}
