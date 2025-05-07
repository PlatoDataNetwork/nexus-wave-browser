
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Add mainFields to prioritize which field in package.json to use
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
  define: {
    // Fix for "global is not defined" error
    global: 'globalThis',
  },
  build: {
    // Production optimizations
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
      },
    },
    // Chunk size optimization
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['@/components/ui'],
          'supabase': ['@supabase/supabase-js']
        },
      },
    },
    // Generate sourcemaps for better debugging (optional)
    sourcemap: true,
  },
}));
