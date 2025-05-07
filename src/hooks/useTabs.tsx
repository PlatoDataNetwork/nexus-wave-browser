
import { useState, useCallback, useEffect } from "react";
import { initialTabs, Tab } from "@/lib/dummyData";
import { toast } from "@/components/ui/sonner";

// Interface for tab history
interface TabHistory {
  [tabId: string]: string[];
}

export function useTabs() {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [currentUrl, setCurrentUrl] = useState<string>(
    initialTabs.find(tab => tab.isActive)?.url || "https://nexus.wave/dashboard"
  );
  
  // History management for each tab
  const [tabHistory, setTabHistory] = useState<TabHistory>({});
  const [historyPosition, setHistoryPosition] = useState<{[tabId: string]: number}>({});

  // Initialize history for default tabs
  useEffect(() => {
    const initialHistory: TabHistory = {};
    const initialPositions: {[tabId: string]: number} = {};
    
    tabs.forEach(tab => {
      initialHistory[tab.id] = [tab.url];
      initialPositions[tab.id] = 0;
    });
    
    setTabHistory(initialHistory);
    setHistoryPosition(initialPositions);
  }, []);

  // Get active tab ID
  const getActiveTabId = useCallback(() => {
    return tabs.find(tab => tab.isActive)?.id;
  }, [tabs]);

  const addTab = useCallback(() => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newTabId,
      title: "New Tab",
      url: "https://nexus.wave/newtab",
      isActive: false,
      icon: undefined
    };

    setTabs(prevTabs => {
      const updatedTabs = prevTabs.map(tab => ({
        ...tab,
        isActive: false
      }));
      return [...updatedTabs, { ...newTab, isActive: true }];
    });
    
    // Initialize history for the new tab
    setTabHistory(prev => ({
      ...prev,
      [newTabId]: ["https://nexus.wave/newtab"]
    }));
    
    setHistoryPosition(prev => ({
      ...prev,
      [newTabId]: 0
    }));
    
    setCurrentUrl("https://nexus.wave/newtab");
    toast.success("New tab opened");
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const tabToClose = prevTabs.find(tab => tab.id === tabId);
      const updatedTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      // If we're closing the active tab, activate the next or previous tab
      if (tabToClose?.isActive && updatedTabs.length > 0) {
        const tabIndex = prevTabs.findIndex(tab => tab.id === tabId);
        const newActiveIndex = tabIndex === prevTabs.length - 1 ? tabIndex - 1 : tabIndex;
        updatedTabs[newActiveIndex].isActive = true;
        setCurrentUrl(updatedTabs[newActiveIndex].url);
        
        // Clean up history for closed tab
        setTabHistory(prev => {
          const newHistory = {...prev};
          delete newHistory[tabId];
          return newHistory;
        });
        
        setHistoryPosition(prev => {
          const newPositions = {...prev};
          delete newPositions[tabId];
          return newPositions;
        });
      }
      
      return updatedTabs;
    });
    toast.info("Tab closed");
  }, []);

  const activateTab = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const updatedTabs = prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId
      }));
      
      const activeTab = updatedTabs.find(tab => tab.id === tabId);
      if (activeTab) {
        setCurrentUrl(activeTab.url);
      }
      
      return updatedTabs;
    });
  }, []);

  const navigateToUrl = useCallback((url: string) => {
    // Ensure URL has protocol
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = `https://${url}`;
    }
    
    const activeTabId = getActiveTabId();
    if (!activeTabId) return;
    
    setCurrentUrl(processedUrl);
    
    // Update the active tab with new URL
    setTabs(prevTabs => {
      return prevTabs.map(tab => {
        if (tab.isActive) {
          return {
            ...tab,
            url: processedUrl,
            title: processedUrl.replace(/^https?:\/\//, '').split('/')[0]
          };
        }
        return tab;
      });
    });
    
    // Add to history for the active tab
    setTabHistory(prev => {
      const activeTabHistory = [...(prev[activeTabId] || [])];
      const currentPosition = historyPosition[activeTabId] || 0;
      
      // If we navigated from a position that's not the end of history,
      // truncate the history from that point
      const newHistory = activeTabHistory.slice(0, currentPosition + 1);
      newHistory.push(processedUrl);
      
      return {
        ...prev,
        [activeTabId]: newHistory
      };
    });
    
    // Update history position
    setHistoryPosition(prev => ({
      ...prev,
      [activeTabId]: (prev[activeTabId] || 0) + 1
    }));
    
    toast.info(`Navigating to ${processedUrl}`);
  }, [getActiveTabId, historyPosition]);

  // Go back in history
  const goBack = useCallback(() => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return;
    
    const currentPosition = historyPosition[activeTabId] || 0;
    const tabHistoryEntries = tabHistory[activeTabId] || [];
    
    if (currentPosition > 0) {
      const newPosition = currentPosition - 1;
      const url = tabHistoryEntries[newPosition];
      
      setHistoryPosition(prev => ({
        ...prev,
        [activeTabId]: newPosition
      }));
      
      setCurrentUrl(url);
      
      // Update tab with new URL without adding to history
      setTabs(prevTabs => {
        return prevTabs.map(tab => {
          if (tab.id === activeTabId) {
            return {
              ...tab,
              url,
              title: url.replace(/^https?:\/\//, '').split('/')[0]
            };
          }
          return tab;
        });
      });
      
      toast.info("Navigated back");
    } else {
      toast.info("No previous page");
    }
  }, [getActiveTabId, historyPosition, tabHistory]);

  // Go forward in history
  const goForward = useCallback(() => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return;
    
    const currentPosition = historyPosition[activeTabId] || 0;
    const tabHistoryEntries = tabHistory[activeTabId] || [];
    
    if (currentPosition < tabHistoryEntries.length - 1) {
      const newPosition = currentPosition + 1;
      const url = tabHistoryEntries[newPosition];
      
      setHistoryPosition(prev => ({
        ...prev,
        [activeTabId]: newPosition
      }));
      
      setCurrentUrl(url);
      
      // Update tab with new URL without adding to history
      setTabs(prevTabs => {
        return prevTabs.map(tab => {
          if (tab.id === activeTabId) {
            return {
              ...tab,
              url,
              title: url.replace(/^https?:\/\//, '').split('/')[0]
            };
          }
          return tab;
        });
      });
      
      toast.info("Navigated forward");
    } else {
      toast.info("No next page");
    }
  }, [getActiveTabId, historyPosition, tabHistory]);

  // Refresh the current page
  const refreshPage = useCallback(() => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return;
    
    toast.info(`Refreshing ${currentUrl}`);
    
    // We're just simulating a refresh since we don't actually load external content
    setTimeout(() => {
      toast.success("Page refreshed");
    }, 500);
  }, [currentUrl, getActiveTabId]);

  // Can go back/forward helpers
  const canGoBack = useCallback(() => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return false;
    
    return (historyPosition[activeTabId] || 0) > 0;
  }, [getActiveTabId, historyPosition]);

  const canGoForward = useCallback(() => {
    const activeTabId = getActiveTabId();
    if (!activeTabId) return false;
    
    const currentPosition = historyPosition[activeTabId] || 0;
    const tabHistoryEntries = tabHistory[activeTabId] || [];
    
    return currentPosition < tabHistoryEntries.length - 1;
  }, [getActiveTabId, historyPosition, tabHistory]);

  return {
    tabs,
    currentUrl,
    addTab,
    closeTab,
    activateTab,
    navigateToUrl,
    goBack,
    goForward,
    refreshPage,
    canGoBack,
    canGoForward
  };
}
