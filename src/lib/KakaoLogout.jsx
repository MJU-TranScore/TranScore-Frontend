// src/lib/KakaoLogout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function KakaoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await api.post('/auth/logout');
      } catch (err) {
        console.warn('서버 로그아웃 실패', err.response?.status, err.response?.data);
      }
      localStorage.clear();
      navigate('/');
    })();
  }, [navigate]);

  return <div className="p-8 text-center">로그아웃 처리 중입니다…</div>;
}
