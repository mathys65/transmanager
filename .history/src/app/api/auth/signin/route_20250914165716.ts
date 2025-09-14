// src/app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PlayFabClient } from "@/lib/playfabServer";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const payload = {
    TitleId: process.env.PLAYFAB_TITLE_ID!,
    Email: email,
    Password: password,
    InfoRequestParameters: { GetUserAccountInfo: true },
  };

  const login = await new Promise<any>((resolve, reject) => {
    PlayFabClient.LoginWithEmailAddress(payload, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

  const sessionTicket = login?.data?.SessionTicket;
  const playfabId = login?.data?.PlayFabId;

  if (!sessionTicket || !playfabId) {
    return NextResponse.json({ error: "Login PlayFab invalide" }, { status: 401 });
  }

  // Cookies HTTP-Only
  const cookieStore = cookies();
  const secure = process.env.COOKIE_SECURE !== "0";
  cookieStore.set("playfab_session", sessionTicket, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set("playfab_id", playfabId, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return NextResponse.json({ ok: true });
}
