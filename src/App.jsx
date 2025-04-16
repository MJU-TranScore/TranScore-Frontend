
//세션 유지 로그인
import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      console.log('Kakao SDK Initialized:', window.Kakao.isInitialized());
    }
  }, []);

  const handleKakaoLogin = () => {
    if (!window.Kakao) return alert('Kakao SDK 로드 실패');

    window.Kakao.Auth.login({
      success: function (authObj) {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function (res) {
            setIsLoggedIn(true);
            setUserProfile({
              nickname: res.kakao_account.profile.nickname,
              thumbnail: res.kakao_account.profile.thumbnail_image_url,
            });
          },
          fail: function (error) {
            console.error('사용자 정보 요청 실패', error);
          },
        });
      },
      fail: function (err) {
        console.error('로그인 실패', err);
      },
    });
  };

  const handleLogout = () => {
    window.Kakao.Auth.logout(() => {
      setIsLoggedIn(false);
      setUserProfile(null);
      setShowDropdown(false);
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-white text-black shadow-md relative">
        <h1
          className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition"
          onClick={() => setActiveTab(null)}
        >
          TranScore
        </h1>

        <div className="relative">
          {!isLoggedIn ? (
            <div className="space-x-4">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded"
                onClick={handleKakaoLogin}
              >
                로그인
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded">
                회원가입
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 hover:opacity-80"
              >
                <img
                  src={userProfile.thumbnail}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{userProfile.nickname}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <nav className="bg-gray-100 px-6 py-3 flex space-x-6 text-gray-800 font-medium shadow-inner">
        <button
          className={`hover:text-blue-600 transition ${activeTab === 'upload' ? 'text-blue-600 font-semibold' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          악보 인식
        </button>
        <button
          className={`hover:text-blue-600 transition ${activeTab === 'community' ? 'text-blue-600 font-semibold' : ''}`}
          onClick={() => setActiveTab('community')}
        >
          커뮤니티
        </button>
      </nav>

      <main className="flex-1 bg-white flex flex-col">
        {activeTab === 'upload' ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="border-4 border-dashed border-gray-300 rounded-lg p-10 text-center w-2/3 max-w-xl">
              <p className="text-lg text-gray-600 mb-4">PDF 또는 이미지 파일을 여기에 드래그 앤 드롭하세요</p>
              <p className="text-sm text-gray-400">또는 클릭하여 파일 선택</p>
            </div>
          </div>
        ) : activeTab === 'community' ? (
          <div className="flex-1 flex items-center justify-center text-xl text-gray-500">
            커뮤니티 페이지 준비 중입니다.
          </div>
        ) : (
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