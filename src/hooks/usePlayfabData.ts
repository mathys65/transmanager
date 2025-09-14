// src/hooks/usePlayfabData.ts
import { useEffect, useState } from "react";

export function usePlayfabBalance() {
  const [data, setData] = useState<{ balances: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/playfab/balance", { cache: "no-store" });
        if (!r.ok) throw new Error(await r.text());
        const j = await r.json();
        if (mounted) setData(j);
      } catch (e: any) {
        setErr(e?.message ?? "Erreur");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { data, loading, err };
}

export function usePlayfabStats() {
  const [data, setData] = useState<{ stats: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/playfab/stats", { cache: "no-store" });
        if (!r.ok) throw new Error(await r.text());
        const j = await r.json();
        if (mounted) setData(j);
      } catch (e: any) {
        setErr(e?.message ?? "Erreur");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { data, loading, err };
}
