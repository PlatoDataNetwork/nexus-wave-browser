
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a favicon link element
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = '/lovable-uploads/30b2fc91-16e6-4be5-a6ce-8ae23ecee8f4.png';
favicon.type = 'image/png';
document.head.appendChild(favicon);

createRoot(document.getElementById("root")!).render(<App />);
