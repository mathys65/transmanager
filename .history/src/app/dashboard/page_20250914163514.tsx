"use client";

import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";

function KpiCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm text-white/70">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-1 text-xs text-white/50">{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <DashboardSidebar />

      <section className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar />

        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          {/* Overview */}
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="mt-1 text-white/70">Vue d’ensemble de ton entreprise.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <KpiCard title="Flotte" value="12 véhicules" sub="+2 ce mois" />
            <KpiCard title="Entrepôts actifs" value="3" sub="Capacité 62%" />
            <KpiCard title="Contrats en cours" value="7" sub="2 urgents" />
            <KpiCard title="Satisfaction clients" value="92%" sub="sur 30 derniers jours" />
          </div>

          {/* Placeholder sections vides pour la suite */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Activité récente</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>• Contrat #A47 livré (Paris → Lyon)</li>
                <li>• Camion TM-032 en maintenance (vidange)</li>
                <li>• Nouveau client signé : HexaLog</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Alertes</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>• Retard estimé : Convoi #C-19 (trafic)</li>
                <li>• Stock bas : Entrepôt Nord (cartons)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
