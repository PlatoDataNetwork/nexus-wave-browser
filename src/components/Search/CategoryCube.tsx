
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
      className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all bg-nexus-purple/20 hover:bg-nexus-purple/30"
      onClick={() => onClick(category.id)}
    >
      <CardContent className="p-4 h-full flex items-center justify-start gap-3">
        <div className="rounded-full bg-nexus-purple p-2 flex items-center justify-center">
          <category.icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm text-foreground">{category.title}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCube;
