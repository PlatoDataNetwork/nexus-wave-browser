
import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import CategoryGrid from '@/components/Wave/CategoryGrid';
import CategoryDetail from '@/components/Wave/CategoryDetail';
import PageLayout from '@/components/Layout/PageLayout';

const Wave: React.FC = () => {
  const location = useLocation();
  
  // Determine if we're on a category detail page
  const isDetailPage = location.pathname.includes('/category/');
  
  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        {!isDetailPage && <CategoryGrid />}
        
        <Routes>
          <Route path="/category/:categoryId" element={<CategoryDetail />} />
        </Routes>
      </div>
    </PageLayout>
  );
};

export default Wave;
