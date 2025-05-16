
/// <reference types="node" />
/// <reference path="./src/global.d.ts" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Import the tagger conditionally using import()
function getComponentTagger() {
  if (process.env.NODE_ENV === 'development') {
    try {
      return import('lovable-tagger').then(module => module.componentTagger());
    } catch (error) {
      console.warn('Failed to load lovable-tagger:', error);
      return null;
    }
  }
  return null;
}

export default defineConfig(async ({ mode }) => {
  // Conditionally load the plugin
  const taggerPlugin = mode === 'development' ? await getComponentTagger() : null;
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    base: "/",
    plugins: [
      react(),
      taggerPlugin,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react',
              'react-dom',
              'react-router-dom',
              '@tanstack/react-query'
            ]
          }
        }
      }
    },
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'react-router-dom', 
        '@tanstack/react-query'
      ]
    }
  };
});
