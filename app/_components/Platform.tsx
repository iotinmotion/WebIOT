"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

const TABLE_ROWS = [
  { id: "TIGRE_412", st: "OK", val: 87, alert: false },
  { id: "PILAR_109", st: "OK", val: 64, alert: false },
  { id: "AYSAM_804", st: "ALERT", val: 12, alert: true },
  { id: "ENEL_2207", st: "OK", val: 91, alert: false },
  { id: "LMZAM_55", st: "OK", val: 73, alert: false },
  { id: "ITUZA_18", st: "OK", val: 58, alert: false },
];

const MAP_PINS = [
  { x: 28, y: 38, alert: false }, { x: 42, y: 30, alert: false },
  { x: 36, y: 50, alert: true }, { x: 52, y: 44, alert: false },
  { x: 64, y: 36, alert: false }, { x: 58, y: 60, alert: false },
  { x: 70, y: 52, alert: false }, { x: 46, y: 62, alert: false },
  { x: 30, y: 70, alert: false }, { x: 78, y: 70, alert: false },
];

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

function PlatformDashboard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="platform-mock">
      {/* Toolbar */}
      <div style={{
        gridColumn: "1 / -1",
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 14px",
        borderBottom: "1px solid var(--line)",
        background: "var(--bg-soft)",
      }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <span style={{
          marginLeft: 10,
          fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
          fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.05em",
        }}>
          sim.iotinmotion.com.ar/dashboard
        </span>
      </div>

      {/* Table */}
      <div style={{ borderRight: "1px solid var(--line)", fontFamily: "var(--font-geist-mono, ui-monospace, monospace)", fontSize: 11 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.4fr 0.7fr 0.7fr 0.7fr 0.9fr",
          gap: 8, padding: "10px 14px",
          borderBottom: "1px solid var(--line)",
          background: "var(--bg-soft)",
          fontSize: "9.5px", letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--ink-faint)",
        }}>
          <span>SENSOR ID</span><span>STATE</span><span>VAL</span><span>BAT</span><span>LAST</span>
        </div>
        {TABLE_ROWS.map((r, i) => (
          <div key={r.id} style={{
            display: "grid", gridTemplateColumns: "1.4fr 0.7fr 0.7fr 0.7fr 0.9fr",
            gap: 8, padding: "10px 14px",
            borderBottom: "1px solid var(--line)",
            alignItems: "center",
          }}>
            <span style={{ color: "var(--brand-blue-deep)", fontWeight: 500 }}>{r.id}</span>
            <span style={{ color: r.alert ? "var(--brand-orange)" : "var(--brand-blue-mid)", fontWeight: r.alert ? 600 : 400 }}>{r.st}</span>
            <span>{(r.val + ((tick + i) % 4) - 2).toString().padStart(2, "0")}</span>
            <span>{98 - i * 3}%</span>
            <span style={{ color: "var(--ink-faint)" }}>{i * 3 + (tick % 5)}s</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{
        position: "relative",
        background: "linear-gradient(180deg, oklch(0.96 0.015 230) 0%, oklch(0.92 0.025 220) 100%)",
        minHeight: 280,
        overflow: "hidden",
      }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="mapgrid" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(43,71,134,0.08)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#mapgrid)" />
          <path d="M 0 25 Q 20 35, 35 30 T 65 35 Q 85 40, 100 30 L 100 50 Q 80 55, 60 50 T 25 55 Q 10 60, 0 55 Z" fill="rgba(130,194,201,0.18)" />
          <path d="M 5 70 L 90 65" stroke="rgba(43,71,134,0.2)" strokeWidth="0.5" fill="none" />
          <path d="M 20 10 L 30 90" stroke="rgba(43,71,134,0.15)" strokeWidth="0.4" fill="none" />
          <path d="M 60 10 L 75 90" stroke="rgba(43,71,134,0.15)" strokeWidth="0.4" fill="none" />
          {MAP_PINS.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="2.5" fill={p.alert ? "rgba(227,76,44,0.25)" : "rgba(130,194,201,0.3)"}>
                {p.alert && <animate attributeName="r" values="1.8;3.5;1.8" dur="1.6s" repeatCount="indefinite" />}
              </circle>
              <circle cx={p.x} cy={p.y} r="1" fill={p.alert ? "#E34C2C" : "#476098"} stroke="white" strokeWidth="0.2" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
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
            <PlatformDashboard />
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
