"use client";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

export default function Timeline() {
  const { t } = useLang();
  const ref = useReveal() as React.RefObject<HTMLDivElement>;
  const ms = t.timeline.milestones;

  const byYear: Record<string, typeof ms> = {};
  ms.forEach((m) => { (byYear[m.y] = byYear[m.y] || []).push(m); });
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="shell" id="evolution" ref={ref}>
      <section className="reveal" style={{
        background: "var(--brand-blue-deep)",
        color: "white",
        borderRadius: 28,
        padding: "80px 0 90px",
        position: "relative",
        overflow: "hidden",
        margin: "110px 0",
      }}>
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(to right, rgba(130,194,201,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(130,194,201,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at top, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, black 30%, transparent 80%)",
          pointerEvents: "none",
        }} />

        <div className="shell">
          <div className="center-head" style={{ marginBottom: 56 }}>
            <span style={{
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--brand-teal)",
              display: "inline-flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ width: 18, height: 1, background: "var(--brand-teal)", flexShrink: 0 }} />
              {t.timeline.eyebrow}
            </span>
            <h2 style={{
              fontSize: "clamp(32px, 4.2vw, 56px)",
              fontWeight: 600, lineHeight: 1.05,
              letterSpacing: "-0.025em",
              margin: "14px 0 0",
              color: "white",
            }}>
              {t.timeline.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span style={{
                fontStyle: "italic", fontWeight: 500, color: "var(--brand-teal)",
                position: "relative", display: "inline-block",
              }}>
                {t.timeline.title.split(" ").slice(-2).join(" ")}
                <span style={{
                  position: "absolute", left: 0, right: 0, bottom: "0.05em",
                  height: "0.12em", background: "var(--brand-orange)", opacity: 0.5, zIndex: -1,
                }} />
              </span>
            </h2>
            <p style={{
              fontSize: "clamp(15px, 1.2vw, 17px)",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "60ch", lineHeight: 1.5, margin: "20px auto 0",
            }}>
              {t.timeline.sub}
            </p>
          </div>

          <div style={{
            position: "relative",
            marginTop: 60, paddingTop: 30,
            overflowX: "auto",
            scrollbarColor: "var(--brand-teal) transparent",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${years.length}, 240px)`,
              gap: 16,
              paddingBottom: 12,
              width: "max-content",
              margin: "0 auto",
              position: "relative",
            }}>
              {/* Horizontal rail */}
              <div style={{
                position: "absolute",
                top: 30, left: 0, right: 0, height: 1,
                background: "rgba(255,255,255,0.18)",
                pointerEvents: "none",
              }} />

              {years.map((y) => (
                <div key={y} style={{ position: "relative", paddingTop: 22, textAlign: "center" }}>
                  {/* Dot */}
                  <div style={{
                    position: "absolute", top: -3, left: "50%",
                    transform: "translateX(-50%)",
                    width: 11, height: 11, borderRadius: "50%",
                    background: "var(--brand-teal)",
                    boxShadow: "0 0 0 4px rgba(130,194,201,0.18)",
                  }} />

                  <span style={{
                    fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                    fontSize: 12, letterSpacing: "0.14em",
                    color: "var(--brand-teal)", display: "inline-block",
                    background: "rgba(130,194,201,0.16)",
                    padding: "4px 10px", borderRadius: 999,
                    marginBottom: 10,
                  }}>{y}</span>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
                    {byYear[y].map((m, i) => (
                      <div key={i} style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10, padding: "12px 14px", textAlign: "left",
                      }}>
                        <h4 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 6px", color: "white" }}>
                          {m.t}
                        </h4>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, margin: 0 }}>
                          {m.d}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
