import { createContext, useContext, useState, useEffect } from "react";
import { dummyArtworks, dummyCategories } from "../data/dummyData";
import { loadFromStorage, saveToStorage } from "../utils/storage";

// 1. Create the Global Context
const GalleryContext = createContext();

// Custom hook to easily access gallery data from any component
export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
};

// Dataset version key: used to safely update images without deleting user's custom artworks
const DATASET_VERSION = "v3_verified_images";
const VERSION_KEY = "arte_dataset_version";

export const GalleryProvider = ({ children }) => {
  // 2. Initialize artworks state (loads from localStorage or falls back to dummyArtworks)
  const [artworks, setArtworks] = useState(() => {
    const storedData = loadFromStorage();
    const storedVersion = typeof window !== "undefined" ? localStorage.getItem(VERSION_KEY) : null;

    // Check if user already has saved data in browser
    if (storedData && Array.isArray(storedData.artworks) && storedData.artworks.length > 0) {
      // If version is outdated, perform smart migration
      if (storedVersion !== DATASET_VERSION) {
        // Map of latest default artworks
        const defaultMap = new Map(dummyArtworks.map((a) => [a.id, a]));
        
        // Update old URLs while keeping user's favorite status intact
        const updated = storedData.artworks.map((item) => {
          const fresh = defaultMap.get(item.id);
          if (fresh) {
            return {
              ...fresh,
              is_favorite: item.is_favorite ?? fresh.is_favorite,
            };
          }
          // Keep user-created custom artworks as they are
          return item;
        });

        // Add any new default artworks that are missing from user's storage
        const existingIds = new Set(updated.map((a) => a.id));
        const missing = dummyArtworks.filter((a) => !existingIds.has(a.id));
        const merged = [...updated, ...missing];

        // Save updated data to localStorage
        saveToStorage({ artworks: merged, categories: storedData.categories || dummyCategories });
        if (typeof window !== "undefined") {
          localStorage.setItem(VERSION_KEY, DATASET_VERSION);
        }
        return merged;
      }
      return storedData.artworks;
    }

    // Default fallback: load initial 33+ artworks from dummyData
    return dummyArtworks;
  });

  // 3. Initialize artwork categories
  const [categories, setCategories] = useState(() => {
    const storedData = loadFromStorage();
    if (storedData && Array.isArray(storedData.categories) && storedData.categories.length > 0) {
      return storedData.categories;
    }
    return dummyCategories;
  });

  // 4. User Role Management ("curator" = full edit/delete rights, "visitor" = view only)
  const [role, setRole] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("arte_user_role");
      if (saved === "curator" || saved === "visitor") return saved;
    }
    return "curator"; // Default to curator mode for full demo access
  });

  // Toggle between Curator and Visitor modes
  const toggleRole = () => {
    const next = role === "curator" ? "visitor" : "curator";
    setRole(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("arte_user_role", next);
    }
  };

  const isCurator = role === "curator";

  // 5. Auto-save artworks to localStorage whenever data changes
  useEffect(() => {
    if (artworks && artworks.length > 0) {
      saveToStorage({ artworks, categories });
      if (typeof window !== "undefined") {
        localStorage.setItem(VERSION_KEY, DATASET_VERSION);
      }
    }
  }, [artworks, categories]);

  // ==========================================
  // 6. CRUD Operations (Create, Read, Update, Delete)
  // ==========================================

  // CREATE: Add a new artwork
  const addArtwork = (newArtwork) => {
    const artwork = {
      ...newArtwork,
      id: `art-${Date.now()}`, // Generate unique ID using current timestamp
      is_favorite: false,
      created_at: new Date().toISOString(),
    };
    setArtworks((prev) => [artwork, ...prev]); // Add to the beginning of the list
    return artwork;
  };

  // UPDATE: Edit an existing artwork by its ID
  const updateArtwork = (id, updatedData) => {
    setArtworks((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updatedData } : art))
    );
  };

  // DELETE: Remove an artwork by its ID
  const deleteArtwork = (id) => {
    setArtworks((prev) => prev.filter((art) => art.id !== id));
  };

  // FAVORITE: Toggle like/favorite status (true <-> false)
  const toggleFavorite = (id) => {
    setArtworks((prev) =>
      prev.map((art) =>
        art.id === id ? { ...art, is_favorite: !art.is_favorite } : art
      )
    );
  };

  // READ: Find and return a single artwork by its ID
  const getArtworkById = (id) => {
    return artworks.find((art) => art.id === id);
  };

  // RESET: Restore all data back to the original default museum dataset
  const resetToDefault = () => {
    setArtworks(dummyArtworks);
    setCategories(dummyCategories);
    saveToStorage({ artworks: dummyArtworks, categories: dummyCategories });
    if (typeof window !== "undefined") {
      localStorage.setItem(VERSION_KEY, DATASET_VERSION);
    }
  };

  // Data & functions shared with all components
  const value = {
    artworks,
    categories,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    toggleFavorite,
    getArtworkById,
    resetToDefault,
    role,
    setRole,
    toggleRole,
    isCurator,
  };

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
};