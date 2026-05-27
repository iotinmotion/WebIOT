"use client";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

const ICONS = [
  // Shield — connectivity & security
  <svg key="shield" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  // Leaf — efficiency & sustainability
  <svg key="leaf" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 19c0-7 6-13 14-13 0 8-6 14-14 14z" />
    <path d="M5 19l8-8" />
  </svg>,
  // Platform — SIM platform
  <svg key="platform" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M3 10h18" />
    <circle cx="7" cy="7" r="0.6" fill="currentColor" />
    <path d="M8 21h8M12 18v3" />
  </svg>,
];

export default function Pillars() {
  const { t } = useLang();
  const ref = useReveal();
  const items = t.pillars.items;

  return (
    <section id="pillars" ref={ref}>
      <div className="shell">
        <div className="center-head reveal">
          <span className="eyebrow">{t.pillars.eyebrow}</span>
          <h2 className="section-title">{t.pillars.title}</h2>
        </div>

        <div className="reveal pillars-responsive" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "var(--line)",
          border: "1px solid var(--line)",
          borderRadius: 18,
          overflow: "hidden",
        }}>
          {items.map((p, i) => (
            <div key={i} style={{
              background: "var(--bg-card)",
              padding: "36px 32px",
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "color-mix(in oklab, var(--brand-blue-deep) 8%, var(--bg-card))",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--brand-blue-deep)",
              }}>
                {ICONS[i]}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", margin: 0, lineHeight: 1.2 }}>
                {p.t}
              </h3>
              <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.55, margin: 0 }}>
                {p.d}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .pillars-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
