import React, { useState, useEffect } from 'react';
import UploadPage from './pages/UploadPage';
import CommunityPage from './pages/CommunityPage';
import MyScoresPage from './pages/MyScoresPage';
import { useLocation } from 'react-router-dom';

function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true);
      setUserProfile({
        nickname: localStorage.getItem('nickname'),
        thumbnail: '',
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('nickname');
    setIsLoggedIn(false);
    setUserProfile(null);
    setActiveTab(null);
    setShowDropdown(false);
  };

  const handleTabChange = tab => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-white text-black shadow-md relative">
        <h1 className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition" onClick={() => setActiveTab(null)}>
          TranScore
        </h1>
        <div className="relative">
          {!isLoggedIn ? (
            <a
              href={`https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`}
              className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
            >
              로그인
            </a>
          ) : (
            <>
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2 hover:opacity-80">
                <img src={userProfile?.thumbnail || '/default-profile.png'} alt="profile" className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium">{userProfile?.nickname}</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md py-1 z-10">
                  <button
                    onClick={() => handleTabChange('my-scores')}
                    className="block px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 w-full text-left"
                  >
                    내 악보 보기
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </header>

      <nav className="bg-gray-100 px-6 py-3 flex space-x-6 text-gray-800 font-medium shadow-inner">
        <button
          className={`hover:text-blue-600 transition ${activeTab === 'upload' ? 'text-blue-600 font-semibold' : ''}`}
          onClick={() => handleTabChange('upload')}
        >
          악보 인식
        </button>
        <button
          className={`hover:text-blue-600 transition ${activeTab === 'community' ? 'text-blue-600 font-semibold' : ''}`}
          onClick={() => handleTabChange('community')}
        >
          커뮤니티
        </button>
      </nav>

      <main className="flex-1 bg-white flex flex-col">
        {activeTab === 'upload' && <UploadPage />}
        {activeTab === 'community' && <CommunityPage />}
        {activeTab === 'my-scores' && <MyScoresPage />}
        {!activeTab && (
          <div className="flex-1 flex flex-col">
            <section className="flex-1 p-10 bg-gray-50">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">TranScore란?</h2>
              <p className="text-gray-700 leading-relaxed">
                TranScore는 PDF 또는 이미지로 된 악보를 인식하여 다양한 조(key)로 변환하는 악보 변환 플랫폼입니다.
              </p>
            </section>
            <footer className="h-32 bg-gray-200 flex items-center justify-center text-gray-500 border-t">
              광고 공간입니다
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;