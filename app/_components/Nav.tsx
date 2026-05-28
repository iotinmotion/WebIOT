"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "./LangContext";

const NAV_SECTIONS = ["home", "solutions", "projects", "news", "about", "contact"] as const;

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
      const y = window.scrollY + 140;
      for (const id of NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y && el.offsetTop + el.offsetHeight > y) {
          setActive(id);
          break;
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkMap: [string, string][] = [
    ["home", t.nav.home],
    ["solutions", t.nav.solutions],
    ["projects", t.nav.projects],
    ["news", t.nav.news],
    ["about", t.nav.about],
    ["contact", t.nav.contact],
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: "14px 0",
        transition: "background 0.3s var(--ease-smooth), border-color 0.3s var(--ease-smooth)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        background: scrolled
          ? "color-mix(in oklab, var(--bg) 80%, transparent)"
          : "transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(180%) blur(14px)" : "none",
      }}
    >
      <div className="shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        {/* Logo */}
        <a href="#home" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Image src="/logo.png" alt="IOT in Motion" height={52} width={180} style={{ height: 52, width: "auto" }} priority />
        </a>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {linkMap.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              style={{
                fontSize: 14, fontWeight: 500,
                color: active === id ? "var(--brand-blue-deep)" : "var(--ink-soft)",
                padding: "8px 14px", borderRadius: 8,
                transition: "all 0.2s var(--ease-smooth)",
                position: "relative",
              }}
              onClick={() => setActive(id)}
            >
              {label}
              {active === id && (
                <span style={{
                  position: "absolute", left: 14, right: 14, bottom: 2,
                  height: 2, background: "var(--brand-teal)", borderRadius: 2,
                }} />
              )}
            </a>
          ))}
        </div>

        {/* Right: lang toggle + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <a
            href="https://sim.iotinmotion.com.ar/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill"
            style={{
              background: "white", color: "var(--brand-blue-deep)",
              border: "1px solid var(--line-strong)",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 14, fontWeight: 500,
              display: "inline-flex", alignItems: "center", gap: 8,
              transition: "all 0.2s var(--ease-smooth)",
              whiteSpace: "nowrap",
            }}
          >
            {t.nav.simClients}
          </a>
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            aria-label="Toggle language"
            style={{
              fontSize: 12, fontWeight: 500, letterSpacing: "0.04em",
              padding: "8px 14px",
              border: "1px solid var(--line-strong)", borderRadius: 999,
              background: "transparent", color: "var(--ink-soft)",
              display: "inline-flex", alignItems: "center", gap: 8,
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
          >
            <span style={{
              fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
              fontSize: 9, letterSpacing: "0.1em",
              background: "var(--brand-blue-deep)", color: "white",
              padding: "2px 5px", borderRadius: 3,
            }}>
              {lang.toUpperCase()}
            </span>
            {lang === "es" ? "Español" : "English"}
          </button>

          {/* Mobile hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{ display: "none" }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" />
                  <line x1="18" y1="4" x2="4" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="19" y2="7" />
                  <line x1="3" y1="12" x2="19" y2="12" />
                  <line x1="3" y1="17" x2="19" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--line)",
          padding: "12px 24px 20px",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {linkMap.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => { setActive(id); setMenuOpen(false); }}
              style={{
                fontSize: 16, fontWeight: 500,
                color: active === id ? "var(--brand-blue-deep)" : "var(--ink)",
                padding: "12px 8px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .nav-links-desktop { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
