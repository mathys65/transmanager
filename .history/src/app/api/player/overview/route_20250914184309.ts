// src/app/api/player/overview/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { grantXpAndLevelUp } from "@/lib/progression";

export async function GET() {
  try {
    const c = cookies();
    const playFabId = c.get("playfab_id")?.value;
    if (!playFabId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    // Normalisation: si xp >= palier, on applique le level-up ici.
    const updated = await grantXpAndLevelUp(playFabId, 0);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur interne" }, { status: 500 });
  }
}
