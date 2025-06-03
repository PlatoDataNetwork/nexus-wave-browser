
import React from "react";
import { Button } from "@/components/ui/button";

interface BookmarkItemProps {
  id: string;
  title: string;
  url: string;
  color: string;
  onClick: (url: string, title: string) => void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({
  title,
  url,
  color,
  onClick
}) => {
  const initial = title.charAt(0).toUpperCase();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center space-x-1 whitespace-nowrap p-1 h-8 hover:bg-primary/10"
      onClick={() => onClick(url, title)}
    >
      <div 
        className="flex items-center justify-center h-6 w-6 rounded-full text-white font-medium text-xs"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
      <span className="text-xs text-white">{title}</span>
    </Button>
  );
};

export default BookmarkItem;
