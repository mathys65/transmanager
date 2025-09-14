// src/app/api/warehouses/create/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { canUse } from "@/lib/level";

export async function POST(req: Request) {
  const playfabId = cookies().get("playfab_id")?.value;
  if (!playfabId) return NextResponse.json({ error: "401" }, { status: 401 });

  const gate = await canUse(playfabId, "Warehouses");
  if (!gate.allowed) {
    return NextResponse.json(
      { error: `Niveau insuffisant (${gate.level}/${gate.min})` },
      { status: 403 }
    );
  }

  // … exécuter la création d’entrepôt …
  return NextResponse.json({ ok: true });
}
