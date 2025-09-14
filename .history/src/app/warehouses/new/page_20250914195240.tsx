"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";
import { EUROPE_CITIES } from "@/lib/cities";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Tooltip      = dynamic(() => import("react-leaflet").then((m) => m.Tooltip), { ssr: false });

type Overview = {
  companyName: string | null;
  balance: number | null;
  level?: number | null;
  xpIntoLevel?: number | null;
  xpForNext?: number | null;
  progress?: number | null;
};

type City = { name: string; country: string; lat: number; lng: number };

const PRICE_EU = 100_000;

export default function NewWarehousePage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [firstFree, setFirstFree] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState<City | null>(null);

  const center = useMemo<[number, number]>(() => [50, 9], []);

  useEffect(() => {
    (async () => {
      try {
        const [oRes, wRes] = await Promise.all([
          fetch("/api/dashboard/overview", { cache: "no-store" }),
          fetch("/api/warehouses/list", { cache: "no-store" }),
        ]);
        const o = await oRes.json();
        const w = await wRes.json();
        setOverview(o as Overview);
        setFirstFree(Array.isArray(w.items) ? w.items.length === 0 : false);
      } catch {
        setFirstFree(false);
      }
    })();
  }, []);

  const priceText = firstFree === null ? "…" : firstFree ? "Offert (0 EU)" : `${PRICE_EU.toLocaleString("fr-FR")} EU`;

  const create = useCallback(async (c: City) => {
    if (busy) return;
    setBusy(true);
    setToast(null);
    try {
      const r = await fetch("/api/warehouses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: c.name, country: c.country, lat: c.lat, lng: c.lng }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Erreur création");
      setToast("Entrepôt créé ✔️");
      setTimeout(() => { window.location.href = "/warehouses"; }, 700);
    } catch (e: any) {
      setToast(e?.message ?? "Erreur");
      setBusy(false);
    }
  }, [busy]);

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <DashboardSidebar />
      <section className="flex min-h-screen flex-1 flex-col">
        {/* Topbar */}
        <div className="px-4 py-3 border-b border-white/10">
          <DashboardTopbar
            companyName={overview?.companyName ?? null}
            balance={overview?.balance ?? null}
            level={overview?.level ?? null}
            progress={overview?.progress ?? null}
            xpIntoLevel={overview?.xpIntoLevel ?? null}
            xpForNext={overview?.xpForNext ?? null}
          />
        </div>

        {/* Zone carte pleine hauteur */}
        <div className="relative flex-1">
          {/* Overlays en dessus de la carte (z-50) */}
          <div className="absolute left-4 top-4 z-50">
            <div className="rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur px-4 py-3">
              <div className="text-sm font-medium">Choisir l’emplacement</div>
              <div className="mt-1 text-xs opacity-80">Clique une grande ville (Europe • OpenStreetMap).</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-white/10 px-2 py-1">Prix&nbsp;: {priceText}</span>
                <span className="rounded-md bg-white/10 px-2 py-1">Capacité&nbsp;: 1 véhicule • 2 personnels</span>
              </div>
            </div>
          </div>

          <div className="absolute right-4 bottom-4 z-50">
            <div className="rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur px-4 py-3 min-w-64">
              {selected ? (
                <>
                  <div className="text-sm font-semibold">
                    {selected.name} <span className="opacity-70 text-xs">({selected.country})</span>
                  </div>
                  <div className="mt-1 text-xs opacity-80">
                    {firstFree ? "Offert" : `Prix : ${PRICE_EU.toLocaleString("fr-FR")} EU`}
                  </div>
                  <button
                    onClick={() => create(selected)}
                    disabled={busy}
                    className="mt-3 w-full rounded-lg bg-sky-500 text-neutral-900 hover:bg-sky-400 disabled:opacity-60 px-3 py-2 text-sm font-medium"
                  >
                    {busy ? "Achat…" : "Acheter ici"}
                  </button>
                </>
              ) : (
                <div className="text-sm opacity-80">Sélectionnez une ville…</div>
              )}
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className="absolute left-1/2 bottom-4 z-50 -translate-x-1/2 rounded-xl border border-white/10 bg-neutral-950/85 px-4 py-2 text-sm">
              {toast}
            </div>
          )}

          {/* Carte derrière (z-0) */}
          <div className="absolute inset-0 z-0">
            <MapContainer center={center} zoom={5} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {EUROPE_CITIES.map((c) => {
                const isSel = selected && c.name === selected.name && c.country === selected.country;
                return (
                  <CircleMarker
                    key={`${c.name}-${c.country}`}
                    center={[c.lat, c.lng]}
                    radius={isSel ? 8 : 6}
                    pathOptions={{ weight: 1, color: isSel ? "#38bdf8" : "#ffffff", fillOpacity: isSel ? 0.6 : 0.4 }}
                    eventHandlers={{ click: () => setSelected(c) }}
                  >
                    <Tooltip>{c.name} ({c.country}) — Sélectionner</Tooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* Sécurise définitivement l’empilement: carte sous les overlays */}
      <style jsx global>{`
        .leaflet-container { z-index: 0; }
      `}</style>
    </main>
  );
}
