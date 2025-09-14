'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MapPinned,
  Warehouse,
  TrendingUp,
  Users,
  Briefcase,
  Boxes,
  BarChart3,
  Building2,
} from 'lucide-react';

type NavItem =
  | { label: string; href: string; icon: React.ElementType; enabled: true }
  | { label: string; href?: undefined; icon: React.ElementType; enabled: false; note?: string };

const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', href: '/dashboard', icon: Home, enabled: true },
  { label: 'Réseau & Carte', icon: MapPinned, enabled: false, note: 'Bientôt' },
  { label: 'Entrepôts & Tri', href: '/warehouses', icon: Warehouse, enabled: true },
  { label: 'Marchés / Contrats', icon: Briefcase, enabled: false, note: 'Bientôt' },
  { label: 'Finances', icon: TrendingUp, enabled: false, note: 'Bientôt' },
  { label: 'Employés', icon: Users, enabled: false, note: 'Bientôt' },
  { label: 'Prestataires', icon: Briefcase, enabled: false, note: 'Bientôt' },
  { label: 'Cargo / Produits', icon: Boxes, enabled: false, note: 'Bientôt' },
  { label: 'Analyses', icon: BarChart3, enabled: false, note: 'Bientôt' },
  { label: 'Filiales', icon: Building2, enabled: false, note: 'Bientôt' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 border-r border-white/10 bg-neutral-950">
      <div className="flex flex-col w-full p-3 gap-1">
        <div className="px-2 py-3 text-sm font-semibold opacity-80">TransManager</div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          if (!item.enabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed border border-transparent"
                aria-disabled
                title={item.note || 'Indisponible'}
              >
                <Icon className="h-4 w-4 opacity-60" />
                <span>{item.label}</span>
                <span className="ml-auto text-[10px] uppercase tracking-wide opacity-60">
                  {item.note || 'Soon'}
                </span>
              </div>
            );
          }

          const active = pathname === item.href || pathname?.startsWith(item.href!);
          return (
            <Link
              key={item.label}
              href={item.href!}
              className={[
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'text-white/80 hover:text-white hover:bg-white/10',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
