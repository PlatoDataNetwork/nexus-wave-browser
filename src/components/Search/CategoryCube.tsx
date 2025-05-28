
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SearchCategory } from '@/data/searchCategories';

interface CategoryCubeProps {
  category: SearchCategory;
  onClick: (categoryId: string) => void;
}

const CategoryCube: React.FC<CategoryCubeProps> = ({ category, onClick }) => {
  const { t } = useTranslation('categories');
  const IconComponent = category.icon;

  const translatedTitle = t(`${category.id}.title`, { defaultValue: category.title });
  const translatedDescription = t(`${category.id}.description`, { defaultValue: category.description });

  return (
    <div
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={() => onClick(category.id)}
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700">
        <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 mx-auto`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-white">
          {translatedTitle}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center line-clamp-2">
          {translatedDescription}
        </p>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default CategoryCube;
