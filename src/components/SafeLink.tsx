"use client";

import Link from "next/link";
import React from "react";

function normalizeHref(h?: string | URL): string {
  if (!h) return "/coming-soon";
  if (h instanceof URL) return h.toString();
  const s = String(h).trim();
  if (!s || s === "#" || s.toLowerCase().startsWith("javascript:")) return "/coming-soon";
  if (/^https?:\/\//i.test(s)) return s;        // liens externes ok
  return s.startsWith("/") ? s : `/${s}`;       // force un chemin absolu
}

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & { href?: string | URL };

export default function SafeLink({ href, ...rest }: Props) {
  const safe = normalizeHref(href);
  return <Link href={safe} {...rest} />;
}
