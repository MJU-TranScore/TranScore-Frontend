/*import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Axios를 이용해 서버와 통신

function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedScore, setUploadedScore] = useState(null);  // 업로드한 악보 관리

  useEffect(() => {
    // JWT로 로그인 상태 유지
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error('사용자 정보 요청 실패', error);
    }
  };

  const handleKakaoLogin = () => {
    if (!window.Kakao) return alert('Kakao SDK 로드 실패');

    window.Kakao.Auth.login({
      success: function (authObj) {
        // 카카오 로그인 성공 후 서버에 로그인 요청하여 JWT 발급 받기
        const kakaoToken = authObj.access_token;
        
        axios.post('/auth/kakao/callback', { kakaoToken })
          .then((response) => {
            // 서버에서 받은 JWT 토큰 저장
            const jwtToken = response.data.jwt_token;
            localStorage.setItem('jwt_token', jwtToken);
            fetchUserProfile(jwtToken);  // JWT로 사용자 정보 가져오기
            setIsLoggedIn(true);
          })
          .catch((err) => {
            console.error('카카오 로그인 서버 처리 실패', err);
          });
      },
      fail: function (err) {
        console.error('로그인 실패', err);
      },
    });
  };

  const handleLogout = () => {
    window.Kakao.Auth.logout(() => {
      localStorage.removeItem('jwt_token');
      setIsLoggedIn(false);
      setUserProfile(null);
      setShowDropdown(false);
    });
  };

  const handleScoreUpload = (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const jwtToken = localStorage.getItem('jwt_token');
    axios.post('/score/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${jwtToken}`, // JWT 토큰 헤더에 포함
      },
    })
    .then(response => {
      setUploadedScore(response.data);  // 서버에서 받은 악보 정보 처리
      alert('악보 업로드 성공');
    })
    .catch(error => {
      console.error('악보 업로드 실패', error);
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-white text-black shadow-md relative">
        <h1 className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition" onClick={() => setActiveTab(null)}>
          TranScore
        </h1>

        <div className="relative">
          {!isLoggedIn ? (
            <div className="space-x-4">
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded" onClick={handleKakaoLogin}>
                로그인
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded">
                회원가입
              </button>
            </div>
          ) : (
            <div>
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2 hover:opacity-80">
                <img src={userProfile.thumbnail} alt="profile" className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium">{userProfile.nickname}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md py-1 z-10">
                  <button onClick={handleLogout} className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left">
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <nav className="bg-gray-100 px-6 py-3 flex space-x-6 text-gray-800 font-medium shadow-inner">
        <button className={`hover:text-blue-600 transition ${activeTab === 'upload' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => setActiveTab('upload')}>
          악보 인식
        </button>
        <button className={`hover:text-blue-600 transition ${activeTab === 'community' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => setActiveTab('community')}>
          커뮤니티
        </button>
      </nav>

      <main className="flex-1 bg-white flex flex-col">
        {activeTab === 'upload' ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="border-4 border-dashed border-gray-300 rounded-lg p-10 text-center w-2/3 max-w-xl">
              <p className="text-lg text-gray-600 mb-4">PDF 또는 이미지 파일을 여기에 드래그 앤 드롭하세요</p>
              <input
                type="file"
                onChange={(e) => handleScoreUpload(e.target.files[0])}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer text-sm text-blue-500">또는 클릭하여 파일 선택</label>
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

export default App;*/