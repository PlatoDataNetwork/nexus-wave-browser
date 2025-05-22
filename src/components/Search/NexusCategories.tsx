
import React from 'react';
import { searchCategories } from "@/data/searchCategories";
import CategoryCube from './CategoryCube';

interface NexusCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
}

const NexusCategories: React.FC<NexusCategoriesProps> = ({ onSelectCategory }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Choose a Search Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchCategories.map((category) => (
          <CategoryCube 
            key={category.id}
            category={category}
            onClick={onSelectCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default NexusCategories;
