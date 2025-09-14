"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

type NavItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { key: "home", label: "Accueil", icon: <span>🏠</span>, href: "/dashboard" },

  {
    key: "network",
    label: "Réseau & Carte",
    icon: <span>🌍</span>,
    children: [
      { label: "Carte opérationnelle", href: "/network/map" },
      { label: "Planification", href: "/network/planning" },
      { label: "Suivi & journaux", href: "/network/logs" },
      { label: "Règles d’acheminement", href: "/network/routing-rules" },
    ],
  },

  {
    key: "fleet",
    label: "Flotte",
    icon: <span>🚚</span>,
    children: [
      { label: "Véhicules routiers", href: "/fleet/road-vehicles" },
      { label: "Avions cargo", href: "/fleet/aircraft" },
      { label: "Maintenance", href: "/fleet/maintenance" },
      { label: "Achat / vente", href: "/fleet/market" },
    ],
  },

  {
    key: "warehouses",
    label: "Entrepôts & Tri",
    icon: <span>🏭</span>,
    children: [
      { label: "Entrepôts", href: "/warehouses" },
      { label: "Centres de tri", href: "/warehouses/sorting-centers" },
      { label: "Stocks & inventaires", href: "/warehouses/inventory" },
    ],
  },

  {
    key: "markets",
    label: "Marchés / Contrats",
    icon: <span>🧾</span>,
    children: [
      { label: "Contrats disponibles", href: "/markets/contracts" },
      { label: "Contrats en cours", href: "/markets/active" },
      { label: "Tarification & SLA", href: "/markets/pricing" },
      { label: "Clients & segments", href: "/markets/clients" },
    ],
  },

  {
    key: "finance",
    label: "Finances",
    icon: <span>🏦</span>,
    children: [
      { label: "Trésorerie", href: "/finance/cash" },
      { label: "Revenus / dépenses", href: "/finance/pnl" },
      { label: "Coûts", href: "/finance/costs" },
      { label: "Investissements", href: "/finance/investments" },
    ],
  },

  {
    key: "staff",
    label: "Employés",
    icon: <span>👥</span>,
    children: [
      { label: "Chauffeurs & équipes", href: "/staff/teams" },
      { label: "Planning", href: "/staff/scheduling" },
      { label: "Recrutement", href: "/staff/hiring" },
      { label: "Paie", href: "/staff/payroll" },
    ],
  },

  {
    key: "vendors",
    label: "Prestataires",
    icon: <span>📄</span>,
    children: [
      { label: "Sous-traitants", href: "/vendors/subcontractors" },
      { label: "Contrats & qualité", href: "/vendors/contracts" },
      { label: "Tarifs négociés", href: "/vendors/rates" },
    ],
  },

  {
    key: "cargo",
    label: "Cargo / Produits",
    icon: <span>📦</span>,
    children: [
      { label: "Types de marchandises", href: "/cargo/types" },
      { label: "Règles & risques", href: "/cargo/rules" },
      { label: "Douanes & incoterms", href: "/cargo/customs" },
    ],
  },

  {
    key: "analytics",
    label: "Analyses",
    icon: <span>📊</span>,
    children: [
      { label: "KPI globaux", href: "/analytics/kpi" },
      { label: "Performance réseau", href: "/analytics/network" },
      { label: "Rentabilité", href: "/analytics/profit" },
      { label: "Prévisions", href: "/analytics/forecast" },
    ],
  },

  {
    key: "subsidiaries",
    label: "Filiales",
    icon: <span>🏢</span>,
    children: [
      { label: "Liste des filiales", href: "/subsidiaries" },
      { label: "Comptes", href: "/subsidiaries/accounts" },
      { label: "Transferts internes", href: "/subsidiaries/transfers" },
    ],
  },

  { key: "alliances", label: "Alliances", icon: <span>🔗</span>, href: "/alliances" },
  { key: "chat", label: "Tchat", icon: <span>💬</span>, href: "/chat" },
  { key: "inbox", label: "Messagerie", icon: <span>✉️</span>, href: "/inbox" },

  {
    key: "settings",
    label: "Paramètres",
    icon: <span>⚙️</span>,
    children: [
      { label: "Entreprise", href: "/settings/company" },
      { label: "Compte & sécurité", href: "/settings/account" },
      { label: "Règles d’utilisation", href: "/legal/terms" },
    ],
  },

  {
    key: "store",
    label: "Boutique",
    icon: <span>⭐</span>,
    children: [
      { label: "Cosmétiques", href: "/store/cosmetics" },
      { label: "Packs", href: "/store/packs" },
    ],
  },

  { key: "support", label: "Support", icon: <span>🛠️</span>, href: "/support" },
];

export default function DashboardSidebar() {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  useEffect(() => {
    const s = localStorage.getItem("tm_sidebar_open");
    if (s !== null) setOpen(s === "1");
    const e = localStorage.getItem("tm_sidebar_expanded");
    if (e) setExpanded(JSON.parse(e));
  }, []);

  useEffect(() => {
    localStorage.setItem("tm_sidebar_open", open ? "1" : "0");
  }, [open]);

  useEffect(() => {
    localStorage.setItem("tm_sidebar_expanded", JSON.stringify(expanded));
  }, [expanded]);

  const isActive = (href?: string) =>
    !!href && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <aside
      className={`${
        open ? "w-72" : "w-16"
      } group relative flex h-screen flex-col border-r border-white/10 bg-slate-900/90 backdrop-blur transition-[width] duration-200`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15"
          >
            <svg viewBox="0 0 64 32" className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="14" width="12" height="9" rx="1.5" fill="currentColor" />
              <rect x="18" y="10" width="32" height="13" rx="2" fill="currentColor" />
              <circle cx="12" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
              <circle cx="28" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
              <circle cx="44" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Link>
          {open && (
            <Link href="/dashboard" className="text-base font-semibold text-white">
              TransManager
            </Link>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-white/10 p-2 text-white/80 hover:bg-white/10"
          aria-label="Toggle sidebar"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Scroll area */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-2 py-2">
        {NAV.map((item) => {
          const hasChildren = !!item.children?.length;
          const isExpanded = !!expanded[item.key];

          const RowInner = (
            <>
              <span className="text-lg">{item.icon}</span>
              {open && <span className="flex-1 text-sm">{item.label}</span>}
              {open && hasChildren && (
                <span className={`text-xs transition-transform ${isExpanded ? "rotate-90" : ""}`}>▸</span>
              )}
            </>
          );

          const rowBase =
            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors";

          return (
            <div key={item.key} className="mb-1">
              {item.href && !hasChildren ? (
                <Link
                  href={item.href}
                  className={
                    rowBase +
                    " " +
                    (isActive(item.href)
                      ? "bg-white/15 text-white"
                      : "text-white/90 hover:bg-white/10")
                  }
                >
                  {RowInner}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => hasChildren && setExpanded((e) => ({ ...e, [item.key]: !e[item.key] }))}
                  className={rowBase + " text-white/90 hover:bg-white/10 w-full text-left"}
                >
                  {RowInner}
                </button>
              )}

              {open && hasChildren && isExpanded && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.children!.map((c) => (
                    <Link
                      href={c.href}
                      key={c.label}
                      className={[
                        "block rounded-lg px-3 py-1.5 text-sm",
                        isActive(c.href) ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3 text-xs text-white/50">
        {open ? "v0.1 • Tableau de bord" : "v0.1"}
      </div>
    </aside>
  );
}
