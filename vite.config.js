// vite.config.js
import { defineConfig } from 'vite'
import react            from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {

      // 1) 콜백 경로는 index.html 반환 → React Router로 처리
      '/auth/kakao/callback': {
        // target은 dev 서버 자신(localhost:5173)이지만,
        // bypass 콜백에서 index.html 경로를 리턴
        target: 'http://localhost:5173',
        changeOrigin: true,
        secure: false,
        bypass: () => '/index.html',
      },

      // 2) 나머지 /auth/* 요청은 백엔드로
      '/auth': {
        target: 'http://13.125.152.246:5000',
        changeOrigin: true,
        secure: false,

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

      // 필요시 /result 등도 추가

    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]',

      }
    }
  },
  base: './',
})
