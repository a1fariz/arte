import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { playClick, playChime } from "../utils/audio";
import { useLanguage } from "../context/LanguageContext";
import { categoryTranslations } from "../data/dummyData";

const ArtworkCard = ({ 
  artwork, 
  onToggleFavorite, 
  onDelete, 
  onOpenLightbox, 
  showActions = true,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const { t, lang, isId } = useLanguage();

  const handleCardClick = (e) => {
    e.stopPropagation();
    playClick();
    navigate(`/gallery/${artwork.id}`);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    if (!artwork.is_favorite) playChime();
    else playClick();
    onToggleFavorite(artwork.id);
  };

  const handleLightbox = (e) => {
    e.stopPropagation();
    playClick();
    if (onOpenLightbox) onOpenLightbox(artwork);
  };

  const translatedCategory = artwork?.category
    ? categoryTranslations[lang]?.[artwork.category] || artwork.category
    : "";

  const desc = isId 
    ? (artwork?.historical_context_id || artwork?.description)
    : (artwork?.historical_context_en || artwork?.description);

  return (
    <div
      className="relative w-full h-full bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[36px] shadow-[0_12px_36px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-warm-gray/60 p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 group justify-between"
    >
      {/* 1. LEFT: Floating Artwork Image */}
      <div 
        onClick={handleCardClick}
        className="relative w-full sm:w-[44%] lg:w-[42%] xl:w-[40%] h-[230px] xs:h-[260px] sm:h-auto sm:min-h-[290px] rounded-[18px] sm:rounded-[24px] overflow-hidden bg-parchment shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:shadow-[0_12px_32px_rgba(0,0,0,0.1)] cursor-pointer shrink-0 z-10"
      >
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-gradient-to-r from-parchment via-warm-gray/40 to-parchment animate-pulse flex items-center justify-center">
            <span className="text-xs font-serif italic text-sepia/60">
              {isId ? "Memuat Mahakarya..." : "Loading Masterpiece..."}
            </span>
          </div>
        )}

        <img
          src={artwork.image_url}
          alt={artwork.title}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            setImgError(true);
            setImgLoaded(true);
            e.currentTarget.src = "https://images.metmuseum.org/CRDImages/ep/web-large/DP146479.jpg";
          }}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Floating Quick Lightbox Button */}
        <button
          onClick={handleLightbox}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-ink/80 sm:bg-white/90 backdrop-blur-md text-ivory sm:text-ink flex items-center justify-center hover:bg-brass hover:text-ink transition-colors shadow-soft z-20"
          title={t("expandView")}
          aria-label={t("expandView")}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Floating Year Pill */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-ivory/90 backdrop-blur-md border border-warm-gray text-[10px] font-mono uppercase tracking-widest text-sepia z-20">
          {artwork.year}
        </div>
      </div>

      {/* 2. RIGHT: Content Section */}
      <div className="w-full sm:w-[56%] lg:w-[58%] xl:w-[60%] flex flex-col justify-between self-stretch space-y-3 sm:space-y-4 py-0.5 sm:py-1">
        <div className="space-y-2 sm:space-y-2.5">
          <h2 
            onClick={handleCardClick}
            className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold text-ink italic leading-snug cursor-pointer hover:text-brass transition-colors"
          >
            {artwork.title}
          </h2>

          <h3 className="text-xs sm:text-sm text-sepia font-sans font-normal flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span>{t("byArtist")} {artwork.artist}</span>
            <span>·</span>
            <span className="text-brass font-medium">{translatedCategory}</span>
          </h3>

          <p className="text-xs sm:text-[13px] text-sepia/85 font-light leading-relaxed line-clamp-3 sm:line-clamp-4">
            {desc}
          </p>
        </div>

        {/* Bottom Container: Details Row + Actions (Always Aligned at Bottom) */}
        <div className="space-y-2.5 sm:space-y-3 pt-2">
          {/* Details Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl bg-parchment/70 border border-warm-gray/60 text-xs text-sepia">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <svg className="w-3.5 h-3.5 text-brass shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 21a4 4 0 01-4-4 4 4 0 014-4h2a4 4 0 014 4 4 4 0 01-4 4H7zm0 0a4 4 0 004-4v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2a4 4 0 004 4h2z" />
              </svg>
              <em className="not-italic font-sans text-[11px] text-ink font-medium truncate">{artwork.medium || "Oil on canvas"}</em>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] text-brass ml-auto">
              <svg className="w-3.5 h-3.5 text-brass shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <em className="not-italic">{t("theMet")}</em>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={handleCardClick}
                className="flex-grow h-10 sm:h-11 px-4 sm:px-6 rounded-full bg-ink text-ivory text-xs uppercase tracking-wider font-sans font-medium hover:bg-brass hover:text-ink transition-all duration-300 flex items-center justify-center shadow-soft"
              >
                {t("viewBtn")}
              </button>

              {/* Favorite Circle Button */}
              <button
                onClick={handleFav}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 border ${
                  artwork.is_favorite
                    ? "bg-brass text-ink border-brass shadow-soft font-bold"
                    : "bg-black/[0.04] border-transparent text-sepia hover:bg-brass hover:text-ink"
                }`}
                title={artwork.is_favorite ? t("favorited") : t("addToFavorites")}
                aria-label={artwork.is_favorite ? t("favorited") : t("addToFavorites")}
                aria-pressed={artwork.is_favorite}
              >
                <svg 
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${artwork.is_favorite ? "fill-ink stroke-ink" : "fill-none stroke-current"}`} 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.75}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Edit Circle Button */}
              <Link
                to={`/gallery/${artwork.id}/edit`}
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/[0.04] hover:bg-ink hover:text-ivory transition-colors flex items-center justify-center text-sepia shrink-0"
                title={t("editArtwork")}
                aria-label={t("editArtwork")}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>

              {/* Delete Circle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  onDelete(artwork.id);
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/[0.04] hover:bg-red-900 hover:text-ivory transition-colors flex items-center justify-center text-sepia shrink-0"
                title={t("removeArtwork")}
                aria-label={t("removeArtwork")}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
