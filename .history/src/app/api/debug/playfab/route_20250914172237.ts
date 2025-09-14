// src/app/api/debug/playfab/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfabServer";

export async function GET() {
  const playfabId = cookies().get("playfab_id")?.value;
  if (!playfabId) return NextResponse.json({ ok: false, error: "Aucun joueur connecté (cookie playfab_id manquant)" }, { status: 401 });

  try {
    const PlayFabServer = getPlayFabServer();

    // 1) Ping simple: inventaire (renvoie aussi les monnaies)
    const inv = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetUserInventory({ PlayFabId: playfabId }, (err: any, res: any) =>
        err ? reject(err) : resolve(res)
      );
    });

    // 2) Compte (API Server = GetUserAccountInfo)
    const acc = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetUserAccountInfo({ PlayFabId: playfabId }, (err: any, res: any) =>
        err ? reject(err) : resolve(res)
      );
    });

    // 3) Stats
    const st = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetPlayerStatistics({ PlayFabId: playfabId }, (err: any, res: any) =>
        err ? reject(err) : resolve(res)
      );
    });

    return NextResponse.json({
      ok: true,
      playfabId,
      currencies: inv?.data?.VirtualCurrency ?? {},
      displayName: acc?.data?.UserInfo?.TitleInfo?.DisplayName ?? null,
      username: acc?.data?.UserInfo?.Username ?? null,
      stats: st?.data?.Statistics ?? [],
    });
  } catch (e: any) {
    // remonte l’info PlayFab brute pour diagnostiquer
    return NextResponse.json({
      ok: false,
      message: e?.message ?? "Erreur PlayFab",
      apiErrorInfo: e?.apiErrorInfo ?? null,
    }, { status: 500 });
  }
}
