
interface CachedData {
  data: any;
  timestamp: number;
  sources: Array<{ title: string; url: string }>;
  ttl: number; // Time to live in milliseconds
}

/**
 * Simple cache for storing real-time data with TTL
 */
class DataCache {
  private cache: Record<string, CachedData> = {};
  
  /**
   * Get cached data if it exists and hasn't expired
   */
  get(key: string): CachedData | null {
    const cachedItem = this.cache[key];
    
    if (!cachedItem) {
      return null;
    }
    
    // Check if the item has expired
    if (Date.now() - cachedItem.timestamp > cachedItem.ttl) {
      // Remove expired item
      delete this.cache[key];
      return null;
    }
    
    return cachedItem;
  }
  
  /**
   * Store data in the cache with TTL based on content type
   */
  set(key: string, data: any, sources: Array<{ title: string; url: string }>, contentType: string): void {
    // Set TTL based on content type
    let ttl = 1800000; // Default: 30 minutes
    
    // Adjust TTL based on content type
    switch (contentType.toLowerCase()) {
      case 'weather':
        ttl = 900000; // 15 minutes
        break;
      case 'finance':
      case 'exchange rate':
      case 'stock':
      case 'crypto':
        ttl = 120000; // 2 minutes
        break;
      case 'news':
        ttl = 600000; // 10 minutes
        break;
      case 'sports':
        ttl = 300000; // 5 minutes
        break;
      case 'technology':
      case 'software':
      case 'version':
        ttl = 1800000; // 30 minutes
        break;
      case 'comparison':
        ttl = 600000; // 10 minutes
        break;
      default:
        ttl = 1800000; // 30 minutes
    }
    
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      sources,
      ttl
    };
  }
  
  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache = {};
  }
  
  /**
   * Remove a specific item from cache
   */
  remove(key: string): void {
    delete this.cache[key];
  }
}

// Export a singleton instance
export const dataCache = new DataCache();
