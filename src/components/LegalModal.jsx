import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { playClick } from "../utils/audio";
import Button from "./ui/Button";

const LegalModal = ({ isOpen, initialTab = "privacy", onClose }) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialTab);
  const modalRef = useRef(null);

  // Update tab when user clicks a different link while opening
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  if (prevInitialTab !== initialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  // Handle ESC and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const isId = lang === "id";

  const content = {
    privacy: {
      badge: isId ? "Kebijakan Privasi · Arsip Klien" : "Privacy Policy · Client Archive",
      title: isId ? "Privasi & Perlindungan Data" : "Privacy & Data Protection",
      subtitle: isId
        ? "Arte beroperasi dengan prinsip 'Local-First' tanpa melacak atau mengumpulkan identitas pribadi Anda."
        : "Arte operates under a local-first philosophy, respecting your autonomy without collecting personal telemetry.",
      sections: [
        {
          num: "I",
          title: isId ? "Penyimpanan Lokal Browser (Local Storage)" : "Browser Local Storage",
          body: isId
            ? "Semua data kurasi Anda—termasuk daftar mahakarya favorit, peran kurator/pengunjung, pengaturan suara efek audio, preferensi bahasa, serta karya seni baru yang Anda tambahkan—disimpan secara eksklusif di memori lokal peramban (localStorage) perangkat Anda. Kami tidak memiliki server database terpusat yang menyimpan aktivitas Anda."
            : "All your curatorial data—including favorited artworks, curator/visitor role selection, sound preferences, language settings, and newly added custom pieces—is stored exclusively within your browser's local storage. We do not maintain any centralized user database tracking your browsing session.",
        },
        {
          num: "II",
          title: isId ? "Bebas Cookie Pelacak & Iklan" : "Zero Third-Party Tracking & Cookies",
          body: isId
            ? "Arte tidak menanamkan cookie pelacak pihak ketiga, analitik invasif, maupun piksel iklan. Pengalaman menjelajahi mahakarya seni di sini murni bersifat kontemplatif dan pribadi."
            : "Arte deploys zero advertising pixels, telemetry trackers, or third-party behavioral cookies. Your exploration through classical art remains entirely private and contemplative.",
        },
        {
          num: "III",
          title: isId ? "Kontrol Penuh & Pemulihan Data" : "Full User Data Autonomy",
          body: isId
            ? "Anda memiliki kendali 100% atas data yang tersimpan. Anda dapat menghapus atau mereset seluruh data kembali ke 33 katalog awal kapan saja melalui tombol 'Pulihkan Dataset' di bagian bawah (footer)."
            : "You maintain complete ownership over cached archival data. You may flush custom additions or reset the catalog back to the original 33 Met collection at any time using the 'Restore Dataset' option in the footer.",
        },
      ],
    },
    terms: {
      badge: isId ? "Ketentuan & Atribusi · CC0 Met" : "Terms & Attribution · CC0 Met",
      title: isId ? "Ketentuan Penggunaan & Lisensi" : "Terms of Service & Licensing",
      subtitle: isId
        ? "Ketentuan kurasi dan apresiasi karya seni domain publik dari The Metropolitan Museum of Art."
        : "Guidelines governing the curation, public domain access, and attribution of Metropolitan Museum assets.",
      sections: [
        {
          num: "I",
          title: isId ? "Akses Terbuka & Lisensi Domain Publik (CC0)" : "Open Access & Creative Commons Zero (CC0)",
          body: isId
            ? "Sebagian besar gambar beresolusi tinggi dan data metadata karya seni yang ditampilkan dalam Arte bersumber dari The Metropolitan Museum of Art Open Access Initiative dan berstatus Domain Publik di bawah lisensi Creative Commons Zero (CC0 1.0 Universal)."
            : "High-resolution imagery and metadata indexed within Arte are sourced from The Metropolitan Museum of Art Open Access program and are dedicated to the Public Domain under Creative Commons Zero (CC0 1.0 Universal).",
        },
        {
          num: "II",
          title: isId ? "Tujuan Edukasi & Non-Komersial" : "Non-Commercial Educational Purpose",
          body: isId
            ? "Aplikasi web Arte dibangun sebagai proyek studi independen, sarana eksplorasi sejarah seni rupa dunia (Renaisans, Barok, Klasik Eropa), serta apresiasi budaya visual tanpa tujuan komersialisasi berbayar."
            : "Arte is designed as an independent cultural and educational platform for classical European art exploration, art history study, and visual appreciation without monetization or paywalled restrictions.",
        },
        {
          num: "III",
          title: isId ? "Penafian Independen (Disclaimer)" : "Independent Affiliation Disclaimer",
          body: isId
            ? "Arte bukan merupakan aplikasi resmi dari The Metropolitan Museum of Art (The Met) di New York, dan tidak berafiliasi maupun disponsori secara resmi oleh institusi tersebut. Seluruh apresiasi dan hak intelektual atas preservasi fisik karya tetap menjadi dedikasi institusi museum terkait."
            : "Arte is an independent cultural curation interface and is not officially affiliated with, endorsed by, or sponsored by The Metropolitan Museum of Art, New York. All physical conservation remains the honored legacy of the respective museum curators.",
        },
      ],
    },
  };

  const currentContent = content[activeTab];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={currentContent.title}
            initial={{ scale: 0.94, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 18, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="bg-ivory border border-warm-gray max-w-2xl w-full shadow-2xl rounded-3xl overflow-hidden my-auto flex flex-col max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-parchment/80 border-b border-warm-gray px-6 sm:px-8 py-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brass animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-brass-dark uppercase font-semibold">
                    {currentContent.badge}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-1 tracking-tight">
                  {currentContent.title}
                </h3>
                <p className="text-xs sm:text-sm text-sepia mt-1 font-light leading-relaxed">
                  {currentContent.subtitle}
                </p>
              </div>

              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="text-sepia hover:text-ink p-2 rounded-full hover:bg-warm-gray/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brass"
                title={isId ? "Tutup dialog" : "Close dialog"}
                aria-label={isId ? "Tutup dialog" : "Close dialog"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-warm-gray bg-ivory px-6 sm:px-8 pt-2">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setActiveTab("privacy");
                }}
                className={`pb-3 pt-2 text-xs sm:text-sm font-medium transition-all relative mr-6 flex items-center gap-2 ${
                  activeTab === "privacy"
                    ? "text-brass-dark font-semibold"
                    : "text-sepia hover:text-ink"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.75"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>{isId ? "Kebijakan Privasi" : "Privacy Policy"}</span>
                {activeTab === "privacy" && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brass"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  setActiveTab("terms");
                }}
                className={`pb-3 pt-2 text-xs sm:text-sm font-medium transition-all relative flex items-center gap-2 ${
                  activeTab === "terms"
                    ? "text-brass-dark font-semibold"
                    : "text-sepia hover:text-ink"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.75"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>{isId ? "Ketentuan & Lisensi CC0" : "Terms & CC0 Licensing"}</span>
                {activeTab === "terms" && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brass"
                  />
                )}
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-ink/90 font-sans">
              {currentContent.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="bg-parchment/40 border border-warm-gray/70 p-4 sm:p-5 rounded-2xl transition-colors hover:border-brass/40"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-brass bg-brass/10 px-2 py-0.5 rounded">
                      Section {sec.num}
                    </span>
                    <h4 className="font-serif font-bold text-ink text-base sm:text-lg">
                      {sec.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-sepia leading-relaxed font-light pl-1">
                    {sec.body}
                  </p>
                </div>
              ))}

              {/* Museum Citation Callout */}
              <div className="flex items-center justify-between p-3.5 bg-warm-gray/30 rounded-xl border border-dashed border-warm-gray text-[11px] text-sepia">
                <span className="font-serif italic">
                  {isId
                    ? "Inisiatif Akses Terbuka The Metropolitan Museum of Art (New York)"
                    : "The Metropolitan Museum of Art Open Access Initiative (New York)"}
                </span>
                <a
                  href="https://www.metmuseum.org/about-the-met/policies-and-documents/open-access"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brass font-mono hover:underline inline-flex items-center gap-1 font-semibold ml-2 shrink-0"
                >
                  CC0 FAQ ↗
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-parchment/60 border-t border-warm-gray px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-sepia">
                {isId ? "Status: Domain Publik · Arsip Terverifikasi" : "Status: Public Domain · Archival Grade"}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="rounded-full w-full sm:w-auto px-6"
              >
                {isId ? "Tutup" : "Close"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;
