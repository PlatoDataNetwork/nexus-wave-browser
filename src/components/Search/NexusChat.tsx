
import React, { useEffect, useRef } from 'react';
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
  // Track if we've already auto-submitted the initial message
  const hasAutoSubmittedRef = useRef<boolean>(false);
  
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
    handleSelectAlternative,
    isPromptOrFollowupQuestion,
    searchResults
  } = useConversation({ 
    onSearch,
    initialMessage
  });
  
  const { showSidebar, setShowSidebar, toggleSidebar } = useSidebarToggle(false);

  // Set the initial message when component mounts - with auto-submission prevention
  useEffect(() => {
    // Only process initialMessage if we haven't already auto-submitted
    if (initialMessage && !hasAutoSubmittedRef.current) {
      console.log('Setting initial message:', initialMessage);
      setCurrentMessage(initialMessage);
      
      // Only auto-submit if it's an initial message from a prompt and it's not empty
      if (initialMessage.trim() !== '') {
        console.log('Will auto-submit initial message');
        
        // Use a small delay to ensure the component is fully mounted
        const timer = setTimeout(() => {
          console.log('Auto-submitting initial message');
          handleSubmit();
          // Mark as auto-submitted to prevent multiple submissions
          hasAutoSubmittedRef.current = true;
        }, 300); // Increased delay for more reliability
        
        return () => clearTimeout(timer);
      }
    }
  }, [initialMessage, setCurrentMessage, handleSubmit]);

  // Determine current processing stage for UI feedback
  const determineProcessingStage = () => {
    if (isClassifying) return 'classifying';
    if (isFetchingRealTimeData) return 'searching';
    return 'generating';
  };

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
            isAutoSubmitEnabled={isPromptOrFollowupQuestion}
            processingStage={determineProcessingStage()}
            searchResults={searchResults}
            currentQuery={currentQuery}
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
