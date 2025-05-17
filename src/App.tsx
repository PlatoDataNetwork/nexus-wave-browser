
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Downloads from "./pages/Downloads";
import { AuthProvider } from "./hooks/useAuth";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

// Create a new query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
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
                <Route path="/search" element={<Search />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/downloads" element={<Downloads />} />
                
                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
          
          {/* Use only Sonner toast provider for consistent UI */}
          <Sonner position="top-center" closeButton />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
