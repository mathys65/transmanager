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
  { key: "warehouses", label: "Entrepôts & Tri", icon: <span>🏭</span>, children: [
      { label: "Entrepôts", href: "/warehouses" },
      { label: "Centres de tri", href: "/warehouses/sorting-centers" },
      { label: "Stocks & inventaires", href: "/warehouses/inventory" },
  ]},
  // … garde le reste de tes items avec de vraies routes (pas "#")
];

function normalizeHref(h?: string): string {
  if (!h) return "/coming-soon";
  const href = h.trim();
  if (href === "#" || href === "") return "/coming-soon";
  if (/^https?:\/\//i.test(href)) return href;
  return href.startsWith("/") ? href : `/${href}`;
}

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

  const isActive = (href?: string) => {
    const h = normalizeHref(href);
    return pathname === h || pathname.startsWith(h + "/");
  };

  const Row = (content: React.ReactNode, className = "") => (
    <div className={["flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors", className].join(" ")}>
      {content}
    </div>
  );

  return (
    <aside className={`${open ? "w-72" : "w-16"} group relative flex h-screen flex-col border-r border-white/10 bg-slate-900/90 backdrop-blur transition-[width] duration-200`}>
      <div className="flex h-16 items-center justify-between px-3">
        <Link href="/dashboard" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15">
          <svg viewBox="0 0 64 32" className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="14" width="12" height="9" rx="1.5" fill="currentColor" />
            <rect x="18" y="10" width="32" height="13" rx="2" fill="currentColor" />
            <circle cx="12" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
            <circle cx="28" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
            <circle cx="44" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
          </svg>
        </Link>
        {open && <Link href="/dashboard" className="text-base font-semibold text-white">TransManager</Link>}
        <button onClick={() => setOpen(v => !v)} className="rounded-lg border border-white/10 p-2 text-white/80 hover:bg-white/10" aria-label="Toggle sidebar">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-2 py-2">
        {NAV.map(item => {
          const hasChildren = !!item.children?.length;
          const expandedNow = !!expanded[item.key];

          const content = (
            <>
              <span className="text-lg">{item.icon}</span>
              {open && <span className="flex-1 text-sm">{item.label}</span>}
              {open && hasChildren && <span className={`text-xs transition-transform ${expandedNow ? "rotate-90" : ""}`}>▸</span>}
            </>
          );

          return (
            <div key={item.key} className="mb-1">
              {item.href && !hasChildren ? (
                <Link
                  href={normalizeHref(item.href)}
                  className={isActive(item.href) ? "bg-white/15 text-white block rounded-xl" : "text-white/90 hover:bg-white/10 block rounded-xl"}
                >
                  {Row(content, "")}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => hasChildren && setExpanded(e => ({ ...e, [item.key]: !e[item.key] }))}
                  className="w-full text-left text-white/90 hover:bg-white/10 rounded-xl"
                >
                  {Row(content, "")}
                </button>
              )}

              {open && hasChildren && expandedNow && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.children!.map(c => (
                    <Link
                      key={c.label}
                      href={normalizeHref(c.href)}
                      className={isActive(c.href) ? "bg-white/15 text-white block rounded-lg px-3 py-1.5 text-sm" : "text-white/80 hover:bg-white/10 block rounded-lg px-3 py-1.5 text-sm"}
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
