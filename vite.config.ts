import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/playground/',
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      virtualRouteConfig: './src/route-config.ts',
      generatedRouteTree: './src/route-tree.gen.ts',
      quoteStyle: 'single',
      semicolons: true,
    }),
    tsconfigPaths(),
    react(),
  ],
});
