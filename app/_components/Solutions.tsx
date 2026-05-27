"use client";
import { useState } from "react";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

function SolIcon({ id }: { id: string }) {
  const paths: Record<string, React.ReactNode> = {
    lorawan: <path d="M12 8a8 8 0 018 8M12 4a12 12 0 0112 12M12 12a4 4 0 014 4M12 16h.01" />,
    macro: <path d="M3 12h4l3-7 4 14 3-7h4" />,
    traffic: <><rect x="6" y="4" width="12" height="16" rx="2" /><circle cx="12" cy="8" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="16" r="1" /></>,
    levels: <><rect x="4" y="3" width="6" height="18" rx="1" /><rect x="14" y="3" width="6" height="18" rx="1" /><path d="M4 14h6M14 9h6" /></>,
    parking: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 17V7h4a3 3 0 010 6H9" /></>,
    climate: <><circle cx="12" cy="10" r="3" /><path d="M12 3v2M12 15v2M3 10h2M19 10h2M5.6 4.6l1.4 1.4M17 16l1.4 1.4M5.6 16l1.4-1.4M17 4.6l1.4-1.4" /><path d="M4 20h16" /></>,
    gas: <><path d="M9 4h6l1 3-1 13H8L7 7z" /><circle cx="12" cy="14" r="2" /></>,
    "gas-sec": <><path d="M9 4h6l1 3-1 13H8L7 7z" /><circle cx="12" cy="14" r="2" /></>,
    cardiac: <path d="M3 12h4l2-5 4 10 2-5h6" />,
    assets: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    env: <><path d="M12 3a4 4 0 014 4c0 3-4 5-4 8M8 19h8" /></>,
    continuity: <><path d="M4 12a8 8 0 1116 0 8 8 0 01-16 0z" /><path d="M12 8v5l3 2" /></>,
    risk: <><path d="M12 3l10 18H2L12 3z" /><path d="M12 10v5M12 18h.01" /></>,
    optimize: <path d="M3 18l5-9 4 5 4-9 5 13" />,
    flood: <><path d="M3 14a3 3 0 016 0 3 3 0 016 0 3 3 0 016 0M3 19a3 3 0 016 0 3 3 0 016 0 3 3 0 016 0M12 5v5" /></>,
    people: <><circle cx="9" cy="7" r="3" /><circle cx="16" cy="9" r="2" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5M14 19c0-2 2-3 4-3s3 1 3 3" /></>,
  };
  return (
    <svg style={{ position: "absolute", inset: 0, width: "56%", height: "56%", margin: "auto", color: "rgba(255,255,255,0.95)" }}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {paths[id] || <><circle cx="12" cy="12" r="6" /><path d="M12 6v6l4 2" /></>}
    </svg>
  );
}

