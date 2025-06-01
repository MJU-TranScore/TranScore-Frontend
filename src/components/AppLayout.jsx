// src/components/AppLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function AppLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const submenuTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const jsKey = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!jsKey) {
      console.error('🚨 VITE_KAKAO_JAVASCRIPT_KEY가 설정되지 않았습니다.');
    } else if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(jsKey);
      console.log('Kakao SDK 초기화 완료:', jsKey);
    }

    const token = localStorage.getItem('accessToken');
    const nick = localStorage.getItem('nickname');
    if (token && nick) {
      setIsLoggedIn(true);
      setUserProfile({ nickname: nick, thumbnail: '/default-profile.png' });
    }
  }, []);

  const requireLoginAndNavigate = (path) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    navigate(path);
  };

  const handleLogin = () => {
    window.location.href =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}` +
      `&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}` +
      `&response_type=code`;
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn(
        '서버 로그아웃 실패:',
        err.response
          ? `${err.response.status} ${JSON.stringify(err.response.data)}`
          : err.message
      );
    }

    const kakaoToken =
      window.Kakao &&
      window.Kakao.Auth &&
      window.Kakao.Auth.getAccessToken();
    if (kakaoToken) {
      window.Kakao.Auth.logout(() => {
        console.log('Kakao JS SDK 로그아웃 완료');
      });
    } else {
      console.log('카카오 토큰이 없어 SDK 로그아웃 호출 생략');
    }

    sessionStorage.clear();
    localStorage.clear();

    setShowDropdown(false);
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate('/');
  };

  const handleSubmenuLeave = () => {
    submenuTimer.current = setTimeout(() => {
      setShowSubmenu(false);
    }, 2000);
  };

  const handleSubmenuEnter = () => {
    if (submenuTimer.current) {
      clearTimeout(submenuTimer.current);
    }
    setShowSubmenu(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-7 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1
              className="text-3xl font-bold text-gray-800 cursor-pointer"
              onClick={() => navigate('/')}
            >
              TranScore
            </h1>
            <nav className="flex space-x-6 relative">
              <div
                className="relative"
                onMouseEnter={handleSubmenuEnter}
                onMouseLeave={handleSubmenuLeave}
              >
                <button
                  onClick={() => requireLoginAndNavigate('/upload')}
                  className="font-medium transition text-gray-800 hover:text-blue-600"
                >
                  악보 인식
                </button>
                {showSubmenu && (
                  <div
                    className="absolute left-0 mt-2 w-40 bg-white border rounded shadow z-10"
                    onMouseEnter={handleSubmenuEnter}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <button
                      onClick={() => navigate('/key-change')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      키 변경
                    </button>
                    <button
                      onClick={() => navigate('/lyrics-extract')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      가사 추출
                    </button>
                    <button
                      onClick={() => navigate('/melody-extract')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      멜로디 추출
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => requireLoginAndNavigate('/mypage')}
                className="font-medium transition text-gray-800 hover:text-blue-600"
              >
                마이페이지
              </button>
              <button
                onClick={() => navigate('/community')}
                className="font-medium transition text-gray-800 hover:text-blue-600"
              >
                커뮤니티
              </button>
            </nav>
          </div>

          {isLoggedIn ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={() => setShowDropdown((v) => !v)}
              >
                <img
                  src={userProfile.thumbnail}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {userProfile.nickname}
                </span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded"
            >
              로그인
            </button>
          )}
        </div>
      </header>

      {/* ✅ Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* ✅ Footer */}
      <footer>
        <div className="bg-white">
          <div className="container mx-auto px-6 py-4 text-center text-gray-500">
            광고 공간입니다
          </div>
        </div>
        <div className="bg-gray-100">
          <div className="container mx-auto px-6 py-2 text-center text-xs text-gray-600">
            © 2025 TranScore. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
