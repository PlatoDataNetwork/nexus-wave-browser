
import React from 'react';
import { WaveCategoryGrid } from '@/components/Wave/WaveCategoryGrid';
import { ScrollArea } from '@/components/ui/scroll-area';

const Wave: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background dark:bg-nexus-space-black">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <WaveCategoryGrid />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Wave;
