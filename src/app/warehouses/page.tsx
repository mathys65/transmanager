"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";
import SafeLink from "@/components/SafeLink";

type Overview = {
  companyName: string | null;
  balance: number | null;
  level?: number | null;
  xpIntoLevel?: number | null;
  xpForNext?: number | null;
  progress?: number | null; // 0..1
};

type Warehouse = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  createdAt?: string;
  price?: number;
  vehicleSlots?: number;
  staffSlots?: number;
};

const seg = (s: string) => encodeURIComponent(String(s));

export default function WarehousesPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [items, setItems] = useState<Warehouse[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [oRes, wRes] = await Promise.all([
        fetch("/api/dashboard/overview", { cache: "no-store" }),
        fetch("/api/warehouses/list", { cache: "no-store" }),
      ]);
      const o = await oRes.json();
      const w = await wRes.json();
      setOverview(o as Overview);
      const arr = Array.isArray(w.items) ? (w.items as Warehouse[]) : [];
      setItems(arr.filter((x) => x && typeof x.id === "string" && Number.isFinite(x.lat) && Number.isFinite(x.lng)));
    } catch (e: any) {
      setErr(e?.message || "Erreur");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const fmtMoney = (n: number | null | undefined) =>
    typeof n === "number" ? n.toLocaleString("fr-FR") : "—";

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <DashboardSidebar />
      <section className="flex min-h-screen flex-1 flex-col">
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

        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Entrepôts</h1>
              <p className="mt-1 text-white/70">Achetez, gérez et améliorez vos installations.</p>
            </div>
            <SafeLink
              href="/warehouses/new"
              className="rounded-xl border border-white/15 bg-white text-neutral-900 hover:bg-neutral-200 px-3 py-1.5 text-sm"
            >
              Acheter un entrepôt
            </SafeLink>
          </div>

          {loading && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
              Chargement…
            </div>
          )}
          {err && (
            <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {err}
            </div>
          )}

          {items && items.length === 0 && !loading ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-medium mb-1">Commencez ici</div>
              <p className="opacity-80 mb-4">
                Aucun entrepôt pour l’instant. Le <strong>premier est offert</strong> — choisissez une ville sur la carte.
              </p>
              <SafeLink
                href="/warehouses/new"
                className="inline-flex items-center rounded-xl border border-white/15 bg-white text-neutral-900 hover:bg-neutral-200 px-4 py-2 text-sm"
              >
                Choisir sur la carte
              </SafeLink>
            </div>
          ) : null}

          {items && items.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((w) => (
                <SafeLink
                  key={w.id}
                  href={`/warehouses/${seg(w.id)}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">
                        {w.name} <span className="opacity-70 text-sm">({w.country})</span>
                      </div>
                      <div className="opacity-70 text-sm">Lat {w.lat.toFixed(3)} • Lng {w.lng.toFixed(3)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-60">
                        {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : ""}
                      </div>
                      <div className="mt-1 text-xs opacity-80">
                        {w.price && w.price > 0 ? `${fmtMoney(w.price)} EU` : "Offert"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="rounded-md bg-white/10 px-2 py-1">{w.vehicleSlots ?? 1} emplacement véhicule</span>
                    <span className="rounded-md bg-white/10 px-2 py-1">{w.staffSlots ?? 2} personnels</span>
                  </div>
                </SafeLink>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
