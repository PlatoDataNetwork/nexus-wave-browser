
import React, { useEffect, useRef } from 'react';

interface InfiniteScrollSentinelProps {
  onIntersect: () => void;
  isLoading: boolean;
  hasMore: boolean;
  scrollableRef: React.RefObject<HTMLElement>;
}

const InfiniteScrollSentinel: React.FC<InfiniteScrollSentinelProps> = ({
  onIntersect,
  isLoading,
  hasMore,
  scrollableRef
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollableRef.current?.querySelector("[data-radix-scroll-area-viewport]") || scrollableRef.current;
    
    if (!scrollElement || !sentinelRef.current) return;
    
    // Create an Intersection Observer to detect when near bottom
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && hasMore) {
          onIntersect();
        }
      },
      { 
        root: scrollElement, 
        threshold: 0.1, 
        rootMargin: '100px' 
      }
    );
    
    // Observe the sentinel element
    observer.observe(sentinelRef.current);
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [isLoading, hasMore, onIntersect, scrollableRef]);

  return <div ref={sentinelRef} className="h-10 w-full" id="scroll-sentinel" />;
};

export default InfiniteScrollSentinel;
