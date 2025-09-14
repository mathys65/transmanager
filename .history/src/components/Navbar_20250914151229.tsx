"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[radial-gradient(1200px_400px_at_10%_-20%,rgba(56,189,248,0.15),transparent),linear-gradient(to_right,rgba(17,24,39,0.85),rgba(17,24,39,0.85))] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          {/* Logo : camion minimaliste */}
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15">
            <svg
              viewBox="0 0 64 32"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-cyan-400"
            >
              {/* Cabine */}
              <rect x="6" y="14" width="12" height="9" rx="1.5" fill="currentColor" />
              {/* Fenêtre cabine */}
              <rect x="7.5" y="15.5" width="5" height="4" rx="0.5" fill="white" />
              {/* Remorque */}
              <rect x="18" y="10" width="32" height="13" rx="2" fill="currentColor" />
              {/* Roues */}
              <circle cx="12" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
              <circle cx="28" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
              <circle cx="44" cy="26" r="3" fill="white" stroke="currentColor" strokeWidth="2" />
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
