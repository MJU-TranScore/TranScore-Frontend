import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import KakaoCallback from './lib/KakaoCallback';
import KakaoLogout   from './lib/KakaoLogout';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/"                      element={<App />} />
      <Route path="/auth/kakao/callback"  element={<KakaoCallback />} />
      <Route path="/logout"               element={<KakaoLogout   />} />
    </Routes>
  </BrowserRouter>
);
