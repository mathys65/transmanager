import { NextResponse } from "next/server";

const TITLE_ID = process.env.PLAYFAB_TITLE_ID!;
const TERMS_VERSION = "1.0";
const COOKIE_NAME = process.env.COOKIE_NAME || "tm_session";

function bad(msg: string, details?: any, status = 400) {
  return NextResponse.json({ error: msg, details }, { status });
}

export async function POST(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const match = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    const sessionTicket = match ? decodeURIComponent(match[1]) : null;

    if (!sessionTicket) return bad("Pas de session en cours.");

    const payload = {
      Data: {
        termsAcceptedAt: new Date().toISOString(),
        termsVersion: TERMS_VERSION,
      },
      Permission: "Private",
    };

    const res = await fetch(`https://${TITLE_ID}.playfabapi.com/Client/UpdateUserData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": sessionTicket,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("PlayFab accept terms error:", JSON.stringify(data, null, 2));
      return bad("Erreur lors de l’enregistrement PlayFab.", data);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return bad("Erreur serveur (accept).", e?.message, 500);
  }
}
