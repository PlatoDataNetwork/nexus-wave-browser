import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, Zap, Globe, Square } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ConversationMessage from './ConversationMessage';
import { classifyQuery } from '@/utils/queryClassifier';
import { getRealTimeData } from '@/utils/realTimeData';
import { getChatGPTResponseWithRealTimeData, streamChatGPTResponseWithRealTimeData } from '@/utils/openai';
import TypewriterEffect from './TypewriterEffect';

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
  }[];
  hasRealTimeData?: boolean;
  alternativeResponses?: string[];
  currentResponseIndex?: number;
  relatedQuestions?: string[];
  isStreaming?: boolean;
  fullContent?: string;
}

interface NexusChatProps {
  onSearch?: (query: string) => void;
}

const NexusChat: React.FC<NexusChatProps> = ({ onSearch }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isFetchingRealTimeData, setIsFetchingRealTimeData] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
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
          
          // Show loading toast for real-time data - positioned above input
          toast("Fetching real-time data...", {
            duration: 3000,
            icon: <Globe className="h-4 w-4" />,
            position: "top-center" // Ensure toast appears at top
          });
          
          realTimeData = await getRealTimeData(messageToSearch, classification);
          
          if (realTimeData) {
            toast("Found real-time information", {
              duration: 2000,
              icon: <Zap className="h-4 w-4 text-nexus-purple" />,
              position: "top-center" // Ensure toast appears at top
            });
          }
        }
      } catch (error) {
        console.error("Error during classification or data fetching:", error);
        toast("Couldn't analyze query for real-time needs", {
          duration: 2000,
          position: "top-center" // Ensure toast appears at top
        });
      } finally {
        setIsClassifying(false);
        setIsFetchingRealTimeData(false);
      }
      
      // Update conversation history with the new user message
      const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageToSearch }];
      
      // Create a placeholder for streaming response
      const tempResponseId = Date.now().toString() + "-streaming";
      const tempAssistantMessage: ChatMessage = {
        id: tempResponseId,
        role: "assistant",
        content: "", // Empty at first, will be populated as chunks arrive
        timestamp: new Date(),
        sources: realTimeData?.sources || [],
        hasRealTimeData: !!realTimeData,
        alternativeResponses: [],
        currentResponseIndex: 0,
        isStreaming: true
      };
      
      setMessages(prev => [...prev, tempAssistantMessage]);
      setIsStreaming(true);
      
      // Stream AI response using the ChatGPT API with conversation history and real-time data
      await streamChatGPTResponseWithRealTimeData(
        messageToSearch, 
        updatedHistory,
        (currentStreamContent, isDone) => {
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            const streamingMsgIndex = updatedMessages.findIndex(msg => msg.id === tempResponseId);
            
            if (streamingMsgIndex !== -1) {
              updatedMessages[streamingMsgIndex] = {
                ...updatedMessages[streamingMsgIndex],
                content: currentStreamContent,
                fullContent: currentStreamContent,
                isStreaming: !isDone
              };
            }
            
            return updatedMessages;
          });
          
          if (isDone) {
            setIsStreaming(false);
            // Update conversation history with the complete assistant response
            setConversationHistory([
              ...updatedHistory,
              { role: "assistant" as const, content: currentStreamContent }
            ]);
            
            // Generate related questions once streaming is complete
            generateRelatedQuestions(messageToSearch, currentStreamContent).then(relatedQuestions => {
              setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                const streamingMsgIndex = updatedMessages.findIndex(msg => msg.id === tempResponseId);
                
                if (streamingMsgIndex !== -1) {
                  updatedMessages[streamingMsgIndex] = {
                    ...updatedMessages[streamingMsgIndex],
                    relatedQuestions: relatedQuestions,
                    id: Date.now().toString() // Replace with permanent ID
                  };
                }
                
                return updatedMessages;
              });
            });
          }
          
          // Scroll to bottom with each chunk
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        realTimeData
      );
      
    } catch (error) {
      console.error("AI error:", error);
      toast("Failed to fetch response. Please try again later.", {
        position: "top-center" // Ensure error toast appears at top
      });
      
      // Add a fallback response
      const fallbackResponse: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, but I encountered an issue while processing your request. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopStreaming = () => {
    // Find the streaming message and mark it as complete
    setMessages(prevMessages => {
      return prevMessages.map(msg => {
        if (msg.isStreaming) {
          return {
            ...msg,
            isStreaming: false,
            id: Date.now().toString() // Assign a permanent ID
          };
        }
        return msg;
      });
    });
    setIsStreaming(false);
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

      // Create a placeholder for the regenerated streaming response
      const tempRegeneratedId = Date.now().toString() + "-regenerating";
      const alternatives = [
        ...currentAssistantMessage.alternativeResponses || [],
        currentAssistantMessage.content
      ];
      
      // Replace the old message with the regenerating version
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          id: tempRegeneratedId,
          content: "",
          alternativeResponses: alternatives,
          currentResponseIndex: 0,
          isStreaming: true
        };
        return updatedMessages;
      });
      
      setIsStreaming(true);
      
      // Stream regenerated response
      await streamChatGPTResponseWithRealTimeData(
        userMessage.content,
        conversationHistory.slice(0, -1), // Exclude the last assistant response
        (currentStreamContent, isDone) => {
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            const streamingMsgIndex = updatedMessages.findIndex(msg => msg.id === tempRegeneratedId);
            
            if (streamingMsgIndex !== -1) {
              updatedMessages[streamingMsgIndex] = {
                ...updatedMessages[streamingMsgIndex],
                content: currentStreamContent,
                fullContent: currentStreamContent,
                isStreaming: !isDone
              };
            }
            
            return updatedMessages;
          });
          
          if (isDone) {
            setIsStreaming(false);
            
            // Update conversation history
            const updatedHistory = [...conversationHistory];
            updatedHistory.splice(-1, 1, { role: "assistant", content: currentStreamContent });
            setConversationHistory(updatedHistory);
            
            // Generate new related questions for the regenerated response
            generateRelatedQuestions(userMessage.content, currentStreamContent).then(relatedQuestions => {
              setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                const streamingMsgIndex = updatedMessages.findIndex(msg => msg.id === tempRegeneratedId);
                
                if (streamingMsgIndex !== -1) {
                  updatedMessages[streamingMsgIndex] = {
                    ...updatedMessages[streamingMsgIndex],
                    relatedQuestions: relatedQuestions,
                    id: Date.now().toString() // Replace with permanent ID
                  };
                }
                
                return updatedMessages;
              });
            });
            
            toast.success("Response regenerated");
          }
          
          // Scroll to bottom with each chunk
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        realTimeData,
        diversityPrompt
      );
      
    } catch (error) {
      console.error("Error regenerating response:", error);
      toast.error("Failed to regenerate response");
      setIsStreaming(false);
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

  return (
    <div className="flex flex-col h-full">
      {/* Increased height of the ScrollArea to make room for input area */}
      <ScrollArea className="flex-1 p-4 pb-20">
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
              <div key={message.id} className="message-container">
                {message.role === "assistant" && message.isStreaming ? (
                  <div className={`flex justify-start`}>
                    <div className="max-w-3/4 rounded-lg p-4 bg-secondary border border-border">
                      {message.hasRealTimeData && (
                        <div className="mb-3 text-xs flex items-center gap-1 text-nexus-purple">
                          <Globe className="h-3 w-3" />
                          <span>Enhanced with real-time web data</span>
                        </div>
                      )}
                      
                      {/* Streaming Typewriter Effect */}
                      <TypewriterEffect 
                        text={message.content} 
                        speed={5}
                        className="conversation-markdown"
                      />
                      
                      {/* Stop streaming button */}
                      <div className="mt-3 flex justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={handleStopStreaming}
                        >
                          <Square className="h-3 w-3" />
                          Stop streaming
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ConversationMessage 
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
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Fixed position input area with higher z-index than before but lower than toasts */}
      <div className="p-4 border-t border-border bg-background shadow-md fixed bottom-0 left-0 right-0 z-20">
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
            disabled={isStreaming}
          />
          <Button 
            type="submit" 
            className="h-full bg-nexus-purple hover:bg-nexus-deep-purple flex-shrink-0"
            disabled={isLoading || isStreaming}
          >
            {isLoading || isStreaming ? (
              <div className="flex items-center gap-1">
                {isClassifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Analyzing</span>
                  </>
                ) : isFetchingRealTimeData ? (
                  <>
                    <Globe className="h-4 w-4 animate-pulse" />
                    <span className="text-xs">Searching</span>
                  </>
                ) : isStreaming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Streaming</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Thinking</span>
                  </>
                )}
              </div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
      
      {/* Add padding at the bottom to prevent content from being hidden behind the input area */}
      <div className="h-20"></div>
    </div>
  );
};

export default NexusChat;
