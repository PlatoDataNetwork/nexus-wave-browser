import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./App.css";

// Page imports
import LandingPage from "./pages/LandingPage";
import BrowserContent from "./components/Browser/BrowserContent";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SettingsDocumentation from "./pages/SettingsDocumentation";
import ExtensionStore from "./pages/ExtensionStore";
import ExtensionAdmin from "./pages/ExtensionAdmin";
import History from "./pages/History";
import Documentation from "./pages/Documentation";
import Downloads from "./pages/Downloads";
import NotFound from "./pages/NotFound";
import Wave from "./pages/Wave";

function App() {
  // Check if running in a browser environment
  const isBrowser = typeof window !== 'undefined';

  // Get theme from local storage if available
  let storedTheme = null;
  if (isBrowser) {
    storedTheme = localStorage.getItem("nexus-ui-theme") || 'dark';
  }

  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="nexus-ui-theme">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<BrowserContent />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/category/:categoryId" element={<Search />} />
          <Route path="/wave/*" element={<Wave />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/documentation" element={<SettingsDocumentation />} />
          <Route path="/extensions" element={<ExtensionStore />} />
          <Route path="/extension-admin" element={<ExtensionAdmin />} />
          <Route path="/history" element={<History />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/staking" element={<NotFound message="Staking page coming soon" />} />
          <Route path="/token" element={<NotFound message="Token page coming soon" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors />
      </ThemeProvider>
    </Router>
  );
}

export default App;
