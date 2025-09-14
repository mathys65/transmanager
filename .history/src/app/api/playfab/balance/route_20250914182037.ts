// src/app/api/playfab/balance/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfab/playfabServer";

export async function GET() {
  const playfabId = cookies().get("playfab_id")?.value;
  if (!playfabId) return NextResponse.json({ error: "Aucun joueur connecté" }, { status: 401 });

  try {
    const PlayFabServer = getPlayFabServer();
    const inv = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetUserInventory({ PlayFabId: playfabId }, (err: any, res: any) =>
        err ? reject(err) : resolve(res)
      );
    });

    return NextResponse.json({
      balances: inv?.data?.VirtualCurrency ?? {},
      recharge: inv?.data?.VirtualCurrencyRechargeTimes ?? {},
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.apiErrorInfo?.errorMessage || e?.message || "Erreur PlayFab" },
      { status: 500 }
    );
  }
}
