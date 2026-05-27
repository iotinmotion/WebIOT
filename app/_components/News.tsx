"use client";
import { useEffect, useState } from "react";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

function NewsThumb({ id }: { id: string }) {
  if (id === "internet-day") {
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="thumb-id" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0e3a5f" /><stop offset="100%" stopColor="#82C2C9" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#thumb-id)" />
        <g opacity="0.18" stroke="white" strokeWidth="0.6" fill="none">
          {Array.from({ length: 10 }).map((_, i) => <line key={i} x1="0" y1={20 + i * 20} x2="320" y2={20 + i * 20} />)}
        </g>
        <text x="22" y="80" fontFamily="sans-serif" fontWeight="700" fontSize="38" fill="#bcd9dd">Internet</text>
        <text x="22" y="118" fontFamily="sans-serif" fontWeight="700" fontSize="38" fill="white">Day 2026</text>
        <g fill="#82C2C9" fontFamily="monospace" fontSize="10" letterSpacing="2">
          <text x="22" y="155">◇ 6 Y 7 DE MAYO</text>
          <text x="22" y="175">◇ B.A. CONVENTION CENTER</text>
        </g>
      </svg>
    );
  }
  if (id === "isc-west") {
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="thumb-isc" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a1a3d" /><stop offset="100%" stopColor="#2B4786" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#thumb-isc)" />
        <rect x="40" y="32" width="240" height="100" rx="4" fill="rgba(130,194,201,0.18)" stroke="#82C2C9" strokeWidth="0.5" />
        <text x="160" y="85" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="22" fill="white" letterSpacing="2">WELCOME TO</text>
        <text x="160" y="115" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="26" fill="#82C2C9" letterSpacing="3">ISC WEST 2026</text>
      </svg>
    );
  }
  if (id === "energy") {
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="thumb-en" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1f4d" /><stop offset="100%" stopColor="#2B4786" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#thumb-en)" />
        <path d="M 240 0 L 320 0 L 320 80 Q 280 120 240 80 Z" fill="#E34C2C" />
        <text x="22" y="74" fontFamily="sans-serif" fontWeight="700" fontSize="18" fill="white">Sistema de</text>
        <text x="22" y="96" fontFamily="sans-serif" fontWeight="700" fontSize="18" fill="#82C2C9">Monitoreo</text>
        <text x="22" y="118" fontFamily="sans-serif" fontWeight="700" fontSize="18" fill="white">Inteligente</text>
      </svg>
    );
  }
  if (id === "biosecure") {
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="thumb-bs" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d2849" /><stop offset="100%" stopColor="#476098" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#thumb-bs)" />
        <g transform="translate(150 70)">
          <circle cx="0" cy="0" r="32" fill="rgba(130,194,201,0.12)" stroke="#82C2C9" strokeWidth="1" />
          <circle cx="0" cy="-6" r="10" fill="rgba(255,255,255,0.9)" />
          <rect x="-12" y="0" width="24" height="20" rx="2" fill="rgba(255,255,255,0.92)" />
        </g>
        <rect x="0" y="160" width="320" height="40" fill="rgba(13,40,73,0.7)" />
        <text x="160" y="184" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#82C2C9" letterSpacing="3">CLINICAL · IOT · TRACEABILITY</text>
      </svg>
    );
  }
  if (id === "lorawan-coverage") {
    return (
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="thumb-lw" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a1a3d" /><stop offset="100%" stopColor="#82C2C9" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#thumb-lw)" />
        <g stroke="rgba(130,194,201,0.5)" strokeWidth="0.4" fill="none">
          {[40, 80, 130, 200].map((r) => <circle key={r} cx="160" cy="100" r={r} />)}
        </g>
        <g fill="#82C2C9">
          {[{ x: 160, y: 100, r: 5 }, { x: 80, y: 60, r: 3 }, { x: 230, y: 50, r: 3 }, { x: 80, y: 140, r: 3 }, { x: 240, y: 150, r: 3 }].map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={n.r} stroke="white" strokeWidth="1" />
          ))}
        </g>
        <text x="160" y="180" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill="white" letterSpacing="3">LORAWAN · 5 PAÍSES</text>
      </svg>
    );
  }
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="thumb-fb" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2B4786" /><stop offset="100%" stopColor="#E34C2C" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#thumb-fb)" />
      <text x="22" y="90" fontFamily="sans-serif" fontWeight="700" fontSize="22" fill="white">Caso de éxito</text>
      <text x="22" y="118" fontFamily="sans-serif" fontWeight="600" fontSize="14" fill="rgba(255,255,255,0.85)">IOT in Motion · 2026</text>
    </svg>
  );
}

