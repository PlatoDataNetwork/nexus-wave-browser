
import React, { useRef } from "react";
import { toast } from "@/components/ui/sonner";
import BookmarkItem from "./BookmarkItem";
import ScrollControls from "./ScrollControls";
import { getAlphabetizedBookmarks } from "@/utils/bookmarkUtils";

interface BookmarksProps {
  onNavigate: (url: string) => void;
  onToggle?: () => void;
}

const Bookmarks: React.FC<BookmarksProps> = ({ onNavigate, onToggle }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 300;
    
    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  const handleBookmarkClick = (url: string, title: string) => {
    console.log(`🔥 Bookmark click handler called for ${title} with URL: ${url}`);
    
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      processedUrl = `https://${url}`;
    }
    
    console.log(`🚀 Final processed URL for navigation: ${processedUrl}`);
    toast.success(`Loading ${title}...`);
    
    onNavigate(processedUrl);
  };

  const alphabetizedBookmarks = getAlphabetizedBookmarks();
  
  // Debug log the Gtrade bookmark specifically
  const gtradeBookmark = alphabetizedBookmarks.find(b => b.title === "Gtrade");
  if (gtradeBookmark) {
    console.log(`📋 Gtrade bookmark in component: ${gtradeBookmark.title} -> ${gtradeBookmark.url}`);
  }

  return (
    <div className="relative flex items-center bg-nexus-header-blue border-b border-border">
      <ScrollControls 
        onScrollLeft={() => handleScroll("left")}
        onScrollRight={() => handleScroll("right")}
      />
      
      <div 
        ref={scrollContainerRef}
        className="flex items-center space-x-3 px-10 py-2 overflow-x-auto nexus-scrollbar scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {alphabetizedBookmarks.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            id={bookmark.id}
            title={bookmark.title}
            url={bookmark.url}
            color={bookmark.color}
            onClick={handleBookmarkClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
