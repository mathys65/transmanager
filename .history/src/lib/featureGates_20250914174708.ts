// src/lib/featureGates.ts
import { getPlayFabServer } from "@/lib/playfabServer";

let cache: { gates: Record<string, number>, curve: Record<string, number> } | null = null;
let ts = 0;

export async function getConfig() {
  const now = Date.now();
  if (!cache || now - ts > 60_000) { // cache 60s
    const Server = getPlayFabServer();
    const td = await new Promise<any>((ok, ko) =>
      Server.GetTitleData({}, (e,r)=> e?ko(e):ok(r))
    );
    cache = {
      gates: JSON.parse(td?.data?.Data?.FeatureGates ?? "{}"),
      curve: JSON.parse(td?.data?.Data?.LevelCurve ?? "{}"),
    };
    ts = now;
  }
  return cache!;
}
