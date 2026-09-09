import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useGallery } from "../context/GalleryContext";
import { useLanguage } from "../context/LanguageContext";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import { playClick, playChime } from "../utils/audio";

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArtworkById, toggleFavorite, deleteArtwork, isCurator } = useGallery();
  const { t, isId } = useLanguage();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview | history | technique | provenance
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const artwork = getArtworkById(id);

  if (!artwork) {
    return (
      <div className="container mx-auto px-6 py-32 text-center max-w-2xl">
        <div className="w-20 h-20 mx-auto mb-6 border-2 border-brass flex items-center justify-center font-serif text-3xl text-brass italic font-bold">
          ?
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4 italic">{t("artworkNotFoundTitle")}</h2>
        <p className="text-sepia mb-8 text-base md:text-lg font-light">
          {t("artworkNotFoundDesc")}
        </p>
        <Link to="/gallery" onClick={playClick}>
          <Button variant="primary">{t("backToGallery")}</Button>
        </Link>
      </div>
    );
  }

  const handleToggleFav = () => {
    if (!artwork.is_favorite) playChime();
    else playClick();
    toggleFavorite(artwork.id);
  };

  const handleTabChange = (tab) => {
    playClick();
    setActiveTab(tab);
  };

  const historyText = isId ? artwork.historical_context_id : artwork.historical_context_en;
  const techniqueText = isId ? artwork.artistic_analysis_id : artwork.artistic_analysis_en;
  const provenanceText = isId ? artwork.provenance_id : artwork.provenance_en;
  const curatorQuote = isId ? artwork.curator_quote_id : artwork.curator_quote_en;

  const tabs = [
    { id: "overview", label: t("tabOverview") },
    { id: "history", label: t("tabHistory") },
    { id: "technique", label: t("tabTechnique") },
    { id: "provenance", label: t("tabProvenance") },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-10 md:py-14">
      {/* Breadcrumb */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-xs sm:text-sm text-sepia mb-8 md:mb-12 font-sans tracking-wider flex items-center gap-2 flex-wrap"
      >
        <Link to="/" onClick={playClick} className="hover:text-brass transition-colors">{t("navHome")}</Link>
        <span className="text-warm-gray">/</span>
        <Link to="/gallery" onClick={playClick} className="hover:text-brass transition-colors">{t("navGallery")}</Link>
        <span className="text-warm-gray">/</span>
        <span className="text-ink truncate font-medium max-w-[200px] sm:max-w-none">{artwork.title}</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: Masterpiece Frame Reveal Animation & Image Loader
            Features:
            1. Frame Reveal Curtain: sliding parchment overlay (y: "0%" -> "-100%")
            2. Skeleton Shimmer: animated placeholder until high-res image is ready
            3. Image Zoom Entrance: scales down smoothly from 1.06 to 1.0
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 lg:sticky lg:top-28 bg-white border border-warm-gray p-3 sm:p-4 shadow-medium relative overflow-hidden rounded-[24px]"
        >
          {/* Frame Reveal Curtain: slides upward to unveil the painting */}
          <motion.div
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-parchment z-20 pointer-events-none"
          />

          <div className="overflow-hidden bg-parchment flex items-center justify-center min-h-[350px] sm:min-h-[480px] rounded-[18px] relative">
            {/* Shimmer skeleton loader shown while image is downloading */}
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 bg-gradient-to-r from-parchment via-warm-gray/40 to-parchment animate-pulse flex items-center justify-center">
                <span className="text-sm font-serif italic text-sepia/70">{t("loadingDetailSkeleton")}</span>
              </div>
            )}
            
            {/* High-resolution Met Museum Masterpiece Canvas */}
            <motion.img
              src={artwork.image_url}
              alt={artwork.title}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => {
                setImgError(true);
                setImgLoaded(true);
                e.currentTarget.src = "https://images.metmuseum.org/CRDImages/ep/web-large/DP146479.jpg";
              }}
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full h-auto max-h-[70vh] sm:max-h-[78vh] object-contain mx-auto transition-opacity duration-700 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </motion.div>

        {/* =========================================================================
            RIGHT COLUMN: Editorial Information & Deep Curatorial Tabs
            Tabs: Overview, Historical Context, Artistic Technique, and Provenance.
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          
          {/* Header & Title with Staggered Fade-in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[10px] text-brass tracking-[0.3em] uppercase mb-2 sm:mb-3 font-sans font-bold">
              {artwork.category}
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-ink mb-3 sm:mb-4 leading-[1.08] italic">
              {artwork.title}
            </h1>
            <p className="text-base sm:text-xl font-serif text-brass italic">
              {t("byArtist")} {artwork.artist}
            </p>
          </motion.div>

          {/* Curatorial Tab Navigation (Mobile 2x2 grid, Desktop horizontal tabs) */}
          <div className="relative">
            <div className="flex sm:hidden grid grid-cols-2 gap-2 pb-2">
              {tabs.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`min-h-[40px] text-xs font-sans tracking-wider py-2 px-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-ink text-ivory border-ink font-bold shadow-soft"
                        : "bg-white border-warm-gray text-sepia hover:border-ink hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 border-b border-warm-gray pb-2 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`min-h-[44px] text-xs font-sans tracking-wider py-2.5 px-3 relative whitespace-nowrap transition-colors ${
                      isSelected ? "text-ink font-bold" : "text-sepia hover:text-ink"
                    }`}
                  >
                    {tab.label}
                    {isSelected && (
                      <motion.div
                        layoutId="activeDetailTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-brass"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curatorial Tab Content */}
          <div className="min-h-[180px]">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="tab-overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <div className="border-y border-warm-gray py-4 sm:py-6 grid grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <div className="text-[10px] text-sepia uppercase tracking-[0.2em] mb-1 sm:mb-2 font-sans">{t("yearCreated")}</div>
                      <div className="font-serif text-xl sm:text-2xl text-ink font-semibold">{artwork.year}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-sepia uppercase tracking-[0.2em] mb-1 sm:mb-2 font-sans">{t("mediumTechnique")}</div>
                      <div className="font-serif text-base sm:text-lg text-ink font-medium truncate">{artwork.medium}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-sepia uppercase tracking-[0.2em] mb-2 font-sans font-bold">{t("curatorialNotes")}</div>
                    <p className="text-ink leading-relaxed text-sm sm:text-base font-light">
                      {artwork.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div
                  key="tab-history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <div className="text-[10px] text-brass uppercase tracking-[0.2em] font-sans font-bold">
                    {t("tabHistory")}
                  </div>
                  <p className="text-ink text-sm sm:text-base leading-relaxed font-light first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-brass">
                    {historyText || artwork.description}
                  </p>
                  {curatorQuote && (
                    <blockquote className="p-4 border-l-2 border-brass bg-parchment/40 italic font-serif text-sm text-sepia mt-4">
                      "{curatorQuote}"
                    </blockquote>
                  )}
                </motion.div>
              )}

              {activeTab === "technique" && (
                <motion.div
                  key="tab-technique"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <div className="text-[10px] text-brass uppercase tracking-[0.2em] font-sans font-bold">
                    {t("tabTechnique")}
                  </div>
                  <p className="text-ink text-sm sm:text-base leading-relaxed font-light">
                    {techniqueText || artwork.medium}
                  </p>
                  <div className="p-4 bg-white border border-warm-gray rounded-xl text-xs font-mono text-sepia flex items-center justify-between">
                    <span>{t("mediumTechnique")}: {artwork.medium}</span>
                    <span className="text-brass font-bold">{artwork.year}</span>
                  </div>
                </motion.div>
              )}

              {activeTab === "provenance" && (
                <motion.div
                  key="tab-provenance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <div className="text-[10px] text-brass uppercase tracking-[0.2em] font-sans font-bold">
                    {t("tabProvenance")}
                  </div>
                  <p className="text-ink text-sm sm:text-base leading-relaxed font-light">
                    {provenanceText || t("provenanceFallback")}
                  </p>
                  <div className="p-4 bg-parchment/60 border border-warm-gray text-xs font-mono text-ink">
                    {t("custodianRow")}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions (Responsive Buttons with Touch Height & SVG icons) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-warm-gray/60"
          >
            <Button
              variant={artwork.is_favorite ? "primary" : "secondary"}
              onClick={handleToggleFav}
              className="w-full sm:flex-1 min-h-[46px] py-3 text-xs flex items-center justify-center gap-2 rounded-full touch-manipulation"
            >
              <svg 
                className={`w-4 h-4 ${artwork.is_favorite ? "fill-ivory stroke-ivory" : "fill-none stroke-current"}`} 
                viewBox="0 0 24 24" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{artwork.is_favorite ? t("favorited") : t("addToFavorites")}</span>
            </Button>
            
            {isCurator && (
              <>
                <Link to={`/gallery/${artwork.id}/edit`} onClick={playClick} className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full min-h-[46px] py-3 text-xs rounded-full touch-manipulation">{t("editDetails")}</Button>
                </Link>
                
                <Button
                  variant="danger"
                  className="w-full sm:w-auto min-h-[46px] py-3 px-5 text-xs flex items-center justify-center gap-1.5 rounded-full touch-manipulation"
                  onClick={() => {
                    playClick();
                    setShowDeleteConfirm(true);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{t("removeBtn")}</span>
                </Button>
              </>
            )}
          </motion.div>

          {/* Delete Confirmation — same dialog pattern as Gallery page */}
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            title={t("confirmDeleteTitle")}
            message={t("confirmDeleteMsg")}
            onConfirm={() => {
              deleteArtwork(artwork.id);
              setShowDeleteConfirm(false);
              navigate("/gallery");
            }}
            onCancel={() => setShowDeleteConfirm(false)}
          />

        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
