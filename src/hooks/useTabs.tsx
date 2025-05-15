import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LucideIcon, Globe } from 'lucide-react';

interface Tab {
  url: string;
  title: string;
  favicon: string | null;
  description: string | null;
  keywords: string | null;
}

export const useTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabUrl, setActiveTabUrl] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedTabs = localStorage.getItem('tabs');
    if (storedTabs) {
      setTabs(JSON.parse(storedTabs));
    }

    const activeTab = localStorage.getItem('activeTabUrl');
    if (activeTab) {
      setActiveTabUrl(activeTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    if (activeTabUrl) {
      localStorage.setItem('activeTabUrl', activeTabUrl);
    }
  }, [activeTabUrl]);

  const addTab = (tab: Tab) => {
    setTabs(prevTabs => {
      const newTabs = [...prevTabs, tab];
      localStorage.setItem('tabs', JSON.stringify(newTabs));
      return newTabs;
    });
    setActiveTabUrl(tab.url);
    searchParams.set('url', tab.url);
    setSearchParams(searchParams);
  };

  const removeTab = (url: string) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.url !== url);
      localStorage.setItem('tabs', JSON.stringify(newTabs));
      return newTabs;
    });
    if (activeTabUrl === url) {
      setActiveTabUrl(null);
      searchParams.delete('url');
      setSearchParams(searchParams);
    }
  };

  const updateTab = (url: string, updatedTab: Partial<Tab>) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.map(tab => {
        if (tab.url === url) {
          return { ...tab, ...updatedTab };
        }
        return tab;
      });
      localStorage.setItem('tabs', JSON.stringify(newTabs));
      return newTabs;
    });
  };

  const setActiveTab = (url: string) => {
    setActiveTabUrl(url);
    searchParams.set('url', url);
    setSearchParams(searchParams);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getIconForTab = (url: string): LucideIcon => {
    return Globe; // Using Globe as default icon
  };

  return {
    tabs,
    activeTabUrl,
    addTab,
    removeTab,
    updateTab,
    setActiveTab,
    isSidebarOpen,
    toggleSidebar,
    getIconForTab,
  };
};
