import axios from 'axios';

// ✅ axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true, // 프리플라이트 요청 시 credentials 전송 허용
});

// ✅ 요청 보내기 전 항상 accessToken을 붙이도록 인터셉터 설정
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 응답 인터셉터: 401(권한 없음) 나오면 refresh_token으로 accessToken을 갱신!
api.interceptors.response.use(
  (response) => response, // 성공 시 그대로 전달
  async (error) => {
    const originalRequest = error.config;

    // 401 오류이면서, 재시도 플래그가 안 붙어있으면 refresh 시도
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.warn('리프레시 토큰 없음');
          throw new Error('리프레시 토큰 없음');
        }

        // ✅ refreshToken으로 새 accessToken 요청
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const newAccessToken = res.data.access_token;
        localStorage.setItem('accessToken', newAccessToken);

        // ✅ 새로운 토큰으로 원래 요청을 다시 보냄
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        console.error('🔥 리프레시 토큰으로 accessToken 갱신 실패:', refreshErr);
        // 갱신 실패 → 그대로 에러 반환 (로그인 페이지로 이동할 수도)
        return Promise.reject(refreshErr);
      }
    }

    // 401 이외의 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export default api;
