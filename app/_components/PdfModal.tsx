"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./LangContext";

interface Props {
  pdf: string;
  solucion: string;
  categoria: string;
  onClose: () => void;
}

const copy = {
  es: {
    title: "Recibir PDF",
    sub: "Completá tus datos y te enviamos el PDF por email.",
    nombre: "Nombre y apellido *",
    email: "Email *",
    empresa: "Empresa",
    celular: "Celular",
    pais: "País / Localidad",
    contacto: "Deseo ser contactado por el equipo de IOT in Motion",
    send: "Enviar PDF",
    sending: "Enviando…",
    success: "¡Listo! El PDF fue enviado a tu email.",
    error: "Hubo un error al enviar. Intentá de nuevo.",
  },
  en: {
    title: "Receive PDF",
    sub: "Fill in your details and we'll send the PDF to your email.",
    nombre: "Full name *",
    email: "Email *",
    empresa: "Company",
    celular: "Phone",
    pais: "Country / City",
    contacto: "I'd like to be contacted by the IOT in Motion team",
    send: "Send PDF",
    sending: "Sending…",
    success: "Done! The PDF was sent to your email.",
    error: "Something went wrong. Please try again.",
  },
};

export default function PdfModal({ pdf, solucion, categoria, onClose }: Props) {
  const { lang } = useLang();
  const t = copy[lang];
  const overlayRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    nombre_apellido: "", email: "", empresa: "", celular: "",
    pais_localidad: "", desea_contacto: false,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function patch(key: string, val: string | boolean) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/send-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pdf, solucion, categoria, locale: lang, origen: "Descarga PDF" }),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: "10px 12px", borderRadius: 8,
    border: "1px solid var(--line-strong)",
    background: "var(--bg-soft)",
    fontSize: 14, color: "var(--brand-blue-deep)",
    outline: "none", width: "100%", boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        background: "var(--bg-card)", borderRadius: 22,
        border: "1px solid var(--line)",
        width: "100%", maxWidth: 480,
        padding: "32px 32px 28px",
        position: "relative",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 32, height: 32, borderRadius: "50%",
            border: "1px solid var(--line)", background: "var(--bg-soft)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16, color: "var(--ink-soft)",
          }}
        >×</button>

        <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: "var(--brand-blue-deep)" }}>
          {t.title}
        </h2>
        <p style={{ margin: "0 0 22px", fontSize: 13, color: "var(--ink-soft)" }}>{t.sub}</p>

        {status === "ok" ? (
          <div style={{
            padding: "20px 16px", borderRadius: 12, textAlign: "center",
            background: "color-mix(in oklab, var(--brand-teal) 18%, transparent)",
            border: "1px solid var(--brand-teal)",
            color: "var(--brand-blue-deep)", fontWeight: 600, fontSize: 15,
          }}>
            ✓ {t.success}
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.nombre}</label>
                <input required value={form.nombre_apellido} onChange={(e) => patch("nombre_apellido", e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.email}</label>
                <input required type="email" value={form.email} onChange={(e) => patch("email", e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.empresa}</label>
                <input value={form.empresa} onChange={(e) => patch("empresa", e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.celular}</label>
                <input value={form.celular} onChange={(e) => patch("celular", e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.pais}</label>
              <input value={form.pais_localidad} onChange={(e) => patch("pais_localidad", e.target.value)} style={inputStyle} />
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: "var(--ink-soft)" }}>
              <input
                type="checkbox"
                checked={form.desea_contacto}
                onChange={(e) => patch("desea_contacto", e.target.checked)}
                style={{ marginTop: 2, accentColor: "var(--brand-blue-deep)", width: 15, height: 15, flexShrink: 0 }}
              />
              {t.contacto}
            </label>

            {status === "error" && (
              <p style={{ margin: 0, fontSize: 13, color: "#c0392b" }}>{t.error}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                marginTop: 4, padding: "12px 24px", borderRadius: 10,
                background: "var(--brand-blue-deep)", color: "white",
                fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
                opacity: status === "sending" ? 0.7 : 1,
              }}
            >
              {status === "sending" ? t.sending : t.send} →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
