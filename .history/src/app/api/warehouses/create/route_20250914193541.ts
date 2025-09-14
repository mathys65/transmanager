import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfabServer";

const PRICE_EU = 100000;   // prix standard
const BASE_SLOTS = 1;     // 1 véhicule
const BASE_STAFF = 2;     // 2 personnels

export async function POST(req: Request) {
  const c = cookies();
  const playFabId = c.get("playfab_id")?.value;
  if (!playFabId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { name, country, lat, lng } = body ?? {};
  if (typeof name !== "string" || typeof country !== "string" || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const Server = getPlayFabServer();

  // 1) Lire la liste existante pour savoir si c’est le premier (offert)
  const data = await new Promise<any>((resolve, reject) => {
    Server.GetUserData({ PlayFabId: playFabId, Keys: ["Warehouses"] }, (e: any, r: any) => (e ? reject(e) : resolve(r)));
  });
  let items: any[] = [];
  try {
    const raw = data?.data?.Data?.Warehouses?.Value;
    if (raw) items = JSON.parse(raw);
  } catch {}
  const firstFree = items.length === 0;

  // 2) Si pas le premier, vérifier le solde et débiter
  let paid = 0;
  if (!firstFree) {
    const inv = await new Promise<any>((resolve, reject) => {
      Server.GetUserInventory({ PlayFabId: playFabId }, (e: any, r: any) => (e ? reject(e) : resolve(r)));
    });
    const bal = inv?.data?.VirtualCurrency?.EU ?? 0;
    if (bal < PRICE_EU) {
      return NextResponse.json({ error: "Solde insuffisant", balance: bal, price: PRICE_EU }, { status: 402 });
    }
    await new Promise<void>((resolve, reject) => {
      Server.SubtractUserVirtualCurrency(
        { PlayFabId: playFabId, VirtualCurrency: "EU", Amount: PRICE_EU },
        (e: any) => (e ? reject(e) : resolve())
      );
    });
    paid = PRICE_EU;
  }

  // 3) Ajouter l’entrepôt (prix payé enregistré)
  const id = `wh_${Date.now()}`;
  const item = {
    id,
    name,
    country,
    lat,
    lng,
    createdAt: new Date().toISOString(),
    price: paid,                 // 0 si offert
    vehicleSlots: BASE_SLOTS,    // capacité de base
    staffSlots: BASE_STAFF,
  };
  items.push(item);

  // 4) Sauvegarder
  await new Promise<void>((resolve, reject) => {
    Server.UpdateUserData({ PlayFabId: playFabId, Data: { Warehouses: JSON.stringify(items) } }, (e: any) =>
      e ? reject(e) : resolve()
    );
  });

  return NextResponse.json({ ok: true, item });
}
