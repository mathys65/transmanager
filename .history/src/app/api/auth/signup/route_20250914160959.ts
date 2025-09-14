import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/cookies";

const TITLE_ID = process.env.PLAYFAB_TITLE_ID; // ex: "15FEFF"
const COOKIE_NAME = process.env.COOKIE_NAME || "tm_session";
const TERMS_VERSION = "1.0"; // change la version si tu modifies les règles

function bad(msg: string, details?: any, status = 400) {
  return NextResponse.json({ error: msg, details }, { status });
}

export async function POST(req: Request) {
  try {
    if (!TITLE_ID) return bad("PLAYFAB_TITLE_ID manquant.");

    const { email, password, companyName, acceptTerms } = await req.json();

    if (!acceptTerms) return bad("Tu dois accepter les règles d’utilisation.");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return bad("Email invalide.");
    if (!password || String(password).length < 6) return bad("Mot de passe trop court (≥ 6).");

    const displayName =
      companyName && String(companyName).trim() ? String(companyName).trim().slice(0, 25) : undefined;

    const payload: any = {
      TitleId: TITLE_ID,
      Email: email,
      Password: password,
      RequireBothUsernameAndEmail: false, // email seul autorisé
      DisplayName: displayName, // on utilise le nom d’entreprise comme “pseudo” affiché
    };

    // 1) Inscription PlayFab
    const regRes = await fetch(`https://${TITLE_ID}.playfabapi.com/Client/RegisterPlayFabUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const regData = await regRes.json();

    if (!regRes.ok || !regData?.data?.SessionTicket) {
      console.error("PlayFab Register error:", JSON.stringify(regData, null, 2));
      const msg = regData?.errorMessage || "Inscription refusée.";
      return bad(msg, regData);
    }

    const sessionTicket = String(regData.data.SessionTicket);

    // 2) (Bonus) Persiste l’acceptation des règles dans UserData
    try {
      const termsPayload = {
        Data: {
          termsAcceptedAt: new Date().toISOString(),
          termsVersion: TERMS_VERSION,
        },
        Permission: "Private",
      };

      await fetch(`https://${TITLE_ID}.playfabapi.com/Client/UpdateUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": sessionTicket, // session du joueur
        },
        body: JSON.stringify(termsPayload),
        cache: "no-store",
      });
    } catch (e) {
      console.warn("UpdateUserData terms failed (non bloquant):", e);
    }

    const next = NextResponse.json({ ok: true });
    setSessionCookie(next, COOKIE_NAME, sessionTicket);
    return next;
  } catch (e: any) {
    console.error("Signup route error:", e);
    return bad("Erreur serveur (signup).", e?.message, 500);
  }
}
