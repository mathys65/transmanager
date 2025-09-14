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
  balance: number | null;
  fleetCount: number | null;
  warehousesActive: number | null;
  activeContracts: number | null;
  customerSatisfaction: number | null;
  level?: number | null;
  xp?: number | null;
  xpIntoLevel?: number | null;
  xpForNext?: number | null;
  progress?: number | null; // 0..1
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Overview | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/dashboard/overview", { cache: "no-store" });
      if (res.status === 401) {
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

  const d = data;
  const fmt = (n: number | null | undefined) =>
    typeof n === "number" ? n.toLocaleString("fr-FR") : "—";
  const sat = (n: number | null | undefined) =>
    typeof n === "number" ? `${n}%` : "—";

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <DashboardSidebar />
      <section className="flex min-h-screen flex-1 flex-col">
        <div className="px-4 py-3 border-b border-white/10">
          <DashboardTopbar
            companyName={d?.companyName ?? null}
            balance={d?.balance ?? null}
            level={d?.level ?? null}
            progress={d?.progress ?? null}
            xpIntoLevel={d?.xpIntoLevel ?? null}
            xpForNext={d?.xpForNext ?? null}
          />
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

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <KpiCard title="Solde (EU)" value={fmt(d?.balance)} />
            <KpiCard title="Flotte" value={typeof d?.fleetCount === "number" ? d!.fleetCount : "—"} />
            <KpiCard title="Entrepôts actifs" value={typeof d?.warehousesActive === "number" ? d!.warehousesActive : "—"} />
            <KpiCard title="Contrats en cours" value={typeof d?.activeContracts === "number" ? d!.activeContracts : "—"} />
            <KpiCard title="Satisfaction clients" value={sat(d?.customerSatisfaction)} />
          </div>

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
