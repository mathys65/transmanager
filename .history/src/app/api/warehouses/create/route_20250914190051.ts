import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfabServer";

const PRICE_EU = 50000; // prix d'achat d'un entrepôt

export async function POST(req: Request) {
  const c = cookies();
  const playFabId = c.get("playfab_id")?.value;
  if (!playFabId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json().catch(()=>null);
  const { name, country, lat, lng } = body ?? {};
  if (typeof name!=="string" || typeof country!=="string" || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const Server = getPlayFabServer();

  // 1) Lire le solde EU
  const inv = await new Promise<any>((resolve,reject)=>{
    Server.GetUserInventory({ PlayFabId: playFabId }, (e:any,r:any)=> e?reject(e):resolve(r));
  });
  const bal = inv?.data?.VirtualCurrency?.EU ?? 0;
  if (bal < PRICE_EU) {
    return NextResponse.json({ error: "Solde insuffisant", balance: bal, price: PRICE_EU }, { status: 402 });
  }

  // 2) Débiter EU
  await new Promise<void>((resolve,reject)=>{
    Server.SubtractUserVirtualCurrency({ PlayFabId: playFabId, VirtualCurrency: "EU", Amount: PRICE_EU }, (e:any)=> e?reject(e):resolve());
  });

  // 3) Lire liste existante
  const data = await new Promise<any>((resolve, reject) => {
    Server.GetUserData({ PlayFabId: playFabId, Keys: ["Warehouses"] }, (e:any,r:any)=> e?reject(e):resolve(r));
  });
  let items: any[] = [];
  try {
    const raw = data?.data?.Data?.Warehouses?.Value;
    if (raw) items = JSON.parse(raw);
  } catch {}

  // 4) Ajouter
  const id = `wh_${Date.now()}`;
  items.push({ id, name, country, lat, lng, createdAt: new Date().toISOString() });

  // 5) Sauvegarder
  await new Promise<void>((resolve,reject)=>{
    Server.UpdateUserData({ PlayFabId: playFabId, Data: { Warehouses: JSON.stringify(items) } }, (e:any)=> e?reject(e):resolve());
  });

  return NextResponse.json({ ok:true, item: { id, name, country, lat, lng } });
}
