// src/app/api/playfab/seed-initial/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PlayFabServer } from "@/lib/playfabServer";

const CURRENCY_CODE = "UE";     // <-- 2 lettres (ton code PlayFab)
const TARGET_MIN = 100000;      // dépôt initial souhaité

export async function POST() {
  const playfabId = cookies().get("playfab_id")?.value;
  if (!playfabId) return NextResponse.json({ error: "Aucun joueur" }, { status: 401 });

  const inv = await new Promise<any>((resolve, reject) => {
    PlayFabServer.GetUserInventory({ PlayFabId: playfabId }, (err, res) => (err ? reject(err) : resolve(res)));
  });

  const current = inv?.data?.VirtualCurrency?.[CURRENCY_CODE] ?? 0;
  if (current >= TARGET_MIN) return NextResponse.json({ ok: true, current, added: 0 });

  const diff = TARGET_MIN - current;
  await new Promise<void>((resolve, reject) => {
    PlayFabServer.AddUserVirtualCurrency(
      { PlayFabId: playfabId, VirtualCurrency: CURRENCY_CODE, Amount: diff },
      (err) => (err ? reject(err) : resolve())
    );
  });

  return NextResponse.json({ ok: true, current: TARGET_MIN, added: diff });
}
