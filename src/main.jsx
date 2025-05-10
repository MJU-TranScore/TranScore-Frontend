import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import KakaoCallback from './lib/KakaoCallback';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallback />} /> {/* 추가 */}
    </Routes>
  </BrowserRouter>
);
