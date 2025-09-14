// src/app/api/dashboard/overview/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfab/playfabServer";

const CURRENCY_CODE = "EU"; // ← 2 lettres

function toNum(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
  return null;
}

export async function GET() {
  const playfabId = cookies().get("playfab_id")?.value;
  if (!playfabId) {
    return NextResponse.json({ error: "Aucun joueur connecté (cookie playfab_id manquant)" }, { status: 401 });
  }

  try {
    const PlayFabServer = getPlayFabServer();

    // Server API : GetUserAccountInfo
    const acc = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetUserAccountInfo({ PlayFabId: playfabId }, (err: any, res: any) =>
        err ? reject(err) : resolve(res)
      );
    });
    const companyName: string | null =
      acc?.data?.UserInfo?.TitleInfo?.DisplayName ??
      acc?.data?.UserInfo?.Username ??
      null;

    // Inventaire → monnaies
    const inv = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetUserInventory({ PlayFabId: playfabId }, (err: any, res: any) =>
        err ? reject(err) : resolve(res)
      );
    });
    const balance = toNum(inv?.data?.VirtualCurrency?.[CURRENCY_CODE]);

    // Stats
    const st = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetPlayerStatistics({ PlayFabId: playfabId }, (err: any, res: any) =>
        err ? reject(err) : resolve(res)
      );
    });
    const statsArr: Array<{ StatisticName: string; Value: number }> = st?.data?.Statistics ?? [];
    const stats: Record<string, number> = {};
    for (const s of statsArr) stats[s.StatisticName] = s.Value;

    return NextResponse.json({
      companyName,
      balance: balance ?? null,                 // solde EU
      fleetCount: toNum(stats["FleetCount"]),
      warehousesActive: toNum(stats["Warehouses"]),
      activeContracts: toNum(stats["ActiveContracts"]),
      customerSatisfaction: toNum(stats["CustomerSatisfaction"]),
    });
  } catch (e: any) {
    const msg = e?.apiErrorInfo?.errorMessage || e?.message || "Erreur PlayFab";
    const code = e?.apiErrorInfo?.error ?? "PlayFabError";
    return NextResponse.json({ error: `${code}: ${msg}`, details: e?.apiErrorInfo ?? null }, { status: 500 });
  }
}
