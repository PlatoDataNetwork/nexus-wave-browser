
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Zap } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import ConversationMessage from './ConversationMessage';
import TypewriterEffect from './TypewriterEffect';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ChatMessage, ConversationBranch, Source, EditHistoryItem } from './types';

// Sample related questions
const SAMPLE_RELATED_QUESTIONS = [
  "What are the benefits of decentralized finance?",
  "How do blockchain transactions work?",
  "What is the difference between Bitcoin and Ethereum?",
  "Explain smart contracts in simple terms"
];

interface NexusChatProps {
  onSearch?: (query: string) => void;
}

const NexusChat: React.FC<NexusChatProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingDots, setLoadingDots] = useState(0);
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>(SAMPLE_RELATED_QUESTIONS);
  
  // Branching conversation state
  const [conversationBranches, setConversationBranches] = useState<ConversationBranch[]>([
    // Initialize with a default branch
    {
      id: 'default-branch',
      questionId: 'root',
      questionVersion: 0,
      messageIds: []
    }
  ]);
  const [activeBranchId, setActiveBranchId] = useState('default-branch');
  const [questionVersionCount, setQuestionVersionCount] = useState<Record<string, number>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Effect for animating loading dots
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingDots((prev) => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);
  
  // Effect for scrolling to bottom when messages change
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
  
  // Get the current branch object
  const getCurrentBranch = (): ConversationBranch | undefined => {
    return conversationBranches.find(branch => branch.id === activeBranchId);
  };

  // Helper function to find messages in the active branch
  const getVisibleMessages = () => {
    const currentBranch = getCurrentBranch();
    if (!currentBranch) return [];
    
    return messages.filter(message => 
      currentBranch.messageIds.includes(message.id)
    );
  };
  
  // Helper function to get available versions for a question
  const getAvailableVersionsForQuestion = (questionId: string) => {
    const branches = conversationBranches.filter(branch => branch.questionId === questionId);
    return branches.map(branch => branch.questionVersion).sort((a, b) => a - b);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue || isLoading) return;
    
    // If onSearch is provided, call it with the input value
    if (onSearch) {
      onSearch(trimmedValue);
    }
    
    const userMessageId = uuidv4();
    const currentBranch = getCurrentBranch();
    
    // Determine question version
    const newQuestionVersion = questionVersionCount[userMessageId] || 0;
    
    // Create a new message object
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: trimmedValue,
      timestamp: new Date(),
      questionVersion: newQuestionVersion,
      branchId: activeBranchId
    };
    
    // Update the messages state
    setMessages(prev => [...prev, newUserMessage]);
    
    // Add the message to the current branch
    addMessageToBranch(activeBranchId, userMessageId);
    
    // Clear input
    setInputValue("");
    
    // Generate AI response (simulated)
    simulateAIResponse(userMessageId);
  };
  
  // Simulate AI response generation
  const simulateAIResponse = async (questionId: string) => {
    setIsLoading(true);
    
    try {
      // Add delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const responseId = uuidv4();
      const responseMessage: ChatMessage = {
        id: responseId,
        role: "assistant",
        content: generateRandomResponse(),
        timestamp: new Date(),
        hasRealTimeData: Math.random() > 0.5,
        questionId: questionId,
        questionVersion: messages.find(m => m.id === questionId)?.questionVersion || 0,
        branchId: activeBranchId
      };
      
      setMessages(prev => [...prev, responseMessage]);
      addMessageToBranch(activeBranchId, responseId);
      
      // Also generate new related questions
      setRelatedQuestions(generateRelatedQuestions());
    } catch (error) {
      toast("Error: Failed to generate response");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle related question click
  const handleRelatedQuestionClick = (question: string) => {
    setInputValue(question);
    // Focus the input
    inputRef.current?.focus();
  };
  
  // Handle regenerating a message
  const handleRegenerateMessage = async (messageId: string) => {
    // Find the message to regenerate
    const messageToRegenerate = messages.find(msg => msg.id === messageId);
    
    if (!messageToRegenerate || messageToRegenerate.role !== "assistant") return;
    
    // Store the current response as an alternative
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        const alternativeResponses = msg.alternativeResponses || [];
        return {
          ...msg,
          alternativeResponses: [...alternativeResponses, msg.content],
          currentResponseIndex: 0
        };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
    
    // Generate a new response
    setIsLoading(true);
    
    try {
      // Add delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newContent = generateRandomResponse();
      
      // Update the message with the new content
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            content: newContent
          };
        }
        return msg;
      }));
    } catch (error) {
      toast("Error: Failed to regenerate response");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle selecting an alternative response
  const handleSelectAlternative = (index: number) => {
    setMessages(prev => prev.map(msg => {
      if (msg.alternativeResponses && msg.alternativeResponses.length > 0) {
        // If selecting the original response (index 0)
        if (index === 0) {
          const originalContent = msg.alternativeResponses[0];
          const remainingAlternatives = msg.alternativeResponses.slice(1);
          return {
            ...msg,
            content: originalContent,
            alternativeResponses: [msg.content, ...remainingAlternatives.slice(0, -1)],
            currentResponseIndex: index
          };
        }
        
        // If selecting an alternative
        const actualIndex = index - 1;
        if (actualIndex < msg.alternativeResponses.length) {
          const selectedContent = msg.alternativeResponses[actualIndex];
          const newAlternatives = [...msg.alternativeResponses];
          newAlternatives[actualIndex] = msg.content;
          
          return {
            ...msg,
            content: selectedContent,
            alternativeResponses: newAlternatives,
            currentResponseIndex: index
          };
        }
      }
      return msg;
    }));
  };
  
  // Handle in-place editing of a message
  const handleInPlaceEdit = (messageId: string, content: string) => {
    const messageToEdit = messages.find(msg => msg.id === messageId);
    
    if (!messageToEdit || messageToEdit.role !== "user") return;
    
    // Update the message to indicate it's being edited
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          isActivelyEditing: true
        };
      }
      return msg;
    }));
  };
  
  // Handle canceling the edit
  const handleCancelEdit = (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          isActivelyEditing: false
        };
      }
      return msg;
    }));
  };
  
  // Handle saving the edit
  const handleSaveEdit = (messageId: string, newContent: string) => {
    // Find the message to edit
    const messageToEdit = messages.find(msg => msg.id === messageId);
    
    if (!messageToEdit || messageToEdit.role !== "user") return;
    
    // Check if this edit should create a new branch
    const questionId = messageId;
    const currentVersion = messageToEdit.questionVersion || 0;
    const newVersion = currentVersion + 1;
    
    // Update question version count
    setQuestionVersionCount(prev => ({
      ...prev,
      [questionId]: newVersion
    }));
    
    // Create a new branch for this edited question
    const newBranchId = createNewBranch(questionId, newVersion);
    
    // Add this message as the first message in the new branch
    const newEditHistory: EditHistoryItem = {
      id: uuidv4(),
      content: messageToEdit.content,
      timestamp: new Date()
    };
    
    // Update the message with the new content and history
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          content: newContent,
          isActivelyEditing: false,
          isEdited: true,
          questionVersion: newVersion,
          branchId: newBranchId,
          editHistory: [
            ...(msg.editHistory || []),
            newEditHistory
          ]
        };
      }
      return msg;
    }));
    
    // Add the message to the new branch
    addMessageToBranch(newBranchId, messageId);
    
    // Switch to the new branch
    switchToBranch(newBranchId);
    
    // Generate a new AI response for the edited message
    simulateAIResponse(messageId);
  };
  
  // Handle navigating through edit history
  const handleNavigateEditHistory = (messageId: string, direction: "prev" | "next") => {
    // Find the message with the given ID
    const messageToNavigate = messages.find(msg => msg.id === messageId);
    
    if (!messageToNavigate || !messageToNavigate.editHistory) return;
    
    // Find the branch for this message version
    const branchId = findBranchForMessage(messageId);
    if (!branchId) return;
    
    const branch = conversationBranches.find(b => b.id === branchId);
    if (!branch) return;
    
    // Find branches with the same questionId but different versions
    const questionBranches = conversationBranches.filter(
      b => b.questionId === branch.questionId
    ).sort((a, b) => a.questionVersion - b.questionVersion);
    
    // Find current index
    const currentBranchIndex = questionBranches.findIndex(b => b.id === branchId);
    if (currentBranchIndex === -1) return;
    
    // Calculate the new index based on direction
    const newIndex = direction === "prev" 
      ? Math.max(0, currentBranchIndex - 1)
      : Math.min(questionBranches.length - 1, currentBranchIndex + 1);
    
    // Switch to the branch at the new index if different from current
    if (newIndex !== currentBranchIndex) {
      const targetBranch = questionBranches[newIndex];
      switchToBranch(targetBranch.id);
    }
  };
  
  // Handle switching question versions
  const handleSwitchQuestionVersion = (version: number) => {
    const currentBranch = getCurrentBranch();
    if (!currentBranch) return;
    
    // Find the branch with the same question ID and the specified version
    const targetBranch = conversationBranches.find(
      branch => branch.questionId === currentBranch.questionId && 
                branch.questionVersion === version
    );
    
    if (targetBranch) {
      switchToBranch(targetBranch.id);
    }
  };
  
  // Generate random response for demo
  const generateRandomResponse = () => {
    const responses = [
      "Nexus is a privacy-focused browser with built-in Web3 capabilities. It's designed to protect your digital identity while enabling seamless interaction with decentralized applications.",
      "The key features of Nexus include end-to-end encryption, a built-in cryptocurrency wallet, decentralized identity management, and protection against tracking and fingerprinting.",
      "Nexus differs from traditional browsers by prioritizing user privacy and ownership of data. It integrates blockchain technology directly into the browsing experience, allowing for secure transactions and identity verification without relying on centralized authorities.",
      "Web3 refers to the next generation of the internet, built on decentralized protocols. It aims to reduce reliance on large tech companies by enabling direct peer-to-peer interactions and user ownership of data and digital assets."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  // Generate related questions for demo
  const generateRelatedQuestions = () => {
    const allQuestions = [
      "How does Nexus protect my privacy?",
      "What cryptocurrencies are supported by Nexus?",
      "Can I import my bookmarks from another browser?",
      "How do I connect to a decentralized application?",
      "What is the difference between Web2 and Web3?",
      "How secure is the Nexus browser?",
      "Does Nexus block all advertisements?",
      "How can I stake tokens in Nexus?"
    ];
    
    // Shuffle and take first 4
    return [...allQuestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  };
  
  // Get the visible messages for the current branch
  const visibleMessages = getVisibleMessages();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {visibleMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md text-center px-4 py-10">
                <Zap className="mx-auto h-12 w-12 text-nexus-purple mb-4" />
                <h2 className="text-2xl font-bold mb-2">Nexus Search</h2>
                <p className="text-muted-foreground mb-6">
                  Ask anything about Web3, crypto, or blockchain technology. Nexus AI will provide you with accurate, up-to-date information.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {relatedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left justify-start h-auto py-2"
                      onClick={() => handleRelatedQuestionClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-4">
              {visibleMessages.map((message) => {
                // Find which branch this message belongs to
                const messageBranchId = findBranchForMessage(message.id);
                const messageBranch = conversationBranches.find(b => b.id === messageBranchId);
                
                // Get all available versions for this question if it's a user message
                const availableVersions = message.role === "user" && messageBranch
                  ? getAvailableVersionsForQuestion(message.id)
                  : [];
                
                return (
                  <ConversationMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    sources={message.sources}
                    hasRealTimeData={message.hasRealTimeData}
                    messageId={message.id}
                    onRegenerateMessage={handleRegenerateMessage}
                    alternativeResponses={message.alternativeResponses || []}
                    currentResponseIndex={message.currentResponseIndex || 0}
                    onSelectAlternative={handleSelectAlternative}
                    relatedQuestions={message.role === "assistant" ? relatedQuestions : []}
                    onRelatedQuestionClick={handleRelatedQuestionClick}
                    isEdited={message.isEdited}
                    editHistory={message.editHistory}
                    isActivelyEditing={message.isActivelyEditing}
                    onInPlaceEdit={handleInPlaceEdit}
                    onCancelEdit={handleCancelEdit}
                    onSaveEdit={handleSaveEdit}
                    editHistoryIndex={messageBranch ? messageBranch.questionVersion : 0}
                    editVersionCount={message.role === "user" ? (availableVersions.length || 1) : 1}
                    onNavigateEditHistory={handleNavigateEditHistory}
                    questionVersion={messageBranch ? messageBranch.questionVersion : 0}
                    branchId={messageBranchId || undefined}
                    onSwitchQuestionVersion={handleSwitchQuestionVersion}
                    availableQuestionVersions={availableVersions}
                    isRegeneratingChain={isLoading}
                  />
                );
              })}
              <div ref={messagesEndRef} />
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg p-4 bg-secondary animate-pulse">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>
                        Generating response
                        {'.'.repeat(loadingDots)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={inputRef}
            placeholder="Ask anything about Web3, blockchain, or crypto..."
            value={inputValue}
            onChange={handleInputChange}
            className="min-h-10 flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-10 w-10 shrink-0 rounded-full"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NexusChat;
