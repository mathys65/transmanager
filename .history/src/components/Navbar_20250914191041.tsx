'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const Item = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href || (href !== '/' && pathname?.startsWith(href));
    return (
      <Link
        href={href}
        className={[
          'px-3 py-2 rounded-lg text-sm transition-colors',
          active ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/10',
        ].join(' ')}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-neutral-950/80 backdrop-blur border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold">TransManager</span>
        </Link>

        <div className="flex items-center gap-1">
          <Item href="/dashboard" label="Tableau de bord" />
          <Item href="/warehouses" label="Entrepôts" />
          <Link
            href="/auth/signin"
            className="ml-2 px-3 py-2 rounded-lg text-sm border border-white/15 text-white/90 hover:bg-white/10"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/signup"
            className="px-3 py-2 rounded-lg text-sm bg-white text-neutral-900 hover:bg-neutral-200"
          >
            Créer un compte
          </Link>
        </div>
      </nav>
    </header>
  );
}
