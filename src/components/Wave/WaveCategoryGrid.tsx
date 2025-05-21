
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '@/lib/categoryData';
import { Card, CardContent } from '@/components/ui/card';

export const WaveCategoryGrid: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/wave/category/${categoryId}`);
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Explore Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.id} 
              className="h-32 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 overflow-hidden"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-0 flex flex-col items-center justify-center h-full relative">
                <div className="w-full h-full absolute inset-0 bg-nexus-purple bg-opacity-20"></div>
                <div className="z-10 flex flex-col items-center justify-center">
                  <Icon className="h-8 w-8 mb-2 text-nexus-purple" />
                  <h3 className="font-medium text-sm text-center">{category.name}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
