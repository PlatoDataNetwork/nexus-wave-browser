
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SearchCategory } from "@/data/searchCategories";

interface CategoryCubeProps {
  category: SearchCategory;
  onClick: (categoryId: string) => void;
}

const CategoryCube: React.FC<CategoryCubeProps> = ({ category, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all h-20"
      onClick={() => onClick(category.id)}
    >
      <CardContent className="p-0 h-full flex flex-col items-center justify-center">
        <div className={`${category.color} w-full h-10 flex items-center justify-center`}>
          <category.icon className="h-6 w-6 text-white" />
        </div>
        <div className="p-2 h-10 w-full flex items-center justify-center">
          <h3 className="font-medium text-xs text-center">{category.title}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCube;
