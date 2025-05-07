
import { useState, useCallback } from "react";
import { initialTabs, Tab } from "@/lib/dummyData";
import { toast } from "@/components/ui/sonner";

export function useTabs() {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [currentUrl, setCurrentUrl] = useState<string>(
    initialTabs.find(tab => tab.isActive)?.url || "https://nexus.wave/dashboard"
  );

  const addTab = useCallback(() => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
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
    
    toast.info(`Navigating to ${processedUrl}`);
  }, []);

  return {
    tabs,
    currentUrl,
    addTab,
    closeTab,
    activateTab,
    navigateToUrl
  };
}
