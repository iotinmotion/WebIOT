"use client";
import { useState } from "react";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

function boldify(text: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  const re = /\*\*([^*]+)\*\*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={m.index} style={{ color: "var(--brand-blue-deep)", fontWeight: 600 }}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

type CaseCode = "smart-park-pilar" | "omint-codeblue" | "omint-env" | "enel" | "renault" | "agua-aysam" | "iscwest";

function CaseVisual({ code }: { code: string }) {
  const configs: Record<string, { alert: string; icon: React.ReactNode }> = {
    "smart-park-pilar": {
      alert: "PARK · LIVE",
      icon: (
        <svg width="50%" height="50%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="20" y="55" width="60" height="22" rx="2" />
          <rect x="32" y="36" width="36" height="18" rx="2" />
          <circle cx="34" cy="80" r="6" fill="currentColor" />
          <circle cx="66" cy="80" r="6" fill="currentColor" />
          <path d="M 16 70 L 4 70" strokeWidth="4" />
          <path d="M 96 70 L 84 70" strokeWidth="4" />
        </svg>
      ),
    },
    "agua-aysam": {
      alert: "19.5K METERS",
      icon: (
        <svg width="38%" height="38%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3c-3 5-6 8-6 12a6 6 0 0012 0c0-4-3-7-6-12z" />
        </svg>
      ),
    },
    "omint-codeblue": {
      alert: "CODE BLUE",
      icon: (
        <svg width="38%" height="38%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      ),
    },
    "omint-env": {
      alert: "TEMP · OK",
      icon: (
        <svg width="38%" height="38%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 4a3 3 0 016 0v9a4 4 0 11-6 0V4z" />
          <line x1="12" y1="7" x2="12" y2="13" />
        </svg>
      ),
    },
    enel: {
      alert: "30K NODES",
      icon: (
        <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <polygon points="13,2 4,14 11,14 9,22 20,9 13,9" />
        </svg>
      ),
    },
    renault: {
      alert: "SUB-METER",
      icon: (
        <svg width="42%" height="42%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="8" width="18" height="10" rx="1" />
          <circle cx="8" cy="13" r="2" />
          <path d="M12 13h6M3 5h18" />
        </svg>
      ),
    },
    iscwest: {
      alert: "IA · IOT",
      icon: (
        <svg width="42%" height="42%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    "tigre-trafico": {
      alert: "TRÁFICO",
      icon: (
        <svg width="48%" height="48%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2" y="7" width="20" height="10" rx="1" />
          <circle cx="6" cy="17" r="2" fill="currentColor" />
          <circle cx="18" cy="17" r="2" fill="currentColor" />
          <path d="M2 11h20M6 11V7l3-3h6l3 3v4" />
        </svg>
      ),
    },
    "tigre-hidrico": {
      alert: "NIVEL HÍDRICO",
      icon: (
        <svg width="42%" height="42%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 14a3 3 0 016 0 3 3 0 016 0 3 3 0 016 0" />
          <path d="M3 19a3 3 0 016 0 3 3 0 016 0 3 3 0 016 0" />
          <path d="M12 3v7" />
          <path d="M9 7l3-4 3 4" />
        </svg>
      ),
    },
    bromteck: {
      alert: "ENERGÍA",
      icon: (
        <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="6" width="16" height="12" rx="1" />
          <path d="M8 6V4M16 6V4M8 18v2M16 18v2" />
          <path d="M9 12l2 2 4-5" />
        </svg>
      ),
    },
    "lomas-escuelas": {
      alert: "ESCUELAS",
      icon: (
        <svg width="42%" height="42%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 10l9-7 9 7v11H3V10z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    ituzaingo: {
      alert: "COMUNIDAD",
      icon: (
        <svg width="42%" height="42%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      ),
    },
  };

  const cfg = configs[code] || { alert: "CASE", icon: <span style={{ fontSize: "3rem" }}>⚡</span> };

  return (
    <div style={{
      position: "relative",
      aspectRatio: "1 / 1.05",
      borderRadius: 16, overflow: "hidden",
      background: "linear-gradient(140deg, var(--brand-blue-deep), oklch(0.25 0.05 280))",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(to right, rgba(130,194,201,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(130,194,201,0.06) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />
      <span style={{
        position: "absolute", top: 18, left: 18,
        background: "var(--brand-orange)", color: "white",
        fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
        fontSize: 9, letterSpacing: "0.14em",
        padding: "5px 9px", borderRadius: 6,
        textTransform: "uppercase", zIndex: 2,
      }}>{cfg.alert}</span>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--brand-teal)",
      }}>
        {cfg.icon}
      </div>
      <span style={{
        position: "absolute", bottom: 14, right: 14,
        fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
        fontSize: 10, letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.6)", textTransform: "uppercase",
      }}>{code.toUpperCase()}</span>
    </div>
  );
}

export default function Projects() {
  const { t } = useLang();
  const ref = useReveal();
  const cats = t.projects.categories;
  const [active, setActive] = useState(cats[0].id);
  const cur = cats.find((c) => c.id === active)!;

  return (
    <section id="projects" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">{t.projects.eyebrow}</span>
            <h2 className="section-title">{t.projects.title}</h2>
          </div>
          <p className="section-sub">{t.projects.sub}</p>
        </div>

        <div className="reveal sol-layout-responsive" style={{
          display: "grid", gridTemplateColumns: "280px 1fr", gap: 28, alignItems: "start",
        }}>
          {/* Sidebar */}
          <aside style={{
            position: "sticky", top: 92,
            background: "var(--bg-card)", border: "1px solid var(--line)",
            borderRadius: 20, padding: "24px 20px",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--ink-faint)", marginBottom: 6,
            }}>
              {t.projects.side_h.toUpperCase()}
            </div>
            <h3 style={{
              fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em",
              margin: "0 0 18px", color: "var(--brand-blue-deep)", lineHeight: 1.1,
            }}>
              <em style={{ fontStyle: "normal", color: "var(--brand-blue-deep)", fontWeight: 600 }}>{t.projects.side_b}</em>
            </h3>
            <div style={{ height: 1, background: "var(--line)", marginBottom: 14 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cats.map((c) => (
                <button key={c.id} onClick={() => setActive(c.id)} style={{
                  textAlign: "left", padding: "14px 18px",
                  border: `1px solid ${active === c.id ? "color-mix(in oklab, var(--brand-blue-deep) 24%, var(--bg-card))" : "var(--line)"}`,
                  borderRadius: 12,
                  background: active === c.id ? "color-mix(in oklab, var(--brand-blue-deep) 6%, var(--bg-card))" : "transparent",
                  color: active === c.id ? "var(--brand-blue-deep)" : "var(--ink)",
                  fontSize: 14.5, fontWeight: 500,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "all 0.25s var(--ease-smooth)", cursor: "pointer",
                }}>
                  <span>{c.t}</span>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: active === c.id ? "var(--brand-blue-deep)" : "var(--bg-soft)",
                    color: active === c.id ? "white" : "var(--brand-blue-deep)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                    transition: "all 0.25s var(--ease-smooth)",
                  }}>›</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Cases */}
          <div key={active} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{cur.t.slice(0, 2).toUpperCase()}</span>
              <div>
                <span style={{
                  fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                  fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "var(--ink-faint)", display: "block", marginBottom: 4,
                }}>{t.projects.selectedLabel}</span>
                <span style={{ fontSize: 22, fontWeight: 600, color: "var(--brand-blue-deep)", letterSpacing: "-0.015em" }}>
                  {cur.t}
                </span>
              </div>
            </div>

            {cur.cases.map((cs) => (
              <article key={cs.code} style={{
                background: "var(--bg-card)", border: "1px solid var(--line)",
                borderRadius: 20, padding: "32px 36px",
                display: "grid", gridTemplateColumns: "1fr 300px",
                gap: 36, alignItems: "center",
                transition: "border-color 0.25s var(--ease-smooth)",
              }}>
                <div>
                  <span style={{
                    fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                    fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "var(--brand-blue-deep)", fontWeight: 900,
                    WebkitTextStroke: "0.4px var(--brand-blue-deep)",
                    marginBottom: 14, display: "block",
                  }}>{cs.h}</span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    background: "var(--bg-soft)", border: "1px solid var(--line)",
                    borderRadius: 999, padding: "6px 14px", fontSize: 13, marginBottom: 18,
                  }}>
                    <span style={{
                      fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                      fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
                      color: "var(--ink-faint)",
                    }}>{t.projects.caseLabel}</span>
                    <span style={{ fontWeight: 600, color: "var(--ink)" }}>{cs.c}</span>
                  </span>
                  <div>
                    {cs.body.map((b, i) => (
                      <p key={i} style={{
                        fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7,
                        margin: "0 0 14px",
                      }}>
                        {boldify(b.text)}
                      </p>
                    ))}
                  </div>
                </div>
                <CaseVisual code={cs.code} />
              </article>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 880px) {
          .sol-layout-responsive { grid-template-columns: 1fr !important; }
          .sol-layout-responsive aside { position: static !important; }
          article { grid-template-columns: 1fr !important; padding: 24px !important; }
        }
      ` }} />
    </section>
  );
}
