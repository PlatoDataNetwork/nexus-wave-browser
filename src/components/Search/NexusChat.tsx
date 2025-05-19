import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, Zap, Globe, SidebarOpen, SidebarClose } from "lucide-react";
import { toast } from "sonner";
import ConversationMessage from './ConversationMessage';
import WebSearchSidebar from './WebSearchSidebar';
import ProcessingStatus, { ProcessStage } from './ProcessingStatus';
import { classifyQuery } from '@/utils/queryClassifier';
import { getRealTimeData } from '@/utils/realTimeData';
import { getChatGPTResponseWithRealTimeData } from '@/utils/openai';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatMessage } from '@/types';

interface NexusChatProps {
  onSearch?: (query: string) => void;
}

const NexusChat: React.FC<NexusChatProps> = ({ onSearch }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processStage, setProcessStage] = useState<ProcessStage>('idle');
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State to maintain conversation history for GPT
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate related questions based on the conversation context
  const generateRelatedQuestions = async (userMessage: string, aiResponse: string): Promise<string[]> => {
    try {
      // Create a prompt specifically for related questions
      const relatedQuestionsPrompt = 
        "Based on the user's original query and your response, " +
        "generate exactly 3 follow-up questions that the user might want to ask next. " +
        "These should be natural continuations of the conversation, exploring related topics or " +
        "deeper aspects of the current topic. Return ONLY the questions as a JSON array with no additional text. " +
        "Format: [\"Question 1?\", \"Question 2?\", \"Question 3?\"]";
      
      // Include just enough context for good question generation
      const contextForQuestions = [
        { role: "user" as const, content: userMessage },
        { role: "assistant" as const, content: aiResponse },
        { role: "user" as const, content: relatedQuestionsPrompt }
      ];
      
      const questionsResponse = await getChatGPTResponseWithRealTimeData(
        relatedQuestionsPrompt,
        contextForQuestions,
        null,
        "Generate diverse, specific, and engaging questions the user might want to ask next"
      );
      
      // Parse the response to get the questions array
      try {
        // The AI might return just the JSON array or it might include explanatory text,
        // so we need to extract just the array part
        const jsonMatch = questionsResponse.match(/\[\s*"[^"]+(?:",\s*"[^"]+")*\s*\]/);
        if (jsonMatch) {
          const questionsArray = JSON.parse(jsonMatch[0]);
          return questionsArray.slice(0, 3); // Ensure we only have 3 questions
        }
        
        // Fallback method if the regex doesn't match
        const cleanedResponse = questionsResponse.replace(/^```json\s*|\s*```$/g, '');
        const questions = JSON.parse(cleanedResponse);
        return Array.isArray(questions) ? questions.slice(0, 3) : [];
      } catch (error) {
        console.error("Failed to parse related questions:", error);
        // If parsing fails, extract questions using simple heuristics
        const questionRegex = /(?:^|\n)["']?([^"'\n]+\?)/g;
        const questions = [];
        let match;
        while ((match = questionRegex.exec(questionsResponse)) !== null && questions.length < 3) {
          questions.push(match[1]);
        }
        return questions.length > 0 ? questions : [];
      }
    } catch (error) {
      console.error("Error generating related questions:", error);
      return [];
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!currentMessage.trim()) return;
    
    // Add user message to conversation
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Call onSearch without updating URL - just inform parent component
    if (onSearch) {
      onSearch(currentMessage);
    }
    
    // Update current query for the sidebar
    setCurrentQuery(currentMessage);
    
    // Show sidebar when there's a new query
    setShowSidebar(true);
    
    const messageToSearch = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);
    setProcessStage('classifying');
    
    try {
      // Step 1: Classify the query to determine if it needs real-time data
      let realTimeData = null;
      let needsRealTimeData = false;
      
      try {
        const classification = await classifyQuery(messageToSearch);
        needsRealTimeData = classification.needsRealTimeData;
        
        // Step 2: If needed, fetch real-time data from the web
        if (needsRealTimeData) {
          setProcessStage('searching');
          
          // Show loading toast for real-time data
          toast("Fetching real-time data...", {
            duration: 3000,
            icon: <Globe className="h-4 w-4" />
          });
          
          realTimeData = await getRealTimeData(messageToSearch, classification);
          
          if (realTimeData) {
            toast("Found real-time information", {
              duration: 2000,
              icon: <Zap className="h-4 w-4 text-nexus-purple" />
            });
          }
        }
      } catch (error) {
        console.error("Error during classification or data fetching:", error);
        toast("Couldn't analyze query for real-time needs", {
          duration: 2000
        });
      } finally {
        setProcessStage('processing');
      }
      
      // Update conversation history with the new user message
      const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageToSearch }];
      
      // Move to generating response stage
      setProcessStage('generating');
      
      // Generate AI response using ChatGPT API with conversation history and real-time data if available
      const aiResponseContent = await getChatGPTResponseWithRealTimeData(
        messageToSearch, 
        updatedHistory,
        realTimeData
      );
      
      // Update conversation history with assistant response
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant" as const, content: aiResponseContent }
      ]);
      
      // Create sources from real-time data for citation
      const sources = realTimeData?.sources || [];
      
      // Generate related questions
      const relatedQuestions = await generateRelatedQuestions(messageToSearch, aiResponseContent);
      
      // Add AI response to conversation UI
      const aiResponse: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined,
        hasRealTimeData: !!realTimeData,
        alternativeResponses: [],
        currentResponseIndex: 0,
        relatedQuestions: relatedQuestions
      };
      
      // Complete the process
      setProcessStage('complete');
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Reset process stage after a short delay
      setTimeout(() => {
        setProcessStage('idle');
      }, 1000);
    } catch (error) {
      console.error("AI error:", error);
      toast("Failed to fetch response. Please try again later.");
      
      // Add a fallback response
      const fallbackResponse: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, but I encountered an issue while processing your request. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
      setProcessStage('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelatedQuestionClick = (question: string) => {
    setCurrentMessage(question);
    // Optional: automatically submit the related question
    setTimeout(() => handleSubmit(), 100);
  };

  const handleRegenerateMessage = async (messageId: string) => {
    // Find the message and its corresponding user message
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].role !== 'assistant') return;
    
    // Find the preceding user message
    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0 && messages[userMessageIndex].role !== 'user') {
      userMessageIndex--;
    }
    
    if (userMessageIndex < 0) return;
    
    const userMessage = messages[userMessageIndex];
    const currentAssistantMessage = messages[messageIndex];
    
    // Show regenerating toast
    toast("Regenerating response...", {
      duration: 3000,
      icon: <Loader2 className="h-4 w-4 animate-spin" />
    });
    
    setIsLoading(true);
    setProcessStage('classifying');
    
    try {
      // Get real-time data if the original response had it
      let realTimeData = null;
      
      if (currentAssistantMessage.hasRealTimeData) {
        try {
          setProcessStage('searching');
          const classification = await classifyQuery(userMessage.content);
          realTimeData = await getRealTimeData(userMessage.content, classification);
        } catch (error) {
          console.error("Error fetching real-time data for regeneration:", error);
        } finally {
          setProcessStage('processing');
        }
      }
      
      // Modified system prompt to ensure variety in responses
      const diversityPrompt = `Please provide a different perspective or approach than previous responses. Use different examples, phrasing, and structure. If this is a regeneration request, avoid repeating the same content or examples from previous responses. Temperature has been increased to encourage creativity.`;
      
      setProcessStage('generating');
      
      // Generate new response with diversity prompt
      const aiResponseContent = await getChatGPTResponseWithRealTimeData(
        userMessage.content,
        conversationHistory.slice(0, -1), // Exclude the last assistant response
        realTimeData,
        diversityPrompt // Pass the diversity prompt
      );
      
      // Create sources from real-time data for citation
      const sources = realTimeData?.sources || [];
      
      // Store the current response in alternatives
      const alternatives = [
        ...currentAssistantMessage.alternativeResponses || [],
        currentAssistantMessage.content
      ];
      
      // Generate new related questions for this regenerated response
      const relatedQuestions = await generateRelatedQuestions(userMessage.content, aiResponseContent);
      
      // Create new AI response
      const regeneratedResponse: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : currentAssistantMessage.sources,
        hasRealTimeData: !!realTimeData || currentAssistantMessage.hasRealTimeData,
        alternativeResponses: alternatives,
        currentResponseIndex: 0,
        relatedQuestions: relatedQuestions
      };
      
      // Replace the old message with the new one
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = regeneratedResponse;
      
      setMessages(updatedMessages);
      
      // Update conversation history
      const updatedHistory = [...conversationHistory];
      updatedHistory.splice(-1, 1, { role: "assistant", content: aiResponseContent });
      setConversationHistory(updatedHistory);
      
      toast.success("Response regenerated");
      
      // Complete the process
      setProcessStage('complete');
      setTimeout(() => {
        setProcessStage('idle');
      }, 1000);
    } catch (error) {
      console.error("Error regenerating response:", error);
      toast.error("Failed to regenerate response");
      setProcessStage('idle');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectAlternative = (messageId: string, index: number) => {
    setMessages(prevMessages => {
      return prevMessages.map(message => {
        if (message.id === messageId) {
          // If we're selecting the current response (index 0), use the main content
          // Otherwise, use one of the alternative responses
          let content = message.content;
          
          if (index > 0 && message.alternativeResponses && index <= message.alternativeResponses.length) {
            content = message.alternativeResponses[index - 1];
          }
          
          return {
            ...message,
            currentResponseIndex: index,
            content: index === 0 ? message.content : message.alternativeResponses![index - 1]
          };
        }
        return message;
      });
    });
  };

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="flex flex-col h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={70} minSize={50} className="h-full overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="p-3 flex items-center justify-between border-b">
              <h3 className="text-sm font-medium">Nexus Chat</h3>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={toggleSidebar}
              >
                {showSidebar ? <SidebarClose className="h-4 w-4" /> : <SidebarOpen className="h-4 w-4" />}
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 pb-4">
                {messages.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-nexus-purple/10 flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-nexus-purple" />
                    </div>
                    <h2 className="text-xl font-medium mb-2">Welcome to Nexus AI</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Ask me anything and I'll provide helpful information and answers to your questions.
                    </p>
                    <div className="flex gap-2 flex-wrap justify-center max-w-lg mx-auto">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setCurrentMessage("What's the weather in New York today?")}
                        className="flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" /> Weather in New York
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setCurrentMessage("Current USD to EUR exchange rate")}
                        className="flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3" /> USD to EUR rate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setCurrentMessage("Latest news about SpaceX")}
                        className="flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" /> SpaceX news
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setCurrentMessage("Show me a chart of Bitcoin price trends")}
                        className="flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3" /> Bitcoin price chart
                      </Button>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <ConversationMessage 
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      sources={message.sources}
                      hasRealTimeData={message.hasRealTimeData}
                      messageId={message.id}
                      onRegenerateMessage={message.role === 'assistant' ? handleRegenerateMessage : undefined}
                      alternativeResponses={message.alternativeResponses || []}
                      currentResponseIndex={message.currentResponseIndex || 0}
                      onSelectAlternative={(index) => handleSelectAlternative(message.id, index)}
                      relatedQuestions={message.relatedQuestions}
                      onRelatedQuestionClick={handleRelatedQuestionClick}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Add processing status component */}
            {isLoading && (
              <div className="px-4 py-2 border-t border-border">
                <ProcessingStatus stage={processStage} />
              </div>
            )}
            
            <div className="p-4 border-t border-border mt-auto">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                  placeholder="Ask Nexus anything..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="flex-1 min-h-12 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    className="h-12 bg-nexus-purple hover:bg-nexus-deep-purple flex-shrink-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-1">
                        {getProcessStageIcon(processStage)}
                      </div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ResizablePanel>
        
        {showSidebar && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20} className="overflow-hidden">
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

// Helper function to get the appropriate icon for each processing stage
function getProcessStageIcon(stage: ProcessStage) {
  switch (stage) {
    case 'classifying':
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs">Analyzing</span>
        </>
      );
    case 'searching':
      return (
        <>
          <Globe className="h-4 w-4 animate-pulse" />
          <span className="text-xs">Searching</span>
        </>
      );
    case 'processing':
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs">Processing</span>
        </>
      );
    case 'generating':
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs">Generating</span>
        </>
      );
    default:
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs">Thinking</span>
        </>
      );
  }
}

export default NexusChat;
