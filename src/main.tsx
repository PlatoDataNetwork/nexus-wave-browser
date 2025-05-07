
// Polyfill for global variable used by Supabase's Node.js packages
window.global = window;

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root and render app
createRoot(document.getElementById("root")!).render(<App />);
