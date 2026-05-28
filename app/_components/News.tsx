"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

type Bilingual = string | { es: string; en: string };

interface NewsItem {
  _id: string;
  titulo: Bilingual;
  descripcion: Bilingual;
  fecha: string | null;
  categoria: Bilingual;
  catKey: string;
  imagenId: string | null;
  link: string | null;
}

function pick(val: Bilingual | undefined, lang: "es" | "en"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.es || val.en || "";
}

function formatDate(raw: string | null, lang: "es" | "en"): string {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString(lang === "es" ? "es-AR" : "en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch {
    return raw;
  }
}

const CAT_COLORS: Record<string, string> = {
  events: "color-mix(in oklab, var(--brand-teal) 24%, var(--bg-card))",
  exhibition: "color-mix(in oklab, var(--brand-blue-mid) 18%, var(--bg-card))",
  energy: "color-mix(in oklab, var(--brand-orange) 16%, var(--bg-card))",
  health: "color-mix(in oklab, var(--brand-teal) 22%, var(--bg-card))",
  networks: "color-mix(in oklab, var(--brand-blue-deep) 12%, var(--bg-card))",
  case: "color-mix(in oklab, var(--brand-orange) 12%, var(--bg-card))",
};

function NewsThumb({ item }: { item: NewsItem }) {
  if (item.imagenId) {
    return (
      <Image
        src={`/api/images/${item.imagenId}`}
        alt=""
        fill
        style={{ objectFit: "cover" }}
      />
    );
  }
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`thumb-${item._id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2B4786" />
          <stop offset="100%" stopColor="#E34C2C" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#thumb-${item._id})`} />
      <text x="22" y="90" fontFamily="sans-serif" fontWeight="700" fontSize="22" fill="white">
        IOT in Motion
      </text>
    </svg>
  );
}

export default function News() {
  const { t, lang } = useLang();
  const ref = useReveal();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
          {loading ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${perView}, 1fr)`,
              gap: 24,
            }}>
              {Array.from({ length: perView }).map((_, i) => (
                <div key={i} className="news-skeleton" style={{
                  height: 320, borderRadius: 20,
                  background: "var(--bg-card)",
                  border: "1px solid var(--line)",
                }} />
              ))}
            </div>
          ) : (
            <>
              <div style={{ overflow: "hidden" }}>
                <div style={{
                  display: "grid",
                  gridAutoFlow: "column",
                  gridAutoColumns: `calc((100% - ${(perView - 1) * 24}px) / ${perView})`,
                  gap: 24,
                  transition: "transform 0.55s var(--ease-smooth)",
                  transform: `translateX(calc(-${safeIndex} * (100% + 24px)))`,
                }}>
                  {items.map((n) => (
                    <article key={n._id} style={{
                      background: "var(--bg-card)", border: "1px solid var(--line)",
                      borderRadius: 20, overflow: "hidden",
                      display: "flex", flexDirection: "column",
                      transition: "all 0.3s var(--ease-smooth)",
                    }}>
                      <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden" }}>
                        <NewsThumb item={n} />
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
                          }}>{pick(n.categoria, lang)}</span>
                          <span style={{
                            fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                            fontSize: 11, letterSpacing: "0.06em",
                            color: "var(--ink-faint)", marginLeft: "auto",
                          }}>{formatDate(n.fecha, lang)}</span>
                        </div>
                        <h3 style={{
                          fontSize: 18, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.25,
                          margin: "4px 0 0", color: "var(--brand-blue-deep)",
                        }}>{pick(n.titulo, lang)}</h3>
                        <p style={{
                          fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5, margin: 0,
                          fontWeight: 700, WebkitTextStroke: "0.3px var(--ink-soft)",
                        }}>
                          {pick(n.descripcion, lang)}
                        </p>
                        <a href={n.link || "#"} target={n.link ? "_blank" : undefined} rel="noopener noreferrer" style={{
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
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes news-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .news-skeleton { animation: news-pulse 1.5s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
