
// Browser polyfills for Node.js modules used by Supabase
if (typeof window !== 'undefined') {
  // Provide global object for Node.js modules
  window.global = window;
  
  // Ensure necessary properties exist on the global object
  window.process = window.process || { env: {} };
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

export default function setupPolyfills() {
  // This function doesn't need to do anything, its existence ensures the polyfills are loaded
  console.log('Polyfills loaded');
}
