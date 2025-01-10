import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensures the build output matches the Wrangler config
    emptyOutDir: true,
  },
});
