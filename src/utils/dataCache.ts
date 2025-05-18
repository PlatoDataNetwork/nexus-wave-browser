
/**
 * Enhanced in-memory cache for real-time data with improved performance
 */

interface CachedItem {
  data: string;
  sources: Array<{ title: string; url: string }>;
  contentType: string;
  timestamp: number; // Timestamp in milliseconds
  accessCount: number; // Track how many times this item was accessed
  lastAccessed: number; // Timestamp of last access
}

class DataCache {
  private cache: Map<string, CachedItem>;
  private readonly TTL_MS: number; // Time-to-live in milliseconds
  private readonly MAX_ITEMS: number; // Maximum number of items in cache
  private readonly AUTOMATIC_CLEANUP_INTERVAL_MS: number; // Auto cleanup interval
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor(ttlMinutes: number = 30, maxItems: number = 200) {
    this.cache = new Map<string, CachedItem>();
    this.TTL_MS = ttlMinutes * 60 * 1000;
    this.MAX_ITEMS = maxItems;
    this.AUTOMATIC_CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
    
    // Start automatic cleanup
    this.startAutomaticCleanup();
    
    // Add event listener for page visibility change
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          // User is leaving the page, clean up to free memory
          this.cleanExpired();
        }
      });
    }
  }
  
  /**
   * Start automatic cleanup interval
   */
  private startAutomaticCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.cleanupInterval = setInterval(() => {
      this.cleanExpired();
    }, this.AUTOMATIC_CLEANUP_INTERVAL_MS);
  }
  
  /**
   * Store data in the cache with optimized memory usage
   */
  set(key: string, data: string, sources: Array<{ title: string; url: string }>, contentType: string): void {
    // If we're at capacity, remove items according to our eviction policy
    if (this.cache.size >= this.MAX_ITEMS) {
      this.evictItems();
    }
    
    const normalizedKey = this.normalizeKey(key);
    
    this.cache.set(normalizedKey, {
      data,
      sources,
      contentType,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now()
    });
    
    console.log(`Cache: stored "${normalizedKey}" (${contentType}) with ${sources.length} sources`);
  }
  
  /**
   * Get data from the cache with access tracking
   */
  get(key: string): CachedItem | undefined {
    const normalizedKey = this.normalizeKey(key);
    const item = this.cache.get(normalizedKey);
    
    // If item doesn't exist or is expired
    if (!item || Date.now() - item.timestamp > this.TTL_MS) {
      if (item) {
        console.log(`Cache: found "${normalizedKey}" but it was expired`);
        // Remove expired item
        this.cache.delete(normalizedKey);
      } else {
        console.log(`Cache: miss for "${normalizedKey}"`);
      }
      return undefined;
    }
    
    // Update access statistics for LFU/LRU hybrid eviction
    item.accessCount += 1;
    item.lastAccessed = Date.now();
    
    console.log(`Cache: hit for "${normalizedKey}" (${item.contentType}), access count: ${item.accessCount}`);
    return item;
  }
  
  /**
   * Clean expired items from the cache
   */
  cleanExpired(): void {
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
   * Hybrid eviction policy that considers both frequency and recency
   * Uses a combination of LFU (Least Frequently Used) and LRU (Least Recently Used)
   */
  private evictItems(): void {
    if (this.cache.size === 0) return;
    
    // Calculate scores for each item (lower is more likely to be evicted)
    const now = Date.now();
    const scoredItems: Array<{key: string, score: number}> = [];
    
    this.cache.forEach((item, key) => {
      // Score formula: (access count) * (recency factor)
      // Recency factor: 1.0 for very recent access, decreases with time
      const recencyFactor = Math.max(0.1, 1 - (now - item.lastAccessed) / this.TTL_MS);
      const score = item.accessCount * recencyFactor;
      
      scoredItems.push({ key, score });
    });
    
    // Sort by score (ascending)
    scoredItems.sort((a, b) => a.score - b.score);
    
    // Remove the lowest scoring items (25% of MAX_ITEMS or at least 1)
    const itemsToRemove = Math.max(1, Math.floor(this.MAX_ITEMS * 0.25));
    
    for (let i = 0; i < itemsToRemove && i < scoredItems.length; i++) {
      this.cache.delete(scoredItems[i].key);
    }
    
    console.log(`Cache: evicted ${itemsToRemove} items using hybrid LFU/LRU policy`);
  }
  
  /**
   * Normalize cache key to improve hit rates
   */
  private normalizeKey(key: string): string {
    // Convert to lowercase
    let normalizedKey = key.toLowerCase();
    
    // Remove extra spaces
    normalizedKey = normalizedKey.replace(/\s+/g, ' ').trim();
    
    // Remove common filler words that don't affect meaning
    const fillerWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
    fillerWords.forEach(word => {
      normalizedKey = normalizedKey.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
    });
    
    // Remove punctuation
    normalizedKey = normalizedKey.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    
    // Normalize spaces again after removals
    normalizedKey = normalizedKey.replace(/\s+/g, ' ').trim();
    
    return normalizedKey;
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
  getStats(): { size: number; maxSize: number; ttlMinutes: number; hitRate: number } {
    // Calculate hit rate if we were tracking hits/misses
    const hitRate = 0; // Placeholder - would need hit/miss tracking
    
    return {
      size: this.cache.size,
      maxSize: this.MAX_ITEMS,
      ttlMinutes: this.TTL_MS / (60 * 1000),
      hitRate
    };
  }
  
  /**
   * Clean up resources when no longer needed
   */
  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

// Create a single instance of the cache
export const dataCache = new DataCache();

// Add window unload handler to clean up resources
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    dataCache.clear();
  });
}
