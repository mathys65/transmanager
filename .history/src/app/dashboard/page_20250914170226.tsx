// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";

function KpiCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm text-white/70">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-1 text-xs text-white/50">{sub}</div>}
    </div>
  );
}

type Overview = {
  companyName: string | null;
  balance: number | null; // monnaie PlayFab (code EU) en unités entières
  fleetCount: number | null;
  warehousesActive: number | null;
  activeContracts: number | null;
  customerSatisfaction: number | null;
};

export default function DashboardPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard/overview", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Erreur overview");
        if (alive) setData(json as Overview);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Erreur réseau");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const d = data;

  const fmt = (n: number | null | undefined) =>
    typeof n === "number" ? n.toLocaleString("fr-FR") : "—";

  const sat = (n: number | null | undefined) =>
    typeof n === "number" ? `${n}%` : "—";

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <DashboardSidebar />
      <section className="flex min-h-screen flex-1 flex-col">
        {/* Topbar affiche le nom et le solde PlayFab */}
        <DashboardTopbar companyName={d?.companyName ?? null} balance={d?.balance ?? null} />

        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="mt-1 text-white/70">Vue d’ensemble de ton entreprise (données PlayFab).</p>

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

          {/* KPIs */}
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <KpiCard title="Solde (€)" value={fmt(d?.balance)} />
            <KpiCard
              title="Flotte"
              value={typeof d?.fleetCount === "number" ? d!.fleetCount : "—"}
            />
            <KpiCard
              title="Entrepôts actifs"
              value={typeof d?.warehousesActive === "number" ? d!.warehousesActive : "—"}
            />
            <KpiCard
              title="Contrats en cours"
              value={typeof d?.activeContracts === "number" ? d!.activeContracts : "—"}
            />
            <KpiCard title="Satisfaction clients" value={sat(d?.customerSatisfaction)} />
          </div>

          {/* Sections (aucune donnée fictive) */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Activité récente</h2>
              <p className="mt-3 text-sm text-white/60">Aucune donnée disponible.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Alertes</h2>
              <p className="mt-3 text-sm text-white/60">Aucune alerte pour le moment.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
