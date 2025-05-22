
import React from 'react';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import WebSearchSidebar from './WebSearchSidebar';
import ChatPanel from './ChatPanel';
import { ConversationProvider } from '@/contexts/ConversationContext';

interface NexusChatProps {
  onSearch?: (query: string) => void;
}

const NexusChat: React.FC<NexusChatProps> = ({ onSearch }) => {
  // Use the sidebar toggle hook
  const { showSidebar, setShowSidebar, toggleSidebar } = useSidebarToggle(false);

  return (
    <ConversationProvider onSearch={onSearch}>
      <div className="flex flex-col h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Chat panel - main content area with absolute positioning for fixed elements */}
          <ResizablePanel defaultSize={70} minSize={50} className="flex flex-col h-full">
            <ChatPanel 
              showSidebar={showSidebar} 
              toggleSidebar={toggleSidebar} 
            />
          </ResizablePanel>
          
          {showSidebar && (
            <>
              <ResizableHandle withHandle />
              {/* Sidebar panel - isolated scrolling context */}
              <ResizablePanel defaultSize={30} minSize={20} className="h-full overflow-hidden">
                <WebSearchSidebar 
                  onClose={() => setShowSidebar(false)}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </ConversationProvider>
  );
};

export default NexusChat;
