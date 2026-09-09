import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { playClick } from "../utils/audio";
import { useLanguage } from "../context/LanguageContext";
import { categoryTranslations } from "../data/dummyData";

const Lightbox = ({ artwork, onClose }) => {
  const { t, lang, isId } = useLanguage();
  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const closeRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!artwork) return;

    previousFocusRef.current = document.activeElement;
    closeRef.current?.focus();

    return () => {
      previousFocusRef.current?.focus?.();
    };
  }, [artwork]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!artwork) return;

      if (e.key === "Escape") {
        playClick();
        onClose();
        return;
      }

      if (e.key === "Tab" && backdropRef.current) {
        const focusable = backdropRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [artwork, onClose]);

  const translatedCategory = artwork?.category
    ? categoryTranslations[lang]?.[artwork.category] || artwork.category
    : "";

  const descText = isId 
    ? (artwork?.historical_context_id || artwork?.description) 
    : (artwork?.historical_context_en || artwork?.description);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-md p-4 sm:p-8"
          ref={backdropRef}
          onClick={() => {
            playClick();
            onClose();
          }}
        >
          {/* Close Button */}
          <button
            ref={closeRef}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-ivory/80 text-2xl hover:text-brass transition-colors w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center border border-ivory/20 hover:border-brass z-50 rounded-full bg-ink/70 backdrop-blur-md touch-manipulation"
            onClick={() => {
              playClick();
              onClose();
            }}
            aria-label="Close Lightbox"
          >
            ✕
          </button>

          {/* Image Content with Swipe Down to Dismiss on Mobile */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={artwork.title}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                playClick();
                onClose();
              }
            }}
            className="flex flex-col lg:flex-row gap-4 sm:gap-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-ink/90 sm:bg-white/5 p-4 sm:p-6 border border-brass/30 rounded-2xl sm:rounded-3xl shadow-2xl touch-pan-y"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 flex items-center justify-center bg-black/40 overflow-hidden rounded-2xl">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>
            
            <div className="lg:w-80 flex flex-col justify-between text-ivory space-y-4">
              <div>
                <div className="text-[10px] text-brass tracking-[0.3em] uppercase mb-2 font-sans font-bold">
                  {translatedCategory}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2 italic leading-snug text-ivory">
                  {artwork.title}
                </h2>
                <p className="text-brass font-serif italic text-base mb-4">
                  {t("byArtist")} {artwork.artist} · {artwork.year}
                </p>
                <div className="h-[1px] w-12 bg-brass mb-4" />
                <p className="text-xs text-ivory/80 leading-relaxed line-clamp-6 font-light">
                  {descText}
                </p>
                <p className="text-[11px] font-mono text-ivory/60 mt-4">
                  {t("mediumTechnique")}: {artwork.medium}
                </p>
              </div>

              <div className="pt-4 border-t border-ivory/20">
                <Link
                  to={`/gallery/${artwork.id}`}
                  onClick={() => {
                    playClick();
                    onClose();
                  }}
                  className="block w-full text-center py-3 bg-brass text-ink font-sans text-xs uppercase tracking-widest font-bold hover:bg-ivory transition-colors rounded-full"
                >
                  {t("expandView")} →
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
