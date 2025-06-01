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

    (async () => {
      try {
        const res = await api.post('/auth/kakao/token', { code });
        console.log('로그인 응답:', res.data);

        const { access_token, refresh_token, nickname } = res.data;

        if (!access_token || !refresh_token) {
          console.error('토큰 발급 실패: 응답 누락');
          throw new Error('토큰 발급 실패');
        }

        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('nickname', nickname);
        sessionStorage.setItem('kakao_code_used', code);

        alert('로그인 성공!');
        navigate('/');
      } catch (err) {
        console.error('로그인 실패:', err.response?.data || err.message);

        // 혹시나 이전에 있던 토큰이 남아있으면 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('nickname');

        alert('로그인 실패: 다시 시도해주세요.');
        navigate('/');
      }
    })();
  }, [navigate]);

  return <div className="p-8 text-center">로그인 처리 중입니다…</div>;
}
