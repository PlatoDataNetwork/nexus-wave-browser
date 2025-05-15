import { useState, useCallback, useEffect } from "react";
import { initialTabs, Tab } from "@/lib/dummyData";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Interface for tab history
interface TabHistory {
  [tabId: string]: {
    history: string[];
    currentIndex: number;
  };
}

export function useTabs(defaultUrl: string = "https://platodata.io") {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTab, setActiveTab] = useState<string | null>(initialTabs[0]?.id || null);
  const [tabHistory, setTabHistory] = useState<TabHistory>({});

  useEffect(() => {
    // Initialize history for existing tabs
    const initialHistory: TabHistory = {};
    initialTabs.forEach(tab => {
      initialHistory[tab.id] = {
        history: [tab.url],
        currentIndex: 0
      };
    });
    setTabHistory(initialHistory);
  }, []);

  const currentUrl = activeTab && tabHistory[activeTab] ? tabHistory[activeTab].history[tabHistory[activeTab].currentIndex] : defaultUrl;

  const canGoBack = useCallback(() => {
    if (!activeTab || !tabHistory[activeTab]) return false;
    return tabHistory[activeTab].currentIndex > 0;
  }, [activeTab, tabHistory]);

  const canGoForward = useCallback(() => {
    if (!activeTab || !tabHistory[activeTab]) return false;
    return tabHistory[activeTab].currentIndex < tabHistory[activeTab].history.length - 1;
  }, [activeTab, tabHistory]);

  const navigateToUrl = useCallback((url: string) => {
    if (!activeTab) return;

    setTabHistory(prev => {
      const currentHistory = prev[activeTab] || { history: [], currentIndex: -1 };
      const newHistory = [...currentHistory.history.slice(0, currentHistory.currentIndex + 1), url];

      return {
        ...prev,
        [activeTab]: {
          history: newHistory,
          currentIndex: newHistory.length - 1
        }
      };
    });

    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTab ? { ...tab, url: url } : tab
      )
    );
  }, [activeTab]);

  const goBack = useCallback(() => {
    if (!activeTab || !canGoBack()) return;

    setTabHistory(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        currentIndex: prev[activeTab].currentIndex - 1
      }
    }));
  }, [activeTab, canGoBack]);

  const goForward = useCallback(() => {
    if (!activeTab || !canGoForward()) return;

    setTabHistory(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        currentIndex: prev[activeTab].currentIndex + 1
      }
    }));
  }, [activeTab, canGoForward]);

  const refreshPage = useCallback(() => {
    if (!activeTab) return;
    const currentTabHistory = tabHistory[activeTab];
    const currentURL = currentTabHistory.history[currentTabHistory.currentIndex];
    navigateToUrl(currentURL);
  }, [activeTab, tabHistory, navigateToUrl]);
  
  const addTab = useCallback(() => {
    const newTabId = `tab-${uuidv4()}`;
    const newTab: Tab = {
      id: newTabId,
      title: "platodata.io",
      url: defaultUrl,
      icon: "https://platodata.io/favicon.ico"
    };
    
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTab(newTabId);
    
    // Initialize history for the new tab
    setTabHistory(prev => ({
      ...prev,
      [newTabId]: {
        history: [defaultUrl],
        currentIndex: 0
      }
    }));
    
    return newTabId;
  }, [defaultUrl]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
    
    // Remove tab history
    setTabHistory(prev => {
      const { [tabId]: _, ...rest } = prev;
      return rest;
    });

    if (activeTab === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[0].id : null);
    }
  }, [activeTab, tabs]);

  const activateTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

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
