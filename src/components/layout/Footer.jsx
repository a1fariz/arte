import { useState } from "react";
import { useGallery } from "../../context/GalleryContext";
import { useLanguage } from "../../context/LanguageContext";
import { dummyArtworks } from "../../data/dummyData";
import ConfirmDialog from "../ConfirmDialog";
import LegalModal from "../LegalModal";
import { playClick, playChime } from "../../utils/audio";

const Footer = () => {
  const { resetToDefault, artworks } = useGallery();
  const { t } = useLanguage();
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalTab, setLegalTab] = useState("privacy");

  const handleReset = () => {
    resetToDefault();
    setShowRestoreConfirm(false);
    playChime();
  };

  const handleOpenLegal = (tab) => {
    playClick();
    setLegalTab(tab);
    setShowLegalModal(true);
  };

  return (
    <footer className="bg-parchment border-t border-warm-gray mt-16 sm:mt-20">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <img src="/logo.svg" alt="Logo Arte" className="w-8 h-8" />
          <span className="text-xl font-serif font-bold text-ink">Arte</span>
          <span className="text-xs text-sepia font-sans">
            © 2026 {t("footerCopyright")} · {artworks.length} {t("footerPreserved")}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-sepia font-sans uppercase tracking-wider">
          <button
            onClick={() => {
              playClick();
              setShowRestoreConfirm(true);
            }}
            className="hover:text-brass transition-colors text-[11px] font-mono border-b border-dashed border-sepia/50 hover:border-brass pb-0.5"
            title={t("footerRestore")}
            aria-label={t("footerRestore")}
          >
            {t("footerRestore")} ({artworks.length}/{dummyArtworks.length})
          </button>
          <button
            type="button"
            onClick={() => handleOpenLegal("privacy")}
            className="hover:text-brass transition-colors"
          >
            {t("footerPrivacy")}
          </button>
          <button
            type="button"
            onClick={() => handleOpenLegal("terms")}
            className="hover:text-brass transition-colors"
          >
            {t("footerTerms")}
          </button>
          <a href="https://www.metmuseum.org" target="_blank" rel="noreferrer" className="hover:text-brass transition-colors">
            {t("footerMetOpen")}
          </a>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showRestoreConfirm}
        title={t("footerRestore")}
        message={t("footerRestoreConfirm")}
        confirmLabel={t("footerRestore")}
        onConfirm={handleReset}
        onCancel={() => setShowRestoreConfirm(false)}
      />

      <LegalModal
        isOpen={showLegalModal}
        initialTab={legalTab}
        onClose={() => setShowLegalModal(false)}
      />
    </footer>
  );
};

export default Footer;
