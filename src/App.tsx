
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
import Downloads from "./pages/Downloads";
import { ThemeProvider } from "./hooks/useTheme";
import { AuthProvider } from "./hooks/useAuth";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-grow">
                <Routes>
                  {/* Marketing Landing Page */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Browser Application Routes */}
                  <Route path="/app" element={<Index defaultUrl="https://platodata.io" />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/settings-docs" element={<Index defaultUrl="/settings-docs" />} />
                  <Route path="/history" element={<Index defaultUrl="/history" />} />
                  <Route path="/extension-store" element={<Index defaultUrl="/extension-store" />} />
                  <Route path="/search" element={<Index defaultUrl="/search" />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/downloads" element={<Downloads />} />
                  
                  {/* Fallback route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
