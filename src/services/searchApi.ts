import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Types for Serper API responses
export interface SerperSearchResponse {
  searchParameters: {
    q: string;
    gl: string;
    hl: string;
    autocorrect: boolean;
    page: number;
    type: string;
  };
  knowledgeGraph?: {
    title: string;
    type: string;
    website?: string;
    imageUrl?: string;
    description?: string;
    descriptionSource?: string;
    descriptionLink?: string;
    attributes?: Record<string, string>;
  };
  organic: {
    title: string;
    link: string;
    snippet: string;
    position: number;
    sitelinks?: Array<{ title: string; link: string }>;
    attributes?: Record<string, string>;
    date?: string;
    imageUrl?: string;
  }[];
  peopleAlsoAsk?: {
    question: string;
    snippet: string;
    title: string;
    link: string;
  }[];
  relatedSearches?: {
    query: string;
  }[];
  // Add images type for image search
  images?: {
    title: string;
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    thumbnailUrl: string;
    thumbnailWidth: number;
    thumbnailHeight: number;
    source: string;
    domain: string;
    link: string;
    googleUrl: string;
    position: number;
  }[];
  // Add videos type for video search
  videos?: {
    title: string;
    link: string;
    snippet: string;
    position: number;
    imageUrl?: string;
    date?: string;
    source?: string;
    duration?: string;
  }[];
  // Add news type for news search
  news?: {
    title: string;
    link: string;
    snippet: string;
    position: number;
    imageUrl?: string;
    date?: string;
    source?: string;
  }[];
}

// Common result format for our app
export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  description: string;
  type: "web" | "image" | "video" | "news" | "nexus";
  imageUrl?: string;
  sitelinks?: Array<{ title: string; link: string }>;
  snippets?: string[];
  position?: number;
  imageWidth?: number;
  imageHeight?: number;
  thumbnailUrl?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  source?: string;
  duration?: string;
  date?: string;
}

export interface KnowledgeGraphData {
  title: string;
  type: string;
  website?: string;
  imageUrl?: string;
  description?: string;
  descriptionSource?: string;
  descriptionLink?: string;
  attributes?: Record<string, string>;
}

export interface SearchAPIResponse {
  results: SearchResultItem[];
  knowledgeGraph?: KnowledgeGraphData;
  peopleAlsoAsk?: {
    question: string;
    snippet: string;
    title: string;
    link: string;
  }[];
  relatedSearches?: string[];
  error?: string;
  provider: "serper";
}

// Provider API key
const SERPER_API_KEY = "a84ace3f3a07c30b70a5cdfb487c85aa14688444"; // This is a sample key

// Create a cached promise for API key fetching to avoid redundant calls
let apiKeyPromise: Promise<string> | null = null;

// Function to get API key from Supabase if available
const getApiKey = async (): Promise<string> => {
  // Use cached promise if available
  if (apiKeyPromise) {
    return apiKeyPromise;
  }
  
  apiKeyPromise = (async () => {
    // If Supabase is available, try to get keys from there
    try {
      // Check if user is authenticated first to avoid the UUID error
      const authResponse = await supabase.auth.getUser();
      if (!authResponse.data.user?.id) {
        // If no authenticated user, return sample key
        return SERPER_API_KEY;
      }
      
      const { data: keys, error } = await supabase
        .from("search_api_keys")
        .select("provider, api_key")
        .eq("user_id", authResponse.data.user.id)
        .eq("provider", "serper");
  
      if (error) {
        throw error;
      }
  
      const serperKeyObj = keys?.find(k => k.provider === "serper");
      return serperKeyObj?.api_key || SERPER_API_KEY;
    } catch (error) {
      console.error("Error fetching API key:", error);
      // Fallback to sample key
      return SERPER_API_KEY;
    }
  })();
  
  return apiKeyPromise;
};

// Cache for search results to avoid redundant API calls
const searchCache = new Map<string, {
  timestamp: number;
  response: SearchAPIResponse;
}>();

// Search cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Generate cache key from search parameters
const generateCacheKey = (
  query: string,
  type: string,
  safeSearch: boolean,
  recencyFilter: string
): string => {
  return `${query}|${type}|${safeSearch}|${recencyFilter}`;
};

