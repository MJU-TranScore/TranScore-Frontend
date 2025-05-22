// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate }    from 'react-router-dom';
import api                from './lib/api';
import UploadPage         from './pages/UploadPage';
import MyScoresPage       from './pages/MyScoresPage';
import CommunityPage      from './pages/CommunityPage';

export default function App() {
  const [activeTab,    setActiveTab]    = useState(null);
  const [isLoggedIn,   setIsLoggedIn]   = useState(false);
  const [userProfile,  setUserProfile]  = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    // 1) Kakao SDK 초기화
    const jsKey = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!jsKey) {
      console.error('🚨 VITE_KAKAO_JAVASCRIPT_KEY가 설정되지 않았습니다.');
    } else if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(jsKey);
      console.log('Kakao SDK 초기화 완료:', jsKey);
    }

    // 2) 로컬스토리지에 토큰/닉네임이 있으면 로그인 상태 유지

    const token = localStorage.getItem('accessToken');
    const nick  = localStorage.getItem('nickname');
    if (token && nick) {
      setIsLoggedIn(true);
      setUserProfile({ nickname: nick, thumbnail: '/default-profile.png' });
    }
  }, []);

  const requireLogin = tab => {
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
    // 1) 서버 로그아웃 요청
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

    // 2) 카카오 토큰이 있을 때만 SDK 로그아웃 호출
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

    // 3) 클라이언트 저장소 비우기
    sessionStorage.clear();  // ex. kakao_code_used
    localStorage.clear();    // accessToken, refreshToken, nickname 등

    // 4) React 상태 초기화
    setShowDropdown(false);
    setIsLoggedIn(false);
    setUserProfile(null);
    setActiveTab(null);

    // 5) (선택) 페이지 새로고침
    // window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-gray-800 cursor-pointer"
            onClick={() => setActiveTab(null)}
          >
            TranScore
          </h1>

          <nav className="flex items-center space-x-6">
            <button
              onClick={() => requireLogin('upload')}
              className={`transition ${
                activeTab === 'upload'
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`}

            >
              악보 인식
            </button>
            <button
              onClick={() => requireLogin('my-scores')}
              className={`transition ${
                activeTab === 'my-scores'
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >

              마이페이지
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`transition ${
                activeTab === 'community'
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              커뮤니티
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2"
                  onClick={() => setShowDropdown(v => !v)}
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
                  <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-10">
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
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        {activeTab === 'upload'    && <UploadPage />}
        {activeTab === 'my-scores' && <MyScoresPage />}
        {activeTab === 'community' && <CommunityPage />}

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
              <h2 className="text-2xl font-semibold mb-6">
                간단한 이용 가이드
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow text-center">
                  <div className="text-3xl font-bold mb-2">1</div>
                  <h3 className="font-medium mb-1">악보 업로드</h3>
                  <p className="text-sm text-gray-500">
                    PDF 또는 이미지를 선택하여 업로드하세요.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow text-center">
                  <div className="text-3xl font-bold mb-2">2</div>
                  <h3 className="font-medium mb-1">반음 선택</h3>
                  <p className="text-sm text-gray-500">
                    원하는 반음만큼 조정값을 선택합니다.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow text-center">
                  <div className="text-3xl font-bold mb-2">3</div>
                  <h3 className="font-medium mb-1">다운로드</h3>
                  <p className="text-sm text-gray-500">
                    변환된 악보를 즉시 다운로드합니다.
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
