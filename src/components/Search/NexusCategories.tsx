
import React from 'react';
import { useTranslation } from 'react-i18next';
import { searchCategories } from "@/data/searchCategories";
import CategoryCube from './CategoryCube';

interface NexusCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
}

const NexusCategories: React.FC<NexusCategoriesProps> = ({ onSelectCategory }) => {
  const { t } = useTranslation('categories');

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">{t('chooseVertical')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
