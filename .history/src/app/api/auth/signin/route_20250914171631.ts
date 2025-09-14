// src/app/api/auth/signin/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabClient } from "@/lib/playfabServer";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
  }

  try {
    const PlayFabClient = getPlayFabClient();

    const login = await new Promise<any>((resolve, reject) => {
      PlayFabClient.LoginWithEmailAddress(
        {
          TitleId: process.env.PLAYFAB_TITLE_ID!,
          Email: email,
          Password: password,
          InfoRequestParameters: { GetUserAccountInfo: true },
        },
        (err, res) => (err ? reject(err) : resolve(res))
      );
    });

    const sessionTicket = login?.data?.SessionTicket as string | undefined;
    const playfabId = login?.data?.PlayFabId as string | undefined;

    if (!sessionTicket || !playfabId) {
      return NextResponse.json({ error: "Login PlayFab invalide." }, { status: 401 });
    }

    const secure = process.env.COOKIE_SECURE !== "0";
    const jar = cookies();

    jar.set("playfab_session", sessionTicket, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });
    jar.set("playfab_id", playfabId, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.apiErrorInfo?.errorMessage || e?.message || "Erreur PlayFab" },
      { status: 500 }
    );
  }
}
