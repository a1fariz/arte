import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { playClick } from "../utils/audio";

// =========================================================================
// Master Artist Showcase Component
// Allows users to explore works by legendary classical painters (Van Gogh, Rembrandt, etc.)
// Features: Active master state, dynamic artwork filtering, and smooth Framer Motion transitions.
// =========================================================================
export const MasterArtistShowcase = ({ artists = [], artworks = [] }) => {
  // 1. State: Stores the currently selected artist's name (defaults to Vincent van Gogh)
  const [selectedArtistName, setSelectedArtistName] = useState(
    () => artists[0]?.name || "Vincent van Gogh"
  );
  const { t, isId } = useLanguage();

  // 2. Memoized lookup: finds full metadata (bio, period, nationality) of active artist
  const activeArtist = useMemo(() => {
    return artists.find((a) => a.name === selectedArtistName) || artists[0] || {};
  }, [artists, selectedArtistName]);

  // Handle clicking on an artist tab/avatar + play audio click
  const handleSelectArtist = (artistName) => {
    setSelectedArtistName(artistName);
    try {
      playClick();
    } catch (_) {}
  };

  // 3. Dynamic Filter: Extracts first name keyword to filter artworks by this specific artist
  const artistKeyword = (activeArtist.name || "").toLowerCase().split(" ")[0];
  const artistArtworks = useMemo(() => {
    return artworks.filter(
      (art) => art.artist && art.artist.toLowerCase().includes(artistKeyword)
    );
  }, [artworks, artistKeyword]);

  return (
    <div className="w-full bg-parchment/40 border-y border-warm-gray py-10 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 lg:px-16">
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-12 md:mb-16 gap-3 sm:gap-6">
          <div>
            <div className="text-[10px] text-brass uppercase tracking-[0.3em] font-sans mb-1.5 sm:mb-3 font-bold">
              {t("mastersTag")}
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-ink italic leading-tight">
              {t("mastersTitle")}
            </h2>
          </div>
          <p className="text-sepia text-xs sm:text-sm max-w-md font-light leading-relaxed">
            {t("mastersSubtitle")}
          </p>
        </div>

        {/* Master Selector Tabs — Circular Avatars on Mobile, Editorial Cards on Desktop */}
        {/* Mobile View: Clean Circular Avatars with Name (Compact & 100% fits on screen) */}
        <div className="flex sm:hidden justify-between items-center gap-2 mb-6 px-1 py-1">
          {artists.map((artist) => {
            const isSelected = activeArtist.name === artist.name;
            const firstName = artist.name.split(" ")[0];

            return (
              <button
                key={artist.name}
                type="button"
                onClick={() => handleSelectArtist(artist.name)}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  handleSelectArtist(artist.name);
                }}
                className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-2 cursor-pointer select-none touch-manipulation"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <div
                  className={`w-14 h-14 rounded-full p-0.5 transition-all duration-200 relative pointer-events-none ${
                    isSelected
                      ? "ring-2 ring-brass ring-offset-2 ring-offset-ivory shadow-md scale-105"
                      : "border-2 border-warm-gray opacity-70"
                  }`}
                >
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.metmuseum.org/CRDImages/ep/web-large/DP-16323-001.jpg";
                    }}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {isSelected && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brass ring-2 ring-white" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-sans tracking-tight text-center truncate max-w-[70px] pointer-events-none ${
                    isSelected ? "text-ink font-bold" : "text-sepia"
                  }`}
                >
                  {firstName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop View: Rich Editorial Cards */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 md:mb-16">
          {artists.map((artist) => {
            const isSelected = activeArtist.name === artist.name;
            const role = isId ? artist.role_id : artist.role_en;
            const nationality = isId ? artist.nationality_id : artist.nationality_en;

            return (
              <motion.div
                key={artist.name}
                whileHover={{ y: -4 }}
                onClick={() => handleSelectArtist(artist.name)}
                className={`p-5 md:p-6 bg-white border cursor-pointer transition-all duration-300 flex flex-col justify-between rounded-2xl ${
                  isSelected 
                    ? "border-brass shadow-medium bg-ivory/50 ring-1 ring-brass/30" 
                    : "border-warm-gray hover:border-ink opacity-75 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden mb-3 md:mb-4 border border-warm-gray p-0.5">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.metmuseum.org/CRDImages/ep/web-large/DP-16323-001.jpg";
                      }}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3 className="font-serif text-base md:text-lg font-bold text-ink leading-snug">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-brass font-sans mt-1">
                    {role || artist.role_en}
                  </p>
                </div>
                <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-warm-gray/60 flex items-center justify-between text-[11px] text-sepia">
                  <span>{nationality || artist.nationality_en}</span>
                  <span className="font-mono text-ink font-medium">{artist.top_works_count} {t("worksCount")}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Artist Works Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeArtist.name}-${isId ? 'id' : 'en'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-warm-gray p-4 sm:p-6 md:p-12 shadow-soft rounded-2xl sm:rounded-3xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-4 space-y-3 sm:space-y-4">
                <span className="text-[10px] text-brass uppercase tracking-widest font-sans font-bold">
                  {isId ? activeArtist.period_id : activeArtist.period_en}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink italic">
                  {activeArtist.name}
                </h3>
                <p className="text-sepia text-xs sm:text-sm leading-relaxed font-light">
                  {isId ? activeArtist.bio_id : activeArtist.bio_en}
                </p>
                <div className="pt-1 sm:pt-2">
                  <Link
                    to={`/gallery?search=${encodeURIComponent(activeArtist.name.split(" ")[0])}`}
                    className="inline-flex items-center min-h-[40px] text-xs font-sans uppercase tracking-widest text-ink hover:text-brass transition-colors border-b border-ink hover:border-brass pb-0.5"
                  >
                    {t("filterAllWorksBy")} {activeArtist.name.split(" ")[0]} →
                  </Link>
                </div>
              </div>

              {/* Grid of artist's specific paintings — 3-Col Compact Row on Mobile, Responsive Grid on Desktop */}
              <div className="lg:col-span-8 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {artistArtworks.slice(0, 3).map((art) => (
                  <Link
                    key={art.id}
                    to={`/gallery/${art.id}`}
                    onClick={playClick}
                    className="group block relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-parchment border border-warm-gray rounded-lg sm:rounded-xl shadow-soft"
                  >
                    <img
                      src={art.image_url}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-ink/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 sm:p-4 flex flex-col justify-end text-ivory">
                      <p className="text-[10px] sm:text-xs font-serif font-bold italic line-clamp-1">{art.title}</p>
                      <p className="text-[9px] sm:text-[10px] text-brass font-mono">{art.year}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MasterArtistShowcase;
