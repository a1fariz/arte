import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGallery } from "../context/GalleryContext";
import { useLanguage } from "../context/LanguageContext";
import CircularGallery from "../components/CircularGallery";
import MasterArtistShowcase from "../components/MasterArtistShowcase";
import { featuredArtists } from "../data/dummyData";
import { playClick } from "../utils/audio";
import { smallImageUrl } from "../utils/helpers";

// =========================================================================
// ANIMATION 1: Hero Rising Headline
// Effect: Words rise up from beneath an "overflow-hidden" container line-by-line.
// Uses cubic-bezier easing [0.16, 1, 0.3, 1] for a luxurious editorial magazine entrance.
// =========================================================================
const HeroHeadline = ({ isId }) => {
  const line1 = isId ? "Kejelasan Sistematik" : "Systematic Clarity";
  const prefix = isId ? "& Nilai Seni" : "& Historical";
  const punchWord = isId ? "Abadi." : "Artistry.";

  return (
    <div className="font-serif text-[36px] xs:text-[44px] sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-ink leading-[1.03] mb-5 sm:mb-6 select-none">
      {/* Line 1: Main Title Slide-Up */}
      <span className="block overflow-hidden">
        <motion.span
          key={`line1-${line1}`}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="block"
        >
          {line1}
        </motion.span>
      </span>

      {/* Line 2: Rising Punch Word (e.g. "Artistry." or "Abadi.") */}
      <span className="block italic text-brass font-normal">
        <span className="inline-block mr-2 sm:mr-3">
          {prefix}
        </span>
        <span className="inline-block overflow-hidden align-bottom">
          <motion.span
            key={`punch-${punchWord}`}
            initial={{ y: "115%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
            className="inline-block"
          >
            {punchWord}
          </motion.span>
        </span>
      </span>
    </div>
  );
};

// =========================================================================
// ANIMATION 2: Infinite Marquee Strip
// Effect: Horizontal ticker continuously moving thumbnails from right to left.
// Performance: Pauses automatically using IntersectionObserver when scrolled out of view.
// =========================================================================
const ArtworkMarquee = ({ artworks }) => {
  // Duplicate array so it loops seamlessly from 0% to -50%
  const marqueeItems = [...artworks, ...artworks];
  const reduceMotion = useReducedMotion();
  const stripRef = useRef(null);
  const [inView, setInView] = useState(true);

  // Stop animation if strip is not visible on screen
  useEffect(() => {
    const el = stripRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animateMarquee = inView && !reduceMotion;

  return (
    <div ref={stripRef} className="relative w-full overflow-hidden border-t border-warm-gray bg-parchment/40 py-2.5 sm:py-3 select-none">
      {/* Edge Fade Masks: Smooth gradient fade on left and right borders */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-ivory to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-ivory to-transparent pointer-events-none" />

      {/* Infinite scrolling motion container */}
      <motion.div
        className="flex gap-4 w-max will-change-transform"
        initial={{ x: 0 }}
        animate={animateMarquee ? { x: "-50%" } : { x: 0 }}
        transition={animateMarquee ? { duration: 110, ease: "linear", repeat: Infinity } : undefined}
      >
        {marqueeItems.map((art, idx) => (
          <Link
            key={`${art.id}-${idx}`}
            to={`/gallery/${art.id}`}
            onClick={playClick}
            className="w-[72px] sm:w-[96px] h-[52px] sm:h-[64px] rounded-lg overflow-hidden bg-white border border-warm-gray shadow-soft shrink-0 cursor-pointer block"
          >
            <img
              src={smallImageUrl(art.image_url)}
              alt={art.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { artworks, isCurator } = useGallery();
  const { t, isId } = useLanguage();

  const wheelItems = artworks.slice(0, 10);
  const selectedExhibition = artworks.slice(0, 4);
  const marqueeArtworks = [...artworks].sort((a, b) => a.year - b.year);

  return (
    <div className="bg-ivory text-ink">
      {/* 1. HERO SECTION — Clean Fine Art Teaser */}
      <section className="relative min-h-[calc(100svh-4rem)] md:h-[calc(100svh-4rem)] md:min-h-[580px] md:max-h-[860px] border-b border-warm-gray flex flex-col justify-between pt-8 sm:pt-12 pb-0 px-5 sm:px-8 md:px-12 lg:px-16 w-full max-w-[1600px] mx-auto overflow-x-hidden">
        {/* Background: Blueprint Grid + Radial Spotlight Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(230,225,214,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(230,225,214,0.35)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black_30%,transparent_75%)] pointer-events-none" />
        <div className="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2 w-[680px] h-[360px] bg-[radial-gradient(closest-side,rgba(184,147,46,0.14),transparent)] blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brass/60 to-transparent pointer-events-none" />

        {/* Hero Central Content — Minimalist & Bold */}
        <div className="relative my-auto py-8 sm:py-6 w-full flex flex-col justify-center">
          <div className="max-w-5xl">
            {/* Main Headline with Rising Climax Word */}
            <HeroHeadline isId={isId} />
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="pt-4 sm:pt-6 border-t border-warm-gray max-w-2xl"
            >
              <p className="text-sm sm:text-base text-sepia font-light leading-relaxed">
                {t("heroSubtitle")}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-8">
                <Link
                  to="/gallery"
                  onClick={playClick}
                  className="inline-flex items-center gap-2 px-7 py-3 sm:py-3.5 bg-ink text-ivory text-xs uppercase tracking-widest font-sans hover:bg-brass hover:text-ink transition-all duration-300 border border-ink hover:border-brass shadow-soft rounded-full"
                >
                  {t("heroCta")}
                </Link>
                {isCurator && (
                  <Link
                    to="/gallery/add"
                    onClick={playClick}
                    className="inline-flex items-center gap-2 px-5 py-3 sm:py-3.5 text-ink text-xs uppercase tracking-widest font-sans border border-warm-gray hover:border-ink rounded-full transition-colors"
                  >
                    {t("navAdd")} +
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Bottom: Artwork Marquee Film-Strip */}
        <div className="relative -mx-5 sm:-mx-8 md:-mx-12 lg:-mx-16 shrink-0">
          <ArtworkMarquee artworks={marqueeArtworks} />
        </div>
      </section>

      {/* 2. CIRCULAR ORBIT GALLERY (Desktop & Tablet Only — Hidden on mobile to avoid repetitive stacking) */}
      <div className="hidden md:block">
        <CircularGallery items={wheelItems} />
      </div>

      {/* 3. PROMINENT MASTERS SHOWCASE */}
      <MasterArtistShowcase artists={featuredArtists} artworks={artworks} />

      {/* 4. SELECTED EXHIBITION — Minimalist Visual Showcase */}
      <section className="py-12 sm:py-16 md:py-24 px-5 sm:px-8 md:px-12 lg:px-16 w-full max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-8 sm:mb-12 border-b border-warm-gray pb-4">
          <div>
            <div className="text-[10px] text-brass uppercase tracking-[0.3em] font-sans mb-1.5 font-bold">
              {t("featuredTag")}
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-ink italic">
              {t("featuredTitle")}
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-sans uppercase tracking-widest text-ink hover:text-brass transition-colors w-fit pb-0.5"
          >
            {t("exploreComplete")}
          </Link>
        </div>

        {/* Clean Visual Grid (Teaser style: Picture-first, clean labels, direct link) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
          {selectedExhibition.map((art) => (
            <Link
              key={art.id}
              to={`/gallery/${art.id}`}
              onClick={playClick}
              className="group cursor-pointer bg-white border border-warm-gray p-3 sm:p-3.5 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-500 flex flex-col justify-between h-full"
            >
              <div>
                <div className="aspect-[4/5] overflow-hidden bg-parchment rounded-xl relative mb-3">
                  <img
                    src={art.image_url}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-ivory/90 backdrop-blur-sm text-[9px] font-mono text-sepia border border-warm-gray/60">
                    {art.year}
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="font-serif text-base font-bold text-ink italic truncate group-hover:text-brass transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-sepia font-sans mt-0.5 truncate">
                    {art.artist}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
