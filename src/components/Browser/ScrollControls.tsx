
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ScrollControlsProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const ScrollControls: React.FC<ScrollControlsProps> = ({
  onScrollLeft,
  onScrollRight
}) => {
  return (
    <>
      {/* Left scroll button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 z-10 h-7 w-7 rounded-full bg-muted/90 shadow-sm hover:bg-muted"
        onClick={onScrollLeft}
      >
        <ArrowLeft className="h-4 w-4 text-white" />
        <span className="sr-only">Scroll left</span>
      </Button>
      
      {/* Right scroll button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 z-10 h-7 w-7 rounded-full bg-muted/90 shadow-sm hover:bg-muted"
        onClick={onScrollRight}
      >
        <ArrowRight className="h-4 w-4 text-white" />
        <span className="sr-only">Scroll right</span>
      </Button>
    </>
  );
};

export default ScrollControls;
