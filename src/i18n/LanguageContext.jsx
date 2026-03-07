import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("cofe_lang") || "uz";
  });

  useEffect(() => {
    localStorage.setItem("cofe_lang", lang);
    document.documentElement.lang = lang === "uz" ? "uz" : "ru";
  }, [lang]);

  const t = (key) => translations[lang]?.[key] ?? key;

  const toggleLang = () => setLang((prev) => (prev === "ru" ? "uz" : "ru"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
