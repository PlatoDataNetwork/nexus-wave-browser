
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/Layout/PageLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Image, Video, Clock, Zap, Sparkles } from 'lucide-react';
import ConversationalSearch from '@/components/Search/ConversationalSearch';
import ImageResults from '@/components/Search/ImageResults';
import CategoryGrid from '@/components/Search/CategoryGrid';

const Search: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'nexus';
  
  // Check if we're on a category page
  const isCategoryPage = location.pathname.includes('/search/category/');
  
  useEffect(() => {
    // Redirect Wave tab to new Wave page
    if (currentTab === 'wave') {
      // If we're on a category page, redirect to the equivalent in the Wave section
      if (isCategoryPage) {
        const categoryId = location.pathname.split('/search/category/')[1];
        navigate(`/wave/category/${categoryId}`);
      } else {
        navigate('/wave');
      }
    }
  }, [currentTab, navigate, isCategoryPage, location.pathname]);
  
  const handleTabChange = (tab: string) => {
    if (tab === 'wave') {
      navigate('/wave');
    } else {
      setSearchParams({ tab });
    }
  };
  
  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border nexus-gradient-bg">
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="web" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                <Image className="h-4 w-4 mr-1" /> Web
              </TabsTrigger>
              <TabsTrigger value="images" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                <Image className="h-4 w-4 mr-1" /> Images
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                <Video className="h-4 w-4 mr-1" /> Videos
              </TabsTrigger>
              <TabsTrigger value="news" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                <Clock className="h-4 w-4 mr-1" /> News
              </TabsTrigger>
              <TabsTrigger value="nexus" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                <Zap className="h-4 w-4 mr-1" /> Nexus Search
              </TabsTrigger>
              <TabsTrigger value="wave" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                <Sparkles className="h-4 w-4 mr-1" /> Nexus Wave
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="web" className="h-full m-0">
            <p className="p-4 text-center">Web search coming soon</p>
          </TabsContent>
          <TabsContent value="images" className="h-full m-0">
            <ImageResults isLoading={false} results={[]} searchQuery="" />
          </TabsContent>
          <TabsContent value="videos" className="h-full m-0">
            <p className="p-4 text-center">Video search coming soon</p>
          </TabsContent>
          <TabsContent value="news" className="h-full m-0">
            <p className="p-4 text-center">News coming soon</p>
          </TabsContent>
          <TabsContent value="nexus" className="h-full m-0">
            <ConversationalSearch />
          </TabsContent>
          
          {/* Wave tab content is now handled in the Wave component */}
        </div>
      </div>
    </PageLayout>
  );
};

export default Search;
