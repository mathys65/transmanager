'use client';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { EUROPE_CITIES } from '@/lib/cities';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr:false });
const TileLayer    = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr:false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr:false });
const Tooltip      = dynamic(() => import('react-leaflet').then(m => m.Tooltip), { ssr:false });

const PRICE_EU = 100_000;

export default function NewWarehousePage() {
  const center = useMemo<[number,number]>(() => [50, 9], []);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string|null>(null);
  const [firstFree, setFirstFree] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/warehouses/list', { cache: 'no-store' });
        const j = await r.json();
        const items = Array.isArray(j.items) ? j.items : [];
        setFirstFree(items.length === 0);
      } catch {
        setFirstFree(false);
      }
    })();
  }, []);

  async function create(name:string, country:string, lat:number, lng:number) {
    if (busy) return;
    setBusy(true); setToast(null);
    try {
      const r = await fetch('/api/warehouses/create', {
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, country, lat, lng })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Erreur création');
      setToast('Entrepôt créé ✔️');
      // redirection légère pour voir le toast
      setTimeout(()=>{ window.location.href = '/warehouses'; }, 700);
    } catch (e:any) {
      setToast(e?.message ?? 'Erreur');
      setBusy(false);
    }
  }

  const priceText = firstFree === null ? '…' : (firstFree ? 'Offert (0 EU)' : `${PRICE_EU.toLocaleString('fr-FR')} EU`);

  return (
    <div className="relative h-[100vh] w-full">
      {/* Overlay haut */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-start justify-between p-4">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur px-4 py-3">
          <div className="text-sm font-medium">Choisir l’emplacement</div>
          <div className="mt-1 text-xs opacity-80">Clique une grande ville (Europe • OpenStreetMap).</div>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="rounded-md bg-white/10 px-2 py-1">Prix&nbsp;: {priceText}</span>
            <span className="rounded-md bg-white/10 px-2 py-1">Capacité&nbsp;: 1 véhicule • 2 personnels</span>
          </div>
        </div>
        <a
          href="/warehouses"
          className="pointer-events-auto rounded-xl border border-white/15 bg-white/90 text-neutral-900 hover:bg-white px-3 py-2 text-sm"
        >
          Annuler
        </a>
      </div>

      {/* Toast bas-centre */}
      {toast && (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-xl border border-white/10 bg-neutral-950/85 px-4 py-2 text-sm">
          {toast}
        </div>
      )}

      {/* Carte plein écran */}
      <div className="absolute inset-0">
        <MapContainer center={center} zoom={5} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {EUROPE_CITIES.map((c) => (
            <CircleMarker
              key={`${c.name}-${c.country}`}
              center={[c.lat, c.lng]}
              radius={6}
              pathOptions={{ weight: 1 }}
              eventHandlers={{
                click: () => create(c.name, c.country, c.lat, c.lng)
              }}
            >
              <Tooltip>{c.name} ({c.country}) — Cliquer pour placer</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Voile "busy" */}
      {busy && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/30">
          <div className="rounded-xl border border-white/10 bg-neutral-950/90 px-4 py-2 text-sm">
            Création de l’entrepôt…
          </div>
        </div>
      )}
    </div>
  );
}
