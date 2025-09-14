'use client';
import { useEffect, useState } from 'react';
import SafeLink from '@/components/SafeLink';

type Warehouse = {
  id:string; name:string; country:string; lat:number; lng:number; createdAt?:string;
  price?: number; vehicleSlots?: number; staffSlots?: number;
};

function isValidItem(x: any): x is Warehouse {
  return x && typeof x.id === 'string' && typeof x.name === 'string'
    && typeof x.country === 'string' && Number.isFinite(x.lat) && Number.isFinite(x.lng);
}
const seg = (s: string) => encodeURIComponent(String(s));

export default function WarehousesPage() {
  const [items, setItems] = useState<Warehouse[]|null>(null);

  useEffect(()=>{ (async()=>{
    try {
      const r = await fetch('/api/warehouses/list', { cache: 'no-store' });
      const j = await r.json();
      const raw = Array.isArray(j.items) ? j.items : [];
      setItems(raw.filter(isValidItem));
    } catch {
      setItems([]);
    }
  })(); }, []);

  if (!items) return <div className="p-6">Chargement…</div>;

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Entrepôts</h1>
          <p className="opacity-70 text-sm">Achetez, gérez et améliorez vos installations.</p>
        </div>
        <SafeLink
          href="/warehouses/new"
          className="rounded-xl border border-white/15 bg-white text-neutral-900 hover:bg-neutral-200 px-3 py-1.5 text-sm"
        >
          Acheter un entrepôt
        </SafeLink>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-medium mb-1">Commencez ici</div>
          <p className="opacity-80 mb-4">
            Aucun entrepôt pour l’instant. Le <strong>premier est offert</strong> — choisissez une ville sur la carte.
          </p>
          <SafeLink
            href="/warehouses/new"
            className="inline-flex items-center rounded-xl border border-white/15 bg-white text-neutral-900 hover:bg-neutral-200 px-4 py-2 text-sm"
          >
            Choisir sur la carte
          </SafeLink>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map(w => (
            <SafeLink
              key={w.id}
              href={`/warehouses/${seg(w.id)}`}
              className="block rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">
                    {w.name} <span className="opacity-70 text-sm">({w.country})</span>
                  </div>
                  <div className="opacity-70 text-sm">Lat {w.lat.toFixed(3)} • Lng {w.lng.toFixed(3)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-60">{w.createdAt ? new Date(w.createdAt).toLocaleDateString() : ""}</div>
                  <div className="mt-1 text-xs opacity-80">
                    {w.price && w.price > 0 ? `${w.price.toLocaleString('fr-FR')} EU` : "Offert"}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="rounded-md bg-white/10 px-2 py-1">{w.vehicleSlots ?? 1} emplacement véhicule</span>
                <span className="rounded-md bg-white/10 px-2 py-1">{w.staffSlots ?? 2} personnels</span>
              </div>
            </SafeLink>
          ))}
        </div>
      )}
    </div>
  );
}
