
import React, { useEffect, useState } from 'react';
import { useConversation } from '@/hooks/useConversation';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';
import { useLocation } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import WebSearchSidebar from './WebSearchSidebar';
import ChatPanel from './ChatPanel';

interface NexusChatProps {
  onSearch?: (query: string) => void;
}

const NexusChat: React.FC<NexusChatProps> = ({ onSearch }) => {
  const [currentCategoryPrompt, setCurrentCategoryPrompt] = useState<string>('');
  const location = useLocation();

  // Get the category from the URL if we're on a category page
  useEffect(() => {
    if (location.pathname.includes('/search/category/')) {
      const categoryPath = location.pathname.split('/search/category/')[1];
      // Format the category name from the URL path (e.g., "ar-vr" -> "AR/VR")
      let categoryName = '';
      
      if (categoryPath === 'ar-vr') {
        categoryName = 'AR/VR';
        setCurrentCategoryPrompt('What are the most innovative AR/VR applications in industries?');
      } else {
        categoryName = categoryPath
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setCurrentCategoryPrompt(`Tell me about recent developments in ${categoryName}`);
      }
    } else {
      setCurrentCategoryPrompt('');
    }
  }, [location.pathname]);

  // Custom hooks to manage state and behaviors
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    isLoading,
    isClassifying,
    isFetchingRealTimeData,
    currentQuery,
    handleSubmit,
    handleRelatedQuestionClick,
    handleRegenerateMessage,
    handleSelectAlternative
  } = useConversation({ onSearch });
  
  const { showSidebar, setShowSidebar, toggleSidebar } = useSidebarToggle(false);

  return (
    <div className="flex flex-col h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Chat panel - main content area with absolute positioning for fixed elements */}
        <ResizablePanel defaultSize={70} minSize={50} className="flex flex-col h-full">
          <ChatPanel
            messages={messages}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isClassifying={isClassifying}
            isFetchingRealTimeData={isFetchingRealTimeData}
            showSidebar={showSidebar}
            toggleSidebar={toggleSidebar}
            handleRegenerateMessage={handleRegenerateMessage}
            handleSelectAlternative={handleSelectAlternative}
            handleRelatedQuestionClick={handleRelatedQuestionClick}
            currentCategoryPrompt={currentCategoryPrompt}
          />
        </ResizablePanel>
        
        {showSidebar && (
          <>
            <ResizableHandle withHandle />
            {/* Sidebar panel - isolated scrolling context */}
            <ResizablePanel defaultSize={30} minSize={20} className="h-full overflow-hidden">
              <WebSearchSidebar 
                currentQuery={currentQuery} 
                conversations={messages}
                onClose={() => setShowSidebar(false)}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default NexusChat;
