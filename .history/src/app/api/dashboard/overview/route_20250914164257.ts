import { NextResponse } from "next/server";

const TITLE_ID = process.env.PLAYFAB_TITLE_ID!;
const COOKIE_NAME = process.env.COOKIE_NAME || "tm_session";

function bad(msg: string, details?: any, status = 400) {
  return NextResponse.json({ error: msg, details }, { status });
}

export async function GET(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const m = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    const sessionTicket = m ? decodeURIComponent(m[1]) : null;
    if (!sessionTicket) return bad("Non connecté.", null, 401);

    // Lis les clés utiles du dashboard dans UserData
    const keys = [
      "companyName",
      "balance",
      "fleetCount",
      "warehousesActive",
      "activeContracts",
      "customerSatisfaction",
    ];

    const res = await fetch(`https://${TITLE_ID}.playfabapi.com/Client/GetUserData`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Authorization": sessionTicket },
      body: JSON.stringify({ Keys: keys }),
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) return bad("PlayFab GetUserData error", json, 500);

    const d = (json?.data?.Data || {}) as Record<string, { Value?: string }>;
    const num = (v?: string | null) => (v != null && v !== "" ? Number(v) : null);

    return NextResponse.json({
      companyName: d.companyName?.Value ?? null,
      balance: num(d.balance?.Value) ?? null,
      fleetCount: num(d.fleetCount?.Value) ?? null,
      warehousesActive: num(d.warehousesActive?.Value) ?? null,
      activeContracts: num(d.activeContracts?.Value) ?? null,
      customerSatisfaction: num(d.customerSatisfaction?.Value) ?? null,
    });
  } catch (e: any) {
    return bad("Erreur serveur (overview).", e?.message, 500);
  }
}
