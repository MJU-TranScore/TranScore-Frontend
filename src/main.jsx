import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import KakaoCallback from './lib/KakaoCallback';
import KakaoLogout from './lib/KakaoLogout';
import KeyChangePage2 from './pages/KeyChangePage2';
import ResultPage from './pages/ResultPage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {/* 홈 및 기본 페이지 */}
      <Route path="/" element={<App />} />

      {/* 카카오 인증 / 로그아웃 */}
      <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
      <Route path="/logout" element={<KakaoLogout />} />

      {/* 키 변경 완료 화면 */}
      <Route path="/key-change/:scoreId/result/:resultId" element={<KeyChangePage2 />} />

      {/* 변경된 악보 결과 확인 */}
      <Route path="/result/transpose/:resultId" element={<ResultPage />} />
    </Routes>
  </BrowserRouter>
);
