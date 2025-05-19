
// Simple in-memory cache for data fetched from external sources
// This would be replaced with a proper cache implementation in a production environment

interface CacheEntry {
  data: string;
  sources: Array<{ title: string; url: string }>;
  timestamp: number;
  contentType: string;
}

class DataCache {
  private cache: Map<string, CacheEntry>;
  private readonly MAX_AGE_MS: number;

  constructor(maxAgeMs = 5 * 60 * 1000) { // Default to 5 minutes
    this.cache = new Map();
    this.MAX_AGE_MS = maxAgeMs;
  }

  // Set data in cache
  set(key: string, data: string, sources: Array<{ title: string; url: string }>, contentType: string): void {
    this.cache.set(key, {
      data,
      sources,
      timestamp: Date.now(),
      contentType
    });
  }

  // Get data from cache, null if expired or not found
  get(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.MAX_AGE_MS) {
      this.cache.delete(key);
      return null;
    }
    
    return entry;
  }

  // Clear all cached entries
  clear(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const dataCache = new DataCache();
