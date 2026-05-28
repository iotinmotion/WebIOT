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

  const placeholders = loading ? Array.from({ length: 6 }) : [];

  return (
    <section id="clients" ref={ref}>
      <div className="shell">
        <div className="center-head reveal">
          <span className="eyebrow">{t.clients.eyebrow}</span>
          <h2 className="section-title">{t.clients.title}</h2>
        </div>

        <div className="reveal clients-grid-responsive" style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 14,
        }}>
          {loading
            ? placeholders.map((_, i) => (
                <div key={i} className="client-skeleton" style={{
                  aspectRatio: "16 / 9",
                  background: "var(--bg-card)",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                }} />
              ))
            : clients.map((c) => (
                <div key={c._id} style={{
                  aspectRatio: "16 / 9",
                  background: "var(--bg-card)",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: c.logoId ? 0 : "14px 18px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.25s var(--ease-smooth)",
                }}>
                  {c.logoId ? (
                    <Image
                      src={`/api/images/${c.logoId}`}
                      alt={c.nombre}
                      fill
                      style={{ objectFit: "contain", padding: "14px 18px" }}
                    />
                  ) : (
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: "var(--brand-blue-deep)",
                      textAlign: "center",
                      letterSpacing: "-0.01em", lineHeight: 1.2,
                    }}>{c.nombre}</div>
                  )}
                </div>
              ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .clients-grid-responsive { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .clients-grid-responsive { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @keyframes client-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .client-skeleton { animation: client-pulse 1.5s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
