
import React from 'react';
import { Loader2 } from "lucide-react";
import { SearchResultItem } from '@/services/searchApi';
import ImageResultsGrid from './ImageResultsGrid';
import { useTranslation } from 'react-i18next';

interface ImageResultsProps {
  isLoading: boolean;
  results: SearchResultItem[];
  searchQuery: string;
}

const ImageResults: React.FC<ImageResultsProps> = ({ isLoading, results, searchQuery }) => {
  const { t } = useTranslation('search');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 text-nexus-purple animate-spin mb-2" />
        <p className="text-muted-foreground">{t('results.searchingImages')}</p>
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-medium mb-2">{t('results.enterSearchTerm', { type: 'images' })}</h2>
        <p className="text-muted-foreground">{t('results.highQualityImages')}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium mb-2">{t('results.noResults', { query: searchQuery })}</h2>
        <p className="text-muted-foreground">{t('results.noResultsDescription')}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        {t('results.aboutTime', { 
          count: results.length.toLocaleString(), 
          time: (Math.random() * 0.5 + 0.1).toFixed(2) 
        })}
      </p>
      <ImageResultsGrid results={results} />
    </div>
  );
};

export default ImageResults;
