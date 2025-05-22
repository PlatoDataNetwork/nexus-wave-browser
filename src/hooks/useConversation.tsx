import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { classifyQuery, classifyQueryWithContext, shouldPerformWebSearch } from '@/utils/queryClassifier';
import { getRealTimeData } from '@/utils/realTimeData';
import { getChatGPTResponseWithRealTimeData, getStreamingResponse } from '@/utils/openai';
import { isSimilarString } from '@/utils/stringUtils';

interface UseConversationProps {
  onSearch?: (query: string) => void;
  initialMessage?: string;
}

export const useConversation = ({ onSearch, initialMessage = '' }: UseConversationProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isFetchingRealTimeData, setIsFetchingRealTimeData] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isPromptOrFollowupQuestion, setIsPromptOrFollowupQuestion] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{title: string, url: string, snippet: string}>>([]);
  const [processingType, setProcessingType] = useState<'individual' | 'contextual'>('individual');
  const [needsRealTimeData, setNeedsRealTimeData] = useState<boolean>(false);
  // New state for tracking suggested and clicked questions
  const [suggestedQuestionsHistory, setSuggestedQuestionsHistory] = useState<Set<string>>(new Set());
  const [clickedQuestionsHistory, setClickedQuestionsHistory] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Reference to track ongoing requests that can be canceled
  const activeRequestsRef = useRef<AbortController | null>(null);
  
  // Track if the related question is being submitted to avoid multiple submissions
  const isSubmittingRelatedRef = useRef<boolean>(false);
  
  // State to maintain conversation history for GPT
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  // Reset the isPromptOrFollowupQuestion flag when the user types
  useEffect(() => {
    // If the current message is being typed by the user, it's not a prompt or follow-up
    if (currentMessage !== initialMessage) {
      setIsPromptOrFollowupQuestion(false);
    }
  }, [currentMessage, initialMessage]);

  // Debug log auto-submission behavior
  useEffect(() => {
    console.log('isPromptOrFollowupQuestion:', isPromptOrFollowupQuestion);
  }, [isPromptOrFollowupQuestion]);

  // Generate related questions in parallel with improved context and deduplication
  const generateRelatedQuestions = useCallback(async (userMessage: string, aiResponse: string): Promise<string[]> => {
    try {
      // Skip related questions if we're currently handling another request
      if (isLoading) return [];
      
      // Get recent conversation history for better context (last 3-5 exchanges)
      const recentConversation = conversationHistory.slice(-6); // Last 3 exchanges (3 user, 3 assistant)
      
      // Create a set of all previously suggested questions for deduplication
      const allSuggestedQuestions = new Set(suggestedQuestionsHistory);
      const allClickedQuestions = new Set(clickedQuestionsHistory);
      
      // Create a prompt specifically for related questions with improved instructions
      const relatedQuestionsPrompt = 
        "Based on the user's queries and your responses in this conversation, generate 3 follow-up questions " +
        "that the USER might want to ask next. These questions should:\n" +
        "1. Be phrased from the user's perspective (first person)\n" +
        "2. Be relevant to continuing the conversation\n" +
        "3. Provide natural next steps that explore new aspects of the topic\n" +
        "4. NOT repeat or closely resemble any previously suggested questions\n" +
        "5. Be specific and focused rather than generic\n\n" +
        
        `Previously suggested questions: ${Array.from(allSuggestedQuestions).join("; ")}\n` +
        `Previously clicked questions: ${Array.from(allClickedQuestions).join("; ")}\n\n` +
        
        "Return ONLY a JSON array with no additional text. Format: [\"Question 1?\", \"Question 2?\", \"Question 3?\"]";
      
      // Include more context for better question generation
      const contextForQuestions = [
        ...recentConversation,
        { role: "user" as const, content: userMessage },
        { role: "assistant" as const, content: aiResponse.substring(0, 800) }, // Use more of the response
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
          const filteredQuestions = deduplicateQuestions(questionsArray);
          
          // Update suggested questions history
          setSuggestedQuestionsHistory(prev => {
            const newSet = new Set(prev);
            filteredQuestions.forEach(q => newSet.add(q));
            return newSet;
          });
          
          return filteredQuestions;
        }
        
        // Fallback method if the regex doesn't match
        const cleanedResponse = questionsResponse.replace(/^```json\s*|\s*```$/g, '');
        const questions = JSON.parse(cleanedResponse);
        const filteredQuestions = deduplicateQuestions(Array.isArray(questions) ? questions : []);
        
        // Update suggested questions history
        setSuggestedQuestionsHistory(prev => {
          const newSet = new Set(prev);
          filteredQuestions.forEach(q => newSet.add(q));
          return newSet;
        });
        
        return filteredQuestions;
      } catch (error) {
        console.error("Failed to parse related questions:", error);
        // Extract questions using simple heuristics as fallback
        const questionRegex = /(?:^|\n)["']?([^"'\n]+\?)/g;
        const questions = [];
        let match;
        while ((match = questionRegex.exec(questionsResponse)) !== null && questions.length < 3) {
          questions.push(match[1]);
        }
        
        const filteredQuestions = deduplicateQuestions(questions);
        
        // Update suggested questions history
        setSuggestedQuestionsHistory(prev => {
          const newSet = new Set(prev);
          filteredQuestions.forEach(q => newSet.add(q));
          return newSet;
        });
        
        return filteredQuestions;
      }
    } catch (error) {
      console.error("Error generating related questions:", error);
      return [];
    }
  }, [isLoading, conversationHistory, suggestedQuestionsHistory, clickedQuestionsHistory]);

  // Helper function to deduplicate questions
  const deduplicateQuestions = useCallback((questions: string[]): string[] => {
    // Filter out questions that are too similar to previously suggested or clicked questions
    const result: string[] = [];
    const allPreviousQuestions = new Set([
      ...Array.from(suggestedQuestionsHistory), 
      ...Array.from(clickedQuestionsHistory)
    ]);
    
    // First pass: filter out exact matches and very similar questions
    for (const question of questions) {
      // Skip if this is an exact match to a previous question
      if (allPreviousQuestions.has(question)) continue;
      
      // Check for similarity with previous questions
      let isTooSimilar = false;
      for (const prevQuestion of allPreviousQuestions) {
        if (isSimilarString(question, prevQuestion, 0.8)) {
          console.log(`Skipping similar question: "${question}" (too similar to "${prevQuestion}")`);
          isTooSimilar = true;
          break;
        }
      }
      
      if (!isTooSimilar) {
        result.push(question);
      }
    }
    
    // Second pass: ensure questions are different from each other
    const finalQuestions: string[] = [];
    for (const question of result) {
      let isDuplicate = false;
      for (const addedQuestion of finalQuestions) {
        if (isSimilarString(question, addedQuestion, 0.7)) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        finalQuestions.push(question);
      }
    }
    
    return finalQuestions.slice(0, 3); // Limit to 3 questions
  }, [suggestedQuestionsHistory, clickedQuestionsHistory]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!currentMessage.trim()) return;
    
    // Add debug for auto-submission tracking
    console.log('Submitting message:', currentMessage.substring(0, 30) + '...');
    
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
      processingType: 'individual', // Default, will be updated
      progressPercentage: 5,
      stageDetails: "Preparing your response...",
      isStreaming: true
    };
    
    setMessages(prevMessages => [...prevMessages, assistantMessage]);
    
    try {
      // Start ALL processes in parallel
      
      // 1. PARALLEL: Start enhanced classification with context awareness
      setIsClassifying(true);
      
      // Convert messages to format needed for classification
      const classificationPromise = classifyQueryWithContext(messageToSearch, messages)
        .then(enhancedClassification => {
          // Update processing type based on classification
          setProcessingType(enhancedClassification.processingType);
          
          // Set whether this query needs real-time data
          setNeedsRealTimeData(enhancedClassification.needsRealTimeData);
          
          // Update message to show progress and processing type
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === assistantMessageId
                ? { 
                    ...msg, 
                    processingStage: 'context-analysis',
                    processingType: enhancedClassification.processingType,
                    progressPercentage: 25,
                    stageDetails: enhancedClassification.processingType === 'contextual' 
                      ? "Analyzing conversation context..." 
                      : "Analyzing your query..."
                  }
                : msg
            )
          );
          
          return enhancedClassification;
        })
        .catch(error => {
          console.error("Enhanced classification error:", error);
          // Return default classification on error
          return {
            needsRealTimeData: false,
            confidence: 0.5,
            topics: [],
            suggestedSearchTerms: [messageToSearch],
            processingType: 'individual' as const,
            requiresWebSearch: false,
            relevantContextIndices: []
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
      
      // 5. Wait for enhanced classification to complete
      const enhancedClassification = await classificationPromise;
      
      // 6. Determine if web search is needed based on the enhanced classification
      const needsWebSearch = shouldPerformWebSearch(
        messageToSearch, 
        enhancedClassification, 
        messages.slice(-6) // Pass recent messages for context
      );
      
      // 7. CONDITIONAL PARALLEL: If needed, fetch real-time data
      let realTimeData = null;
      if (needsWebSearch) {
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
        toast({
          title: "Fetching real-time data...",
          duration: 2000,
        });
        
        // Use the classification result for better search terms
        realTimeData = await getRealTimeData(messageToSearch, enhancedClassification)
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
          toast({
            title: "Found real-time information",
            duration: 2000,
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
      
      // 8. PARALLEL: Generate related questions with our improved implementation
      // Pass more context to avoid duplicates
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
      
      // 9. Wait for related questions
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
                processingType: enhancedClassification.processingType,
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
      toast({
        title: "Failed to fetch response. Please try again later.",
        variant: "destructive",
      });
      
      // Add a fallback response
      const fallbackResponse: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "I'm sorry, but I encountered an issue while processing your request. Please try again later.",
        timestamp: new Date(),
        processingStage: 'complete',
        processingType: 'individual',
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
  }, [conversationHistory, currentMessage, generateRelatedQuestions, onSearch, toast, messages]);

  const handleRelatedQuestionClick = useCallback((question: string) => {
    // Prevent multiple submissions of the same related question
    if (isSubmittingRelatedRef.current || isLoading) {
      console.log('Preventing duplicate submission of related question');
      return;
    }
    
    console.log('Related question clicked:', question);
    
    // Set the flag to indicate this is a follow-up question
    setIsPromptOrFollowupQuestion(true);
    isSubmittingRelatedRef.current = true;
    
    // Add to clicked questions history
    setClickedQuestionsHistory(prev => {
      const newSet = new Set(prev);
      newSet.add(question);
      return newSet;
    });
    
    // Set the question as the current message
    setCurrentMessage(question);
    
    // Automatically submit after a brief delay
    setTimeout(() => {
      console.log('Auto-submitting related question');
      handleSubmit();
      
      // Reset the flag after submission
      setTimeout(() => {
        isSubmittingRelatedRef.current = false;
      }, 500);
    }, 100);
  }, [handleSubmit, isLoading]);

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
    toast({
      title: "Regenerating response...",
      duration: 3000,
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
      
      // Success toast - Fix the toast.success call
      toast({
        title: "Response regenerated",
        variant: "default",
      });
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
      
      // Error toast - Fix the toast.error call
      toast({
        title: "Failed to regenerate response",
        variant: "destructive",
      });
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

  // Handle initial message submission if provided
  useEffect(() => {
    if (initialMessage && initialMessage.trim() !== '') {
      // Set the flag to indicate this is an initial prompt
      setIsPromptOrFollowupQuestion(true);
      
      // We'll let NexusChat handle the actual submission
      console.log('Initial message in useConversation:', initialMessage);
    }
  }, [initialMessage]);

  // Add the search results to the state when getting real-time data
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.sources) {
        const formattedResults = lastMessage.sources.map(source => ({
          title: source.title || '',
          url: source.url || '',
          snippet: source.snippet || ''
        }));
        setSearchResults(formattedResults);
      }
    }
  }, [messages]);

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
    handleSelectAlternative,
    isPromptOrFollowupQuestion,
    searchResults,
    processingType,
    needsRealTimeData,
    suggestedQuestionsHistory,
    clickedQuestionsHistory
  };
};
