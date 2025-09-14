// src/app/api/playfab/balance/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfabServer";

export async function GET() {
  const playfabId = cookies().get("playfab_id")?.value;
  if (!playfabId) return NextResponse.json({ error: "Aucun joueur connecté" }, { status: 401 });

  try {
    const PlayFabServer = getPlayFabServer();
    const inv = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetUserInventory({ PlayFabId: playfabId }, (err, res) => (err ? reject(err) : resolve(res)));
    });

    const balances = inv?.data?.VirtualCurrency ?? {};
    const recharge = inv?.data?.VirtualCurrencyRechargeTimes ?? {};
    return NextResponse.json({ balances, recharge });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.apiErrorInfo?.errorMessage || e?.message || "Erreur PlayFab" },
      { status: 500 }
    );
  }
}
