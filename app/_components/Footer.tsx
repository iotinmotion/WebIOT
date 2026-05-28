"use client";
import Image from "next/image";
import { useLang } from "./LangContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer style={{
      background: "var(--brand-blue-deep)",
      color: "rgba(255,255,255,0.85)",
      padding: "56px 0 40px",
    }}>
      <div className="shell">
        <div className="footer-grid-responsive" style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
          gap: 40, alignItems: "start",
        }}>
          <div>
            <Image
              src="/logo.png"
              alt="IOT in Motion"
              width={120}
              height={40}
              style={{ height: 40, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.95 }}
            />
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", marginTop: 14, maxWidth: "30ch" }}>
              {t.footer.tagline} {t.footer.city}
            </p>
          </div>

          <div>
            <h4 style={{
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--brand-teal)", margin: "0 0 14px", fontWeight: 500,
            }}>{t.footer.offices}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>{t.contact.location}</li>
              <li>Argentina</li>
            </ul>
          </div>

          <div>
            <h4 style={{
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--brand-teal)", margin: "0 0 14px", fontWeight: 500,
            }}>{t.footer.contact}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>{t.contact.phone}</li>
              <li>
                <a href={`mailto:${t.contact.mail}`} style={{ transition: "color 0.2s" }}>
                  {t.contact.mail}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--brand-teal)", margin: "0 0 14px", fontWeight: 500,
            }}>{t.footer.follow}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><a href="https://ar.linkedin.com/company/iot-in-motion" target="_blank" rel="noopener noreferrer" style={{ transition: "color 0.2s" }}>LinkedIn</a></li>
              <li><a href="https://www.instagram.com/iotinmotion.com.ar/" target="_blank" rel="noopener noreferrer" style={{ transition: "color 0.2s" }}>Instagram</a></li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: 36, paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.12)",
          fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
          fontSize: 11, letterSpacing: "0.05em",
          color: "rgba(255,255,255,0.5)",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <span>© {new Date().getFullYear()} IOT in Motion · {t.footer.rights}</span>
          <span>v2.0 · refresh</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .footer-grid-responsive { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .footer-grid-responsive { grid-template-columns: 1fr !important; }
        }
        footer a:hover { color: var(--brand-teal) !important; }
      `}</style>
    </footer>
  );
}
