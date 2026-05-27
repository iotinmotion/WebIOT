"use client";
import Image from "next/image";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

const NODES = [
  { x: 16, y: 22, label: "AYSAM_19500" },
  { x: 84, y: 18, label: "TIGRE_500" },
  { x: 90, y: 56, label: "PILAR_1000" },
  { x: 70, y: 84, label: "ENEL_30K" },
  { x: 24, y: 80, label: "EZEIZA_100" },
  { x: 8, y: 54, label: "GRP_SAN_300" },
];

const TAGS = "LoRaWAN · NB-IoT · 4G · MQTT · ENARGAS · Cloud · IA · API · Edge · SIGFOX · LTE-M · Telemetría · Agro 4.0 · Smart City".split(" · ");

function HeroVisual() {
  return (
    <div style={{
      position: "relative",
      aspectRatio: "16 / 11",
      width: "100%",
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: "0 30px 80px -25px color-mix(in oklab, var(--brand-blue-deep) 50%, transparent), 0 0 0 1px color-mix(in oklab, var(--brand-blue-deep) 20%, transparent)",
      background: "radial-gradient(ellipse at 30% 30%, #1a3370 0%, #0a1a3d 60%, #050d24 100%)",
    }}>
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(to right, rgba(130,194,201,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(130,194,201,0.05) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 90%)",
      }} />

      {/* Network SVG */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="#82C2C9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#82C2C9" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="22" fill="url(#centerGlow)" />
        {NODES.map((n, i) => (
          <line key={`l-${i}`} x1={n.x} y1={n.y} x2="50" y2="50"
            stroke="rgba(130,194,201,0.18)" strokeWidth="0.18" strokeDasharray="0.6 0.6" />
        ))}
        {NODES.map((n, i) => (
          <circle key={`p-${i}`} r="0.7" fill="#82C2C9">
            <animate attributeName="cx" from={n.x} to="50" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="cy" from={n.y} to="50" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {NODES.map((n, i) => (
          <g key={`n-${i}`}>
            <circle cx={n.x} cy={n.y} r="2.6" fill="rgba(130,194,201,0.18)" />
            <circle cx={n.x} cy={n.y} r="0.95" fill="#82C2C9" stroke="white" strokeWidth="0.15" />
          </g>
        ))}
      </svg>

      {/* Live bar */}
      <div style={{
        position: "absolute", top: 16, left: 16, right: 16,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
        fontSize: 10, letterSpacing: "0.18em",
        color: "rgba(255,255,255,0.65)",
        textTransform: "uppercase",
        zIndex: 3,
      }}>
        <span>
          <span style={{
            display: "inline-block",
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--brand-orange)",
            marginRight: 8,
            animation: "pulse-fast 1.4s ease-in-out infinite",
          }} />
          LIVE · {new Date().toISOString().slice(0, 10)}
        </span>
        <span>NODES · {NODES.length}</span>
      </div>

      {/* Core */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        zIndex: 2,
      }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%",
          background: "rgba(130, 194, 201, 0.12)",
          border: "2px solid rgba(130, 194, 201, 0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: -16,
            border: "1px solid rgba(130,194,201,0.18)",
            borderRadius: "50%",
            animation: "ring-out 3s ease-out infinite",
          }} />
          <div style={{
            position: "absolute", inset: -16,
            border: "1px solid rgba(130,194,201,0.18)",
            borderRadius: "50%",
            animation: "ring-out 3s ease-out 1.5s infinite",
          }} />
          <Image src="/logo.png" alt="" width={56} height={56} style={{ width: 56, height: "auto", opacity: 0.95, filter: "brightness(1.1) invert(1)" }} />
        </div>
        <div style={{
          marginTop: 16,
          fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
          fontSize: 11, letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.6)",
          textTransform: "uppercase",
        }}>
          SIM Platform · Sensores en Movimiento
        </div>
      </div>

      {/* Chips */}
      {[
        { style: { top: "20%", left: "8%" }, alert: false, text: "AYSAM · 19.5K" },
        { style: { top: "68%", right: "8%" }, alert: true, text: "ENEL · 30K" },
        { style: { bottom: "10%", left: "32%" }, alert: false, text: "PILAR · 1.0K" },
      ].map((chip, i) => (
        <div key={i} style={{
          position: "absolute",
          ...chip.style,
          fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
          fontSize: 10, letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.85)",
          background: "rgba(43, 71, 134, 0.55)",
          padding: "5px 10px",
          borderRadius: 6,
          border: "1px solid rgba(130,194,201,0.2)",
          display: "flex", alignItems: "center", gap: 6,
          backdropFilter: "blur(6px)",
          zIndex: 3,
          whiteSpace: "nowrap",
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: chip.alert ? "var(--brand-orange)" : "var(--brand-teal)",
            boxShadow: `0 0 8px ${chip.alert ? "var(--brand-orange)" : "var(--brand-teal)"}`,
          }} />
          {chip.text}
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();
  const ref = useReveal();

  return (
    <section id="home" ref={ref} style={{ padding: "120px 0 0", position: "relative", overflow: "hidden" }}>
      <div className="shell">
        {/* Top headline */}
        <h1 className="reveal" style={{
          textAlign: "center",
          fontSize: "clamp(28px, 3vw, 40px)",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: 1.18,
          color: "var(--brand-blue-deep)",
          maxWidth: "28ch",
          margin: "0 auto 64px",
          textWrap: "balance",
        } as React.CSSProperties}>
          {t.hero.title_1}{" "}
          <span style={{ fontStyle: "italic", color: "var(--brand-orange)" }}>{t.hero.title_2}</span>{" "}
          {t.hero.title_3}
        </h1>

        {/* Two-column grid */}
        <div className="hero-grid-responsive reveal" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.05fr",
          gap: 64,
          alignItems: "center",
        }}>
          {/* Left column */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--brand-blue-deep)",
              marginBottom: 24,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "var(--brand-orange)",
                boxShadow: "0 0 0 4px color-mix(in oklab, var(--brand-orange) 22%, transparent)",
                animation: "pulse 2.4s var(--ease-smooth) infinite",
                flexShrink: 0,
              }} />
              {t.hero.eyebrow}
            </div>

            <h2 style={{
              fontSize: "clamp(28px, 3vw, 38px)",
              fontWeight: 600,
              color: "var(--brand-blue-deep)",
              margin: "0 0 18px",
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
            }}>
              {t.hero.bring_to_life}
            </h2>

            <p style={{
              fontSize: 16,
              color: "var(--ink-soft)",
              lineHeight: 1.6,
              maxWidth: "50ch",
              margin: "0 0 28px",
            }}>
              {t.hero.sub}
            </p>

            <div style={{
              background: "color-mix(in oklab, var(--brand-teal) 25%, white)",
              borderLeft: "3px solid var(--brand-teal)",
              borderRadius: 14,
              padding: "22px 24px",
              fontSize: 14.5,
              lineHeight: 1.55,
              color: "var(--brand-blue-deep)",
              marginBottom: 32,
            }}>
              {t.hero.pitch}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="#contact" className="btn btn-primary">
                {t.hero.cta_primary} <span>→</span>
              </a>
              <a href="#solutions" className="btn btn-secondary">
                {t.hero.cta_secondary}
              </a>
            </div>
          </div>

          {/* Right column — visual */}
          <HeroVisual />
        </div>

        {/* Tag strip */}
        <div style={{
          marginTop: 80,
          padding: "22px 0",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}>
          <div className="tagstrip-track">
            {[...TAGS, ...TAGS].map((s, i) => (
              <span className="tagstrip-item" key={i}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .hero-grid-responsive { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
