
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
      className="cursor-pointer hover:shadow-md transition-all h-36"
      onClick={() => onClick(category.id)}
    >
      <CardContent className="p-0 h-full flex flex-col">
        <div className={`${category.color} h-1/2 flex items-center justify-center`}>
          <category.icon className="h-10 w-10 text-white" />
        </div>
        <div className="p-3 h-1/2">
          <h3 className="font-medium text-sm mb-1">{category.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{category.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCube;
