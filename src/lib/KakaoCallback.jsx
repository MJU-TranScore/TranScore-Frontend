import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
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

    //  여기부터 수정됨
    axios.post(`${import.meta.env.VITE_API_URL}/auth/kakao/token`, 
      { code },
      { headers: { 'Content-Type': 'application/json' } }
    )
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

  return <div>로그인 처리 중입니다...</div>;
};

export default KakaoCallback;
