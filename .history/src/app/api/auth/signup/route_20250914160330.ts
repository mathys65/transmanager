import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/cookies";

const TITLE_ID = process.env.PLAYFAB_TITLE_ID; // ex: "15FEFF"
const COOKIE_NAME = process.env.COOKIE_NAME || "tm_session";

function bad(msg: string, details?: any, status = 400) {
  return NextResponse.json({ error: msg, details }, { status });
}

export async function POST(req: Request) {
  try {
    if (!TITLE_ID) return bad("PLAYFAB_TITLE_ID manquant.");

    const { email, password, username } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return bad("Email invalide.");
    if (!password || String(password).length < 6) return bad("Mot de passe trop court (≥ 6).");

    const payload: any = {
      TitleId: TITLE_ID,
      Email: email,
      Password: password,
      RequireBothUsernameAndEmail: false, // 🔑 Permet d’enregistrer avec email seul
    };

    // Si l’utilisateur a saisi un username, on le passe comme DisplayName
    if (username && String(username).trim()) {
      payload.DisplayName = String(username).trim().slice(0, 25);
    }

    const res = await fetch(`https://${TITLE_ID}.playfabapi.com/Client/RegisterPlayFabUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data?.data?.SessionTicket) {
      console.error("PlayFab Register error:", JSON.stringify(data, null, 2));
      const msg = data?.errorMessage || "Inscription refusée.";
      return bad(msg, data);
    }

    const sessionTicket = String(data.data.SessionTicket);
    const next = NextResponse.json({ ok: true });
    setSessionCookie(next, COOKIE_NAME, sessionTicket);
    return next;
  } catch (e: any) {
    console.error("Signup route error:", e);
    return bad("Erreur serveur (signup).", e?.message, 500);
  }
}
