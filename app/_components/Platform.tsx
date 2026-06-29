"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

function CountUp({ target = 22300, duration = 2400 }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && !started) setStarted(true); },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return <span ref={elRef}>{val.toLocaleString("en-US")}</span>;
}


export default function Platform() {
  const { t } = useLang();
  const ref = useReveal();

  return (
    <section id="platform" ref={ref} style={{
      background: "var(--bg-soft)",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div className="shell">
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="eyebrow">{t.platform.eyebrow}</span>
          <h2 className="section-title">{t.platform.title}</h2>
          <div style={{
            fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
            fontSize: 13, color: "var(--brand-teal)", letterSpacing: "0.06em", marginTop: 6,
          }}>
            {t.platform.subtitle}
          </div>
        </div>

        {/* Grid */}
        <div className="platform-grid-responsive" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: 64, alignItems: "center",
        }}>
          <div className="reveal">
            <div style={{
              fontSize: "clamp(56px, 8vw, 110px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "var(--brand-blue-deep)",
              display: "flex", alignItems: "baseline", gap: 8,
            }}>
              <CountUp target={22300} duration={2400} />
              <span style={{ fontSize: "0.4em", color: "var(--brand-orange)", transform: "translateY(-0.25em)" }}>↑</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 17, color: "var(--ink)", fontWeight: 500 }}>
              {t.platform.stat_label}
            </div>
            <div style={{
              marginTop: 6,
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 12, color: "var(--ink-faint)", letterSpacing: "0.04em",
            }}>
              {t.platform.stat_sub}
            </div>
            <h3 style={{ fontSize: "clamp(22px, 2vw, 28px)", fontWeight: 600, margin: "28px 0 14px", letterSpacing: "-0.015em" }}>
              {t.platform.h}
            </h3>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.55 }}>
              {t.platform.d}
            </p>
          </div>

          <div className="reveal">
            <video
              src="/plataforma-sim.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", borderRadius: 12, display: "block" }}
            />
          </div>
        </div>

        <p className="reveal" style={{
          textAlign: "center", marginTop: 32,
          fontSize: 13, color: "var(--ink-faint)",
          fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
          letterSpacing: "0.04em",
        }}>
          {t.platform.caption}
        </p>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .platform-grid-responsive { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
