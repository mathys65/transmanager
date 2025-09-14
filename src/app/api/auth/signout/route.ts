// src/app/api/auth/signout/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const jar = cookies();

  // Supprime proprement les cookies côté serveur
  try {
    jar.delete("playfab_session");
    jar.delete("playfab_id");
  } catch {
    // fallback au cas où (certaines versions)
    const secure = process.env.COOKIE_SECURE !== "0";
    jar.set("playfab_session", "", {
      httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 0,
    });
    jar.set("playfab_id", "", {
      httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 0,
    });
  }

  return NextResponse.json({ ok: true });
}
