
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PageLayout from "./components/Layout/PageLayout";
import Search from "./pages/Search";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Marketing Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Browser Application Routes */}
          <Route path="/app" element={<Index defaultUrl="https://Platodata.io" />} />
          <Route path="/settings-docs" element={<Index defaultUrl="/settings-docs" />} />
          <Route path="/history" element={<Index defaultUrl="/history" />} />
          <Route path="/extension-store" element={<Index defaultUrl="/extension-store" />} />
          <Route path="/search" element={<Index defaultUrl="/search" />} />
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
