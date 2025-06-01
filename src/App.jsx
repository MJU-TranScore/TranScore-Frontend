import React, { useState, useEffect, useRef } from 'react';
import api from './lib/api';
import UploadPage from './pages/UploadPage';
import MyScoresPage from './pages/MyScoresPage';
import CommunityPage from './pages/CommunityPage';
import KeyChangePage from './pages/KeyChangePage';
import LyricsExtractPage from './pages/LyricsExtractPage';
import MelodyExtractPage from './pages/MelodyExtractPage';

export default function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);

  const submenuTimer = useRef(null);

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

  const requireLogin = (tab) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    setActiveTab(tab);
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
    setActiveTab(null);
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
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-7 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1
              className="text-3xl font-bold text-gray-800 cursor-pointer"
              onClick={() => setActiveTab(null)}
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
                  onClick={() => requireLogin('upload')}
                  className={`font-medium transition ${
                    activeTab === 'upload'
                      ? 'text-blue-600'
                      : 'text-gray-800 hover:text-blue-600'
                  }`}
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
                      onClick={() => setActiveTab('key-change')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      키 변경
                    </button>
                    <button
                      onClick={() => setActiveTab('lyrics-extract')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      가사 추출
                    </button>
                    <button
                      onClick={() => setActiveTab('melody-extract')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      멜로디 추출
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => requireLogin('my-scores')}
                className={`font-medium transition ${
                  activeTab === 'my-scores'
                    ? 'text-blue-600'
                    : 'text-gray-800 hover:text-blue-600'
                }`}
              >
                마이페이지
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`font-medium transition ${
                  activeTab === 'community'
                    ? 'text-blue-600'
                    : 'text-gray-800 hover:text-blue-600'
                }`}
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

      <main className="flex-1 container mx-auto px-6 py-8">
        {activeTab === 'upload' && <UploadPage />}
        {activeTab === 'my-scores' && <MyScoresPage />}
        {activeTab === 'community' && <CommunityPage />}
        {activeTab === 'key-change' && <KeyChangePage />}
        {activeTab === 'lyrics-extract' && <LyricsExtractPage />}
        {activeTab === 'melody-extract' && <MelodyExtractPage />}

        {activeTab === null && (
          <>
            <section
              className="relative h-96 bg-cover bg-center mb-8 rounded-lg overflow-hidden"
              style={{ backgroundImage: 'url(/images/score-hero.jpg)' }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
                <h2 className="text-4xl font-bold mb-2">
                  당신의 악보를 새롭게 변환해보세요
                </h2>
                <p className="mb-4">
                  간단한 업로드만으로 즉시 키 변경, 가사·멜로디 추출까지!
                </p>
                <button
                  onClick={requireLogin.bind(null, 'upload')}
                  className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded"
                >
                  지금 시작하기
                </button>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">간단한 이용 가이드</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow text-center">
                  <div className="text-3xl font-bold mb-2">1</div>
                  <h3 className="font-medium mb-1">악보 업로드 및 인식</h3>
                  <p className="text-sm text-gray-500">
                    악보 이미지를 업로드하세요.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow text-center">
                  <div className="text-3xl font-bold mb-2">2</div>
                  <h3 className="font-medium mb-1">기능 사용</h3>
                  <p className="text-sm text-gray-500">
                    원하는 만큼 키 변경이 가능하고,
                  </p>
                  <p className="text-sm text-gray-500">
                    가사만 따로 저장할 수 있으며,
                  </p>
                  <p className="text-sm text-gray-500">
                    멜로디도 들을 수 있습니다.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow text-center">
                  <div className="text-3xl font-bold mb-2">3</div>
                  <h3 className="font-medium mb-1">악보 추출</h3>
                  <p className="text-sm text-gray-500">
                    변환된 악보를 추출하여
                  </p>
                  <p className="text-sm text-gray-500">
                    확인 및 다운로드 가능합니다.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

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
