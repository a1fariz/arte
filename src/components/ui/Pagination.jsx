import { motion } from "framer-motion";
import { playClick } from "../../utils/audio";
import { useLanguage } from "../../context/LanguageContext";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useLanguage();

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleSelect = (p) => {
    if (p === currentPage || p < 1 || p > totalPages) return;
    playClick();
    onPageChange(p);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-12 sm:mt-20 pt-8 border-t border-warm-gray/60">
      {/* Prev Button */}
      <motion.button
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => handleSelect(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t("prevBtn")}
        className={`h-10 sm:h-11 px-5 sm:px-6 rounded-full text-xs font-sans uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
          currentPage === 1
            ? "border border-warm-gray text-sepia/40 opacity-40 cursor-not-allowed bg-transparent"
            : "border border-warm-gray text-ink hover:border-ink hover:bg-ink hover:text-ivory shadow-soft bg-white"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{t("prevBtn")}</span>
      </motion.button>

      {/* Number Buttons with Floating Pill Active Indicator */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-full bg-white border border-warm-gray/80 shadow-soft max-w-full overflow-x-auto">
        {pages.map((page) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => handleSelect(page)}
              aria-label={String(page)}
              aria-current={isActive ? "page" : undefined}
              className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs font-mono font-medium transition-colors duration-300 flex items-center justify-center shrink-0 ${
                isActive ? "text-ivory" : "text-sepia hover:text-ink"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePagePill"
                  className="absolute inset-0 rounded-full bg-ink shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{String(page).padStart(2, '0')}</span>
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => handleSelect(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t("nextBtn")}
        className={`h-10 sm:h-11 px-5 sm:px-6 rounded-full text-xs font-sans uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
          currentPage === totalPages
            ? "border border-warm-gray text-sepia/40 opacity-40 cursor-not-allowed bg-transparent"
            : "border border-warm-gray text-ink hover:border-ink hover:bg-ink hover:text-ivory shadow-soft bg-white"
        }`}
      >
        <span>{t("nextBtn")}</span>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  );
};

export default Pagination;
