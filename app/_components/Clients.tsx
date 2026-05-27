"use client";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

export default function Clients() {
  const { t } = useLang();
  const ref = useReveal();
  const list = t.clients.list;

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
          {list.map((c, i) => (
            <div key={i} style={{
              aspectRatio: "16 / 9",
              background: "var(--bg-card)",
              border: "1px solid var(--line)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "14px 18px",
              transition: "all 0.25s var(--ease-smooth)",
              cursor: "default",
            }}>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: "var(--brand-blue-deep)",
                textAlign: "center",
                letterSpacing: "-0.01em", lineHeight: 1.2,
              }}>{c}</div>
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
      `}</style>
    </section>
  );
}
