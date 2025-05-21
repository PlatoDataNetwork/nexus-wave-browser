
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the Wave category detail page
    navigate(`/wave/category/${categoryId}`);
  }, [categoryId, navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-nexus-purple mr-2" />
      <span>Redirecting to Wave...</span>
    </div>
  );
};

export default CategoryDetail;
