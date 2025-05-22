// src/lib/KakaoLogout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function KakaoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // 서버 세션 무효화
        await api.post('/auth/logout');
      } catch (err) {
        console.warn('서버 로그아웃 실패', err.response?.status, err.response?.data);
      }
      // 클라이언트 정리
      localStorage.clear();
      // 홈으로 리다이렉트
      navigate('/');
    })();
  }, [navigate]);

  return <div className="p-8 text-center">로그아웃 처리 중입니다…</div>;
}
