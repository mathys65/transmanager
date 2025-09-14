export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfab/getPlayFabServer";

const pf = <T,>(fn: (cb: (e:any,r:any)=>void)=>void) =>
  new Promise<T>((res,rej)=>fn((e:any,r:any)=>e?rej(e):res(r)));

export async function GET() {
  try {
    const playFabId = cookies().get("playfab_id")?.value;
    if (!playFabId) return NextResponse.json({ error:"Unauthenticated" }, { status:401 });

    const Server = getPlayFabServer();

    const inv = await pf<any>(cb => Server.GetUserInventory({ PlayFabId: playFabId }, cb));
    const balance = inv?.data?.VirtualCurrency?.EU ?? 0;

    let level: number | null = null, xp: number | null = null;
    try {
      const stats = await pf<any>(cb => Server.GetPlayerStatistics({ PlayFabId: playFabId }, cb));
      const arr: Array<{StatisticName:string;Value:number}> = stats?.data?.Statistics ?? [];
      level = arr.find(s=>s.StatisticName==="Level")?.Value ?? null;
      xp    = arr.find(s=>s.StatisticName==="XP")?.Value ?? null;
    } catch {}

    const data = await pf<any>(cb => Server.GetUserData({ PlayFabId: playFabId, Keys:["Warehouses"] }, cb));
    let warehousesActive = 0;
    try {
      const raw = data?.data?.Data?.Warehouses?.Value;
      const items = raw ? JSON.parse(raw) : [];
      if (Array.isArray(items)) warehousesActive = items.length;
    } catch {}

    let xpIntoLevel:null|number=null, xpForNext:null|number=null, progress:null|number=null;
    if (typeof level==="number" && typeof xp==="number") {
      const need = (lvl:number)=>1000*lvl;
      const needNow = need(level);
      xpIntoLevel = xp % needNow;
      xpForNext = needNow;
      progress = needNow? xpIntoLevel/needNow : 0;
    }

    return NextResponse.json({
      companyName: null,
      balance,
      fleetCount: null,
      warehousesActive,
      activeContracts: null,
      customerSatisfaction: null,
      level, xp, xpIntoLevel, xpForNext, progress
    });
  } catch (e:any) {
    const payload = {
      error: "PlayFabError",
      message: e?.errorMessage || e?.message || String(e),
      code: e?.code ?? null,
      details: e?.errorDetails ?? e?.details ?? null,
      haveEnv: !!process.env.PLAYFAB_TITLE_ID && !!process.env.PLAYFAB_DEV_SECRET_KEY,
    };
    console.error("[overview] PlayFab error:", payload);
    return NextResponse.json(payload, { status:500 });
  }
}
