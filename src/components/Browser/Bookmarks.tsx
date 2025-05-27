
import React, { useRef } from "react";
import { bookmarks } from "@/lib/dummyData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { topProtocols } from "@/lib/protocolData";

interface BookmarksProps {
  onNavigate: (url: string) => void;
  onToggle?: () => void;
}

// Enhanced bookmark type that always includes color
interface EnhancedBookmark {
  id: string;
  title: string;
  url: string;
  color: string;
  icon?: React.ElementType;
}

const Bookmarks: React.FC<BookmarksProps> = ({ onNavigate, onToggle }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 300; // Increase scroll amount for faster navigation
    
    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  const handleBookmarkClick = (url: string, title: string) => {
    // Make sure the URL has protocol
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      processedUrl = `https://${url}`;
    }
    
    // Log and navigate
    console.log(`Bookmark clicked: ${title} - Navigating to: ${processedUrl}`);
    toast.success(`Loading ${title}...`);
    
    // Call the navigation function
    onNavigate(processedUrl);
  };

  // Create a merged and alphabetized list of bookmarks
  const getColorFromName = (name: string) => {
    // Generate a consistent color based on the name
    const colors = [
      "#9b87f5", // Primary Purple
      "#7E69AB", // Secondary Purple
      "#6E59A5", // Tertiary Purple
      "#8B5CF6", // Vivid Purple
      "#D946EF", // Magenta Pink
      "#F97316", // Bright Orange
      "#0EA5E9", // Ocean Blue
      "#1EAEDB", // Bright Blue
      "#33C3F0", // Sky Blue
      "#E84142", // Red
      "#00D395", // Teal
      "#2A5ADA", // Blue
      "#FF007A", // Pink
      "#F7931A", // Orange
      "#0033AD", // Navy
      "#6747ED", // Purple
      "#E42575", // Hot Pink
      "#1AAB9B", // Seafoam
      "#0657F9", // Royal Blue
      "#00FFA3", // Bright Green
    ];
    
    // Use a simple hash function to pick a color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Create a combined and alphabetized list of bookmarks
  const getAlphabetizedBookmarks = (): EnhancedBookmark[] => {
    // Create a combined array of bookmarks and protocols
    const combinedBookmarks: EnhancedBookmark[] = [
      // Include the original bookmarks with added color property
      ...bookmarks.map(bookmark => ({
        ...bookmark,
        color: getColorFromName(bookmark.title)
      })),
      // Include Alek Bot
      {
        id: "alekbot",
        title: "Alek Bot",
        url: "https://gist.github.com/AlekBot/8f25dd2b086621f44ee23ed4d33ce43b",
        color: getColorFromName("Alek Bot")
      },
      // Add Alpaca to favorites
      {
        id: "alpaca",
        title: "Alpaca",
        url: "https://alpacanetwork.ai",
        color: getColorFromName("Alpaca")
      },
      // Add DefiX to favorites
      {
        id: "defix",
        title: "DefiX",
        url: "https://web3-vercel-nexus.vercel.app/",
        color: getColorFromName("DefiX")
      },
      // Include top protocols
      ...topProtocols.map(protocol => ({
        id: protocol.id,
        title: protocol.name,
        url: protocol.url,
        color: protocol.color || getColorFromName(protocol.name)
      }))
    ];

    // Sort alphabetically by title
    return combinedBookmarks.sort((a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  };

  const alphabetizedBookmarks = getAlphabetizedBookmarks();

  return (
    <div className="relative flex items-center bg-nexus-header-blue border-b border-border">
      {/* Left scroll button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 z-10 h-7 w-7 rounded-full bg-muted/90 shadow-sm hover:bg-muted"
        onClick={() => handleScroll("left")}
      >
        <ArrowLeft className="h-4 w-4 text-white" />
        <span className="sr-only">Scroll left</span>
      </Button>
      
      {/* Bookmarks container with horizontal scrolling */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center space-x-3 px-10 py-2 overflow-x-auto nexus-scrollbar scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {alphabetizedBookmarks.map((bookmark) => {
          const initial = bookmark.title.charAt(0).toUpperCase();
          
          return (
            <Button
              key={bookmark.id}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1 whitespace-nowrap p-1 h-8 hover:bg-primary/10"
              onClick={() => handleBookmarkClick(bookmark.url, bookmark.title)}
            >
              <div 
                className="flex items-center justify-center h-6 w-6 rounded-full text-white font-medium text-xs"
                style={{ backgroundColor: bookmark.color }}
              >
                {initial}
              </div>
              <span className="text-xs text-white">{bookmark.title}</span>
            </Button>
          );
        })}
      </div>
      
      {/* Right scroll button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 z-10 h-7 w-7 rounded-full bg-muted/90 shadow-sm hover:bg-muted"
        onClick={() => handleScroll("right")}
      >
        <ArrowRight className="h-4 w-4 text-white" />
        <span className="sr-only">Scroll right</span>
      </Button>
    </div>
  );
};

export default Bookmarks;
