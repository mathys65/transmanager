// src/app/api/dashboard/overview/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PlayFabServer } from "@/lib/playfabServer";

const CURRENCY_CODE = "UE"; // ta monnaie 2 lettres

type Overview = {
  companyName: string | null;
  balance: number | null;
  fleetCount: number | null;
  warehousesActive: number | null;
  activeContracts: number | null;
  customerSatisfaction: number | null;
};

function toNum(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
  return null;
}

export async function GET() {
  const playfabId = cookies().get("playfab_id")?.value;
  if (!playfabId) return NextResponse.json({ error: "Aucun joueur connecté" }, { status: 401 });

  try {
    const acc = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetAccountInfo({ PlayFabId: playfabId }, (err, res) => (err ? reject(err) : resolve(res)));
    });

    const companyName: string | null =
      acc?.data?.AccountInfo?.TitleInfo?.DisplayName ??
      acc?.data?.AccountInfo?.Username ??
      null;

    const inv = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetUserInventory({ PlayFabId: playfabId }, (err, res) => (err ? reject(err) : resolve(res)));
    });
    const balance = toNum(inv?.data?.VirtualCurrency?.[CURRENCY_CODE]);

    const st = await new Promise<any>((resolve, reject) => {
      PlayFabServer.GetPlayerStatistics({ PlayFabId: playfabId }, (err, res) => (err ? reject(err) : resolve(res)));
    });
    const statsArr: Array<{ StatisticName: string; Value: number }> = st?.data?.Statistics ?? [];
    const stats: Record<string, number> = {};
    for (const s of statsArr) stats[s.StatisticName] = s.Value;

    const overview: Overview = {
      companyName,
      balance: balance ?? null,                           // solde UE
      fleetCount: toNum(stats["FleetCount"]),
      warehousesActive: toNum(stats["Warehouses"]),
      activeContracts: toNum(stats["ActiveContracts"]),
      customerSatisfaction: toNum(stats["CustomerSatisfaction"]),
    };

    return NextResponse.json(overview);
  } catch (e: any) {
    return NextResponse.json({ error: e?.apiErrorInfo?.errorMessage || e?.message || "Erreur PlayFab" }, { status: 500 });
    // si e.apiErrorInfo existe, PlayFab renvoie le message exact
  }
}
