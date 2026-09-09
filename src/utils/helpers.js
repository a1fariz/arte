export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// The Met serves several sizes under /CRDImages/<collection>/. Small UI thumbs
// (marquee strip, orbit dial) don't need web-large (~1000px+) — mobile-large
// is ~2.5x lighter. Falls back to the original URL if the pattern isn't found.
export const smallImageUrl = (url) => {
  if (typeof url !== "string") return url;
  return url.replace("/web-large/", "/mobile-large/");
};
