
import React from 'react';
import { searchCategories } from "@/data/searchCategories";
import CategoryCube from './CategoryCube';

interface NexusCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
}

const NexusCategories: React.FC<NexusCategoriesProps> = ({ onSelectCategory }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Choose an Industry Vertical</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
