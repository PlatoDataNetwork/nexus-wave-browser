
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import PageLayout from "@/components/Layout/PageLayout";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Search from "./pages/Search";
import ExtensionStore from "./pages/ExtensionStore";
import Profile from "./pages/Profile";
import Downloads from "./pages/Downloads";
import History from "./pages/History";
import Settings from "./pages/Settings";
import SettingsDocumentation from "./pages/SettingsDocumentation";
import Documentation from "./pages/Documentation";
import ExtensionAdmin from "./pages/ExtensionAdmin";
import NotFound from "./pages/NotFound";
import Token from "./pages/Token";
import Staking from "./pages/Staking";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<PageLayout><LandingPage /></PageLayout>} />
              <Route path="/app" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/extension-store" element={<ExtensionStore />} />
              <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />
              <Route path="/downloads" element={<PageLayout><Downloads /></PageLayout>} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings-docs" element={<SettingsDocumentation />} />
              <Route path="/documentation" element={<PageLayout><Documentation /></PageLayout>} />
              <Route path="/extension-admin" element={<PageLayout><ExtensionAdmin /></PageLayout>} />
              <Route path="/token" element={<PageLayout><Token /></PageLayout>} />
              <Route path="/staking" element={<PageLayout><Staking /></PageLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
