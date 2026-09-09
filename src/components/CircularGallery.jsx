import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { smallImageUrl } from "../utils/helpers";

// =========================================================================
// Circular 3D Orbit Gallery Component
// Creates an interactive rotating wheel of artworks using trigonometry.
// Features:
// 1. Math.cos & Math.sin positioning on a circle.
// 2. requestAnimationFrame continuous smooth rotation.
// 3. Counter-rotation so card contents always stay upright.
// 4. Auto-pause with IntersectionObserver when scrolled out of view.
// =========================================================================
export const CircularGallery = ({ items = [] }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // Pauses auto-spin on mouse hover
  const { t } = useLanguage();

  // Rotation angles (degrees)
  const [currentAngle, setCurrentAngle] = useState(0);
  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const isTargetingRef = useRef(false);
  const sectionRef = useRef(null);

  // PERFORMANCE OPTIMIZATION:
  // Pause the requestAnimationFrame loop entirely when the component is off-screen or tab is hidden
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let inView = true;
    let tabVisible = !document.hidden;
    const sync = () => setIsRunning(inView && tabVisible);

    let observer;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          sync();
        },
        { threshold: 0.05 }
      );
      observer.observe(el);
    }

    const handleVisibility = () => {
      tabVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (observer) observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const total = items.length;
  const step = 360 / Math.max(total, 1); // Angle between each artwork on the circle (e.g. 360 / 10 = 36 deg)
  const [radius, setRadius] = useState(400); // Circle radius in pixels

  // Responsive radius: adjusts orbit size depending on screen width
  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 640) {
        setRadius(240);
      } else if (window.innerWidth < 1024) {
        setRadius(320);
      } else {
        setRadius(400);
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  // ANIMATION LOOP (Runs at 60fps via requestAnimationFrame)
  useEffect(() => {
    if (!isRunning) return;

    let animId;
    let lastTime = performance.now();

    const loop = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05); // Frame delta time in seconds
      lastTime = now;

      if (isTargetingRef.current) {
        // Smoothly interpolate towards the target angle when user clicks a specific artwork
        const diff = targetAngleRef.current - angleRef.current;
        if (Math.abs(diff) < 0.05) {
          angleRef.current = targetAngleRef.current;
          isTargetingRef.current = false;
        } else {
          angleRef.current += diff * Math.min(delta * 8, 0.25);
        }
      } else if (!isHovered) {
        // Continuous gentle auto-spin when not hovered
        angleRef.current -= 10 * delta;
      }

      setCurrentAngle(angleRef.current);

      // Determine which artwork is currently closest to the front/active position
      const normalized = ((-angleRef.current % 360) + 360) % 360;
      const closest = Math.round(normalized / step) % total;
      setSelectedIdx(closest);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, step, total, isRunning]);

  // Smoothly rotate the wheel to a specific card index
  const rotateTo = (idx) => {
    setSelectedIdx(idx);
    const cur = angleRef.current;
    const currentNorm = ((-cur % 360) + 360) % 360;
    const targetNorm = idx * step;
    let diff = targetNorm - currentNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    targetAngleRef.current = cur - diff;
    isTargetingRef.current = true;
  };

  const handleNext = () => {
    const nextIdx = (selectedIdx + 1) % total;
    rotateTo(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (selectedIdx - 1 + total) % total;
    rotateTo(prevIdx);
  };

  const activeArt = items[selectedIdx] || items[0] || {};

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-0 md:min-h-[85vh] bg-ivory border-y border-warm-gray overflow-hidden flex flex-col justify-center select-none py-10 sm:py-12 md:py-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#E6E1D6_1px,transparent_1px)] [background-size:28px_28px] opacity-35 pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[840px] h-[840px] rounded-full border border-warm-gray/40 pointer-events-none translate-x-[50%] hidden md:block" />

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Selected Artwork Detail */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-brass uppercase tracking-[0.3em] font-sans font-bold">
                {t("dialTag")}
              </span>
              <div className="h-[1px] w-8 bg-brass" />
            </div>

            {/* Mobile-Only Elegant Preview Showcase Card with Touch Swipe Gesture */}
            <div className="block md:hidden">
              <motion.div
                key={`mobile-preview-${activeArt.id}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40) handleNext();
                  else if (info.offset.x > 40) handlePrev();
                }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-parchment border border-warm-gray shadow-medium cursor-grab active:cursor-grabbing touch-pan-y"
              >
                <img
                  src={activeArt.image_url}
                  alt={activeArt.title}
                  draggable={false}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-ivory">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brass block">
                      #{String(selectedIdx + 1).padStart(2, '0')} · {activeArt.year}
                    </span>
                    <h4 className="font-serif text-sm font-semibold italic truncate">
                      {activeArt.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-sans text-ivory/80 uppercase tracking-wider shrink-0">
                    {activeArt.artist}
                  </span>
                </div>

                {/* Micro Swipe Cue Badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-ink/60 backdrop-blur-sm text-[9px] font-mono text-ivory/75 uppercase tracking-widest pointer-events-none">
                  Swipe ↔
                </div>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeArt.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div className="text-xs text-sepia font-sans mb-1 sm:mb-2 uppercase tracking-widest flex items-center gap-2 sm:gap-3">
                  <span className="text-brass font-bold font-mono text-xs sm:text-sm">#{String(selectedIdx + 1).padStart(2, '0')}</span>
                  <span>{activeArt.category || "European Art"}</span>
                  <span>·</span>
                  <span>{activeArt.year}</span>
                </div>
                
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-6xl font-bold text-ink italic leading-[1.1]">
                  {activeArt.title}
                </h2>
                
                <p className="font-serif text-brass text-base sm:text-xl italic">
                  {t("byArtist")} {activeArt.artist}
                </p>
                
                <div className="p-4 sm:p-6 bg-white border border-warm-gray shadow-soft max-w-lg space-y-3 rounded-2xl">
                  <p className="text-xs text-sepia font-light leading-relaxed line-clamp-3">
                    {activeArt.description}
                  </p>
                  <div className="pt-3 border-t border-warm-gray/60 flex justify-between text-[11px] font-mono text-ink">
                    <span>{t("mediumTechnique")}: {activeArt.medium}</span>
                    <span className="text-brass">{t("theMet")}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 sm:pt-3">
                  <Link
                    to={`/gallery/${activeArt.id}`}
                    className="min-h-[44px] px-6 sm:px-8 py-2.5 sm:py-3 bg-ink text-ivory text-xs uppercase tracking-widest font-sans hover:bg-brass hover:text-ink transition-all duration-300 border border-ink hover:border-brass shadow-soft inline-flex items-center justify-center rounded-full"
                  >
                    {t("dialViewDetails")}
                  </Link>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={handlePrev}
                      className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center border border-warm-gray text-ink hover:border-ink hover:bg-ink hover:text-ivory transition-all text-xs rounded-full touch-manipulation"
                      aria-label="Previous"
                    >
                      ←
                    </button>
                    <div className="font-mono text-xs text-sepia px-1">
                      <span className="text-ink font-bold">{String(selectedIdx + 1).padStart(2, '0')}</span>
                      <span> / </span>
                      <span>{String(total).padStart(2, '0')}</span>
                    </div>
                    <button
                      onClick={handleNext}
                      className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center border border-warm-gray text-ink hover:border-ink hover:bg-ink hover:text-ivory transition-all text-xs rounded-full touch-manipulation"
                      aria-label="Next"
                    >
                      →
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: High-Performance GPU Semicircle Wheel (Hidden on Mobile, Visible on Tablet & Desktop) */}
          <div className="hidden md:flex lg:col-span-6 relative h-[440px] lg:h-[620px] items-center justify-center lg:justify-end overflow-hidden lg:overflow-visible">
            <div className="relative w-[660px] lg:w-[800px] h-[660px] lg:h-[800px] lg:translate-x-[50%] flex items-center justify-center">
              
              <div
                style={{
                  transform: `rotate(${currentAngle}deg)`,
                  willChange: "transform",
                }}
                className="w-full h-full rounded-full relative flex items-center justify-center"
              >
                {items.map((art, idx) => {
                  const itemDeg = 180 + idx * step;
                  const rad = (itemDeg * Math.PI) / 180;
                  const x = Math.cos(rad) * radius;
                  const y = Math.sin(rad) * radius;
                  const isSelected = selectedIdx === idx;

                  return (
                    <div
                      key={art.id || idx}
                      style={{
                        position: "absolute",
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateTo(idx);
                      }}
                      className="cursor-pointer"
                    >
                      <div
                        style={{
                          transform: `rotate(${-currentAngle}deg)`,
                          willChange: "transform",
                        }}
                        className={`w-[110px] sm:w-[155px] lg:w-[180px] h-[150px] sm:h-[210px] lg:h-[250px] p-1.5 sm:p-2 bg-white border rounded-xl sm:rounded-2xl transition-[border-color,box-shadow,transform] duration-300 ${
                          isSelected 
                            ? "border-brass shadow-medium scale-105 sm:scale-110 ring-1 ring-brass z-40 opacity-100" 
                            : "border-warm-gray opacity-65 hover:opacity-100 hover:scale-105 shadow-soft"
                        }`}
                      >
                        <div className="w-full h-[75%] sm:h-[78%] overflow-hidden bg-parchment relative rounded-lg sm:rounded-xl">
                          <img
                            src={smallImageUrl(art.image_url)}
                            alt={art.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="h-[25%] sm:h-[22%] pt-1 px-0.5 sm:px-1 flex flex-col justify-center bg-white">
                          <h4 className="font-serif text-[10px] sm:text-xs font-semibold text-ink truncate italic">
                            {art.title}
                          </h4>
                          <p className="text-[8px] sm:text-[10px] text-sepia truncate font-sans">
                            {art.artist}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CircularGallery;
