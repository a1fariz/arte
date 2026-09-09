import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useGallery } from "../context/GalleryContext";
import { useLanguage } from "../context/LanguageContext";
import ArtworkCard from "../components/ArtworkCard";
import Pagination from "../components/ui/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import Lightbox from "../components/Lightbox";
import { playClick } from "../utils/audio";
import { categoryTranslations } from "../data/dummyData";

// Editorial Directional Slide Variants (transform+opacity only — filter animations are GPU-expensive)
const pageSlideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.985,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.4, ease: "easeOut" },
      scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.985,
    transition: {
      duration: 0.3,
      ease: [0.76, 0, 0.24, 1],
    },
  }),
};

const cardItemVariants = {
  enter: {
    opacity: 0,
    y: 16,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const GalleryPage = () => {
  const { artworks, categories, toggleFavorite, deleteArtwork, isCurator } = useGallery();
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  
  // State Management
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [lightboxArt, setLightboxArt] = useState(null);
  
  const itemsPerPage = 6;

  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) setSearchQuery(q);
    const cat = searchParams.get("category");
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  // =========================================================================
  // Core Filter, Search, and Sort Logic (useMemo recalculates only when inputs change)
  // =========================================================================
  const filteredArtworks = useMemo(() => {
    let result = [...artworks];

    // 1. Filter by Favorites: only keep items where is_favorite === true
    if (showFavoritesOnly) {
      result = result.filter((art) => art.is_favorite);
    }

    // 2. Filter by Search Query: check if title or artist contains the search keyword
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(query) ||
          art.artist.toLowerCase().includes(query)
      );
    }

    // 3. Filter by Category / Classification: match exact category name
    if (selectedCategory !== "All") {
      result = result.filter((art) => art.category === selectedCategory);
    }

    // 4. Sorting: arrange items by date added, title (A-Z), or historical creation year
    switch (sortBy) {
      case "newest": result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
      case "oldest": result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); break;
      case "title-az": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "title-za": result.sort((a, b) => b.title.localeCompare(a.title)); break;
      case "year-new": result.sort((a, b) => b.year - a.year); break;
      case "year-old": result.sort((a, b) => a.year - b.year); break;
      default: break;
    }

    return result;
  }, [artworks, searchQuery, selectedCategory, showFavoritesOnly, sortBy]);

  // =========================================================================
  // Pagination Logic (6 items per page)
  // =========================================================================
  // Total number of pages
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  
  // Slice array to get only the artworks for the current page
  const currentArtworks = filteredArtworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle clicking a page number: sets slide direction and smoothly scrolls up to the grid
  const handlePageChange = (p) => {
    if (p === currentPage) return;
    setDirection(p > currentPage ? 1 : -1);
    setCurrentPage(p);
    const grid = document.getElementById("gallery-grid");
    if (grid) {
      const gridTop = grid.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: gridTop, behavior: "smooth" });
    }
  };

  // Search input handler: resets to page 1 immediately
  const handleSearch = (e) => { 
    setDirection(0);
    setSearchQuery(e.target.value); 
    setCurrentPage(1); 
  };
  
  // Category click handler
  const handleCategory = (cat) => { 
    playClick();
    setDirection(0);
    setSelectedCategory(cat); 
    setCurrentPage(1); 
  };
  
  const handleSort = (e) => { 
    playClick();
    setDirection(0);
    setSortBy(e.target.value); 
    setCurrentPage(1); 
  };

  const handleToggleFavOnly = () => {
    playClick();
    setDirection(0);
    setShowFavoritesOnly(!showFavoritesOnly);
    setCurrentPage(1);
  };

  const handleDelete = () => {
    if (deleteId) { 
      deleteArtwork(deleteId); 
      setDeleteId(null); 
    }
  };

  const totalFavs = artworks.filter((a) => a.is_favorite).length;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-10 md:py-14">
      {/* Header */}
      <div className="mb-8 md:mb-10 text-center">
        <div className="text-[10px] text-brass tracking-[0.3em] uppercase mb-3 md:mb-4 font-sans font-bold">
          {t("galleryTag")}
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-ink mb-4 leading-tight italic">
          {t("galleryTitle")}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sepia">
          <div className="h-[1px] w-8 sm:w-12 bg-warm-gray" />
          <span className="text-xs sm:text-sm">{t("gallerySubtitle")}</span>
          <div className="h-[1px] w-8 sm:w-12 bg-warm-gray" />
        </div>
      </div>

      {/* Category Quick Pills with Fade Mask & Blur Edge */}
      <div className="relative mb-8 md:mb-10">
        {/* Soft Fade / Blur masks on left & right */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-ivory via-ivory/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-ivory via-ivory/80 to-transparent z-10 pointer-events-none" />

        <div className="flex items-center justify-start md:justify-center gap-2.5 overflow-x-auto py-2 px-6 sm:px-10 scrollbar-none [mask-image:linear-gradient(to_right,transparent,black_28px,black_calc(100%-28px),transparent)]">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === "All" ? artworks.length : artworks.filter((a) => a.category === cat).length;
            const label = categoryTranslations[lang]?.[cat] || cat;
            
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-sans tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2 shrink-0 border ${
                  isSelected
                    ? "bg-ink text-ivory border-ink font-bold shadow-soft"
                    : "bg-white border-warm-gray text-sepia hover:border-ink hover:text-ink"
                }`}
              >
                <span>{label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${isSelected ? "bg-brass text-ink" : "bg-parchment text-sepia"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar: Search, Filter, Sort, Favorites — Clean 2-Row on Mobile, 1-Row on Tablet/Desktop */}
      <div 
        id="gallery-toolbar"
        className="flex flex-col md:flex-row gap-3 md:gap-4 mb-8 sm:mb-12 justify-between items-stretch md:items-center bg-parchment/50 p-3 sm:p-4 border border-warm-gray shadow-soft rounded-2xl w-full"
      >
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-80 lg:w-96 px-4 py-2.5 sm:py-3 bg-ivory border border-warm-gray rounded-xl focus:border-ink focus:outline-none text-xs sm:text-sm text-ink placeholder:text-sepia transition-colors"
        />

        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full md:w-auto items-center">
          <button
            onClick={handleToggleFavOnly}
            aria-pressed={showFavoritesOnly}
            className={`min-h-[42px] px-3.5 sm:px-4 py-2 border rounded-xl text-xs uppercase tracking-widest font-sans font-bold transition-colors flex items-center justify-center gap-2 shrink-0 ${
              showFavoritesOnly 
                ? "bg-brass text-ink border-brass shadow-soft" 
                : "bg-ivory border-warm-gray text-sepia hover:text-ink hover:border-ink"
            }`}
          >
            <span>{t("favoritesBtn")}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/10">
              {totalFavs}
            </span>
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => handleCategory(e.target.value)}
            className="min-h-[42px] flex-1 sm:w-52 md:w-56 min-w-0 px-3 py-2 bg-ivory border border-warm-gray rounded-xl focus:border-ink focus:outline-none text-xs sm:text-sm text-ink cursor-pointer font-sans"
          >
            <option value="All">{t("allClassifications")}</option>
            {categories.filter((c) => c !== "All").map((cat) => (
              <option key={cat} value={cat}>
                {categoryTranslations[lang]?.[cat] || cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={handleSort}
            className="min-h-[42px] w-32 sm:w-44 md:w-48 min-w-0 px-3 py-2 bg-ivory border border-warm-gray rounded-xl focus:border-ink focus:outline-none text-xs sm:text-sm text-ink cursor-pointer font-sans"
          >
            <option value="newest">{t("sortNewest")}</option>
            <option value="oldest">{t("sortOldest")}</option>
            <option value="title-az">{t("sortTitleAZ")}</option>
            <option value="title-za">{t("sortTitleZA")}</option>
            <option value="year-new">{t("sortYearNew")}</option>
            <option value="year-old">{t("sortYearOld")}</option>
          </select>
        </div>
      </div>

      {/* Grid List with Smooth Cascade Animation */}
      {currentArtworks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 md:py-24 bg-white border border-warm-gray rounded-3xl p-8 max-w-xl mx-auto shadow-soft"
        >
          <img src="/logo.svg" alt="" aria-hidden="true" className="w-16 h-16 mx-auto mb-4" />
          <h3 className="font-serif text-2xl sm:text-3xl text-ink mb-2 italic">{t("noArtworksTitle")}</h3>
          <p className="text-sepia text-sm mb-6 font-light">
            {showFavoritesOnly 
              ? t("noArtworksFavDesc")
              : t("noArtworksFilterDesc")}
          </p>
          {(searchQuery || selectedCategory !== "All" || showFavoritesOnly) && (
            <button
              onClick={() => {
                playClick();
                setSearchQuery("");
                setSelectedCategory("All");
                setShowFavoritesOnly(false);
                setCurrentPage(1);
              }}
              className="px-6 py-2.5 bg-ink text-ivory text-xs uppercase tracking-widest font-sans hover:bg-brass hover:text-ink transition-colors border border-ink hover:border-brass rounded-full"
            >
              {t("resetFilters")}
            </button>
          )}
        </motion.div>
      ) : (
        <div id="gallery-grid" className="relative w-full overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`page-grid-${currentPage}-${selectedCategory}-${sortBy}-${showFavoritesOnly}-${lang}`}
              custom={direction}
              variants={pageSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 w-full items-stretch"
            >
              {currentArtworks.map((artwork) => (
                <motion.div
                  key={artwork.id}
                  variants={cardItemVariants}
                  className="w-full flex h-full"
                >
                  <ArtworkCard
                    artwork={artwork}
                    onToggleFavorite={toggleFavorite}
                    onDelete={setDeleteId}
                    onOpenLightbox={setLightboxArt}
                    showActions={isCurator}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Modern Floating Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title={t("confirmDeleteTitle")}
        message={t("confirmDeleteMsg")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Lightbox Integration */}
      <Lightbox artwork={lightboxArt} onClose={() => setLightboxArt(null)} />
    </div>
  );
};

export default GalleryPage;
