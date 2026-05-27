"use client";
import Image from "next/image";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

export default function About() {
  const { t } = useLang();
  const ref = useReveal();

  return (
    <section id="about" ref={ref}>
      <div className="shell">
        <div className="center-head reveal">
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h2 className="section-title">{t.about.title}</h2>
        </div>

        <div className="about-grid-responsive" style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 80, alignItems: "start",
        }}>
          <div className="reveal">
            {[t.about.p1, t.about.p2, t.about.p3, t.about.p4].map((p, i) => (
              <p key={i} style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 18px" }}>
                {p}
              </p>
            ))}
          </div>

          <div className="reveal" style={{
            aspectRatio: "4 / 5",
            borderRadius: 22, overflow: "hidden",
            position: "relative",
            background: "linear-gradient(140deg, var(--brand-blue-deep), var(--brand-blue-mid))",
            border: "1px solid var(--line)",
          }}>
            {/* Diagonal stripes */}
            <div style={{
              position: "absolute", inset: 0,
              background: "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 24px, transparent 24px, transparent 48px)",
            }} />
            {/* Caption */}
            <span style={{
              position: "absolute", bottom: 16, left: 16,
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 10, letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.55)",
              textTransform: "uppercase",
            }}>TEAM PHOTO</span>
            {/* Logo badge */}
            <div style={{
              position: "absolute", bottom: 24, right: 24,
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(255,255,255,0.94)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Image src="/logo.png" alt="IOT in Motion" width={60} height={60} style={{ width: 60, height: "auto" }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .about-grid-responsive { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
