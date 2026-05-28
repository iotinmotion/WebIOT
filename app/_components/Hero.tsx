"use client";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

const TAGS = "LoRaWAN · NB-IoT · 4G · MQTT · ENARGAS · Cloud · IA · API · Edge · SIGFOX · LTE-M · Telemetría · Agro 4.0 · Smart City".split(" · ");

function HeroVisual() {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: "0 30px 80px -25px color-mix(in oklab, var(--brand-blue-deep) 50%, transparent), 0 0 0 1px color-mix(in oklab, var(--brand-blue-deep) 20%, transparent)",
    }}>
      <video
        src="/iot-video.mov"
        autoPlay
        muted
        loop
        playsInline
        style={{ display: "block", width: "100%", height: "auto" }}
      />
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
