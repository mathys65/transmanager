"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type NavItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: { label: string; href?: string }[];
};

const NAV: NavItem[] = [
  { key: "home", label: "Accueil", icon: <span>🏠</span>, href: "#" },
  {
    key: "network",
    label: "Réseau & Carte",
    icon: <span>🌍</span>,
    children: [
      { label: "Carte opérationnelle", href: "#" },
      { label: "Planification", href: "#" },
      { label: "Suivi & journaux", href: "#" },
      { label: "Règles d’acheminement", href: "#" },
    ],
  },
  {
    key: "fleet",
    label: "Flotte",
    icon: <span>🚚</span>,
    children: [
      { label: "Véhicules routiers", href: "#" },
      { label: "Avions cargo", href: "#" },
      { label: "Maintenance", href: "#" },
      { label: "Achat / vente", href: "#" },
    ],
  },
  {
    key: "warehouses",
    label: "Entrepôts & Tri",
    icon: <span>🏭</span>,
    children: [
      { label: "Entrepôts", href: "#" },
      { label: "Centres de tri", href: "#" },
      { label: "Stocks & inventaires", href: "#" },
    ],
  },
  {
    key: "markets",
    label: "Marchés / Contrats",
    icon: <span>🧾</span>,
    children: [
      { label: "Contrats disponibles", href: "#" },
      { label: "Contrats en cours", href: "#" },
      { label: "Tarification & SLA", href: "#" },
      { label: "Clients & segments", href: "#" },
    ],
  },
  {
    key: "finance",
    label: "Finances",
    icon: <span>🏦</span>,
    children: [
      { label: "Trésorerie", href: "#" },
      { label: "Revenus / dépenses", href: "#" },
      { label: "Coûts", href: "#" },
      { label: "Investissements", href: "#" },
    ],
  },
  {
    key: "staff",
    label: "Employés",
    icon: <span>👥</span>,
    children: [
      { label: "Chauffeurs & équipes", href: "#" },
      { label: "Planning", href: "#" },
      { label: "Recrutement", href: "#" },
      { label: "Paie", href: "#" },
    ],
  },
  {
    key: "vendors",
    label: "Prestataires",
    icon: <span>📄</span>,
    children: [
      { label: "Sous-traitants", href: "#" },
      { label: "Contrats & qualité", href: "#" },
      { label: "Tarifs négociés", href: "#" },
    ],
  },
  {
    key: "cargo",
    label: "Cargo / Produits",
    icon: <span>📦</span>,
    children: [
      { label: "Types de marchandises", href: "#" },
      { label: "Règles & risques", href: "#" },
      { label: "Douanes & incoterms", href: "#" },
    ],
  },
  {
    key: "analytics",
    label: "Analyses",
    icon: <span>📊</span>,
    children: [
      { label: "KPI globaux", href: "#" },
      { label: "Performance réseau", href: "#" },
      { label: "Rentabilité", href: "#" },
      { label: "Prévisions", href: "#" },
    ],
  },
  {
    key: "subsidiaries",
    label: "Filiales",
    icon: <span>🏢</span>,
    children: [
      { label: "Liste des filiales", href: "#" },
      { label: "Comptes", href: "#" },
      { label: "Transferts internes", href: "#" },
    ],
  },
  { key: "alliances", label: "Alliances", icon: <span>🔗</span>, href: "#" },
  { key: "chat", label: "Tchat", icon: <span>💬</span>, href: "#" },
  { key: "inbox", label: "Messagerie", icon: <span>✉️</span>, href: "#" },
  {
    key: "settings",
    label: "Paramètres",
    icon: <span>⚙️</span>,
    children: [
      { label: "Entreprise", href: "#" },
      { label: "Compte & sécurité", href: "#" },
      { label: "Règles d’utilisation", href: "/legal/terms" },
    ],
  },
  {
    key: "store",
    label: "Boutique",
    icon: <span>⭐</span>,
    children: [
      { label: "Cosmétiques", href: "#" },
      { label: "Packs", href: "#" },
    ],
  },
  { key: "support", label: "Support", icon: <span>🛠️</span>, href: "#" },
];

export default function DashboardSidebar() {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // persistance locale
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

  return (
    <aside
      className={`${
        open ? "w-72" : "w-16"
      } group relative flex h-screen flex-col border-r border-white/10 bg-slate-900/90 backdrop-blur transition-[width] duration-200`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15">
            {/* petit logo camion */}
            <svg viewBox="0 0 64 32" className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="14" width="12" height="9" rx="1.5" fill="currentColor" />
              <rect x="18" y="10" width="32" height="13" rx="2" fill="currentColor" />
              <circle cx="12" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
              <circle cx="28" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
              <circle cx="44" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          {open && <span className="text-base font-semibold text-white">TransManager</span>}
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

          const Row = (
            <div
              onClick={() => hasChildren && setExpanded((e) => ({ ...e, [item.key]: !e[item.key] }))}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-white/90 hover:bg-white/10"
            >
              <span className="text-lg">{item.icon}</span>
              {open && <span className="flex-1 text-sm">{item.label}</span>}
              {open && hasChildren && (
                <span className={`text-xs transition-transform ${isExpanded ? "rotate-90" : ""}`}>▸</span>
              )}
            </div>
          );

          return (
            <div key={item.key} className="mb-1">
              {item.href && !hasChildren ? (
                <Link href={item.href} onClick={(e) => e.preventDefault()}>
                  {Row}
                </Link>
              ) : (
                Row
              )}

              {open && hasChildren && isExpanded && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.children!.map((c) => (
                    <Link
                      href={c.href || "#"}
                      key={c.label}
                      onClick={(e) => e.preventDefault()}
                      className="block rounded-lg px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
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

      {/* Footer petite zone */}
      <div className="border-t border-white/10 p-3 text-xs text-white/50">
        {open ? "v0.1 • Tableau de bord" : "v0.1"}
      </div>
    </aside>
  );
}
