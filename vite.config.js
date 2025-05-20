import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // auth, user, score, transform, mypage 는 백엔드로 프록시
      '/auth': {
        target: 'http://13.125.152.246:5000',
        changeOrigin: true,
        secure: false,
        bypass: req => {
          // 카카오 콜백만 로컬 처리
          if (req.url.startsWith('/auth/kakao/callback')) return req.url;
        },
      },
      '/user': {
        target: 'http://13.125.152.246:5000',
        changeOrigin: true,
        secure: false,
      },
      '/score': {
        target: 'http://13.125.152.246:5000',
        changeOrigin: true,
        secure: false,
      },
      '/transform': {
        target: 'http://13.125.152.246:5000',
        changeOrigin: true,
        secure: false,
      },
      '/mypage': {
        target: 'http://13.125.152.246:5000',
        changeOrigin: true,
        secure: false,
      },
      // result, community 등 로컬에 구현된 것은 아직 proxy 구현 X
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames:     '[name].[hash].js',
        chunkFileNames:     '[name].[hash].js',
        assetFileNames:     '[name].[hash][extname]',
      }
    }
  },
  base: './',
});
