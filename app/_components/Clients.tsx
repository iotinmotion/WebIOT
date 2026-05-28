"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

interface Cliente {
  _id: string;
  nombre: string;
  logoId: string | null;
}

const CARD_W = 180;
const GAP = 16;

function ClientCard({ c }: { c: Cliente }) {
  return (
    <div style={{
      width: CARD_W, flexShrink: 0,
      aspectRatio: "16 / 9",
      background: "var(--bg-card)",
      border: "1px solid var(--line)",
      borderRadius: 12,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {c.logoId ? (
        <Image
          src={`/api/images/${c.logoId}`}
          alt={c.nombre}
          fill
          style={{ objectFit: "contain", padding: "12px 16px" }}
        />
      ) : (
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: "var(--brand-blue-deep)",
          textAlign: "center",
          letterSpacing: "-0.01em", lineHeight: 1.2,
          padding: "0 12px",
        }}>{c.nombre}</span>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: "flex", gap: GAP, padding: "0 var(--shell-pad, 24px)" }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="client-skeleton" style={{
          width: CARD_W, flexShrink: 0,
          aspectRatio: "16 / 9",
          background: "var(--bg-card)",
          border: "1px solid var(--line)",
          borderRadius: 12,
        }} />
      ))}
    </div>
  );
}

export default function Clients() {
  const { t } = useLang();
  const ref = useReveal();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => { setClients(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const track = [...clients, ...clients];
  const duration = clients.length * 3;

  return (
    <section id="clients" ref={ref}>
      <div className="shell">
        <div className="center-head reveal">
          <span className="eyebrow">{t.clients.eyebrow}</span>
          <h2 className="section-title">{t.clients.title}</h2>
        </div>
      </div>

      <div className="reveal" style={{ overflow: "hidden", width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <>
            {/* Row 1 — scrolls left */}
            <div
              className="clients-ticker clients-ticker-left"
              style={{ "--ticker-duration": `${duration}s`, display: "flex", gap: GAP, width: "max-content" } as React.CSSProperties}
            >
              {track.map((c, i) => <ClientCard key={`a-${c._id}-${i}`} c={c} />)}
            </div>

            {/* Row 2 — scrolls right */}
            <div
              className="clients-ticker clients-ticker-right"
              style={{ "--ticker-duration": `${duration}s`, display: "flex", gap: GAP, width: "max-content" } as React.CSSProperties}
            >
              {track.map((c, i) => <ClientCard key={`b-${c._id}-${i}`} c={c} />)}
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes clients-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - ${GAP / 2}px)); }
        }
        @keyframes clients-scroll-right {
          0%   { transform: translateX(calc(-50% - ${GAP / 2}px)); }
          100% { transform: translateX(0); }
        }
        .clients-ticker-left  { animation: clients-scroll-left  var(--ticker-duration, 30s) linear infinite; }
        .clients-ticker-right { animation: clients-scroll-right var(--ticker-duration, 30s) linear infinite; }
        .clients-ticker:hover { animation-play-state: paused; }
        @keyframes client-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .client-skeleton { animation: client-pulse 1.5s ease-in-out infinite; }
      `}} />
    </section>
  );
}