export default function Solutions() {
  const { t } = useLang();
  const ref = useReveal();
  const cats = t.solutions.categories;
  const [active, setActive] = useState(cats[0].id);
  const cur = cats.find((c) => c.id === active)!;

  return (
    <section id="solutions" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">{t.solutions.eyebrow}</span>
            <h2 className="section-title">{t.solutions.title}</h2>
          </div>
          <p className="section-sub">{t.solutions.sub}</p>
        </div>

        <div className="reveal sol-layout-responsive" style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 28,
          alignItems: "start",
        }}>
          {/* Sidebar */}
          <aside style={{
            position: "sticky", top: 92,
            background: "var(--bg-card)",
            border: "1px solid var(--line)",
            borderRadius: 20,
            padding: "24px 20px",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--ink-faint)", marginBottom: 6,
            }}>
              {t.solutions.side_h.toUpperCase()}
            </div>
            <h3 style={{
              fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em",
              margin: "0 0 18px", color: "var(--brand-blue-deep)", lineHeight: 1.1,
            }}>
              <em style={{ fontStyle: "normal", color: "var(--brand-blue-deep)", fontWeight: 600 }}>{t.solutions.side_b}</em>
            </h3>
            <div style={{ height: 1, background: "var(--line)", marginBottom: 14 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  style={{
                    textAlign: "left",
                    padding: "14px 18px",
                    border: `1px solid ${active === c.id ? "color-mix(in oklab, var(--brand-blue-deep) 24%, var(--bg-card))" : "var(--line)"}`,
                    borderRadius: 12,
                    background: active === c.id ? "color-mix(in oklab, var(--brand-blue-deep) 6%, var(--bg-card))" : "transparent",
                    color: active === c.id ? "var(--brand-blue-deep)" : "var(--ink)",
                    fontSize: 14.5, fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "all 0.25s var(--ease-smooth)",
                    cursor: "pointer",
                  }}
                >
                  <span>{c.t}</span>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: active === c.id ? "var(--brand-blue-deep)" : "var(--bg-soft)",
                    color: active === c.id ? "white" : "var(--brand-blue-deep)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11,
                    transition: "all 0.25s var(--ease-smooth)",
                  }}>›</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Detail */}
          <div key={active} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Header */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--line)",
              borderRadius: 18, padding: "18px 24px",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <span style={{
                width: 40, height: 40, borderRadius: 10,
                background: "color-mix(in oklab, var(--brand-blue-deep) 10%, var(--bg-card))",
                color: "var(--brand-blue-deep)",
                fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>{cur.short}</span>
              <div>
                <span style={{
                  fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                  fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "var(--ink-faint)", display: "block", marginBottom: 4,
                }}>{t.solutions.selectedLabel}</span>
                <span style={{
                  fontSize: 22, fontWeight: 600, color: "var(--brand-blue-deep)",
                  letterSpacing: "-0.015em", lineHeight: 1.15,
                }}>{cur.t}</span>
              </div>
            </div>

            {/* Items */}
            {cur.items.map((item, i) => (
              <article key={item.id} style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "1fr 240px" : "240px 1fr",
                gap: 32,
                background: "var(--bg-card)",
                border: "1px solid var(--line)",
                borderRadius: 18,
                padding: "28px 28px 24px",
                alignItems: "center",
                transition: "all 0.25s var(--ease-smooth)",
              }}>
                <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                  <h4 style={{
                    fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                    fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "var(--brand-blue-deep)", margin: "0 0 14px", fontWeight: 900,
                    WebkitTextStroke: "0.4px var(--brand-blue-deep)",
                  }}>{item.t}</h4>
                  <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 18px" }}>
                    {item.d}
                  </p>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 18,
                    fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                    fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                  }}>
                    <a href="#contact" style={{ color: "var(--brand-blue-deep)", fontWeight: 900, WebkitTextStroke: "0.4px var(--brand-blue-deep)" }}>
                      {t.solutions.moreInfo}
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()}
                      style={{ color: "var(--brand-orange)", fontWeight: 900, textDecoration: "underline", textUnderlineOffset: 4, WebkitTextStroke: "0.4px var(--brand-orange)" }}>
                      {t.solutions.downloadPdf}
                    </a>
                  </div>
                </div>
                <div style={{
                  order: i % 2 === 0 ? 2 : 1,
                  position: "relative", aspectRatio: "4 / 3", borderRadius: 14, overflow: "hidden",
                  background: item.tone === "teal"
                    ? "linear-gradient(135deg, var(--brand-teal), var(--brand-blue-mid))"
                    : "linear-gradient(135deg, var(--brand-blue-deep), var(--brand-blue-mid))",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    maskImage: "radial-gradient(ellipse at center, black 40%, transparent 90%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 90%)",
                  }} />
                  <SolIcon id={item.id} />
                  <span style={{
                    position: "absolute", bottom: 10, left: 12,
                    fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                    fontSize: 9, letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.7)", textTransform: "uppercase",
                  }}>{item.id.toUpperCase()}</span>
                </div>
              </article>
            ))}

            {/* Other solutions */}
            {cur.other && cur.other.length > 0 && (
              <div style={{
                background: "var(--bg-card)",
                border: "1px dashed var(--line-strong)",
                borderRadius: 18, padding: "26px 28px",
              }}>
                <h4 style={{
                  fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                  fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "var(--brand-blue-deep)", margin: "0 0 14px", fontWeight: 600,
                }}>{t.solutions.otherTitle}</h4>
                <ul style={{
                  listStyle: "none", padding: 0, margin: 0,
                  display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 24px",
                }}>
                  {cur.other.map((o, i) => (
                    <li key={i} style={{ fontSize: 14, color: "var(--ink-soft)", paddingLeft: 18, position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "var(--brand-orange)" }}>—</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 880px) {
          .sol-layout-responsive { grid-template-columns: 1fr !important; }
          .sol-layout-responsive aside { position: static !important; }
        }
        @media (max-width: 720px) {
          .sol-layout-responsive article { grid-template-columns: 1fr !important; }
          .sol-layout-responsive article > div { order: unset !important; }
        }
      ` }} />
    </section>
  );
}
