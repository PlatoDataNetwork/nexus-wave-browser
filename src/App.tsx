
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
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
              
              {/* Additional routes for footer links (placeholder pages) */}
              <Route path="/features" element={<LandingPage />} />
              <Route path="/pricing" element={<LandingPage />} />
              <Route path="/community" element={<LandingPage />} />
              <Route path="/about" element={<LandingPage />} />
              <Route path="/blog" element={<LandingPage />} />
              <Route path="/careers" element={<LandingPage />} />
              <Route path="/privacy" element={<LandingPage />} />
              <Route path="/terms" element={<LandingPage />} />
              <Route path="/cookies" element={<LandingPage />} />
              <Route path="/security" element={<LandingPage />} />
              <Route path="/docs" element={<LandingPage />} />
              <Route path="/tutorials" element={<LandingPage />} />
              <Route path="/api" element={<LandingPage />} />
              <Route path="/changelog" element={<LandingPage />} />
              <Route path="/roadmap" element={<LandingPage />} />
              
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
