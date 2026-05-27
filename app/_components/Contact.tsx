"use client";
import { useState } from "react";
import { useLang } from "./LangContext";
import { useReveal } from "./useReveal";

export default function Contact() {
  const { t } = useLang();
  const ref = useReveal();
  const [form, setForm] = useState({ email: "", subject: "", area: "", message: "" });
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4500);
    setForm({ email: "", subject: "", area: "", message: "" });
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
    fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
    color: "var(--ink-faint)",
  };
  const inputStyle: React.CSSProperties = {
    background: "var(--bg)", border: "1px solid var(--line)",
    color: "var(--ink)", padding: "13px 14px", borderRadius: 10,
    fontFamily: "inherit", fontSize: 14.5, resize: "vertical" as const,
    transition: "all 0.2s var(--ease-smooth)", outline: "none",
  };

  return (
    <section id="contact" ref={ref}>
      <div className="shell">
        <div className="center-head reveal">
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 className="section-title">{t.contact.title}</h2>
          <p className="section-sub">{t.contact.sub}</p>
        </div>

        <div className="reveal contact-grid-responsive" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 24, alignItems: "stretch",
        }}>
          {/* Location card */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--line)",
            borderRadius: 22, padding: 32,
          }}>
            <h3 style={labelStyle}>{t.contact.location_h}</h3>
            <div style={{ fontSize: 22, fontWeight: 600, color: "var(--brand-blue-deep)", margin: "0 0 0", letterSpacing: "-0.015em" }}>
              Caseros, Buenos Aires
            </div>

            {/* Map */}
            <div style={{
              marginTop: 18, aspectRatio: "3 / 2",
              borderRadius: 14, overflow: "hidden", position: "relative",
              background: "linear-gradient(180deg, oklch(0.95 0.02 80) 0%, oklch(0.92 0.025 75) 100%)",
              border: "1px solid var(--line)",
            }}>
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect width="100" height="100" fill="oklch(0.95 0.025 80)" />
                <path d="M 0 38 L 100 36" stroke="oklch(0.85 0.04 50)" strokeWidth="2" />
                <path d="M 0 56 L 100 54" stroke="oklch(0.85 0.04 50)" strokeWidth="2.4" />
                <path d="M 0 78 L 100 76" stroke="oklch(0.88 0.03 60)" strokeWidth="1.5" />
                <path d="M 18 0 L 22 100" stroke="oklch(0.88 0.03 60)" strokeWidth="1.5" />
                <path d="M 48 0 L 52 100" stroke="oklch(0.85 0.04 50)" strokeWidth="2" />
                <path d="M 76 0 L 80 100" stroke="oklch(0.88 0.03 60)" strokeWidth="1.5" />
                <rect x="8" y="14" width="14" height="10" fill="oklch(0.92 0.02 70)" />
                <rect x="58" y="40" width="14" height="10" fill="oklch(0.92 0.02 70)" />
                <rect x="28" y="62" width="16" height="10" fill="oklch(0.92 0.02 70)" />
                <text x="32" y="44" fontFamily="monospace" fontSize="3.2" fill="oklch(0.5 0.04 50)">Caseros</text>
                <text x="56" y="62" fontFamily="monospace" fontSize="2.6" fill="oklch(0.55 0.04 50)">Av. Mitre</text>
              </svg>
              {/* Pin */}
              <div style={{
                position: "absolute", top: "38%", left: "32%",
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--brand-orange)", border: "3px solid white",
                boxShadow: "0 8px 18px rgba(227,76,44,0.4)",
                transform: "translate(-50%, -100%)", zIndex: 2,
              }} />
            </div>

            {/* Location info */}
            <div style={{
              marginTop: 18, paddingTop: 18,
              borderTop: "1px solid var(--line)",
              display: "grid", gap: 8, fontSize: 14, color: "var(--ink-soft)",
            }}>
              {[
                { label: "TEL", value: t.contact.phone },
                { label: "EMAIL", value: t.contact.mail, href: `mailto:${t.contact.mail}` },
                { label: "DIR", value: t.contact.location },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ ...labelStyle, minWidth: 70 }}>{row.label}</span>
                  {row.href ? (
                    <a href={row.href} style={{ color: "var(--brand-blue-deep)" }}>{row.value}</a>
                  ) : (
                    <span>{row.value}</span>
                  )}
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <div style={{
              marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 16, padding: 18,
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              borderRadius: 14, color: "white",
            }}>
              <div>
                <div style={{ fontFamily: "var(--font-geist-mono, ui-monospace, monospace)", fontSize: 11, letterSpacing: "0.14em", opacity: 0.85 }}>
                  {t.contact.whatsapp_h}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{t.contact.phone}</div>
              </div>
              <a href={`https://wa.me/5491151640000`} target="_blank" rel="noopener noreferrer"
                className="btn"
                style={{
                  background: "rgba(255,255,255,0.18)", color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "10px 18px", borderRadius: 999, whiteSpace: "nowrap",
                }}>
                {t.contact.whatsapp_cta}
              </a>
            </div>
          </div>

          {/* Form card */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--line)",
            borderRadius: 22, padding: 32,
          }}>
            <h3 style={labelStyle}>{t.contact.email_h}</h3>
            <div style={{ fontSize: 22, fontWeight: 600, color: "var(--brand-blue-deep)", margin: "0 0 4px", letterSpacing: "-0.015em" }}>
              {t.contact.title}
            </div>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: "4px 0 0", lineHeight: 1.5 }}>
              {t.contact.email_d}
            </p>

            <form onSubmit={submit} style={{ marginTop: 20 }}>
              {[
                { key: "email", label: t.contact.email, type: "email", required: true },
                { key: "subject", label: t.contact.subject, type: "text", required: false },
              ].map((f) => (
                <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    type={f.type}
                    required={f.required}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              ))}

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                <label style={labelStyle}>{t.contact.area}</label>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  style={inputStyle}
                >
                  {t.contact.area_opts.map((o, i) => (
                    <option key={i} value={i === 0 ? "" : o}>{o}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                <label style={labelStyle}>{t.contact.message}</label>
                <textarea
                  required
                  placeholder={t.contact.message_ph}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, minHeight: 100 }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{t.contact.privacy}</span>
                <button type="submit" className="btn btn-primary" style={{ background: "var(--brand-blue-deep)" }}>
                  {t.contact.send} <span>→</span>
                </button>
              </div>

              {sent && (
                <div style={{
                  marginTop: 14, padding: "12px 14px",
                  background: "color-mix(in oklab, var(--brand-teal) 22%, transparent)",
                  border: "1px solid var(--brand-teal)",
                  borderRadius: 10,
                  color: "var(--brand-blue-deep)",
                  fontSize: 13.5,
                  fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
                }}>
                  ✓ {t.contact.sent}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .contact-grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
