import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ensureBaseStats } from "@/lib/playfab/ensureBaseStats";
import { getPlayFabClient } from "@/lib/playfab/getPlayFabClient";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const Client = getPlayFabClient();

    // Connexion PlayFab
    const loginRes: any = await new Promise((resolve, reject) => {
      Client.LoginWithEmailAddress(
        {
          TitleId: process.env.PLAYFAB_TITLE_ID!,
          Email: email,
          Password: password,
        },
        (err, res) => (err ? reject(err) : resolve(res))
      );
    });

    if (!loginRes?.data?.PlayFabId || !loginRes?.data?.SessionTicket) {
      return NextResponse.json({ error: "Échec connexion PlayFab" }, { status: 400 });
    }

    const playFabId = loginRes.data.PlayFabId;
    const sessionTicket = loginRes.data.SessionTicket;

    // Initialise Level=1 / XP=0 si absent
    await ensureBaseStats(playFabId);

    // Cookies de session
    const c = cookies();
    c.set("playfab_id", playFabId, { httpOnly: true });
    c.set("playfab_session", sessionTicket, { httpOnly: true });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur interne" }, { status: 500 });
  }
}
