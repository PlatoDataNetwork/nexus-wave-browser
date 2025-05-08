
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
import PageLayout from "./components/Layout/PageLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index defaultUrl="https://Platodata.io" />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings-docs" element={<PageLayout><Documentation /></PageLayout>} />
          <Route path="/documentation" element={<PageLayout><Documentation /></PageLayout>} />
          <Route path="/extension-store" element={<Index defaultUrl="/extension-store" />} />
          <Route path="/extension-admin" element={<PageLayout includeFooter={true}><ExtensionAdmin /></PageLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
