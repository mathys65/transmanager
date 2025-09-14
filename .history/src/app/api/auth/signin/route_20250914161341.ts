import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/cookies";

const TITLE_ID = process.env.PLAYFAB_TITLE_ID; // ex: "15FEFF"
const COOKIE_NAME = process.env.COOKIE_NAME || "tm_session";
const TERMS_VERSION = "1.0";

function bad(msg: string, details?: any, status = 400) {
  return NextResponse.json({ error: msg, details }, { status });
}

export async function POST(req: Request) {
  try {
    if (!TITLE_ID) return bad("PLAYFAB_TITLE_ID manquant.");

    const { email, password } = await req.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return bad("Email invalide.");
    if (!password || String(password).length < 6) return bad("Mot de passe trop court (≥ 6).");

    // 1) Login
    const payload = { TitleId: TITLE_ID, Email: email, Password: password };
    const loginRes = await fetch(`https://${TITLE_ID}.playfabapi.com/Client/LoginWithEmailAddress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const loginData = await loginRes.json();

    if (!loginRes.ok || !loginData?.data?.SessionTicket) {
      console.error("PlayFab Login error:", JSON.stringify(loginData, null, 2));
      const msg = loginData?.errorMessage || "Connexion refusée.";
      return bad(msg, loginData);
    }

    const sessionTicket = String(loginData.data.SessionTicket);

    // 2) Lire UserData pour voir si conditions acceptées
    const userDataRes = await fetch(`https://${TITLE_ID}.playfabapi.com/Client/GetUserData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": sessionTicket,
      },
      body: JSON.stringify({ Keys: ["termsAcceptedAt", "termsVersion"] }),
      cache: "no-store",
    });
    const userData = await userDataRes.json();
    const data = userData?.data?.Data || {};

    const termsVersion = data?.termsVersion?.Value;
    const termsAccepted = data?.termsAcceptedAt?.Value;

    const next = NextResponse.json({
      ok: true,
      requireTerms: !termsAccepted || termsVersion !== TERMS_VERSION,
    });

    // Pose le cookie de session (nécessaire pour la suite)
    setSessionCookie(next, COOKIE_NAME, sessionTicket);

    return next;
  } catch (e: any) {
    console.error("Signin route error:", e);
    return bad("Erreur serveur (signin).", e?.message, 500);
  }
}
