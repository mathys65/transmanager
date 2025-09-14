'use client';
import { useEffect, useState } from 'react';
import SafeLink from '@/components/SafeLink';

type Warehouse = { id:string; name:string; country:string; lat:number; lng:number; createdAt?:string };

function isValidItem(x: any): x is Warehouse {
  return x && typeof x.id === 'string' && typeof x.name === 'string'
    && typeof x.country === 'string' && Number.isFinite(x.lat) && Number.isFinite(x.lng);
}
const seg = (s: string) => encodeURIComponent(String(s)); // évite “string did not match pattern”

export default function WarehousesPage() {
  const [items, setItems] = useState<Warehouse[]|null>(null);

  async function load() {
    try {
      const r = await fetch('/api/warehouses/list', { cache: 'no-store' });
      const j = await r.json();
      const raw = Array.isArray(j.items) ? j.items : [];
      // filtre éléments corrompus / anciens formats
      setItems(raw.filter(isValidItem));
    } catch {
      setItems([]);
    }
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
        <SafeLink
          href="/warehouses/new"
          className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2"
        >
          Acheter un entrepôt
        </SafeLink>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Vos entrepôts</h1>
        <SafeLink
          href="/warehouses/new"
          className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-sm"
        >
          Ajouter
        </SafeLink>
      </div>
      <div className="space-y-2">
        {items.map(w => (
          <SafeLink
            key={w.id}
            href={`/warehouses/${seg(w.id)}`}
            className="block rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {w.name} <span className="opacity-70 text-sm">({w.country})</span>
                </div>
                <div className="opacity-70 text-sm">Lat {w.lat.toFixed(3)} • Lng {w.lng.toFixed(3)}</div>
              </div>
              <div className="text-xs opacity-60">
                {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : ""}
              </div>
            </div>
          </SafeLink>
        ))}
      </div>
    </div>
  );
}
