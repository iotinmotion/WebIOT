"use client";
import { useEffect, useState } from "react";

export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: 24, right: 24,
        width: 44, height: 44,
        borderRadius: "50%",
        background: show ? "var(--brand-teal)" : "transparent",
        color: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 10px 30px -10px rgba(130,194,201,0.6)",
        zIndex: 30,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(8px)",
        pointerEvents: show ? "auto" : "none",
        transition: "all 0.3s var(--ease-smooth)",
        fontSize: 18,
        border: "none",
        cursor: "pointer",
      }}
    >
      ↑
    </button>
  );
}
