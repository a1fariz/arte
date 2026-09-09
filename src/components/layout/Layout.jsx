import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { playTransition } from "../../utils/audio";

const Layout = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [initialLoading, setInitialLoading] = useState(!reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    if (!initialLoading) {
      playTransition();
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, initialLoading]);

  return (
    <div className="min-h-screen flex flex-col bg-ivory relative overflow-x-hidden">
      {/* =========================================================================
          ANIMATION 1: Initial Website Load Preloader
          Effect: Fullscreen dark luxury screen shown on initial visit.
          Fades out smoothly after 600ms with a gentle slide-up logo reveal.
          ========================================================================= */}
      <AnimatePresence>
        {initialLoading && (
          <motion.div
            key="initial-preloader"
            className="fixed inset-0 bg-ink z-[200] pointer-events-none flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-3"
            >
              <div className="mb-3">
                <img src="/logo.svg" alt="Logo Arte" className="w-12 h-12 mx-auto shadow-brass" />
              </div>
              <div className="text-ivory font-serif text-3xl md:text-4xl italic tracking-wider flex items-center justify-center gap-3">
                <span className="w-2 h-2 rounded-full bg-brass animate-ping" />
                Arte Gallery
              </div>
              <div className="text-[10px] uppercase font-sans tracking-[0.3em] text-brass/80">
                Classical Art Bureau · Curated v2026
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      {/* =========================================================================
          ANIMATION 2: Theater Curtain Transition (Page Navigation)
          Effect: Black curtain scales down (scaleY: 1 -> 0) from the top
          whenever user navigates to a new URL, creating a cinematic stage entrance.
          Uses cubic-bezier [0.76, 0, 0.24, 1] for ultra-smooth theatrical timing.
          ========================================================================= */}
      <AnimatePresence>
        {!reduceMotion && (
          <motion.div
            key={`curtain-${location.pathname}`}
            className="fixed inset-0 bg-ink z-[100] pointer-events-none origin-top flex flex-col items-center justify-center will-change-transform"
            initial={{ scaleY: 1, transition: { duration: 0 } }}
            animate={{ scaleY: 0, transition: { delay: 0.25, duration: 0.45, ease: [0.76, 0, 0.24, 1] } }}
            exit={{ scaleY: 1, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 1, 1, 0], y: 0 }}
              transition={{ duration: 0.7, times: [0, 0.25, 0.7, 1], ease: [0.16, 1, 0.3, 1] }}
              className="text-ivory font-serif text-3xl md:text-4xl italic tracking-wider flex items-center gap-4"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-brass animate-ping" />
              Arte Gallery
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          ANIMATION 3: Main Page Content Entrance
          Effect: Page content slides up (y: 26 -> 0) in sync with the lifting curtain.
          ========================================================================= */}
      <main className="flex-grow pt-16">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
