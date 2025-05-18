
/**
 * Simple in-memory cache for real-time data with expiration
 */

interface CachedItem {
  data: string;
  sources: Array<{ title: string; url: string }>;
  contentType: string;
  timestamp: number; // Timestamp in milliseconds
}

class DataCache {
  private cache: Map<string, CachedItem>;
  private readonly TTL_MS: number; // Time-to-live in milliseconds
  private readonly MAX_ITEMS: number; // Maximum number of items in cache
  
  constructor(ttlMinutes: number = 30, maxItems: number = 100) {
    this.cache = new Map<string, CachedItem>();
    this.TTL_MS = ttlMinutes * 60 * 1000;
    this.MAX_ITEMS = maxItems;
    
    // Periodically clean expired items to prevent memory leaks
    setInterval(() => this.cleanExpired(), 5 * 60 * 1000); // Clean every 5 minutes
  }
  
  /**
   * Store data in the cache
   */
  set(key: string, data: string, sources: Array<{ title: string; url: string }>, contentType: string): void {
    // If we're at capacity, remove oldest item
    if (this.cache.size >= this.MAX_ITEMS) {
      this.removeOldest();
    }
    
    this.cache.set(key.toLowerCase(), {
      data,
      sources,
      contentType,
      timestamp: Date.now()
    });
    
    console.log(`Cache: stored "${key}" (${contentType}) with ${sources.length} sources`);
  }
  
  /**
   * Get data from the cache, return undefined if not found or expired
   */
  get(key: string): CachedItem | undefined {
    const cacheKey = key.toLowerCase();
    const item = this.cache.get(cacheKey);
    
    // If item doesn't exist or is expired
    if (!item || Date.now() - item.timestamp > this.TTL_MS) {
      if (item) {
        console.log(`Cache: found "${key}" but it was expired`);
        // Remove expired item
        this.cache.delete(cacheKey);
      } else {
        console.log(`Cache: miss for "${key}"`);
      }
      return undefined;
    }
    
    console.log(`Cache: hit for "${key}" (${item.contentType})`);
    return item;
  }
  
  /**
   * Clean expired items from the cache
   */
  private cleanExpired(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > this.TTL_MS) {
        this.cache.delete(key);
        expiredCount++;
      }
    });
    
    if (expiredCount > 0) {
      console.log(`Cache: cleaned ${expiredCount} expired items`);
    }
  }
  
  /**
   * Remove the oldest item from the cache
   */
  private removeOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;
    
    this.cache.forEach((item, key) => {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`Cache: removed oldest item "${oldestKey}" to make space`);
    }
  }
  
  /**
   * Clear the entire cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`Cache: cleared all ${size} items`);
  }
  
  /**
   * Get current cache stats
   */
  getStats(): { size: number; maxSize: number; ttlMinutes: number } {
    return {
      size: this.cache.size,
      maxSize: this.MAX_ITEMS,
      ttlMinutes: this.TTL_MS / (60 * 1000)
    };
  }
}

// Create a single instance of the cache
export const dataCache = new DataCache();