const CAT_COLORS: Record<string, string> = {
  events: "color-mix(in oklab, var(--brand-teal) 24%, var(--bg-card))",
  exhibition: "color-mix(in oklab, var(--brand-blue-mid) 18%, var(--bg-card))",
  energy: "color-mix(in oklab, var(--brand-orange) 16%, var(--bg-card))",
  health: "color-mix(in oklab, var(--brand-teal) 22%, var(--bg-card))",
  networks: "color-mix(in oklab, var(--brand-blue-deep) 12%, var(--bg-card))",
  case: "color-mix(in oklab, var(--brand-orange) 12%, var(--bg-card))",
};

export default function News() {
  const { t } = useLang();
  const ref = useReveal();
  const items = t.news.items;
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    function recalc() {
      const w = window.innerWidth;
      setPerView(w < 640 ? 1 : w < 980 ? 2 : 3);
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  const pages = Math.max(1, Math.ceil(items.length / perView));
  const safeIndex = Math.min(index, pages - 1);

  return (
    <section id="news" ref={ref} style={{
      background: "var(--bg-soft)",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div className="shell">
        <div className="center-head reveal">
          <span className="eyebrow">{t.news.eyebrow}</span>
          <h2 className="section-title">
            {t.news.title_a}{" "}
            <span className="accent">{t.news.title_b}</span>
          </h2>
          <p className="section-sub">{t.news.sub}</p>
        </div>

        <div className="reveal">
          <div style={{ overflow: "hidden" }}>
            <div style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: `calc((100% - ${(perView - 1) * 24}px) / ${perView})`,
              gap: 24,
              transition: "transform 0.55s var(--ease-smooth)",
              transform: `translateX(calc(-${safeIndex} * (100% + 24px) * ${perView > 1 ? 1 : 1}))`,
            }}>
              {items.map((n) => (
                <article key={n.id} style={{
                  background: "var(--bg-card)", border: "1px solid var(--line)",
                  borderRadius: 20, overflow: "hidden",
                  display: "flex", flexDirection: "column",
                  transition: "all 0.3s var(--ease-smooth)",
                }}>
                  <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden" }}>
                    <NewsThumb id={n.id} />
                  </div>
                  <div style={{
                    padding: "22px 22px 20px",
                    display: "flex", flexDirection: "column", gap: 12, flex: 1,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{
                        fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                        fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                        padding: "5px 12px", borderRadius: 999,
                        background: CAT_COLORS[n.catKey] || CAT_COLORS.networks,
                        color: "var(--brand-blue-deep)", fontWeight: 600,
                      }}>{n.cat}</span>
                      <span style={{
                        fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                        fontSize: 11, letterSpacing: "0.06em",
                        color: "var(--ink-faint)", marginLeft: "auto",
                      }}>{n.date}</span>
                    </div>
                    <h3 style={{
                      fontSize: 18, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.25,
                      margin: "4px 0 0", color: "var(--brand-blue-deep)",
                    }}>{n.t}</h3>
                    <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5, margin: 0 }}>{n.d}</p>
                    <a href="#" onClick={(e) => e.preventDefault()} style={{
                      marginTop: "auto", paddingTop: 14,
                      borderTop: "1px solid var(--line)",
                      fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                      fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                      color: "var(--brand-blue-deep)", fontWeight: 600,
                      display: "inline-flex", alignItems: "center", gap: 8,
                    }}>
                      {t.news.cta} <span>→</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28, gap: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Page ${i + 1}`}
                  style={{
                    width: i === safeIndex ? 44 : 32, height: 4,
                    borderRadius: 2,
                    background: i === safeIndex ? "var(--brand-blue-deep)" : "var(--line-strong)",
                    cursor: "pointer",
                    transition: "all 0.25s var(--ease-smooth)",
                    border: "none",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {(["‹", "›"] as const).map((arrow, i) => (
                <button
                  key={arrow}
                  onClick={() => setIndex(i === 0 ? Math.max(0, safeIndex - 1) : Math.min(pages - 1, safeIndex + 1))}
                  disabled={i === 0 ? safeIndex === 0 : safeIndex === pages - 1}
                  aria-label={i === 0 ? "Previous" : "Next"}
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    border: "1px solid var(--line-strong)",
                    background: "var(--bg-card)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-geist-mono, ui-monospace, monospace)", fontSize: 18,
                    color: "var(--brand-blue-deep)",
                    cursor: "pointer",
                    transition: "all 0.25s var(--ease-smooth)",
                    opacity: (i === 0 ? safeIndex === 0 : safeIndex === pages - 1) ? 0.35 : 1,
                  }}
                >{arrow}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
