'use client';
import { useEffect, useState } from 'react';

type Overview = { level: number; xp: number; xpIntoLevel: number; xpForNext: number; progress: number; };

export default function Topbar() {
  const [data, setData] = useState<Overview | null>(null);

  async function load() {
    try { const r = await fetch('/api/player/overview', { cache: 'no-store' }); if (r.ok) setData(await r.json()); }
    catch {}
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, []);

  const level = data?.level ?? 1;
  const progress = Math.min(1, Math.max(0, data?.progress ?? 0));
  const showCap = progress === 0 && level >= 1;

  return (
    <div className="w-full flex items-center justify-between gap-4 px-4 py-3">
      <div className="text-sm opacity-80">Bienvenue, transport pyrénéens</div>
      <div className="flex items-center gap-2">
        <span className="text-sm opacity-80">Niv.</span>
        <span className="text-sm font-medium">{level}</span>
        <div className="w-40 h-2 rounded-full bg-white/10 border border-white/10 overflow-hidden relative">
          <div className="h-full bg-white/40" style={{ width: `${progress * 100}%` }} role="progressbar"
               aria-valuemin={0} aria-valuemax={1} aria-valuenow={progress}/>
          {showCap && <div className="absolute left-0 top-0 h-full" style={{ width: 4, background: 'rgba(255,255,255,0.25)' }} />}
        </div>
      </div>
      <a href="/api/auth/signout" className="text-sm rounded-xl bg-white/5 hover:bg-white/10 px-3 py-1.5 border border-white/10">
        Se déconnecter
      </a>
    </div>
  );
}
