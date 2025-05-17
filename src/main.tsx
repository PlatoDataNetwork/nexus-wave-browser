
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './hooks/useTheme'

// Create a favicon link element
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = '/lovable-uploads/43781a1e-b320-4a1b-aeb4-6cae375ea2f8.png';
favicon.type = 'image/png';
document.head.appendChild(favicon);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
