import metArtworks from "./met_artworks.json";

export const dummyArtworks = metArtworks;

// Category translations mapping for display
export const categoryTranslations = {
  en: {
    "All": "All Classifications",
    "European Paintings": "European Paintings",
    "Drawings and Prints": "Drawings & Prints",
    "Robert Lehman Collection": "Robert Lehman Collection",
    "Modern and Contemporary Art": "Modern & Contemporary",
    "Asian Art": "Asian Art",
    "Medieval Art": "Medieval Art"
  },
  id: {
    "All": "Semua Klasifikasi",
    "European Paintings": "Lukisan Eropa",
    "Drawings and Prints": "Gambar & Seni Grafis",
    "Robert Lehman Collection": "Koleksi Robert Lehman",
    "Modern and Contemporary Art": "Seni Modern & Kontemporer",
    "Asian Art": "Seni Rupa Asia",
    "Medieval Art": "Seni Abad Pertengahan"
  }
};

const uniqueCats = Array.from(new Set(metArtworks.map((a) => a.category).filter(Boolean)));
export const dummyCategories = ["All", ...uniqueCats];

// Bilingual Featured Artists Data
export const featuredArtists = [
  {
    name: "Vincent van Gogh",
    role_en: "Post-Impressionist Master",
    role_id: "Pelukis Agung Pasca-Impresionisme",
    period_en: "1853–1890 · Netherlands",
    period_id: "1853–1890 · Belanda",
    bio_en: "Pioneer of modern expressionism with dramatic brushstrokes and emotional resonance.",
    bio_id: "Pelopor ekspresionisme modern dengan goresan kuas dramatis dan resonansi emosional mendalam.",
    avatar: "https://images.metmuseum.org/CRDImages/ep/web-large/DT1947.jpg",
    highlight_art_id: "art-436533",
    top_works_count: 8,
    nationality_en: "Dutch",
    nationality_id: "Belanda"
  },
  {
    name: "Rembrandt van Rijn",
    role_en: "Baroque Titan of Light & Shadow",
    role_id: "Master Barok Pencahayaan & Bayangan",
    period_en: "1606–1669 · Dutch Republic",
    period_id: "1606–1669 · Republik Belanda",
    bio_en: "Master of chiaroscuro, human psychology, and dramatic historical portraiture.",
    bio_id: "Pakar teknik chiaroscuro, kedalaman psikologi manusia, dan potret sejarah dramatis.",
    avatar: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-16323-001.jpg",
    highlight_art_id: "art-437397",
    top_works_count: 8,
    nationality_en: "Dutch",
    nationality_id: "Belanda"
  },
  {
    name: "Johannes Vermeer",
    role_en: "Master of Domestic Light",
    role_id: "Pelukis Agung Cahaya Ruang Domestik",
    period_en: "1632–1675 · Delft, Netherlands",
    period_id: "1632–1675 · Delft, Belanda",
    bio_en: "Renowned for luminous color purity, intimate interior spaces, and subtle narrative tension.",
    bio_id: "Terkemuka atas kemurnian warna bercahaya, ruang interior akrab, dan ketenangan naratif.",
    avatar: "https://images.metmuseum.org/CRDImages/ep/web-large/DP145920.jpg",
    highlight_art_id: "art-437881",
    top_works_count: 5,
    nationality_en: "Dutch",
    nationality_id: "Belanda"
  },
  {
    name: "Edgar Degas",
    role_en: "Impressionist Painter & Sculptor",
    role_id: "Pelukis & Pematung Impresionis",
    period_en: "1834–1917 · Paris, France",
    period_id: "1834–1917 · Paris, Prancis",
    bio_en: "Famous for capturing movement, theatrical ballet performances, and Parisian nightlife.",
    bio_id: "Terkenal karena mengabadikan dinamika gerak, pertunjukan balet teater, dan kehidupan kota Paris.",
    avatar: "https://images.metmuseum.org/CRDImages/ep/web-large/DP145923.jpg",
    highlight_art_id: "art-436155",
    top_works_count: 4,
    nationality_en: "French",
    nationality_id: "Prancis"
  }
];
