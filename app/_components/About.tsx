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
          gridTemplateColumns: "1.6fr 1fr",
          gap: 80, alignItems: "center",
        }}>
          <div className="reveal">
            {[t.about.p1, t.about.p2, t.about.p3, t.about.p4].map((p, i) => (
              <p key={i} style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.65, margin: "0 0 18px" }}
                dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>

          <div className="reveal" style={{
            aspectRatio: "4 / 3",
            borderRadius: 22, overflow: "hidden",
            position: "relative",
            border: "1px solid var(--line)",
          }}>
            <Image src="/team.png" alt="IOT in Motion team" fill style={{ objectFit: "cover" }} />
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
