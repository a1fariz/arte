import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGallery } from "../context/GalleryContext";
import { useLanguage } from "../context/LanguageContext";
import Button from "../components/ui/Button";
import { playClick, playChime } from "../utils/audio";

const ArtworkForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addArtwork, updateArtwork, getArtworkById, categories } = useGallery();
  const { t } = useLanguage();
  
  const isEdit = Boolean(id);
  const existingArtwork = isEdit ? getArtworkById(id) : null;

  const [formData, setFormData] = useState({
    title: existingArtwork?.title || "",
    artist: existingArtwork?.artist || "",
    year: existingArtwork?.year || "",
    category: existingArtwork?.category || categories[1] || "European Paintings",
    medium: existingArtwork?.medium || "Oil on canvas",
    description: existingArtwork?.description || "",
    image_url: existingArtwork?.image_url || "",
  });

  const [errors, setErrors] = useState({});
  const [imgValid, setImgValid] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ==========================================
  // Form Validation Logic
  // ==========================================
  const validate = () => {
    const newErrors = {};
    const trimmedTitle = formData.title.trim();
    const trimmedArtist = formData.artist.trim();
    const trimmedUrl = formData.image_url.trim();
    const parsedYear = parseInt(formData.year, 10);

    // 1. Validate Title: required, between 2 and 120 characters
    if (!trimmedTitle) {
      newErrors.title = t("errTitleRequired");
    } else if (trimmedTitle.length < 2) {
      newErrors.title = t("errTitleMin");
    } else if (trimmedTitle.length > 120) {
      newErrors.title = t("errTitleMax");
    }

    // 2. Validate Artist Name: required, minimum 2 characters
    if (!trimmedArtist) {
      newErrors.artist = t("errArtistRequired");
    } else if (trimmedArtist.length < 2) {
      newErrors.artist = t("errArtistMin");
    }

    // 3. Validate Creation Year: required, number, historical range (-3000 to 2026)
    if (!formData.year || isNaN(parsedYear)) {
      newErrors.year = t("errYearRequired");
    } else if (parsedYear < -3000 || parsedYear > 2026) {
      newErrors.year = t("errYearRange");
    }

    // 4. Validate Image URL: required, must be a valid http/https web link
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
    if (!trimmedUrl) {
      newErrors.image_url = t("errUrlRequired");
    } else if (!urlPattern.test(trimmedUrl)) {
      newErrors.image_url = t("errUrlInvalid");
    }

    // 5. Validate Description: optional, maximum 1000 characters
    if (formData.description.trim().length > 1000) {
      newErrors.description = t("errDescMax");
    }

    // If newErrors is empty, validation passed!
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // Form Submit Handler (Add or Edit)
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default browser page reload
    
    // Only proceed if all validation checks pass
    if (validate()) {
      const dataToSubmit = { 
        ...formData, 
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        image_url: formData.image_url.trim(),
        year: parseInt(formData.year, 10) 
      };

      playChime(); // Play success harmonic chime

      if (isEdit) {
        // UPDATE existing artwork
        updateArtwork(id, dataToSubmit);
        navigate(`/gallery/${id}`);
      } else {
        // CREATE new artwork
        const newArt = addArtwork(dataToSubmit);
        navigate(`/gallery/${newArt.id}`);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-16 max-w-4xl">
      {/* Header */}
      <div className="mb-10 md:mb-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-3 md:mb-4">
          <div className="h-[1px] w-8 sm:w-12 bg-brass" />
          <span className="text-[10px] text-brass tracking-[0.3em] uppercase font-sans font-bold">
            {isEdit ? t("formEditTag") : t("formNewTag")}
          </span>
          <div className="h-[1px] w-8 sm:w-12 bg-brass" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink italic">
          {isEdit ? t("formEditTitle") : t("formNewTitle")}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <motion.form
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-white border border-warm-gray p-6 sm:p-10 space-y-6 shadow-soft rounded-[28px]"
        >
          {/* Title */}
          <div>
            <label className="block text-[10px] text-sepia uppercase tracking-[0.2em] mb-2 font-sans font-bold">
              {t("labelTitle")}
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "error-title" : undefined}
              className={`w-full px-0 py-2.5 bg-transparent border-0 border-b ${
                errors.title ? "border-red-900" : "border-warm-gray focus:border-ink"
              } focus:outline-none text-ink text-lg sm:text-xl font-serif italic transition-colors placeholder:text-sepia/40`}
              placeholder="The Starry Night"
            />
            {errors.title && <p id="error-title" className="text-red-900 text-xs mt-1.5 font-sans">{errors.title}</p>}
          </div>

          {/* Artist */}
          <div>
            <label className="block text-[10px] text-sepia uppercase tracking-[0.2em] mb-2 font-sans font-bold">
              {t("labelArtist")}
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              aria-invalid={!!errors.artist}
              aria-describedby={errors.artist ? "error-artist" : undefined}
              className={`w-full px-0 py-2.5 bg-transparent border-0 border-b ${
                errors.artist ? "border-red-900" : "border-warm-gray focus:border-ink"
              } focus:outline-none text-ink text-base sm:text-lg font-serif transition-colors placeholder:text-sepia/40`}
              placeholder="Vincent van Gogh"
            />
            {errors.artist && <p id="error-artist" className="text-red-900 text-xs mt-1.5 font-sans">{errors.artist}</p>}
          </div>

          {/* Grid: Year & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] text-sepia uppercase tracking-[0.2em] mb-2 font-sans font-bold">
                {t("labelYear")}
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                aria-invalid={!!errors.year}
                aria-describedby={errors.year ? "error-year" : undefined}
                className={`w-full px-0 py-2.5 bg-transparent border-0 border-b ${
                  errors.year ? "border-red-900" : "border-warm-gray focus:border-ink"
                } focus:outline-none text-ink text-base sm:text-lg font-serif transition-colors placeholder:text-sepia/40`}
                placeholder="1889"
              />
              {errors.year && <p id="error-year" className="text-red-900 text-xs mt-1.5 font-sans">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-[10px] text-sepia uppercase tracking-[0.2em] mb-2 font-sans font-bold">
                {t("labelCategory")}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-0 py-2.5 bg-transparent border-0 border-b border-warm-gray focus:border-ink focus:outline-none text-ink text-base font-serif cursor-pointer transition-colors"
              >
                {categories.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat} className="bg-ivory font-sans text-sm">{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Medium */}
          <div>
            <label className="block text-[10px] text-sepia uppercase tracking-[0.2em] mb-2 font-sans font-bold">
              {t("labelMedium")}
            </label>
            <input
              type="text"
              name="medium"
              value={formData.medium}
              onChange={handleChange}
              className="w-full px-0 py-2.5 bg-transparent border-0 border-b border-warm-gray focus:border-ink focus:outline-none text-ink text-base font-serif transition-colors placeholder:text-sepia/40"
              placeholder="Oil on Canvas"
            />
          </div>

          {/* Image URL with Live Validation */}
          <div>
            <label className="block text-[10px] text-sepia uppercase tracking-[0.2em] mb-2 font-sans font-bold">
              {t("labelImageUrl")}
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={(e) => {
                handleChange(e);
                setImgValid(true);
              }}
              aria-invalid={!!errors.image_url}
              aria-describedby={errors.image_url ? "error-image-url" : undefined}
              className={`w-full px-0 py-2.5 bg-transparent border-0 border-b ${
                errors.image_url ? "border-red-900" : "border-warm-gray focus:border-ink"
              } focus:outline-none text-ink text-sm font-mono transition-colors placeholder:text-sepia/40`}
              placeholder="https://images.metmuseum.org/..."
            />
            {errors.image_url && <p id="error-image-url" className="text-red-900 text-xs mt-1.5 font-sans">{errors.image_url}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] text-sepia uppercase tracking-[0.2em] mb-2 font-sans font-bold">
              {t("labelDescription")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "error-description" : undefined}
              className="w-full px-4 py-3 bg-parchment/30 border border-warm-gray focus:border-ink focus:outline-none text-ink text-sm font-sans resize-none transition-colors rounded-xl"
              placeholder="Historical background, provenance, and stylistic notes..."
            />
            {errors.description && <p id="error-description" className="text-red-900 text-xs mt-1 font-sans">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-warm-gray">
            <Link to={isEdit ? `/gallery/${id}` : "/gallery"} onClick={playClick}>
              <Button variant="secondary" type="button" className="rounded-full">{t("btnCancel")}</Button>
            </Link>
            <Button variant="primary" type="submit" className="rounded-full">
              {isEdit ? t("btnSave") : t("btnPublish")}
            </Button>
          </div>
        </motion.form>

        {/* Live Image Preview Sidebar */}
        <div className="lg:col-span-4 bg-white border border-warm-gray p-5 shadow-soft space-y-3 rounded-[28px]">
          <div className="text-[10px] text-brass uppercase tracking-widest font-sans font-bold">
            {t("previewTitle")}
          </div>
          
          <div className="aspect-[4/5] bg-parchment overflow-hidden border border-warm-gray flex items-center justify-center relative rounded-2xl">
            {formData.image_url ? (
              <img
                src={formData.image_url}
                alt="Artwork Preview"
                onError={() => setImgValid(false)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imgValid ? "opacity-100" : "opacity-30"}`}
              />
            ) : (
              <div className="text-center p-4 text-sepia text-xs font-light">
                {t("previewPlaceholder")}
              </div>
            )}
            {!imgValid && formData.image_url && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/70 text-ivory text-xs p-3 text-center">
                {t("previewImageError")}
              </div>
            )}
          </div>

          <div className="pt-2">
            <h4 className="font-serif text-sm font-bold text-ink truncate italic">
              {formData.title || t("previewUntitled")}
            </h4>
            <p className="text-xs text-sepia font-sans">
              {formData.artist || t("previewUnknownArtist")} · {formData.year || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkForm;
