
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Documentation from "./pages/Documentation";
import ExtensionAdmin from "./pages/ExtensionAdmin";
import ExtensionStore from "./pages/ExtensionStore";
import HistoryPage from "./pages/History";
import PageLayout from "./components/Layout/PageLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Use Index component for all browser-like routes */}
          <Route path="/" element={<Index defaultUrl="https://Platodata.io" />} />
          <Route path="/settings" element={<Index defaultUrl="/settings" />} />
          <Route path="/documentation" element={<Index defaultUrl="/documentation" />} />
          <Route path="/history" element={<Index defaultUrl="/history" />} />
          <Route path="/extension-store" element={<Index defaultUrl="/extension-store" />} />
          <Route path="/extension-browser" element={<Index defaultUrl="/extension-store" />} />
          
          {/* Fallback route */}
          <Route path="*" element={<PageLayout includeFooter={true}><NotFound /></PageLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
