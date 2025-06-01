// src/lib/KakaoCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) {
      alert('인가 코드 없음');
      navigate('/');
      return;
    }
    if (sessionStorage.getItem('kakao_code_used') === code) {
      console.warn('이미 사용된 인가 코드입니다.');
      navigate('/');
      return;
    }

    api.post('/auth/kakao/token', { code })
      .then(res => {
        const { access_token, refresh_token, nickname } = res.data;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('nickname', nickname);
        sessionStorage.setItem('kakao_code_used', code);
        navigate('/');
      })
      .catch(err => {
        console.error('로그인 실패:', err.response?.data || err.message);
        alert('로그인 실패');
        navigate('/');
      });
  }, [navigate]);

  return <div className="p-8 text-center">로그인 처리 중입니다…</div>;
}
