export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfab/getPlayFabServer";

function pf<T>(fn: (cb: (e:any, r:any)=>void)=>void): Promise<T> {
  return new Promise((resolve, reject) => fn((e:any, r:any) => (e ? reject(e) : resolve(r))));
}

export async function GET() {
  try {
    const playFabId = cookies().get("playfab_id")?.value;
    if (!playFabId) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const Server = getPlayFabServer();

    // Solde EU
    const inv = await pf<any>(cb => Server.GetUserInventory({ PlayFabId: playFabId }, cb));
    const balance = inv?.data?.VirtualCurrency?.EU ?? 0;

    // Stats (Level / XP si tu les utilises)
    let level: number | null = null;
    let xp: number | null = null;
    try {
      const stats = await pf<any>(cb => Server.GetPlayerStatistics({ PlayFabId: playFabId }, cb));
      const arr: Array<{ StatisticName:string; Value:number }> = stats?.data?.Statistics ?? [];
      level = arr.find(s => s.StatisticName === "Level")?.Value ?? null;
      xp    = arr.find(s => s.StatisticName === "XP")?.Value ?? null;
    } catch {}

    // Entrepôts
    const data = await pf<any>(cb => Server.GetUserData({ PlayFabId: playFabId, Keys: ["Warehouses"] }, cb));
    let warehousesActive = 0;
    try {
      const raw = data?.data?.Data?.Warehouses?.Value;
      if (raw) {
        const items = JSON.parse(raw);
        if (Array.isArray(items)) warehousesActive = items.length;
      }
    } catch {}

    // KPI placeholders
    const fleetCount = null;
    const activeContracts = null;
    const customerSatisfaction = null;

    // Progression XP (si applicable)
    let xpIntoLevel: number | null = null;
    let xpForNext: number | null   = null;
    let progress: number | null    = null;
    if (typeof level === "number" && typeof xp === "number") {
      const need = (lvl:number) => 1000 * lvl;
      const needNow = need(level);
      xpIntoLevel = xp % needNow;
      xpForNext   = needNow;
      progress    = needNow ? xpIntoLevel / needNow : 0;
    }

    return NextResponse.json({
      companyName: null,
      balance,
      fleetCount,
      warehousesActive,
      activeContracts,
      customerSatisfaction,
      level,
      xp,
      xpIntoLevel,
      xpForNext,
      progress,
    });
  } catch (e:any) {
    const payload = {
      error: "PlayFabError",
      message: e?.errorMessage || e?.message || String(e),
      code: e?.code ?? null,
      details: e?.errorDetails ?? e?.details ?? null,
    };
    console.error("[overview] PlayFab error:", payload);
    return NextResponse.json(payload, { status: 500 });
  }
}
