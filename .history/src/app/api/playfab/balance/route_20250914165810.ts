// src/app/api/playfab/balance/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PlayFabServer } from "@/lib/playfabServer";

export async function GET() {
  const cookieStore = cookies();
  const playfabId = cookieStore.get("playfab_id")?.value;

  if (!playfabId) {
    return NextResponse.json({ error: "Aucun joueur connecté" }, { status: 401 });
  }

  // GetUserInventory renvoie les soldes de monnaie virtuelle
  const inv = await new Promise<any>((resolve, reject) => {
    PlayFabServer.GetUserInventory({ PlayFabId: playfabId }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

  // VirtualCurrency est un dictionnaire { "EU": number, ... }
  const balances = inv?.data?.VirtualCurrency ?? {};
  const recharge = inv?.data?.VirtualCurrencyRechargeTimes ?? {};

  return NextResponse.json({ balances, recharge });
}
