
import { LucideIcon } from "lucide-react";
import { Search, FileText, Globe, Video, Image, Zap } from "lucide-react";

export interface SearchCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  prompts: SearchPrompt[];
}

export interface SearchPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export const searchCategories: SearchCategory[] = [
  {
    id: "web",
    title: "Web Search",
    description: "Search the web securely and privately",
    icon: Globe,
    color: "bg-blue-500",
    prompts: [
      {
        id: "web-1",
        title: "Latest News",
        description: "Get the latest news on any topic",
        prompt: "Show me the latest news about",
      },
      {
        id: "web-2",
        title: "Research Topic",
        description: "Get comprehensive information on a topic",
        prompt: "I need in-depth information about",
      },
      {
        id: "web-3",
        title: "Find Reviews",
        description: "Search for product or service reviews",
        prompt: "Find reviews for",
      },
      {
        id: "web-4",
        title: "How-To Guide",
        description: "Find step-by-step guides",
        prompt: "How do I",
      },
      {
        id: "web-5",
        title: "Compare Options",
        description: "Compare different products or services",
        prompt: "Compare",
      },
      {
        id: "web-6",
        title: "Find Statistics",
        description: "Search for facts and statistics",
        prompt: "What are the statistics for",
      },
    ],
  },
  {
    id: "docs",
    title: "Documents",
    description: "Search within documents and articles",
    icon: FileText,
    color: "bg-amber-500",
    prompts: [
      {
        id: "docs-1",
        title: "Summarize Article",
        description: "Get a concise summary of any article",
        prompt: "Summarize this article about",
      },
      {
        id: "docs-2",
        title: "Find Citations",
        description: "Search for academic citations",
        prompt: "Find academic papers about",
      },
      {
        id: "docs-3",
        title: "Extract Key Points",
        description: "Get key points from a document",
        prompt: "What are the key points in",
      },
      {
        id: "docs-4",
        title: "Technical Documentation",
        description: "Search technical documentation",
        prompt: "Explain the technical details of",
      },
      {
        id: "docs-5",
        title: "Find Definitions",
        description: "Look up definitions and explanations",
        prompt: "What does this term mean:",
      },
      {
        id: "docs-6",
        title: "Research Papers",
        description: "Find academic research",
        prompt: "Find research papers about",
      },
    ],
  },
  {
    id: "images",
    title: "Images",
    description: "Search for images across the web",
    icon: Image,
    color: "bg-green-500",
    prompts: [
      {
        id: "images-1",
        title: "Find Images",
        description: "Search for specific images",
        prompt: "Find images of",
      },
      {
        id: "images-2",
        title: "Stock Photos",
        description: "Find stock photos for any purpose",
        prompt: "Find stock photos of",
      },
      {
        id: "images-3",
        title: "Infographics",
        description: "Search for informative infographics",
        prompt: "Find infographics about",
      },
      {
        id: "images-4",
        title: "Diagrams",
        description: "Search for diagrams and charts",
        prompt: "Find diagrams explaining",
      },
      {
        id: "images-5",
        title: "Art & Illustrations",
        description: "Find artistic images and illustrations",
        prompt: "Find artwork related to",
      },
      {
        id: "images-6",
        title: "Icons & Logos",
        description: "Search for icons and logo designs",
        prompt: "Find icons or logos for",
      },
    ],
  },
  {
    id: "videos",
    title: "Videos",
    description: "Search for videos across platforms",
    icon: Video,
    color: "bg-red-500",
    prompts: [
      {
        id: "videos-1",
        title: "Tutorial Videos",
        description: "Find how-to and tutorial videos",
        prompt: "Find tutorial videos for",
      },
      {
        id: "videos-2",
        title: "Educational Content",
        description: "Find educational videos on any topic",
        prompt: "Find educational videos about",
      },
      {
        id: "videos-3",
        title: "Product Reviews",
        description: "Find video reviews of products",
        prompt: "Find video reviews of",
      },
      {
        id: "videos-4",
        title: "Event Coverage",
        description: "Find videos covering events",
        prompt: "Find videos covering",
      },
      {
        id: "videos-5",
        title: "Documentary Films",
        description: "Search for documentary content",
        prompt: "Find documentaries about",
      },
      {
        id: "videos-6",
        title: "Short Videos",
        description: "Find short-form video content",
        prompt: "Find short videos about",
      },
    ],
  },
  {
    id: "qa",
    title: "Q&A",
    description: "Ask questions and get direct answers",
    icon: Search,
    color: "bg-purple-500",
    prompts: [
      {
        id: "qa-1",
        title: "Quick Facts",
        description: "Get quick answers to factual questions",
        prompt: "What is",
      },
      {
        id: "qa-2",
        title: "How To",
        description: "Ask how to do something",
        prompt: "How do I",
      },
      {
        id: "qa-3",
        title: "Explanations",
        description: "Get detailed explanations",
        prompt: "Explain",
      },
      {
        id: "qa-4",
        title: "Problem Solving",
        description: "Get help solving problems",
        prompt: "Help me solve",
      },
      {
        id: "qa-5",
        title: "Recommendations",
        description: "Get personalized recommendations",
        prompt: "What are the best",
      },
      {
        id: "qa-6",
        title: "Opinion Questions",
        description: "Ask for opinions or perspectives",
        prompt: "What do you think about",
      },
    ],
  },
  {
    id: "nexus",
    title: "Nexus AI",
    description: "Advanced AI-powered search capabilities",
    icon: Zap,
    color: "bg-nexus-purple",
    prompts: [
      {
        id: "nexus-1",
        title: "Data Analysis",
        description: "Analyze data and provide insights",
        prompt: "Analyze these statistics about",
      },
      {
        id: "nexus-2",
        title: "Creative Writing",
        description: "Generate creative content",
        prompt: "Write a creative piece about",
      },
      {
        id: "nexus-3",
        title: "Trend Analysis",
        description: "Analyze and explain current trends",
        prompt: "What are the current trends in",
      },
      {
        id: "nexus-4",
        title: "Complex Questions",
        description: "Get answers to complex questions",
        prompt: "I need a detailed explanation of",
      },
      {
        id: "nexus-5",
        title: "Predictions",
        description: "Get predictions based on data",
        prompt: "What might happen with",
      },
      {
        id: "nexus-6",
        title: "Research Assistant",
        description: "Get help with research",
        prompt: "Help me research",
      },
    ],
  },
];

export const getCategoryById = (id: string): SearchCategory | undefined => {
  return searchCategories.find(category => category.id === id);
};
