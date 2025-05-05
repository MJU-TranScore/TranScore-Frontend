// src/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://13.125.152.246', // EC2 서버 주소
  withCredentials: true,
});

export default api;

export const kakaoLogin = async (data) => {
  try {
    const response = await api.get('/auth/kakao/token', {
      params: { code: data.code }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};