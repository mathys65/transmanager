import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfabServer";
import { grantXpAndLevelUp, readCurve, readStats, reqForLevel } from "@/lib/progression";

export async function POST(req: Request) {
  try {
    const c = cookies();
    const playFabId = c.get("playfab_id")?.value;
    if (!playFabId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount ?? 0);

    const updated = await grantXpAndLevelUp(playFabId, amount);
    return NextResponse.json({ ok: true, ...updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur" }, { status: 500 });
  }
}

// GET = lecture simple (utile pour debugger)
export async function GET() {
  try {
    const c = cookies();
    const playFabId = c.get("playfab_id")?.value;
    if (!playFabId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const Server = getPlayFabServer();
    const curve = await readCurve(Server);
    const { level, xp } = await readStats(Server, playFabId);
    const need = reqForLevel(level, curve);
    const progress = need ? Math.max(0, Math.min(1, xp / need)) : 0;

    return NextResponse.json({ level, xp, xpForNext: need, xpIntoLevel: xp, progress });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur" }, { status: 500 });
  }
}
