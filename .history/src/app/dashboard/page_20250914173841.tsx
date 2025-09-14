// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";

function KpiCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm text-white/70">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

type Overview = {
  companyName: string | null;
  balance: number | null;              // monnaie EU (PlayFab)
  fleetCount: number | null;
  warehousesActive: number | null;
  activeContracts: number | null;
  customerSatisfaction: number | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Overview | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/dashboard/overview", { cache: "no-store" });
      if (res.status === 401) {
        // session expirée / non connectée → accueil
        router.push("/");
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Erreur overview");
      setData(json as Overview);
    } catch (e: any) {
      setErr(e?.message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const signOut = async () => {
    setSigningOut(true);
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });
      // même si l’API échoue, on renvoie à l’accueil pour couper l’accès
    } finally {
      router.push("/");
    }
  };

  const d = data;
  const fmt = (n: number | null | undefined) =>
    typeof n === "number" ? n.toLocaleString("fr-FR") : "—";
  const sat = (n: number | null | undefined) =>
    typeof n === "number" ? `${n}%` : "—";

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <DashboardSidebar />
      <section className="flex min-h-screen flex-1 flex-col">
        {/* Topbar (affiche nom + solde) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <DashboardTopbar companyName={d?.companyName ?? null} balance={d?.balance ?? null} />
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
              disabled={loading}
            >
              Rafraîchir
            </button>
            <button
              onClick={signOut}
              disabled={signingOut}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-60"
            >
              {signingOut ? "Déconnexion…" : "Se déconnecter"}
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="mt-1 text-white/70">Données lues en direct depuis PlayFab.</p>

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
            <KpiCard title="Solde (EU)" value={fmt(d?.balance)} />
            <KpiCard title="Flotte" value={typeof d?.fleetCount === "number" ? d!.fleetCount : "—"} />
            <KpiCard title="Entrepôts actifs" value={typeof d?.warehousesActive === "number" ? d!.warehousesActive : "—"} />
            <KpiCard title="Contrats en cours" value={typeof d?.activeContracts === "number" ? d!.activeContracts : "—"} />
            <KpiCard title="Satisfaction clients" value={sat(d?.customerSatisfaction)} />
          </div>

          {/* Sections placeholder */}
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
