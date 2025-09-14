export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getPlayFabServer } from "@/lib/playfab/getPlayFabServer";

const pf = <T,>(fn: (cb:(e:any,r:any)=>void)=>void)=>new Promise<T>((res,rej)=>fn((e:any,r:any)=>e?rej(e):res(r)));

export async function GET() {
  try {
    const Server = getPlayFabServer();
    // appel simple qui nécessite seulement la clé secrète
    const td = await pf<any>(cb => Server.GetTitleData({ Keys: [] }, cb));
    return NextResponse.json({ ok:true, titleId: process.env.PLAYFAB_TITLE_ID, titleDataKeys: Object.keys(td?.data?.Data??{}) });
  } catch (e:any) {
    return NextResponse.json({
      ok:false,
      message: e?.errorMessage || e?.message || String(e),
      code: e?.code ?? null,
      details: e?.errorDetails ?? e?.details ?? null
    }, { status:500 });
  }
}
