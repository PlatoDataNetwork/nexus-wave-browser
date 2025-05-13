
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
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./hooks/useTheme";
import Header from "./components/Layout/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Header />
            <Routes>
              {/* Marketing Landing Page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Browser Application Routes */}
              <Route path="/app" element={<Index defaultUrl="https://nexuswavedata.io" />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings-docs" element={<Index defaultUrl="/settings-docs" />} />
              <Route path="/history" element={<Index defaultUrl="/history" />} />
              <Route path="/extension-store" element={<Index defaultUrl="/extension-store" />} />
              <Route path="/search" element={<Index defaultUrl="/search" />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
