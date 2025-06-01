// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 콜백 경로는 React Router 처리
      '/auth/kakao/callback': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        secure: false,
        bypass: () => '/index.html',
      },
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/score': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/transform': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/mypage': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]',
      },
    },
  },
  base: './',
});
