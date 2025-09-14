'use client';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { EUROPE_CITIES } from '@/lib/cities';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr:false });
const TileLayer    = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr:false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr:false });
const Tooltip      = dynamic(() => import('react-leaflet').then(m => m.Tooltip), { ssr:false });

const PRICE_EU = 50000;

export default function NewWarehousePage() {
  const center = useMemo<[number,number]>(() => [50, 9], []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);
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
    setBusy(true); setMsg(null);
    try {
      const r = await fetch('/api/warehouses/create', {
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, country, lat, lng })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Erreur création');
      setMsg('Entrepôt créé ✔️');
      setTimeout(()=>{ window.location.href = '/warehouses'; }, 600);
    } catch (e:any) {
      setMsg(e?.message ?? 'Erreur');
    } finally {
      setBusy(false);
    }
  }

  const priceText = firstFree === null ? '…' : (firstFree ? 'Offert (0 EU)' : `${PRICE_EU.toLocaleString('fr-FR')} EU`);

  return (
    <div className="p-0">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Choisir l’emplacement</h1>
          <p className="text-sm opacity-80">
            Clique sur un point de ville pour placer ton entrepôt (Europe • OpenStreetMap).
          </p>
          <div className="mt-2 text-sm">
            <span className="mr-2 rounded-md bg-white/10 px-2 py-1">Prix&nbsp;: {priceText}</span>
            <span className="ml-2 rounded-md bg-white/10 px-2 py-1">Capacité&nbsp;: 1 véhicule • 2 personnels</span>
          </div>
        </div>
        <a href="/warehouses" className="text-sm rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5">Annuler</a>
      </div>

      {msg && <div className="px-4 pb-2 text-sm">{msg}</div>}

      <div className="h-[70vh] w-full">
        <MapContainer center={center} zoom={5} scrollWheelZoom className="h-full w-full rounded-none">
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
                click: () => { if (!busy) create(c.name, c.country, c.lat, c.lng); }
              }}
            >
              <Tooltip>{c.name} ({c.country}) — Cliquer pour placer</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
