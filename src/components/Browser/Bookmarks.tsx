
import React from "react";
import { bookmarks } from "@/lib/dummyData";
import { Button } from "@/components/ui/button";

interface BookmarksProps {
  onNavigate: (url: string) => void;
}

const Bookmarks: React.FC<BookmarksProps> = ({ onNavigate }) => {
  return (
    <div className="flex items-center space-x-2 px-2 py-1 border-b border-border bg-secondary/20 overflow-x-auto nexus-scrollbar">
      {bookmarks.map((bookmark) => (
        <Button
          key={bookmark.id}
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1 whitespace-nowrap"
          onClick={() => onNavigate(bookmark.url)}
        >
          {bookmark.icon && <bookmark.icon className="h-3 w-3 text-muted-foreground" />}
          <span className="text-xs">{bookmark.title}</span>
        </Button>
      ))}
    </div>
  );
};

export default Bookmarks;
