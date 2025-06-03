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

  // ✅ transform이 붙어야 할 경로만 지정
  const transformPaths = [
    /^\/score\/\d+\/melody$/,
    /^\/score\/\d+\/lyrics$/,
    /^\/score\/\d+\/transpose$/,
    /^\/score\/upload$/,         // 변환 전용 업로드
    /^\/score\/info$/,           // 최신 업로드 조회
  ];

  if (config.url && transformPaths.some((r) => r.test(config.url))) {
    config.url = `/transform${config.url}`;
  }

  return config;
});

// ✅ 응답 인터셉터: 401(권한 없음) 나오면 refresh_token으로 accessToken을 갱신!
api.interceptors.response.use(
  (response) => response, // 성공 시 그대로 전달
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.warn('리프레시 토큰 없음');
          throw new Error('리프레시 토큰 없음');
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const newAccessToken = res.data.access_token;
        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        console.error('🔥 리프레시 토큰으로 accessToken 갱신 실패:', refreshErr);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
