
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a favicon link element
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = '/lovable-uploads/43781a1e-b320-4a1b-aeb4-6cae375ea2f8.png';
favicon.type = 'image/png';
document.head.appendChild(favicon);

console.log("Main script executing, attempting to render App");
const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Could not find root element");
}
