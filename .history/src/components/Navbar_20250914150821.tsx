"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[radial-gradient(1200px_400px_at_10%_-20%,rgba(56,189,248,0.15),transparent),linear-gradient(to_right,rgba(17,24,39,0.85),rgba(17,24,39,0.85))] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          {/* Logo : route courbe + avion, monogramme discret */}
          <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15">
            <svg viewBox="0 0 48 48" width="22" height="22" aria-hidden>
              {/* Route courbe */}
              <path d="M6 36c12-10 18-10 36-18" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none"/>
              {/* Pointillé route */}
              <path d="M10 34c8-6 14-8 30-15" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" fill="none"/>
              {/* Avion stylisé */}
              <path d="M29 13l5 3-3 1-1 3-3-2 2-5z" fill="#e2e8f0"/>
              {/* Monogramme TM discret */}
              <text x="8.5" y="16.5" fontSize="7" fill="#22d3ee" fontWeight="700">T</text>
              <text x="14.5" y="16.5" fontSize="7" fill="#94a3b8" fontWeight="700">M</text>
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">TransManager</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-cyan-400"
          >
            Créer un compte
          </Link>
        </nav>
      </div>
    </header>
  );
}
