"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import es from "@/messages/es";
import en from "@/messages/en";

type Lang = "es" | "en";
type Messages = typeof es;

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Messages;
}

const Ctx = createContext<LangCtx>({
  lang: "es",
  setLang: () => {},
  t: es,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const stored = localStorage.getItem("iot.lang") as Lang | null;
    if (stored === "es" || stored === "en") setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("iot.lang", l);
  }

  const t = lang === "en" ? en : es;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}
