import React from "react";
import BrowserHeader, { DateTime, UserMenu, SettingsButton, ThemeToggle, HomeButton } from "@/components/Browser/BrowserHeader";
import ProtocolsMenu from "@/components/Browser/ProtocolsMenu";
import { useTabs } from "@/hooks/useTabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface NexusBrowserShellProps {
  children: React.ReactNode;
}

const NexusBrowserShell: React.FC<NexusBrowserShellProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const {
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
    canGoForward,
  } = useTabs("https://platodata.io/nexus");

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-nexus-header-blue border-b border-border">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <ProtocolsMenu onNavigate={navigateToUrl} />
          <div className="flex flex-col text-white min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold truncate">
              Nexus AI
            </h1>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          {!isMobile && <DateTime />}
          <HomeButton />
          <ThemeToggle />
          {!isMobile && <SettingsButton />}
          <UserMenu />
        </nav>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <BrowserHeader
          tabs={tabs}
          currentUrl={currentUrl}
          onAddTab={addTab}
          onCloseTab={closeTab}
          onActivateTab={activateTab}
          onNavigate={navigateToUrl}
          onGoBack={goBack}
          onGoForward={goForward}
          onRefresh={refreshPage}
          canGoBack={canGoBack()}
          canGoForward={canGoForward()}
          bookmarksBarState={isMobile ? "hidden" : "hidden"}
          onToggleBookmarksBar={() => {}}
        />

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NexusBrowserShell;
