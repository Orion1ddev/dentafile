
/**
 * Utility functions for image optimization
 */

/**
 * Generates a WebP version URL from original image URL
 * This assumes a server-side process is handling the conversion
 */
export const getWebPUrl = (originalUrl: string, quality: number = 70): string => {
  if (!originalUrl) return '';
  
  // Check if the URL is already a WebP image
  if (originalUrl.toLowerCase().endsWith('.webp')) {
    return originalUrl;
  }

  // If we have a server that supports on-the-fly conversion
  // Example: Append quality parameter for CDN handling
  try {
    const url = new URL(originalUrl);
    url.searchParams.append('format', 'webp');
    url.searchParams.append('q', quality.toString());
    return url.toString();
  } catch (e) {
    // If the URL parsing fails, just return the original
    console.log('WebP conversion not available for this URL:', originalUrl);
    return originalUrl;
  }
};

/**
 * Generates srcset for responsive images
 */
export const generateSrcSet = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  try {
    const url = new URL(imageUrl);
    return `
      ${getWebPUrl(imageUrl, 60)} 400w,
      ${getWebPUrl(imageUrl, 70)} 800w,
      ${getWebPUrl(imageUrl, 80)} 1200w
    `;
  } catch (e) {
    return imageUrl;
  }
};

/**
 * Creates an optimized image props object with lazy loading and srcset
 */
export const getOptimizedImageProps = (src: string | null | undefined, alt: string): React.ImgHTMLAttributes<HTMLImageElement> => {
  if (!src) {
    return { alt };
  }
  
  return {
    src,
    srcSet: generateSrcSet(src),
    loading: "lazy",
    alt,
    decoding: "async",
  };
};
