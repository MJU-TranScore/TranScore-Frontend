import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadPage     from './pages/UploadPage';
import CommunityPage  from './pages/CommunityPage';
import MyScoresPage   from './pages/MyScoresPage';

export default function App() {
  const [activeTab, setActiveTab]     = useState(null);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const nick  = localStorage.getItem('nickname');
    if (token && nick) {
      setIsLoggedIn(true);
      setUserProfile({ nickname: nick });
    }
  }, []);

  const requireLogin = tab => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return false;
    }
    setActiveTab(tab);
    return true;
  };

  const handleLoginRedirect = () => {
    window.location.href =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}` +
      `&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}` +
      `&response_type=code`;
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
              onClick={() => requireLogin('community')}
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
                  onClick={() => setShowDropdown(v => !v)}
                  className="flex items-center space-x-2"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {userProfile.nickname}
                  </span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                    <button
                      onClick={() => setActiveTab('my-scores')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      내 악보 보기
                    </button>
                    <button
                      onClick={() => navigate('/logout')}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginRedirect}
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
        {activeTab === 'community' && <CommunityPage />}
        {activeTab === 'my-scores' && <MyScoresPage />}

        {!activeTab && (
          <>
            <section
              className="relative h-64 bg-cover bg-center mb-8 rounded-lg overflow-hidden"
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
                  onClick={handleLoginRedirect}
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
            © 2025 TranScore. All rights reserved. 비상업적 이용은 무료로 제공되며,
            상업적 이용 및 API 연동 시 별도 라이선스가 필요합니다.
          </div>
        </div>
      </footer>
    </div>
  );
}
