
import { toast } from "@/components/ui/use-toast";
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
}

// Types for You.com API responses
export interface YouSearchResponse {
  hits: {
    url: string;
    title: string;
    description: string;
    favicon_url?: string;
    thumbnail_url?: string;
    snippets?: string[];
  }[];
  latency: number;
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
  provider: "serper" | "you";
}

// Provider API keys
const SERPER_API_KEY = "a84ace3f3a07c30b70a5cdfb487c85aa14688444"; // This is a sample key
const YOU_API_KEY = "b4a7675d-d49a-4a31-a3ce-2dbf61cb935e<__>1P6A8vETU8N2v5f4IL9xcte2"; // This is a sample key

// Function to get API keys from Supabase if available
const getApiKeys = async (): Promise<{ serperKey: string; youKey: string }> => {
  // If Supabase is available, try to get keys from there
  try {
    const { data: keys, error } = await supabase
      .from("search_api_keys")
      .select("provider, api_key")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      throw error;
    }

    const serperKeyObj = keys?.find(k => k.provider === "serper");
    const youKeyObj = keys?.find(k => k.provider === "you");

    return {
      serperKey: serperKeyObj?.api_key || SERPER_API_KEY,
      youKey: youKeyObj?.api_key || YOU_API_KEY
    };
  } catch (error) {
    console.error("Error fetching API keys:", error);
    // Fallback to sample keys
    return {
      serperKey: SERPER_API_KEY,
      youKey: YOU_API_KEY
    };
  }
};

// Search using Serper API
export const searchWithSerper = async (query: string, type: "search" | "images" | "videos" | "news" = "search"): Promise<SearchAPIResponse> => {
  if (!query.trim()) {
    return { results: [], provider: "serper" };
  }

  try {
    const apiKeys = await getApiKeys();
    const apiKey = apiKeys.serperKey;

    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      q: query,
      gl: "us",
      hl: "en",
      autocorrect: true
    });

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
    
    // Map the response to our common format
    const results: SearchResultItem[] = data.organic.map((item) => ({
      id: `serper-${item.position}`,
      title: item.title,
      url: item.link,
      description: item.snippet,
      type: type === "images" ? "image" : 
            type === "videos" ? "video" : 
            type === "news" ? "news" : "web",
      imageUrl: item.imageUrl,
      sitelinks: item.sitelinks,
      position: item.position
    }));

    const mappedResponse: SearchAPIResponse = {
      results,
      provider: "serper",
      relatedSearches: data.relatedSearches?.map(item => item.query) || [],
      peopleAlsoAsk: data.peopleAlsoAsk,
    };

    if (data.knowledgeGraph) {
      mappedResponse.knowledgeGraph = data.knowledgeGraph;
    }

    return mappedResponse;
  } catch (error) {
    console.error("Error searching with Serper:", error);
    toast({
      title: "Search Error",
      description: "Failed to fetch search results from Serper. Please try again later.",
      variant: "destructive"
    });
    return {
      results: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
      provider: "serper"
    };
  }
};

// Search using You.com API
export const searchWithYou = async (query: string): Promise<SearchAPIResponse> => {
  if (!query.trim()) {
    return { results: [], provider: "you" };
  }

  try {
    const apiKeys = await getApiKeys();
    const apiKey = apiKeys.youKey;

    const options = {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey
      }
    };

    const endpoint = `https://api.ydc-index.io/search?query=${encodeURIComponent(query)}`;
    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
      throw new Error(`You.com API returned ${response.status}: ${response.statusText}`);
    }

    const data: YouSearchResponse = await response.json();
    
    // Map the response to our common format
    const results: SearchResultItem[] = data.hits.map((item, index) => ({
      id: `you-${index}`,
      title: item.title,
      url: item.url,
      description: item.description,
      type: "web",
      imageUrl: item.thumbnail_url,
      snippets: item.snippets
    }));

    return {
      results,
      provider: "you"
    };
  } catch (error) {
    console.error("Error searching with You.com:", error);
    toast({
      title: "Search Error",
      description: "Failed to fetch search results from You.com. Please try again later.",
      variant: "destructive"
    });
    return {
      results: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
      provider: "you"
    };
  }
};
