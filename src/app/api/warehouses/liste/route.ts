import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfabServer";

export async function GET() {
  const c = cookies();
  const playFabId = c.get("playfab_id")?.value;
  if (!playFabId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const Server = getPlayFabServer();
  const data = await new Promise<any>((resolve, reject) => {
    Server.GetUserData({ PlayFabId: playFabId, Keys: ["Warehouses"] }, (e:any,r:any)=> e?reject(e):resolve(r));
  });

  let items: any[] = [];
  try {
    const raw = data?.data?.Data?.Warehouses?.Value;
    if (raw) items = JSON.parse(raw);
  } catch {}
  return NextResponse.json({ items });
}
Ò