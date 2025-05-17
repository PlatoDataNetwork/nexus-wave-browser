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
import SearchSuggestions from './SearchSuggestions';

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
  // New fields for edit history and message chain support
  editHistory?: {
    id: string;
    content: string;
    timestamp: Date;
  }[];
  // Message relationships for chain updates
  parentMessageId?: string;
  childMessageIds?: string[];
  isEdited?: boolean;
  // Add the missing property
  showEditHistory?: boolean;
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
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isRegeneratingChain, setIsRegeneratingChain] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State to maintain conversation history for GPT
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper function to find child messages in the conversation chain
  const findChildMessages = (messageId: string): string[] => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return [];
    
    // For simple parent-child relationship in a linear conversation:
    // Child messages are those that follow the current message in the conversation
    const childIds: string[] = [];
    
    // Start from the next message and collect all IDs
    // For now, we'll simply consider all subsequent messages as children
    // in a more complex system, we'd use the explicit parent-child relationships
    for (let i = messageIndex + 1; i < messages.length; i++) {
      childIds.push(messages[i].id);
    }
    
    return childIds;
  };

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

  const handleSubmit = async (e?: React.FormEvent, directMessage?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Use direct message if provided, otherwise use current message state
    const messageToProcess = directMessage || currentMessage;
    
    if (!messageToProcess.trim()) return;
    
    // Check if we're editing an existing message
    if (editingMessageId) {
      // Find the message being edited
      const messageIndex = messages.findIndex(msg => msg.id === editingMessageId);
      if (messageIndex !== -1) {
        const originalMessage = messages[messageIndex];
        // Create updated message with edit history
        const updatedMessages = [...messages];
        
        // Create history entry for the original content if this is the first edit
        const history = originalMessage.editHistory || [];
        
        if (!originalMessage.isEdited) {
          history.push({
            id: originalMessage.id,
            content: originalMessage.content,
            timestamp: originalMessage.timestamp
          });
        }
        
        // Update the message with new content and edit history
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          content: messageToProcess,
          isEdited: true,
          editHistory: history
        };
        
        // Update messages
        setMessages(updatedMessages);
        
        // Clear editing state and input field
        setEditingMessageId(null);
        setCurrentMessage("");
        
        // Find all subsequent messages that need to be regenerated
        const childMessageIds = findChildMessages(originalMessage.id);
        
        // If there are messages to regenerate, start with the first response
        if (childMessageIds.length > 0) {
          const nextMessageId = childMessageIds[0];
          // Show toast for chain regeneration
          toast.info("Regenerating conversation chain...", {
            duration: 3000,
          });
          
          setIsRegeneratingChain(true);
          // Start chain regeneration with the first child message
          await regenerateMessageChain(nextMessageId, updatedMessages);
          setIsRegeneratingChain(false);
        }
        
        return;
      }
    }
    
    // Add user message to conversation
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageToProcess,
      timestamp: new Date(),
      childMessageIds: []
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Call onSearch without updating URL - just inform parent component
    if (onSearch) {
      onSearch(messageToProcess);
    }
    
    // Clear the input field only when using the current message state
    // If a direct message was provided, don't clear the input
    if (!directMessage) {
      setCurrentMessage("");
    }
    
    setIsLoading(true);
    
    try {
      setIsClassifying(true);
      let realTimeData = null;
      let needsRealTimeData = false;
      
      try {
        const classification = await classifyQuery(messageToProcess);
        needsRealTimeData = classification.needsRealTimeData;
        
        // Step 2: If needed, fetch real-time data from the web
        if (needsRealTimeData) {
          setIsClassifying(false);
          setIsFetchingRealTimeData(true);
          
          // Show loading toast for real-time data
          toast("Fetching real-time data...", {
            duration: 3000,
            icon: <Globe className="h-4 w-4" />
          });
          
          realTimeData = await getRealTimeData(messageToProcess, classification);
          
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
        setIsClassifying(false);
        setIsFetchingRealTimeData(false);
      }
      
      // Update conversation history with the new user message
      const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageToProcess }];
      
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
        isStreaming: true,
        // Establish relationship with the parent message (the user message)
        parentMessageId: userMessage.id
      };
      
      // Update the user message to reference this response
      setMessages(prev => {
        const updatedMessages = [...prev];
        const userMsgIndex = updatedMessages.length - 1;
        if (userMsgIndex >= 0 && updatedMessages[userMsgIndex].id === userMessage.id) {
          updatedMessages[userMsgIndex] = {
            ...updatedMessages[userMsgIndex],
            childMessageIds: [tempResponseId]
          };
        }
        return [...updatedMessages, tempAssistantMessage];
      });
      
      setIsStreaming(true);
      
      // Stream AI response using the ChatGPT API with conversation history and real-time data
      await streamChatGPTResponseWithRealTimeData(
        messageToProcess, 
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
            generateRelatedQuestions(messageToProcess, currentStreamContent).then(relatedQuestions => {
              setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                const streamingMsgIndex = updatedMessages.findIndex(msg => msg.id === tempResponseId);
                
                if (streamingMsgIndex !== -1) {
                  const permanentId = Date.now().toString();
                  updatedMessages[streamingMsgIndex] = {
                    ...updatedMessages[streamingMsgIndex],
                    relatedQuestions: relatedQuestions,
                    id: permanentId // Replace with permanent ID
                  };
                  
                  // Update parent message's childMessageIds with the permanent ID
                  const parentIndex = updatedMessages.findIndex(
                    msg => msg.childMessageIds?.includes(tempResponseId)
                  );
                  if (parentIndex !== -1) {
                    updatedMessages[parentIndex] = {
                      ...updatedMessages[parentIndex],
                      childMessageIds: [permanentId]
                    };
                  }
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
      toast("Failed to fetch response. Please try again later.");
      
      // Add a fallback response
      const fallbackResponse: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, but I encountered an issue while processing your request. Please try again later.",
        timestamp: new Date(),
        parentMessageId: userMessage.id
      };
      setMessages(prev => [...prev, fallbackResponse]);
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  };

  // New function to regenerate a chain of messages starting from a specific message
  const regenerateMessageChain = async (messageId: string, currentMessages: ChatMessage[] = messages) => {
    const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || currentMessages[messageIndex].role !== 'assistant') {
      console.error("Message not found or not an assistant message:", messageId);
      return;
    }
    
    // Find the parent message (user question)
    const currentMessage = currentMessages[messageIndex];
    const parentId = currentMessage.parentMessageId;
    
    if (!parentId) {
      console.error("Parent message not found for:", messageId);
      return;
    }
    
    const parentIndex = currentMessages.findIndex(msg => msg.id === parentId);
    if (parentIndex === -1) {
      console.error("Parent message not found in messages array:", parentId);
      return;
    }
    
    const userMessage = currentMessages[parentIndex];
    
    // Show regenerating toast
    toast("Regenerating response...", {
      duration: 3000,
      icon: <Loader2 className="h-4 w-4 animate-spin" />
    });
    
    setIsLoading(true);
    
    try {
      // Get real-time data if the original response had it
      let realTimeData = null;
      
      if (currentMessage.hasRealTimeData) {
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
      
      // Create conversation history up to this point
      // We need to find all messages before the parent message that are part of the conversation
      const historyMessages: { role: "user" | "assistant"; content: string }[] = [];
      
      for (let i = 0; i < parentIndex; i++) {
        historyMessages.push({
          role: currentMessages[i].role,
          content: currentMessages[i].content
        });
      }
      
      // Add the parent message (user question)
      historyMessages.push({
        role: userMessage.role,
        content: userMessage.content
      });
      
      // Modified system prompt to ensure variety in responses
      const diversityPrompt = `Please provide a different perspective or approach than previous responses. Use different examples, phrasing, and structure. If this is a regeneration request, avoid repeating the same content or examples from previous responses. Temperature has been increased to encourage creativity.`;

      // Create a placeholder for the regenerated streaming response
      const tempRegeneratedId = Date.now().toString() + "-regenerating";
      
      // Get alternative responses if they exist
      const alternatives = [
        ...currentMessage.alternativeResponses || [],
        currentMessage.content
      ];
      
      // Replace the old message with the regenerating version
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        
        // Find the index in the current state, which might be different from messageIndex
        const currentIndex = updatedMessages.findIndex(msg => msg.id === messageId);
        
        if (currentIndex !== -1) {
          updatedMessages[currentIndex] = {
            ...updatedMessages[currentIndex],
            id: tempRegeneratedId,
            content: "",
            alternativeResponses: alternatives,
            currentResponseIndex: 0,
            isStreaming: true
          };
        }
        
        // Also update any child message references
        const parentMsgIndex = updatedMessages.findIndex(msg => 
          msg.childMessageIds?.includes(messageId)
        );
        
        if (parentMsgIndex !== -1) {
          const childIds = [...(updatedMessages[parentMsgIndex].childMessageIds || [])];
          const idIndex = childIds.indexOf(messageId);
          
          if (idIndex !== -1) {
            childIds[idIndex] = tempRegeneratedId;
            updatedMessages[parentMsgIndex] = {
              ...updatedMessages[parentMsgIndex],
              childMessageIds: childIds
            };
          }
        }
        
        return updatedMessages;
      });
      
      setIsStreaming(true);
      
      // Stream regenerated response
      await streamChatGPTResponseWithRealTimeData(
        userMessage.content,
        historyMessages,
        async (currentStreamContent, isDone) => {
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
            const newMessageId = Date.now().toString();
            
            // Update the message with the permanent ID
            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              const streamingMsgIndex = updatedMessages.findIndex(msg => msg.id === tempRegeneratedId);
              
              if (streamingMsgIndex !== -1) {
                updatedMessages[streamingMsgIndex] = {
                  ...updatedMessages[streamingMsgIndex],
                  id: newMessageId,
                  isStreaming: false,
                  // Keep parent reference
                  parentMessageId: userMessage.id
                };
              }
              
              // Update parent references to the new message ID
              const parentMsgIndex = updatedMessages.findIndex(msg => 
                msg.childMessageIds?.includes(tempRegeneratedId)
              );
              
              if (parentMsgIndex !== -1) {
                const childIds = [...(updatedMessages[parentMsgIndex].childMessageIds || [])];
                const idIndex = childIds.indexOf(tempRegeneratedId);
                
                if (idIndex !== -1) {
                  childIds[idIndex] = newMessageId;
                  updatedMessages[parentMsgIndex] = {
                    ...updatedMessages[parentMsgIndex],
                    childMessageIds: childIds
                  };
                }
              }
              
              return updatedMessages;
            });
            
            // Clear streaming state
            setIsStreaming(false);
            
            // Generate new related questions for the regenerated response
            generateRelatedQuestions(userMessage.content, currentStreamContent).then(relatedQuestions => {
              setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                const msgIndex = updatedMessages.findIndex(msg => msg.id === newMessageId);
                
                if (msgIndex !== -1) {
                  updatedMessages[msgIndex] = {
                    ...updatedMessages[msgIndex],
                    relatedQuestions: relatedQuestions
                  };
                }
                
                return updatedMessages;
              });
            });
            
            // If this message has child messages, continue the regeneration chain
            const childMessageIds = findChildMessages(messageId);
            
            if (childMessageIds.length > 0 && childMessageIds[0] !== messageId) {
              // Get the updated messages state
              const nextMessageId = childMessageIds[0];
              
              // Wait a moment before starting the next regeneration
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Recursively regenerate the next message in the chain
              await regenerateMessageChain(nextMessageId, 
                // Get fresh copy of messages since state might have changed
                [...document.querySelectorAll('[data-message-id]')].map(el => {
                  const id = el.getAttribute('data-message-id');
                  return messages.find(msg => msg.id === id) as ChatMessage;
                })
              );
            } else {
              // End of chain, show success toast
              toast.success("Conversation chain regenerated");
              setIsRegeneratingChain(false);
            }
          }
          
          // Scroll to bottom with each chunk
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        realTimeData,
        diversityPrompt
      );
      
    } catch (error) {
      console.error("Error regenerating message chain:", error);
      toast.error("Failed to regenerate conversation chain");
      setIsStreaming(false);
      setIsRegeneratingChain(false);
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
    // Set the question in the input field for visibility, but pass it directly to handleSubmit
    setCurrentMessage(question);
    // Directly submit the question without relying on state update
    handleSubmit(undefined, question);
  };

  const handleEditMessage = (messageId: string, content: string) => {
    // Set the message content in the input field
    setCurrentMessage(content);
    
    // Set the editing message ID
    setEditingMessageId(messageId);
    
    // Focus the textarea
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    // Find the message and its corresponding user message
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].role !== 'assistant') return;

    // Show regenerating chain toast
    toast.info("Regenerating conversation chain...", {
      duration: 3000,
    });
    
    setIsRegeneratingChain(true);
    await regenerateMessageChain(messageId);
    setIsRegeneratingChain(false);
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
    
    // Find all child messages of this message
    const childMessageIds = findChildMessages(messageId);
    
    // If there are child messages, trigger regeneration chain
    if (childMessageIds.length > 0) {
      const nextMessageId = childMessageIds[0];
      
      // Show toast for chain regeneration
      toast.info("Regenerating conversation chain...", {
        duration: 3000,
      });
      
      setIsRegeneratingChain(true);
      // Start chain regeneration with the first child message
      regenerateMessageChain(nextMessageId).then(() => {
        setIsRegeneratingChain(false);
      });
    }
  };

  // New function to toggle showing edit history
  const handleToggleEditHistory = (messageId: string) => {
    setMessages(prevMessages => {
      return prevMessages.map(message => {
        if (message.id === messageId) {
          return {
            ...message,
            showEditHistory: !message.showEditHistory
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
              
              {/* Search suggestions with auto-submit */}
              <SearchSuggestions 
                onSelectSuggestion={handleRelatedQuestionClick}
                autoSubmit={true}
              />
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="message-container" data-message-id={message.id}>
                {message.role === "assistant" && message.isStreaming ? (
                  <div className={`flex justify-start`}>
                    <div className="max-w-3/4 rounded-lg p-4 bg-secondary border border-border">
                      {message.hasRealTimeData && (
                        <div className="mb-3 text-xs flex items-center gap-1 text-nexus-purple">
                          <Globe className="h-3 w-3" />
                          <span>Enhanced with real-time web data</span>
                        </div>
                      )}
                      
                      {/* Streaming with blinking cursor */}
                      <TypewriterEffect 
                        text={message.content}
                        isStreaming={true}
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
                    onEditMessage={message.role === 'user' ? handleEditMessage : undefined}
                    isEdited={message.isEdited}
                    editHistory={message.editHistory}
                    onToggleEditHistory={() => handleToggleEditHistory(message.id)}
                    isRegeneratingChain={isRegeneratingChain}
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
            placeholder={editingMessageId ? "Edit your message..." : "Ask Nexus anything..."}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-1 min-h-12 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isStreaming || isRegeneratingChain}
          />
          <Button 
            type="submit" 
            className="h-full bg-nexus-purple hover:bg-nexus-deep-purple flex-shrink-0"
            disabled={isLoading || isStreaming || isRegeneratingChain}
          >
            {isLoading || isStreaming || isRegeneratingChain ? (
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
                ) : isRegeneratingChain ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Regenerating</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Thinking</span>
                  </>
                )}
              </div>
            ) : editingMessageId ? (
              <span className="text-xs">Update</span>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        {/* Show cancel button when editing */}
        {editingMessageId && (
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 text-xs"
              onClick={() => {
                setEditingMessageId(null);
                setCurrentMessage("");
              }}
            >
              Cancel editing
            </Button>
          </div>
        )}
      </div>
      
      {/* Add padding at the bottom to prevent content from being hidden behind the input area */}
      <div className="h-20"></div>
    </div>
  );
};

export default NexusChat;
