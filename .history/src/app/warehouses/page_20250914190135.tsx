'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Warehouse = { id:string; name:string; country:string; lat:number; lng:number; createdAt?:string };

export default function WarehousesPage() {
  const [items, setItems] = useState<Warehouse[]|null>(null);

  async function load() {
    const r = await fetch('/api/warehouses/list', { cache: 'no-store' });
    const j = await r.json();
    setItems(j.items ?? []);
  }
  useEffect(()=>{ load(); }, []);

  if (!items) return <div className="p-6">Chargement…</div>;
  if (items.length===0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">Entrepôts</h1>
        <p className="opacity-80 mb-4">
          Vous n’avez pas encore d’entrepôt. Achetez-en un pour démarrer : stationner vos véhicules,
          maintenance, carburant, nettoyage, améliorations…
        </p>
        <Link href="/warehouses/new" className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2">
          Acheter un entrepôt
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Vos entrepôts</h1>
        <Link href="/warehouses/new" className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-sm">
          Ajouter
        </Link>
      </div>
      <div className="space-y-2">
        {items.map(w => (
          <Link key={w.id} href={`/warehouses/${w.id}`} className="block rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {w.name} <span className="opacity-70 text-sm">({w.country})</span>
                </div>
                <div className="opacity-70 text-sm">Lat {w.lat.toFixed(3)} • Lng {w.lng.toFixed(3)}</div>
              </div>
              <div className="text-xs opacity-60">{w.createdAt ? new Date(w.createdAt).toLocaleDateString() : ""}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
