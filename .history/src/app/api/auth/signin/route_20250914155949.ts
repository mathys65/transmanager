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

    const { email, password } = await req.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return bad("Email invalide.");
    if (!password || String(password).length < 6) return bad("Mot de passe trop court (≥ 6).");

    const payload = { TitleId: TITLE_ID, Email: email, Password: password };

    const res = await fetch(`https://${TITLE_ID}.playfabapi.com/Client/LoginWithEmailAddress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data?.data?.SessionTicket) {
      const msg = data?.errorMessage || "Connexion refusée.";
      return bad(msg, data);
    }

    const sessionTicket = data.data.SessionTicket as string;
    const next = NextResponse.json({ ok: true });
    setSessionCookie(next, COOKIE_NAME, sessionTicket);
    return next;
  } catch (e: any) {
    return bad("Erreur serveur (signin).", e?.message, 500);
  }
}
