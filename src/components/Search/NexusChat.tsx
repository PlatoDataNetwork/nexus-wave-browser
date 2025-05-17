
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, Zap, Globe, Square } from "lucide-react";
import { toast } from "sonner";
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
  // Fields for edit history and message chain support
  editHistory?: {
    id: string;
    content: string;
    timestamp: Date;
  }[];
  // Message relationships for chain updates
  parentMessageId?: string;
  childMessageIds?: string[];
  isEdited?: boolean;
  showEditHistory?: boolean;
  // New field to track edit versions
  editHistoryIndex?: number;
  // New fields for branching conversation support
  branchId?: string;
  questionVersion?: number;
  isHidden?: boolean;
}

interface ConversationBranch {
  id: string;
  questionId: string;
  questionVersion: number;
  messageIds: string[];
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
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  // New states for branch management
  const [conversationBranches, setConversationBranches] = useState<ConversationBranch[]>([]);
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State to maintain conversation history for GPT
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper function to create a new branch
  const createNewBranch = (questionId: string, questionVersion: number): string => {
    const branchId = `branch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    setConversationBranches(prevBranches => [
      ...prevBranches,
      {
        id: branchId,
        questionId,
        questionVersion,
        messageIds: []
      }
    ]);
    
    return branchId;
  };

  // Helper function to switch to a specific branch
  const switchToBranch = (branchId: string) => {
    setActiveBranchId(branchId);
  };

  // Helper function to add a message to a branch
  const addMessageToBranch = (branchId: string, messageId: string) => {
    setConversationBranches(prevBranches => 
      prevBranches.map(branch => {
        if (branch.id === branchId) {
          return {
            ...branch,
            messageIds: [...branch.messageIds, messageId]
          };
        }
        return branch;
      })
    );
  };

  // Helper function to find which branch a message belongs to
  const findBranchForMessage = (messageId: string): string | null => {
    const branch = conversationBranches.find(branch => 
      branch.messageIds.includes(messageId)
    );
    
    return branch ? branch.id : null;
  };

  // Helper function to find messages in the active branch
  const getVisibleMessages = () => {
    if (!activeBranchId) return messages;
    
    // Find the active branch
    const activeBranch = conversationBranches.find(branch => branch.id === activeBranchId);
    if (!activeBranch) return messages;
    
    // Return only messages that belong to this branch
    return messages.filter(msg => activeBranch.messageIds.includes(msg.id));
  };

  // Helper function to find child messages in the conversation chain
  const findChildMessages = (messageId: string, withinBranchId?: string): string[] => {
    if (withinBranchId) {
      const branch = conversationBranches.find(b => b.id === withinBranchId);
      if (!branch) return [];
      
      const messageIndex = branch.messageIds.indexOf(messageId);
      if (messageIndex === -1) return [];
      
      return branch.messageIds.slice(messageIndex + 1);
    }
    
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return [];
    
    const childIds: string[] = [];
    
    for (let i = messageIndex + 1; i < messages.length; i++) {
      childIds.push(messages[i].id);
    }
    
    return childIds;
  };

  const generateRelatedQuestions = async (userMessage: string, aiResponse: string): Promise<string[]> => {
    try {
      const relatedQuestionsPrompt = 
        "Based on the user's original query and your response, " +
        "generate exactly 3 follow-up questions that the user might want to ask next. " +
        "These should be natural continuations of the conversation, exploring related topics or " +
        "deeper aspects of the current topic. Return ONLY the questions as a JSON array with no additional text. " +
        "Format: [\"Question 1?\", \"Question 2?\", \"Question 3?\"]";
      
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
      
      try {
        const jsonMatch = questionsResponse.match(/\[\s*"[^"]+(?:",\s*"[^"]+")*\s*\]/);
        if (jsonMatch) {
          const questionsArray = JSON.parse(jsonMatch[0]);
          return questionsArray.slice(0, 3);
        }
        
        const cleanedResponse = questionsResponse.replace(/^```json\s*|\s*```$/g, '');
        const questions = JSON.parse(cleanedResponse);
        return Array.isArray(questions) ? questions.slice(0, 3) : [];
      } catch (error) {
        console.error("Failed to parse related questions:", error);
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
    
    const messageToProcess = directMessage || currentMessage;
    
    if (!messageToProcess.trim()) return;
    
    // Handle in-place editing of existing message
    if (activeEditId) {
      const messageIndex = messages.findIndex(msg => msg.id === activeEditId);
      if (messageIndex !== -1) {
        const originalMessage = messages[messageIndex];
        
        // Update message history
        const updatedMessages = [...messages];
        const history = originalMessage.editHistory || [];
        
        history.push({
          id: originalMessage.id,
          content: originalMessage.content,
          timestamp: new Date()
        });
        
        const newQuestionVersion = (originalMessage.questionVersion || 0) + 1;
        const newBranchId = createNewBranch(originalMessage.id, newQuestionVersion);
        
        // Update the message with its new version and branch
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          content: messageToProcess,
          isEdited: true,
          editHistory: history,
          editHistoryIndex: history.length,
          questionVersion: newQuestionVersion,
          branchId: newBranchId
        };
        
        setMessages(updatedMessages);
        setActiveEditId(null);
        switchToBranch(newBranchId);
        
        // Hide old responses from previous versions
        const childMessageIds = findChildMessages(originalMessage.id);
        if (childMessageIds.length > 0) {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              childMessageIds.includes(msg.id) 
                ? {...msg, isHidden: true} 
                : msg
            )
          );
          
          // Generate new response for the edited message
          await generateResponseForMessage(messageToProcess, originalMessage.id, newBranchId);
        }
        
        return;
      }
    }
    
    // Handle regular message editing (not in-place)
    if (editingMessageId) {
      const messageIndex = messages.findIndex(msg => msg.id === editingMessageId);
      if (messageIndex !== -1) {
        const originalMessage = messages[messageIndex];
        const updatedMessages = [...messages];
        
        const history = originalMessage.editHistory || [];
        
        if (!originalMessage.isEdited) {
          history.push({
            id: originalMessage.id,
            content: originalMessage.content,
            timestamp: originalMessage.timestamp
          });
        }
        
        const newQuestionVersion = (originalMessage.questionVersion || 0) + 1;
        const newBranchId = createNewBranch(originalMessage.id, newQuestionVersion);
        
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          content: messageToProcess,
          isEdited: true,
          editHistory: history,
          editHistoryIndex: history.length,
          questionVersion: newQuestionVersion,
          branchId: newBranchId
        };
        
        setMessages(updatedMessages);
        setEditingMessageId(null);
        setCurrentMessage("");
        switchToBranch(newBranchId);
        
        // Hide old responses from previous versions
        const childMessageIds = findChildMessages(originalMessage.id);
        if (childMessageIds.length > 0) {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              childMessageIds.includes(msg.id) 
                ? {...msg, isHidden: true} 
                : msg
            )
          );
          
          // Generate new response for the edited message
          await generateResponseForMessage(messageToProcess, originalMessage.id, newBranchId);
        }
        
        return;
      }
    }
    
    // Handle new message
    const userMessageId = Date.now().toString();
    let currentBranchId = activeBranchId;
    
    // If there's no active branch, create a new one
    if (!currentBranchId) {
      currentBranchId = createNewBranch(userMessageId, 0);
      switchToBranch(currentBranchId);
    }
    
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: messageToProcess,
      timestamp: new Date(),
      childMessageIds: [],
      editHistoryIndex: 0,
      questionVersion: 0,
      branchId: currentBranchId
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    addMessageToBranch(currentBranchId, userMessageId);
    
    if (onSearch) {
      onSearch(messageToProcess);
    }
    
    if (!directMessage) {
      setCurrentMessage("");
    }
    
    await generateResponseForMessage(messageToProcess, userMessageId, currentBranchId);
  };

  // Helper function to generate a response for a specific message
  const generateResponseForMessage = async (messageContent: string, parentMessageId: string, branchId: string) => {
    setIsLoading(true);
    
    try {
      setIsClassifying(true);
      let realTimeData = null;
      let needsRealTimeData = false;
      
      try {
        const classification = await classifyQuery(messageContent);
        needsRealTimeData = classification.needsRealTimeData;
        
        if (needsRealTimeData) {
          setIsClassifying(false);
          setIsFetchingRealTimeData(true);
          
          toast("Fetching real-time data...", {
            duration: 3000,
            icon: <Globe className="h-4 w-4" />
          });
          
          realTimeData = await getRealTimeData(messageContent, classification);
          
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
      
      const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageContent }];
      
      const tempResponseId = Date.now().toString() + "-streaming";
      const tempAssistantMessage: ChatMessage = {
        id: tempResponseId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        sources: realTimeData?.sources || [],
        hasRealTimeData: !!realTimeData,
        alternativeResponses: [],
        currentResponseIndex: 0,
        isStreaming: true,
        editHistoryIndex: 0,
        parentMessageId: parentMessageId,
        branchId: branchId
      };
      
      setMessages(prev => {
        const updatedMessages = [...prev];
        const userMsgIndex = updatedMessages.findIndex(msg => msg.id === parentMessageId);
        
        if (userMsgIndex >= 0) {
          updatedMessages[userMsgIndex] = {
            ...updatedMessages[userMsgIndex],
            childMessageIds: [...(updatedMessages[userMsgIndex].childMessageIds || []), tempResponseId]
          };
        }
        
        return [...updatedMessages, tempAssistantMessage];
      });
      
      addMessageToBranch(branchId, tempResponseId);
      setIsStreaming(true);
      
      await streamChatGPTResponseWithRealTimeData(
        messageContent, 
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
            setConversationHistory([
              ...updatedHistory,
              { role: "assistant" as const, content: currentStreamContent }
            ]);
            
            generateRelatedQuestions(messageContent, currentStreamContent).then(relatedQuestions => {
              setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                const streamingMsgIndex = updatedMessages.findIndex(msg => msg.id === tempResponseId);
                
                if (streamingMsgIndex !== -1) {
                  const permanentId = Date.now().toString();
                  updatedMessages[streamingMsgIndex] = {
                    ...updatedMessages[streamingMsgIndex],
                    relatedQuestions: relatedQuestions,
                    id: permanentId
                  };
                  
                  // Update the branch with the permanent ID
                  setConversationBranches(prevBranches => 
                    prevBranches.map(branch => {
                      if (branch.id === branchId) {
                        return {
                          ...branch,
                          messageIds: branch.messageIds.map(id => 
                            id === tempResponseId ? permanentId : id
                          )
                        };
                      }
                      return branch;
                    })
                  );
                  
                  const parentIndex = updatedMessages.findIndex(
                    msg => msg.childMessageIds?.includes(tempResponseId)
                  );
                  if (parentIndex !== -1) {
                    updatedMessages[parentIndex] = {
                      ...updatedMessages[parentIndex],
                      childMessageIds: updatedMessages[parentIndex].childMessageIds?.map(id => 
                        id === tempResponseId ? permanentId : id
                      )
                    };
                  }
                }
                
                return updatedMessages;
              });
            });
          }
          
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        realTimeData
      );
      
    } catch (error) {
      console.error("AI error:", error);
      toast("Failed to fetch response. Please try again later.");
      
      const fallbackResponse: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, but I encountered an issue while processing your request. Please try again later.",
        timestamp: new Date(),
        parentMessageId: parentMessageId,
        editHistoryIndex: 0,
        branchId: branchId
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
      addMessageToBranch(branchId, fallbackResponse.id);
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateMessageChain = async (messageId: string, currentMessages: ChatMessage[] = messages) => {
    const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || currentMessages[messageIndex].role !== 'assistant') {
      console.error("Message not found or not an assistant message:", messageId);
      return;
    }
    
    const currentMessage = currentMessages[messageIndex];
    const parentId = currentMessage.parentMessageId;
    const branchId = currentMessage.branchId || findBranchForMessage(messageId);
    
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
    
    toast("Regenerating response...", {
      duration: 3000,
      icon: <Loader2 className="h-4 w-4 animate-spin" />
    });
    
    setIsLoading(true);
    
    try {
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
      
      // Create conversation history for this branch
      const historyMessages: { role: "user" | "assistant"; content: string }[] = [];
      
      // Find the branch and get its messages
      const branch = conversationBranches.find(b => b.id === branchId);
      if (branch) {
        for (const msgId of branch.messageIds) {
          if (msgId === messageId) break; // Stop when we reach the current message
          
          const msg = currentMessages.find(m => m.id === msgId);
          if (msg) {
            historyMessages.push({
              role: msg.role,
              content: msg.content
            });
          }
        }
      } else {
        // Fallback if branch is not found
        for (let i = 0; i < parentIndex; i++) {
          historyMessages.push({
            role: currentMessages[i].role,
            content: currentMessages[i].content
          });
        }
        
        historyMessages.push({
          role: userMessage.role,
          content: userMessage.content
        });
      }
      
      const diversityPrompt = `Please provide a different perspective or approach than previous responses. Use different examples, phrasing, and structure. If this is a regeneration request, avoid repeating the same content or examples from previous responses. Temperature has been increased to encourage creativity.`;

      const tempRegeneratedId = Date.now().toString() + "-regenerating";
      
      const alternatives = [
        ...currentMessage.alternativeResponses || [],
        currentMessage.content
      ];
      
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        
        const currentIndex = updatedMessages.findIndex(msg => msg.id === messageId);
        
        if (currentIndex !== -1) {
          updatedMessages[currentIndex] = {
            ...updatedMessages[currentIndex],
            id: tempRegeneratedId,
            content: "",
            alternativeResponses: alternatives,
            currentResponseIndex: alternatives.length, // Set to new response
            isStreaming: true
          };
        }
        
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
      
      // Update branch with new ID
      if (branchId) {
        setConversationBranches(prevBranches => 
          prevBranches.map(branch => {
            if (branch.id === branchId) {
              return {
                ...branch,
                messageIds: branch.messageIds.map(id => 
                  id === messageId ? tempRegeneratedId : id
                )
              };
            }
            return branch;
          })
        );
      }
      
      setIsStreaming(true);
      
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
            
            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              const streamingMsgIndex = updatedMessages.findIndex(msg => msg.id === tempRegeneratedId);
              
              if (streamingMsgIndex !== -1) {
                updatedMessages[streamingMsgIndex] = {
                  ...updatedMessages[streamingMsgIndex],
                  id: newMessageId,
                  isStreaming: false,
                  parentMessageId: userMessage.id,
                  branchId: branchId
                };
              }
              
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
            
            // Update branch with permanent ID
            if (branchId) {
              setConversationBranches(prevBranches => 
                prevBranches.map(branch => {
                  if (branch.id === branchId) {
                    return {
                      ...branch,
                      messageIds: branch.messageIds.map(id => 
                        id === tempRegeneratedId ? newMessageId : id
                      )
                    };
                  }
                  return branch;
                })
              );
            }
            
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
            
            // Find child messages in the same branch
            const childMessageIds = branch ? 
              branch.messageIds.slice(branch.messageIds.indexOf(newMessageId) + 1) :
              findChildMessages(messageId);
            
            if (childMessageIds.length > 0 && childMessageIds[0] !== messageId) {
              await new Promise(resolve => setTimeout(resolve, 500));
              await regenerateMessageChain(childMessageIds[0], 
                messages.map(msg => {
                  const updatedMsg = {...msg};
                  if (msg.id === messageId) {
                    updatedMsg.id = newMessageId;
                  }
                  return updatedMsg;
                })
              );
            } else {
              toast.success("Conversation chain regenerated");
              setIsRegeneratingChain(false);
            }
          }
          
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
    setMessages(prevMessages => {
      return prevMessages.map(msg => {
        if (msg.isStreaming) {
          return {
            ...msg,
            isStreaming: false,
            id: Date.now().toString()
          };
        }
        return msg;
      });
    });
    setIsStreaming(false);
  };

  const handleRelatedQuestionClick = (question: string) => {
    setCurrentMessage(question);
    handleSubmit(undefined, question);
  };

  const handleEditMessage = (messageId: string, content: string, isInPlace: boolean = false) => {
    if (isInPlace) {
      setActiveEditId(messageId);
    } else {
      setCurrentMessage(content);
      setEditingMessageId(messageId);
      
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }
  };

  const handleCancelEdit = (messageId: string) => {
    setActiveEditId(null);
  };

  const handleSaveEdit = (messageId: string, newContent: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;
    
    const originalMessage = messages[messageIndex];
    const updatedMessages = [...messages];
    
    const history = originalMessage.editHistory || [];
    
    if (!originalMessage.isEdited) {
      history.push({
        id: originalMessage.id,
        content: originalMessage.content,
        timestamp: originalMessage.timestamp
      });
    } else {
      history.push({
        id: originalMessage.id,
        content: originalMessage.content,
        timestamp: new Date()
      });
    }
    
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: newContent,
      isEdited: true,
      editHistory: history,
      editHistoryIndex: history.length
    };
    
    setMessages(updatedMessages);
    setActiveEditId(null);
    
    const childMessageIds = findChildMessages(originalMessage.id);
    
    if (childMessageIds.length > 0) {
      const nextMessageId = childMessageIds[0];
      toast.info("Regenerating conversation chain...", {
        duration: 3000,
      });
      
      setIsRegeneratingChain(true);
      regenerateMessageChain(nextMessageId, updatedMessages).then(() => {
        setIsRegeneratingChain(false);
      });
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].role !== 'assistant') return;

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
          // Get the correct content
          let content = message.content;
          
          if (index > 0 && message.alternativeResponses && index <= message.alternativeResponses.length) {
            content = message.alternativeResponses[index - 1];
          } else if (index === 0 && message.alternativeResponses && message.alternativeResponses.length > 0) {
            // Index 0 means the original response before regenerations
            content = message.alternativeResponses[message.alternativeResponses.length - 1];
          }
          
          return {
            ...message,
            currentResponseIndex: index,
            content: content
          };
        }
        return message;
      });
    });
    
    // If we're in a branch, find the next message in this branch
    const branchId = findBranchForMessage(messageId);
    if (branchId) {
      const branch = conversationBranches.find(b => b.id === branchId);
      if (branch) {
        const msgIndex = branch.messageIds.indexOf(messageId);
        if (msgIndex !== -1 && msgIndex < branch.messageIds.length - 1) {
          const nextMessageId = branch.messageIds[msgIndex + 1];
          
          toast.info("Regenerating conversation chain...", {
            duration: 3000,
          });
          
          setIsRegeneratingChain(true);
          regenerateMessageChain(nextMessageId).then(() => {
            setIsRegeneratingChain(false);
          });
        }
      }
    } else {
      // Fallback to old behavior
      const childMessageIds = findChildMessages(messageId);
      
      if (childMessageIds.length > 0) {
        const nextMessageId = childMessageIds[0];
        
        toast.info("Regenerating conversation chain...", {
          duration: 3000,
        });
        
        setIsRegeneratingChain(true);
        regenerateMessageChain(nextMessageId).then(() => {
          setIsRegeneratingChain(false);
        });
      }
    }
  };

  const handleNavigateEditHistory = (messageId: string, direction: "prev" | "next") => {
    setMessages(prevMessages => {
      return prevMessages.map(message => {
        if (message.id === messageId) {
          const currentIndex = message.editHistoryIndex || 0;
          const history = message.editHistory || [];
          const totalVersions = history.length + 1;
          
          let newIndex = currentIndex;
          if (direction === "prev" && currentIndex > 0) {
            newIndex = currentIndex - 1;
          } else if (direction === "next" && currentIndex < totalVersions - 1) {
            newIndex = currentIndex + 1;
          }
          
          let newContent = message.content;
          
          if (newIndex < history.length) {
            newContent = history[newIndex].content;
          } else if (newIndex === history.length) {
            newContent = message.content;
          }
          
          return {
            ...message,
            content: newContent,
            editHistoryIndex: newIndex
          };
        }
        return message;
      });
    });
  };

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

  // New method to switch between question versions
  const handleSwitchQuestionVersion = (messageId: string, version: number) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message) return;
    
    // Find all branches related to this question
    const relatedBranches = conversationBranches.filter(branch => 
      branch.questionId === messageId || branch.questionId === message.parentMessageId
    );
    
    // Find the branch for the selected version
    const targetBranch = relatedBranches.find(branch => 
      branch.questionVersion === version
    );
    
    if (targetBranch) {
      switchToBranch(targetBranch.id);
      
      // Update UI to show the messages are from a different branch
      setMessages(prevMessages => 
        prevMessages.map(msg => ({
          ...msg,
          isHidden: !targetBranch.messageIds.includes(msg.id) && 
                    relatedBranches.some(branch => branch.messageIds.includes(msg.id))
        }))
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
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
              
              <SearchSuggestions 
                onSelectSuggestion={handleRelatedQuestionClick}
                autoSubmit={true}
              />
            </div>
          ) : (
            getVisibleMessages().map((message, index) => {
              if (message.isHidden) return null;
              
              if (activeEditId) {
                const activeEditIndex = messages.findIndex(m => m.id === activeEditId);
                if (activeEditIndex !== -1 && message.branchId !== messages[activeEditIndex].branchId) {
                  return null;
                }
              }
              
              return (
                <div key={message.id} className="message-container" data-message-id={message.id}>
                  {message.role === "assistant" && message.isStreaming ? (
                    <div className="flex justify-start">
                      <div className="max-w-3/4 rounded-lg p-4 bg-secondary border border-border">
                        {message.hasRealTimeData && (
                          <div className="mb-3 text-xs flex items-center gap-1 text-nexus-purple">
                            <Globe className="h-3 w-3" />
                            <span>Enhanced with real-time web data</span>
                          </div>
                        )}
                        
                        <TypewriterEffect 
                          text={message.content}
                          isStreaming={true}
                          className="conversation-markdown"
                        />
                        
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
                      isActivelyEditing={message.id === activeEditId}
                      onInPlaceEdit={handleEditMessage}
                      onCancelEdit={handleCancelEdit}
                      onSaveEdit={handleSaveEdit}
                      editHistoryIndex={message.editHistoryIndex || 0}
                      editVersionCount={(message.editHistory?.length || 0) + 1}
                      onNavigateEditHistory={handleNavigateEditHistory}
                      // New props for branching conversations
                      questionVersion={message.questionVersion}
                      branchId={message.branchId}
                      onSwitchQuestionVersion={(version) => handleSwitchQuestionVersion(message.id, version)}
                    />
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
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
            disabled={isStreaming || isRegeneratingChain || activeEditId !== null}
          />
          <Button 
            type="submit" 
            className="h-full bg-nexus-purple hover:bg-nexus-deep-purple flex-shrink-0"
            disabled={isLoading || isStreaming || isRegeneratingChain || activeEditId !== null}
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
      
      <div className="h-20"></div>
    </div>
  );
};

export default NexusChat;
