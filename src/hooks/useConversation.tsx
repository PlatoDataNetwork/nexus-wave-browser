import { useState, useCallback, useRef } from 'react';
import { toast } from "sonner";
import { classifyQuery } from '@/utils/queryClassifier';
import { getRealTimeData } from '@/utils/realTimeData';
import { getChatGPTResponseWithRealTimeData, getStreamingResponse } from '@/utils/openai';
import { ChatMessage } from '@/types';

interface UseConversationProps {
  onSearch?: (query: string) => void;
}

export const useConversation = ({ onSearch }: UseConversationProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isFetchingRealTimeData, setIsFetchingRealTimeData] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  
  // Reference to track ongoing requests that can be canceled
  const activeRequestsRef = useRef<AbortController | null>(null);
  
  // State to maintain conversation history for GPT
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  // Generate related questions in parallel
  const generateRelatedQuestions = useCallback(async (userMessage: string, aiResponse: string): Promise<string[]> => {
    try {
      // Skip related questions if we're currently handling another request
      if (isLoading) return [];
      
      // Create a prompt specifically for related questions
      const relatedQuestionsPrompt = 
        "Based on the user's query and your response, generate 3 follow-up questions that the USER might want to ask next. " +
        "These should be phrased from the user's perspective (first person), be relevant to continuing the conversation, " +
        "and provide natural next steps in the conversation. " +
        "Return ONLY a JSON array with no additional text. Format: [\"Question 1?\", \"Question 2?\", \"Question 3?\"]";
      
      // Include just enough context for good question generation
      const contextForQuestions = [
        { role: "user" as const, content: userMessage },
        { role: "assistant" as const, content: aiResponse.substring(0, 500) }, // Use only the first part of the response
        { role: "user" as const, content: relatedQuestionsPrompt }
      ];
      
      const questionsResponse = await getChatGPTResponseWithRealTimeData(
        relatedQuestionsPrompt,
        contextForQuestions,
        null
      );
      
      // Parse the response to get the questions array
      try {
        const jsonMatch = questionsResponse.match(/\[\s*"[^"]+(?:",\s*"[^"]+")*\s*\]/);
        if (jsonMatch) {
          const questionsArray = JSON.parse(jsonMatch[0]);
          return questionsArray.slice(0, 3);
        }
        
        // Fallback method if the regex doesn't match
        const cleanedResponse = questionsResponse.replace(/^```json\s*|\s*```$/g, '');
        const questions = JSON.parse(cleanedResponse);
        return Array.isArray(questions) ? questions.slice(0, 3) : [];
      } catch (error) {
        console.error("Failed to parse related questions:", error);
        // Extract questions using simple heuristics as fallback
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
  }, [isLoading]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!currentMessage.trim()) return;
    
    // Cancel any in-flight requests
    if (activeRequestsRef.current) {
      activeRequestsRef.current.abort();
    }
    activeRequestsRef.current = new AbortController();
    
    // Performance tracking
    const startTime = performance.now();
    console.time('total-response-time');
    
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
    
    const messageToSearch = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);
    
    // Create placeholder for assistant response
    const assistantMessageId = `asst-${Date.now().toString()}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
      processingStage: 'initializing',
      progressPercentage: 5,
      stageDetails: "Preparing your response...",
      isStreaming: true
    };
    
    setMessages(prevMessages => [...prevMessages, assistantMessage]);
    
    try {
      // Start ALL processes in parallel
      
      // 1. PARALLEL: Start classification
      setIsClassifying(true);
      const classificationPromise = classifyQuery(messageToSearch)
        .then(classification => {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === assistantMessageId
                ? { 
                    ...msg, 
                    processingStage: 'classifying',
                    progressPercentage: 25,
                    stageDetails: "Analyzing your query..."
                  }
                : msg
            )
          );
          return classification;
        })
        .catch(error => {
          console.error("Classification error:", error);
          // Return default classification on error
          return {
            needsRealTimeData: false,
            confidence: 0.5,
            topics: [],
            suggestedSearchTerms: [messageToSearch]
          };
        })
        .finally(() => {
          setIsClassifying(false);
        });
      
      // 2. PARALLEL: Update conversation history with the new user message
      const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageToSearch }];
      
      // 3. Start showing the streaming response immediately while we wait for classification
      // Set up a callback to handle streaming tokens
      let streamedContent = '';
      
      const handleToken = (token: string) => {
        streamedContent += token;
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === assistantMessageId
              ? { 
                  ...msg, 
                  content: streamedContent,
                  processingStage: 'streaming',
                  progressPercentage: 40 + (streamedContent.length / 10), // Incremental progress
                  stageDetails: "Generating your response..."
                }
              : msg
          )
        );
      };
      
      // 4. PARALLEL: Start initial streaming response without real-time data
      // This gives immediate feedback while we wait for classification and data fetching
      const initialStreamPromise = getStreamingResponse(
        messageToSearch,
        updatedHistory,
        handleToken
      ).catch(error => {
        console.error("Initial streaming error:", error);
      });
      
      // 5. Wait for classification to complete
      const classification = await classificationPromise;
      
      // 6. CONDITIONAL PARALLEL: If needed, fetch real-time data
      let realTimeData = null;
      if (classification.needsRealTimeData) {
        setIsFetchingRealTimeData(true);
        
        // Update progress
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === assistantMessageId
              ? { 
                  ...msg, 
                  processingStage: 'searching',
                  progressPercentage: 60,
                  stageDetails: "Searching for real-time data..."
                }
              : msg
          )
        );
        
        // Show loading toast for real-time data
        toast("Fetching real-time data...", {
          duration: 2000,
          icon: <span className="h-4 w-4" />
        });
        
        // Fetch real-time data
        realTimeData = await getRealTimeData(messageToSearch, classification)
          .catch(error => {
            console.error("Real-time data error:", error);
            return null;
          })
          .finally(() => {
            setIsFetchingRealTimeData(false);
          });
        
        // Update progress
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === assistantMessageId
              ? { 
                  ...msg, 
                  processingStage: 'processing',
                  progressPercentage: 70,
                  stageDetails: "Processing information..."
                }
              : msg
          )
        );
        
        if (realTimeData) {
          toast("Found real-time information", {
            duration: 2000,
            icon: <span className="h-4 w-4 text-nexus-purple" />
          });
          
          // If we have real-time data, generate a more informed response
          // But we already have a basic streaming response showing, so users see something
          streamedContent = '';
          const realTimeStreamPromise = getStreamingResponse(
            messageToSearch,
            updatedHistory,
            handleToken,
            realTimeData
          ).catch(error => {
            console.error("Real-time streaming error:", error);
          });
          
          // Wait for streaming to complete
          await realTimeStreamPromise;
        }
      } else {
        // If we don't need real-time data, wait for the initial streaming to complete
        await initialStreamPromise;
      }
      
      // Create sources from real-time data for citation
      const sources = realTimeData?.sources || [];
      
      // 7. PARALLEL: Generate related questions while updating the UI
      const relatedQuestionsPromise = generateRelatedQuestions(messageToSearch, streamedContent)
        .catch(error => {
          console.error("Related questions error:", error);
          return [];
        });
      
      // Update progress to complete
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                processingStage: 'finalizing',
                progressPercentage: 90,
                stageDetails: "Finishing up..."
              }
            : msg
        )
      );
      
      // 8. Wait for related questions
      const relatedQuestions = await relatedQuestionsPromise;
      
      // Update conversation history with assistant response
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant" as const, content: streamedContent }
      ]);
      
      // Add AI response to conversation UI - final version
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? {
                id: assistantMessageId,
                role: "assistant",
                content: streamedContent,
                timestamp: new Date(),
                sources: sources.length > 0 ? sources : undefined,
                hasRealTimeData: !!realTimeData,
                alternativeResponses: [],
                currentResponseIndex: 0,
                relatedQuestions: relatedQuestions,
                processingStage: 'complete',
                progressPercentage: 100,
                isLoading: false,
                isStreaming: false
              } 
            : msg
        )
      );
      
      // Log performance metrics
      const totalTime = performance.now() - startTime;
      console.timeEnd('total-response-time');
      console.log(`Total response generated in ${(totalTime/1000).toFixed(2)}s`);
      
    } catch (error) {
      console.error("AI error:", error);
      toast("Failed to fetch response. Please try again later.");
      
      // Add a fallback response
      const fallbackResponse: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "I'm sorry, but I encountered an issue while processing your request. Please try again later.",
        timestamp: new Date(),
        processingStage: 'complete',
        progressPercentage: 100,
        isLoading: false,
        isStreaming: false
      };
      
      setMessages(prev => 
        prev.map(msg => msg.id === assistantMessageId ? fallbackResponse : msg)
      );
    } finally {
      setIsLoading(false);
      activeRequestsRef.current = null;
    }
  }, [conversationHistory, currentMessage, generateRelatedQuestions, onSearch]);

  const handleRelatedQuestionClick = useCallback((question: string) => {
    setCurrentMessage(question);
    // Automatically submit after a brief delay
    setTimeout(() => handleSubmit(), 50);
  }, [handleSubmit]);

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
    
    // Update message to show processing state
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId
          ? { 
              ...msg, 
              isLoading: true,
              content: "Regenerating response...",
              processingStage: 'classifying',
              progressPercentage: 15,
              stageDetails: "Starting regeneration process..."
            }
          : msg
      )
    );
    
    try {
      // Get real-time data if the original response had it
      let realTimeData = null;
      
      if (currentAssistantMessage.hasRealTimeData) {
        try {
          setIsFetchingRealTimeData(true);
          
          // Update progress
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === messageId
                ? { 
                    ...msg, 
                    processingStage: 'searching',
                    progressPercentage: 40,
                    stageDetails: "Refreshing real-time information..."
                  }
                : msg
            )
          );
          
          const classification = await classifyQuery(userMessage.content);
          realTimeData = await getRealTimeData(userMessage.content, classification);
          
          // Update progress
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === messageId
                ? { 
                    ...msg, 
                    processingStage: 'processing',
                    progressPercentage: 60,
                    stageDetails: "Processing updated information..."
                  }
                : msg
            )
          );
        } catch (error) {
          console.error("Error fetching real-time data for regeneration:", error);
        } finally {
          setIsFetchingRealTimeData(false);
        }
      }
      
      // Update progress
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId
            ? { 
                ...msg, 
                processingStage: 'generating',
                progressPercentage: 75,
                stageDetails: "Creating alternative response..."
              }
            : msg
        )
      );
      
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
      
      // Update progress to complete
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId
            ? { 
                ...msg, 
                processingStage: 'complete',
                progressPercentage: 100,
                stageDetails: "Regeneration complete"
              }
            : msg
        )
      );
      
      // Create new AI response
      const regeneratedResponse: ChatMessage = {
        id: messageId,
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : currentAssistantMessage.sources,
        hasRealTimeData: !!realTimeData || currentAssistantMessage.hasRealTimeData,
        alternativeResponses: alternatives,
        currentResponseIndex: 0,
        relatedQuestions: relatedQuestions,
        processingStage: 'complete',
        progressPercentage: 100,
        isLoading: false
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
      
      // Update the message to show error
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId
            ? { 
                ...msg, 
                isLoading: false,
                content: "Failed to regenerate response. Please try again.",
                processingStage: 'complete',
                progressPercentage: 100
              }
            : msg
        )
      );
      
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

  return {
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
  };
};
