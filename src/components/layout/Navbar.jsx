import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import MagneticButton from "../ui/MagneticButton";
import { playClick, getSoundEnabled, setSoundEnabled } from "../../utils/audio";
import { useLanguage } from "../../context/LanguageContext";
import { useGallery } from "../../context/GalleryContext";

const Navbar = () => {
  const location = useLocation();
  const { setLang, t, isId } = useLanguage();
  const { isCurator, toggleRole } = useGallery();
  const [isOpen, setIsOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => getSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClick();
  };

  const handleToggleLang = () => {
    playClick();
    setLang(isId ? "en" : "id");
  };

  const handleToggleRole = () => {
    playClick();
    toggleRole();
  };

  const navLinks = [
    { name: t("navHome"), path: "/" },
    { name: t("navGallery"), path: "/gallery" },
    ...(isCurator ? [{ name: t("navAdd"), path: "/gallery/add" }] : []),
  ];

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-warm-gray"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-3.5 sm:py-4 md:py-5 flex justify-between items-center">
        {/* Logo with Magnetic Effect */}
        <Link to="/" onClick={playClick} className="flex items-center gap-3 group">
          <MagneticButton className="flex items-center gap-3 group cursor-pointer">
            <img
              src="/logo.svg"
              alt="Logo Arte"
              className="w-9 h-9 md:w-10 md:h-10 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg md:text-xl font-serif font-bold text-ink tracking-tight group-hover:text-brass transition-colors duration-500">
                Arte
              </span>
              <span className="text-[8px] md:text-[9px] text-sepia font-sans tracking-[0.2em] uppercase">
                {t("bureauSubtitle")}
              </span>
            </div>
          </MagneticButton>
        </Link>

        {/* Desktop Nav Links & Controls */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={playClick}
                className={`relative text-sm font-medium font-sans tracking-wide transition-colors duration-300 hover:text-ink ${
                  isActive ? "text-ink" : "text-sepia"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-brass"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <div className="h-4 w-[1px] bg-warm-gray" />

          {/* Role Switcher (Curator vs Visitor) */}
          <button
            onClick={handleToggleRole}
            className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-warm-gray text-xs font-mono tracking-wider shadow-sm hover:border-ink transition-colors"
            title={t("roleSwitchTooltip")}
            aria-label={t("roleSwitchTooltip")}
            aria-pressed={isCurator}
          >
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] transition-all duration-300 ${
                isCurator ? "bg-ink text-ivory font-bold" : "text-sepia hover:text-ink"
              }`}
            >
              {t("roleCurator")}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] transition-all duration-300 ${
                !isCurator ? "bg-brass text-ink font-bold" : "text-sepia hover:text-ink"
              }`}
            >
              {t("roleVisitor")}
            </span>
          </button>

          {/* Bilingual Language Switcher (EN | ID) */}
          <button
            onClick={handleToggleLang}
            className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-warm-gray text-xs font-mono tracking-wider shadow-sm hover:border-ink transition-colors"
            title={isId ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
            aria-label={isId ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
            aria-pressed={!isId}
          >
            <span
              className={`px-2.5 py-1 rounded-full transition-all duration-300 ${
                !isId ? "bg-ink text-ivory font-bold" : "text-sepia hover:text-ink"
              }`}
            >
              EN
            </span>
            <span
              className={`px-2.5 py-1 rounded-full transition-all duration-300 ${
                isId ? "bg-ink text-ivory font-bold" : "text-sepia hover:text-ink"
              }`}
            >
              ID
            </span>
          </button>

          {/* Sound FX Toggle Button */}
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-2 px-3 py-1.5 border border-warm-gray text-[11px] font-mono uppercase tracking-widest text-sepia hover:text-ink hover:border-ink transition-colors rounded-full"
            title={soundOn ? t("soundMute") : t("soundUnmute")}
            aria-label={soundOn ? t("soundMute") : t("soundUnmute")}
            aria-pressed={soundOn}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${soundOn ? "bg-brass animate-pulse" : "bg-warm-gray"}`} />
            <span>{soundOn ? t("soundOn") : t("soundOff")}</span>
          </button>
        </div>

        {/* Mobile Controls (Minimalist & Clean: Lang + Hamburger) */}
        <div className="flex items-center gap-2.5 md:hidden">
          {/* Mobile Lang Button */}
          <button
            onClick={handleToggleLang}
            className="px-2.5 py-1 border border-warm-gray rounded-full text-[11px] font-mono font-bold text-ink hover:border-ink transition-colors"
            aria-label={isId ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
          >
            {isId ? "ID" : "EN"}
          </button>

          <button
            onClick={() => {
              playClick();
              setIsOpen(!isOpen);
            }}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 border border-warm-gray text-ink rounded-full focus:outline-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isOpen}
          >
            <span className={`w-4 h-0.5 bg-ink transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-4 h-0.5 bg-ink transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <span className={`w-4 h-0.5 bg-ink transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-warm-gray bg-ivory px-6 py-6 space-y-5 shadow-medium"
          >
            <div className="space-y-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => {
                      playClick();
                      setIsOpen(false);
                    }}
                    className={`block text-lg font-serif italic py-1 transition-colors ${
                      isActive ? "text-brass font-bold" : "text-ink"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Secondary Settings: Role & Sound */}
            <div className="pt-4 border-t border-warm-gray/70 flex items-center justify-between gap-3">
              <button
                onClick={handleToggleRole}
                className={`px-3 py-1.5 border rounded-full text-xs font-mono font-bold transition-all ${
                  isCurator ? "bg-ink text-ivory border-ink" : "bg-brass text-ink border-brass"
                }`}
                aria-pressed={isCurator}
              >
                {t("curatorMode")}: {isCurator ? t("roleCurator") : t("roleVisitor")}
              </button>

              <button
                onClick={handleToggleSound}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-warm-gray rounded-full text-xs font-mono text-ink"
                aria-pressed={soundOn}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${soundOn ? "bg-brass animate-pulse" : "bg-warm-gray"}`} />
                <span>{soundOn ? t("soundOn") : t("soundOff")}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
