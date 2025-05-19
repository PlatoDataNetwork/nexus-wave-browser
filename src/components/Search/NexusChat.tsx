import React, { useState } from 'react';
import { SidebarOpen, SidebarClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import WebSearchSidebar from './WebSearchSidebar';
import { classifyQuery } from '@/utils/queryClassifier';
import { getRealTimeData } from '@/utils/realTimeData';
import { getChatGPTResponseWithRealTimeData } from '@/utils/openai';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatMessage } from '@/types';
import ConversationDisplay from './ConversationDisplay';
import ChatInput from './ChatInput';

interface NexusChatProps {
  onSearch?: (query: string) => void;
}

const NexusChat: React.FC<NexusChatProps> = ({ onSearch }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isFetchingRealTimeData, setIsFetchingRealTimeData] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  
  // State to maintain conversation history for GPT
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

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
    
    try {
      // Step 1: Classify the query to determine if it needs real-time data
      setIsClassifying(true);
      let realTimeData = null;
      let needsRealTimeData = false;
      
      try {
        const classification = await classifyQuery(messageToSearch);
        needsRealTimeData = classification.needsRealTimeData;
        
        // Step 2: If needed, fetch real-time data from the web
        if (needsRealTimeData) {
          setIsClassifying(false);
          setIsFetchingRealTimeData(true);
          
          // Show loading toast for real-time data
          toast("Fetching real-time data...", {
            duration: 3000,
            icon: <span className="h-4 w-4" />
          });
          
          realTimeData = await getRealTimeData(messageToSearch, classification);
          
          if (realTimeData) {
            toast("Found real-time information", {
              duration: 2000,
              icon: <span className="h-4 w-4 text-nexus-purple" />
            });
          }
        }
      } catch (error) {
        console.error("Error during classification or data fetching:", error);
        toast("Couldn't analyze query for real-time needs", {
          duration: 2000
        });
      } finally {
        setIsClassifying(false);
        setIsFetchingRealTimeData(false);
      }
      
      // Update conversation history with the new user message
      const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageToSearch }];
      
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
      
      setMessages(prev => [...prev, aiResponse]);
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
      icon: <span className="h-4 w-4 animate-spin" />
    });
    
    setIsLoading(true);
    
    try {
      // Get real-time data if the original response had it
      let realTimeData = null;
      
      if (currentAssistantMessage.hasRealTimeData) {
        try {
          setIsFetchingRealTimeData(true);
          const classification = await classifyQuery(userMessage.content);
          realTimeData = await getRealTimeData(userMessage.content, classification);
        } catch (error) {
          console.error("Error fetching real-time data for regeneration:", error);
        } finally {
          setIsFetchingRealTimeData(false);
        }
      }
      
      // Modified system prompt to ensure variety in responses
      const diversityPrompt = `Please provide a different perspective or approach than previous responses. Use different examples, phrasing, and structure. If this is a regeneration request, avoid repeating the same content or examples from previous responses. Temperature has been increased to encourage creativity.`;
      
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
    } catch (error) {
      console.error("Error regenerating response:", error);
      toast.error("Failed to regenerate response");
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
        {/* Chat panel - main content area with proper layout */}
        <ResizablePanel defaultSize={70} minSize={50} className="flex flex-col h-full relative">
          <div className="p-3 flex items-center justify-between border-b bg-background">
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
          
          {/* Messages area - takes available space minus headers and input area */}
          <ConversationDisplay 
            messages={messages}
            setCurrentMessage={setCurrentMessage}
            handleRegenerateMessage={handleRegenerateMessage}
            handleSelectAlternative={handleSelectAlternative}
            handleRelatedQuestionClick={handleRelatedQuestionClick}
          />
          
          {/* Fixed input area at the bottom */}
          <ChatInput 
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isClassifying={isClassifying}
            isFetchingRealTimeData={isFetchingRealTimeData}
          />
        </ResizablePanel>
        
        {showSidebar && (
          <>
            <ResizableHandle withHandle />
            {/* Sidebar panel - completely self-contained */}
            <ResizablePanel defaultSize={30} minSize={20} className="h-full">
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
