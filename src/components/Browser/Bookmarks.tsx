
import React, { useRef } from "react";
import { bookmarks } from "@/lib/dummyData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface BookmarksProps {
  onNavigate: (url: string) => void;
}

const Bookmarks: React.FC<BookmarksProps> = ({ onNavigate }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 150; // Amount to scroll each time
    
    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  const handleBookmarkClick = (url: string, title: string) => {
    // Explicitly log and navigate to the URL
    console.log(`Navigating to bookmark: ${url}`);
    
    // Make sure the URL has protocol
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      processedUrl = `https://${url}`;
    }
    
    // Use onNavigate to trigger navigation in the parent components
    onNavigate(processedUrl);
    toast.info(`Loading ${title}...`);
  };

  // Add Alek Bot to the bookmarks
  const allBookmarks = [
    ...bookmarks,
    {
      id: "alekbot",
      title: "Alek Bot",
      url: "https://gist.github.com/AlekBot/8f25dd2b086621f44ee23ed4d33ce43b",
      icon: bookmarks[0].icon // Using the icon from the first bookmark as a placeholder
    }
  ];

  return (
    <div className="relative flex items-center border-b border-border bg-secondary/20">
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
        className="flex items-center space-x-2 px-10 py-1 overflow-x-auto nexus-scrollbar scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {allBookmarks.map((bookmark) => (
          <Button
            key={bookmark.id}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 whitespace-nowrap"
            onClick={() => handleBookmarkClick(bookmark.url, bookmark.title)}
          >
            {bookmark.icon && <bookmark.icon className="h-3 w-3 text-muted-foreground" />}
            <span className="text-xs">{bookmark.title}</span>
          </Button>
        ))}
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
