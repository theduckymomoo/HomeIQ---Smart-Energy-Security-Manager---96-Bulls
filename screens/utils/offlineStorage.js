// utils/offlineStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@homeiq_cache_';
const DEFAULT_CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Cache data with expiration time
 * @param {string} key - Cache key identifier
 * @param {any} data - Data to cache
 * @param {number} expiryMinutes - Expiration time in minutes (default: 15)
 */
export const cacheData = async (key, data, expiryMinutes = 15) => {
  try {
    const now = new Date();
    const expiryTime = now.getTime() + (expiryMinutes * 60 * 1000);
    
    const cacheItem = {
      data,
      timestamp: now.getTime(),
      expiryTime,
    };
    
    await AsyncStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify(cacheItem)
    );
    
    console.log(`✓ Cached: ${key} (expires in ${expiryMinutes}m)`);
  } catch (error) {
    console.error(`Error caching data for key "${key}":`, error);
  }
};

/**
 * Retrieve cached data if not expired
 * @param {string} key - Cache key identifier
 * @param {number} maxAge - Maximum age in milliseconds (default: 15 minutes)
 * @returns {any|null} Cached data or null if expired/not found
 */
export const getCachedData = async (key, maxAge = DEFAULT_CACHE_EXPIRY) => {
  try {
    const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    
    if (!cached) {
      console.log(`⚠ No cache found for: ${key}`);
      return null;
    }
    
    const cacheItem = JSON.parse(cached);
    const { data, timestamp, expiryTime } = cacheItem;
    const currentTime = Date.now();
    
    // Check if cache has expired
    if (currentTime > expiryTime) {
      console.log(`⏰ Cache expired for: ${key}`);
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    
    const age = currentTime - timestamp;
    const ageMinutes = Math.floor(age / 60000);
    console.log(`✓ Cache hit: ${key} (${ageMinutes}m old)`);
    
    return data;
  } catch (error) {
    console.error(`Error reading cache for key "${key}":`, error);
    return null;
  }
};

/**
 * Remove specific cached item
 * @param {string} key - Cache key identifier
 */
export const removeCachedData = async (key) => {
  try {
    await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    console.log(`✓ Removed cache: ${key}`);
  } catch (error) {
    console.error(`Error removing cache for key "${key}":`, error);
  }
};

/**
 * Clear all cached data
 */
export const clearAllCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`✓ Cleared ${cacheKeys.length} cached items`);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Get cache metadata (size, age, etc.)
 * @param {string} key - Cache key identifier
 * @returns {object|null} Cache metadata
 */
export const getCacheMetadata = async (key) => {
  try {
    const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    
    if (!cached) return null;
    
    const cacheItem = JSON.parse(cached);
    const currentTime = Date.now();
    const age = currentTime - cacheItem.timestamp;
    const timeUntilExpiry = cacheItem.expiryTime - currentTime;
    
    return {
      key,
      timestamp: cacheItem.timestamp,
      expiryTime: cacheItem.expiryTime,
      ageInMinutes: Math.floor(age / 60000),
      expiresInMinutes: Math.floor(timeUntilExpiry / 60000),
      isExpired: currentTime > cacheItem.expiryTime,
      size: JSON.stringify(cacheItem.data).length,
    };
  } catch (error) {
    console.error(`Error getting cache metadata for key "${key}":`, error);
    return null;
  }
};

/**
 * List all cached keys
 * @returns {Array<string>} Array of cache keys
 */
export const listCachedKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys
      .filter(key => key.startsWith(CACHE_PREFIX))
      .map(key => key.replace(CACHE_PREFIX, ''));
  } catch (error) {
    console.error('Error listing cache keys:', error);
    return [];
  }
};

// Export cache key constants for consistency
export const CACHE_KEYS = {
  APPLIANCES: 'appliances',
  LOADSHEDDING: 'loadshedding',
  USER_PROFILE: 'user_profile',
  ANALYTICS: 'analytics',
  LAST_SYNC: 'last_sync_timestamp',
};
