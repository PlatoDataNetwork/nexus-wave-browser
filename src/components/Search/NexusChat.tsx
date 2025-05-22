
import React from 'react';
import { useConversation } from '@/hooks/useConversation';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import WebSearchSidebar from './WebSearchSidebar';
import ChatPanel from './ChatPanel';

interface NexusChatProps {
  onSearch?: (query: string) => void;
  initialMessage?: string;
}

const NexusChat: React.FC<NexusChatProps> = ({ onSearch, initialMessage = '' }) => {
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
  } = useConversation({ 
    onSearch,
    initialMessage
  });
  
  const { showSidebar, setShowSidebar, toggleSidebar } = useSidebarToggle(false);

  // Set the initial message when component mounts
  React.useEffect(() => {
    if (initialMessage) {
      setCurrentMessage(initialMessage);
    }
  }, [initialMessage, setCurrentMessage]);

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
