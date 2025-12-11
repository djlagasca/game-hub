const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80";

const getCroppedImageUrl = (url?: string, width = 600, height = 400) => {
  if (!url) return FALLBACK_IMAGE;

  if (url.includes("/media/crop/")) return url;

  const mediaSegment = "/media/";
  const mediaIndex = url.indexOf(mediaSegment);
  if (mediaIndex === -1) return url;

  const prefix = url.slice(0, mediaIndex + mediaSegment.length);
  const suffix = url.slice(mediaIndex + mediaSegment.length);

  return `${prefix}crop/${width}/${height}/${suffix}`;
};

export default getCroppedImageUrl;
