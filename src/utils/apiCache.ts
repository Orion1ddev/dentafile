
/**
 * Simple cache service for API responses using localStorage
 * with Time To Live (TTL) functionality
 */

const CACHE_PREFIX = 'dentafile_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Set an item in the cache
 */
export const setCacheItem = <T>(key: string, data: T, ttl: number = DEFAULT_TTL): void => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(cacheKey, JSON.stringify(item));
  } catch (error) {
    console.error('Error setting cache item:', error);
  }
};

/**
 * Get an item from the cache
 * Returns null if the item doesn't exist or has expired
 */
export const getCacheItem = <T>(key: string): T | null => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) return null;
    
    const item: CacheItem<T> = JSON.parse(cachedData);
    const now = Date.now();
    
    // Check if item has expired
    if (now - item.timestamp > item.ttl) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return item.data;
  } catch (error) {
    console.error('Error getting cache item:', error);
    return null;
  }
};

/**
 * Remove an item from the cache
 */
export const removeCacheItem = (key: string): void => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Error removing cache item:', error);
  }
};

/**
 * Clear all cached items
 */
export const clearCache = (): void => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Get a cached API response or fetch fresh data
 */
export const getCachedOrFetch = async <T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> => {
  // Try to get from cache first
  const cachedData = getCacheItem<T>(cacheKey);
  
  if (cachedData) {
    console.log(`Retrieved from cache: ${cacheKey}`);
    return cachedData;
  }
  
  // If not in cache or expired, fetch fresh data
  const freshData = await fetchFn();
  
  // Store in cache
  setCacheItem(cacheKey, freshData, ttl);
  
  return freshData;
};
