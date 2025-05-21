
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '@/lib/categoryData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Category not found</h2>
        <Button onClick={() => navigate('/search?tab=wave')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>
    );
  }
  
  const Icon = category.icon;
  const promptsPerPage = 6;
  const totalPages = Math.ceil(category.prompts.length / promptsPerPage);
  const currentPrompts = category.prompts.slice(
    currentPage * promptsPerPage, 
    (currentPage + 1) * promptsPerPage
  );
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };
  
  const handlePromptClick = (promptText: string) => {
    setUserInput(promptText);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    toast.success("Processing your prompt");
    // In a real implementation, this would send the prompt to an API
    console.log("Submitted prompt:", userInput);
  };
  
  return (
    <div className="p-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/search?tab=wave')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className={`p-2 rounded-full ${category.color} bg-opacity-20`}>
          <Icon className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">{category.name}</h1>
      </div>
      
      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {currentPrompts.map((prompt) => (
          <Card 
            key={prompt.id} 
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => handlePromptClick(prompt.text)}
          >
            <CardContent className="p-4">
              <p>{prompt.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={handlePrevPage} 
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button 
          variant="outline" 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages - 1}
        >
          Next
        </Button>
      </div>
      
      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-50">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-3">
          <Textarea 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Write or select a prompt..."
            className="min-h-[100px]"
          />
          <Button type="submit" className="ml-auto">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CategoryDetail;
