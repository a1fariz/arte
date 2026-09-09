import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("arte_lang_pref");
      if (saved === "en" || saved === "id") return saved;
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("arte_lang_pref", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "id" : "en"));
  };

  // Helper translation function with fallback
  const t = (key) => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  const value = {
    lang,
    setLang,
    toggleLanguage,
    t,
    isId: lang === "id",
    isEn: lang === "en",
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};
