
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LucideIcon, Globe } from 'lucide-react';
import { Tab as TabType } from '@/lib/dummyData';
import { v4 as uuidv4 } from 'uuid';

export const useTabs = (defaultUrl: string = 'https://platodata.io') => {
  const [tabs, setTabs] = useState<TabType[]>([]);
  const [activeTabUrl, setActiveTabUrl] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<Record<string, string[]>>({});
  const [historyPosition, setHistoryPosition] = useState<Record<string, number>>({});

  useEffect(() => {
    const storedTabs = localStorage.getItem('tabs');
    if (storedTabs) {
      setTabs(JSON.parse(storedTabs));
    } else {
      // Create initial tab with default URL
      const initialTab: TabType = {
        id: uuidv4(),
        title: 'New Tab',
        url: defaultUrl,
        isActive: true,
      };
      setTabs([initialTab]);
      setActiveTabUrl(defaultUrl);
      
      // Initialize history for this tab
      setNavigationHistory(prev => ({ ...prev, [initialTab.id]: [defaultUrl] }));
      setHistoryPosition(prev => ({ ...prev, [initialTab.id]: 0 }));
    }

    const activeTab = localStorage.getItem('activeTabUrl');
    if (activeTab) {
      setActiveTabUrl(activeTab);
    }
  }, [defaultUrl]);

  useEffect(() => {
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    if (activeTabUrl) {
      localStorage.setItem('activeTabUrl', activeTabUrl);
    }
  }, [activeTabUrl]);

  // Get the current active tab ID
  const getActiveTabId = () => {
    return tabs.find(tab => tab.isActive)?.id || '';
  };

  // Get the current URL
  const currentUrl = activeTabUrl || defaultUrl;

  // Add a new tab
  const addTab = (tabData?: Partial<TabType>) => {
    const newTab: TabType = {
      id: uuidv4(),
      title: tabData?.title || 'New Tab',
      url: tabData?.url || defaultUrl,
      isActive: true,
      icon: tabData?.icon,
    };

    setTabs(prevTabs => {
      const updatedTabs = prevTabs.map(tab => ({
        ...tab,
        isActive: false
      }));
      
      return [...updatedTabs, newTab];
    });
    
    setActiveTabUrl(newTab.url);
    searchParams.set('url', newTab.url);
    setSearchParams(searchParams);
    
    // Initialize history for this tab
    setNavigationHistory(prev => ({ ...prev, [newTab.id]: [newTab.url] }));
    setHistoryPosition(prev => ({ ...prev, [newTab.id]: 0 }));
  };

  // Close a tab
  const closeTab = (id: string) => {
    setTabs(prevTabs => {
      const tabToClose = prevTabs.find(tab => tab.id === id);
      const isActiveTab = tabToClose?.isActive || false;
      const newTabs = prevTabs.filter(tab => tab.id !== id);
      
      // If the closed tab was active, make another tab active
      if (isActiveTab && newTabs.length > 0) {
        const lastTab = newTabs[newTabs.length - 1];
        lastTab.isActive = true;
        setActiveTabUrl(lastTab.url);
        searchParams.set('url', lastTab.url);
        setSearchParams(searchParams);
      }
      
      return newTabs;
    });
    
    // Clean up history for this tab
    setNavigationHistory(prev => {
      const newHistory = { ...prev };
      delete newHistory[id];
      return newHistory;
    });
    
    setHistoryPosition(prev => {
      const newPositions = { ...prev };
      delete newPositions[id];
      return newPositions;
    });
  };

  // Activate a tab
  const activateTab = (id: string) => {
    setTabs(prevTabs => {
      return prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === id
      }));
    });
    
    const tabToActivate = tabs.find(tab => tab.id === id);
    if (tabToActivate) {
      setActiveTabUrl(tabToActivate.url);
      searchParams.set('url', tabToActivate.url);
      setSearchParams(searchParams);
    }
  };

  // Navigate to a URL in the current tab
  const navigateToUrl = (url: string) => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return;

    // Update the tab's URL
    setTabs(prevTabs => {
      return prevTabs.map(tab => {
        if (tab.id === activeTabId) {
          return { ...tab, url };
        }
        return tab;
      });
    });
    
    setActiveTabUrl(url);
    searchParams.set('url', url);
    setSearchParams(searchParams);
    
    // Update navigation history
    setNavigationHistory(prev => {
      const currentTabHistory = [...(prev[activeTabId] || [])];
      const currentPosition = historyPosition[activeTabId] || 0;
      
      // Remove any forward history if navigating from middle of history
      const newHistory = currentTabHistory.slice(0, currentPosition + 1);
      newHistory.push(url);
      
      return { ...prev, [activeTabId]: newHistory };
    });
    
    setHistoryPosition(prev => {
      const currentPosition = prev[activeTabId] || 0;
      return { ...prev, [activeTabId]: currentPosition + 1 };
    });
  };

  // Navigate back in history
  const goBack = () => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return;
    
    const currentPosition = historyPosition[activeTabId] || 0;
    if (currentPosition <= 0) return; // Can't go back further
    
    const newPosition = currentPosition - 1;
    const newUrl = navigationHistory[activeTabId][newPosition];
    
    // Update position without adding to history
    setHistoryPosition(prev => ({ ...prev, [activeTabId]: newPosition }));
    
    // Update tab URL without adding to history
    setTabs(prevTabs => {
      return prevTabs.map(tab => {
        if (tab.id === activeTabId) {
          return { ...tab, url: newUrl };
        }
        return tab;
      });
    });
    
    setActiveTabUrl(newUrl);
    searchParams.set('url', newUrl);
    setSearchParams(searchParams);
  };

  // Navigate forward in history
  const goForward = () => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return;
    
    const currentPosition = historyPosition[activeTabId] || 0;
    const maxPosition = (navigationHistory[activeTabId]?.length || 1) - 1;
    
    if (currentPosition >= maxPosition) return; // Can't go forward further
    
    const newPosition = currentPosition + 1;
    const newUrl = navigationHistory[activeTabId][newPosition];
    
    // Update position without adding to history
    setHistoryPosition(prev => ({ ...prev, [activeTabId]: newPosition }));
    
    // Update tab URL without adding to history
    setTabs(prevTabs => {
      return prevTabs.map(tab => {
        if (tab.id === activeTabId) {
          return { ...tab, url: newUrl };
        }
        return tab;
      });
    });
    
    setActiveTabUrl(newUrl);
    searchParams.set('url', newUrl);
    setSearchParams(searchParams);
  };

  // Refresh the current page
  const refreshPage = () => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return;
    
    // Re-navigate to the same URL to refresh
    const currentUrl = tabs.find(tab => tab.id === activeTabId)?.url || '';
    if (currentUrl) {
      // Just trigger a re-render - in a real app this would reload the content
      setTabs(prevTabs => [...prevTabs]);
    }
  };

  // Check if can go back
  const canGoBack = () => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return false;
    
    const currentPosition = historyPosition[activeTabId] || 0;
    return currentPosition > 0;
  };

  // Check if can go forward
  const canGoForward = () => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return false;
    
    const currentPosition = historyPosition[activeTabId] || 0;
    const maxPosition = (navigationHistory[activeTabId]?.length || 1) - 1;
    
    return currentPosition < maxPosition;
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Get icon for tab
  const getIconForTab = (url: string): LucideIcon => {
    return Globe; // Using Globe as default icon
  };

  return {
    tabs,
    activeTabUrl,
    currentUrl,
    addTab,
    closeTab,
    removeTab: closeTab, // Alias for compatibility
    updateTab: (url: string, updatedTab: Partial<TabType>) => {
      const tab = tabs.find(t => t.url === url);
      if (tab) {
        const updated = { ...tab, ...updatedTab };
        setTabs(prevTabs => prevTabs.map(t => t.url === url ? updated : t));
      }
    },
    activateTab,
    setActiveTab: (url: string) => {
      const tab = tabs.find(t => t.url === url);
      if (tab) activateTab(tab.id);
    },
    navigateToUrl,
    goBack,
    goForward,
    refreshPage,
    canGoBack,
    canGoForward,
    isSidebarOpen,
    toggleSidebar,
    getIconForTab,
  };
};