// Search using Serper API with result count and recency parameter
export const searchWithSerper = async (
  query: string, 
  type: "search" | "images" | "videos" | "news" = "search",
  safeSearch: boolean = true,
  resultCount: number = type === "images" ? 200 : 100,
  recencyFilter: "day" | "week" | "month" | "any" = "any"
): Promise<SearchAPIResponse> => {
  if (!query.trim()) {
    return { results: [], provider: "serper" };
  }

  // Check cache first
  const cacheKey = generateCacheKey(query, type, safeSearch, recencyFilter);
  const cachedResult = searchCache.get(cacheKey);
  
  // Use cached result if it's still valid
  if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_TTL) {
    console.log("Using cached search results for:", query);
    return cachedResult.response;
  }

  try {
    console.time('serper-api-call');
    const apiKey = await getApiKey();

    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);
    myHeaders.append("Content-Type", "application/json");

    // Add recency filter to the request
    const requestBody: any = {
      q: query,
      gl: "us",
      hl: "en",
      autocorrect: true,
      safe: safeSearch,
      num: resultCount // Add number of results parameter
    };

    // Add date restrict parameter based on recency filter
    if (recencyFilter !== "any") {
      switch (recencyFilter) {
        case "day":
          requestBody.dateRestrict = "d1"; // past 1 day
          break;
        case "week":
          requestBody.dateRestrict = "w1"; // past 1 week
          break;
        case "month":
          requestBody.dateRestrict = "m1"; // past 1 month
          break;
      }
    }

    const raw = JSON.stringify(requestBody);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect
    };

    const endpoint = `https://google.serper.dev/${type === "search" ? "search" : type}`;
    const response = await fetch(endpoint, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Serper API returned ${response.status}: ${response.statusText}`);
    }

    const data: SerperSearchResponse = await response.json();
    console.timeEnd('serper-api-call');
    
    // Handle different response formats based on search type
    let results: SearchResultItem[] = [];
    
    if (type === "images" && data.images) {
      // Map image search results
      results = data.images.map((image) => ({
        id: `serper-img-${image.position}`,
        title: image.title,
        url: image.link,
        description: image.title,
        type: "image",
        imageUrl: image.imageUrl,
        thumbnailUrl: image.thumbnailUrl,
        imageWidth: image.imageWidth,
        imageHeight: image.imageHeight,
        thumbnailWidth: image.thumbnailWidth,
        thumbnailHeight: image.thumbnailHeight,
        source: image.source,
        position: image.position
      }));
    } else if (type === "videos" && data.videos) {
      // Map video search results
      results = data.videos.map((video, index) => ({
        id: `serper-vid-${index}`,
        title: video.title,
        url: video.link,
        description: video.snippet,
        type: "video",
        imageUrl: video.imageUrl,
        source: video.source,
        duration: video.duration
      }));
    } else if (type === "news" && data.news) {
      // Map news search results
      results = data.news.map((news, index) => ({
        id: `serper-news-${index}`,
        title: news.title,
        url: news.link,
        description: news.snippet,
        type: "news",
        imageUrl: news.imageUrl,
        source: news.source,
        date: news.date
      }));
    } else {
      // Map regular search results
      results = data.organic.map((item) => ({
        id: `serper-${item.position}`,
        title: item.title,
        url: item.link,
        description: item.snippet,
        type: type === "news" ? "news" : "web",
        imageUrl: item.imageUrl,
        sitelinks: item.sitelinks,
        position: item.position,
        date: item.date
      }));
    }

    const mappedResponse: SearchAPIResponse = {
      results,
      provider: "serper",
      relatedSearches: data.relatedSearches?.map(item => item.query) || [],
      peopleAlsoAsk: data.peopleAlsoAsk,
    };

    if (data.knowledgeGraph) {
      mappedResponse.knowledgeGraph = data.knowledgeGraph;
    }
    
    // Cache the result
    searchCache.set(cacheKey, {
      timestamp: Date.now(),
      response: mappedResponse
    });

    return mappedResponse;
  } catch (error) {
    console.error("Error searching with Serper:", error);
    toast("Failed to fetch results from Serper. Please try again later.");
    return {
      results: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
      provider: "serper"
    };
  }
};
