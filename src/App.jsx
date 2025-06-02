// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import UploadPage from "./pages/UploadPage";
import MyPage from "./pages/MyPage/MyPage";
import MyPageUpload from "./pages/MyPage/MyPageUpload";
import MyPageTranspose from "./pages/MyPage/MyPageTranspose";
import MyPageLyrics from "./pages/MyPage/MyPageLyrics";
import MyPageMelody from "./pages/MyPage/MyPageMelody";
import CommunityPage from "./pages/CommunityPage";
import KeyChangePage from "./pages/KeyChangePage";
import LyricsExtractPage from "./pages/LyricsExtractPage";
import MelodyExtractPage from "./pages/MelodyExtractPage";
import KakaoCallback from "./lib/KakaoCallback";
import KakaoLogout from "./lib/KakaoLogout";
import KeyChangePage2 from "./pages/KeyChangePage2";
import ResultPage from "./pages/ResultPage";
import ScoreViewPage from "./pages/ScoreViewPage";

export default function App() {
  useEffect(() => {
    const jsKey = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!jsKey) {
      console.error("🚨 VITE_KAKAO_JAVASCRIPT_KEY가 설정되지 않았습니다.");
    } else if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(jsKey);
      console.log("Kakao SDK 초기화 완료:", jsKey);
    }
  }, []);

  return (
    <Routes>
      {/* 홈 및 기본 페이지 */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="mypage" element={<MyPage />}>
          <Route index element={<Navigate to="uploads" replace />} />
          <Route path="uploads" element={<MyPageUpload />} />
          <Route path="transpose" element={<MyPageTranspose />} />
          <Route path="lyrics" element={<MyPageLyrics />} />
          <Route path="melody" element={<MyPageMelody />} />
        </Route>
        <Route path="community" element={<CommunityPage />} />
        <Route path="key-change" element={<KeyChangePage />} />
        <Route path="lyrics-extract" element={<LyricsExtractPage />} />
        <Route path="melody-extract" element={<MelodyExtractPage />} />
        <Route path="score/view/:scoreId" element={<ScoreViewPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* 카카오 인증 / 로그아웃 */}
      <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
      <Route path="/logout" element={<KakaoLogout />} />

      {/* 기능별 페이지 (AppLayout 없이 단독 경로) */}
      <Route path="/key-change/:scoreId/result/:resultId" element={<KeyChangePage2 />} />
      <Route path="/result/transpose/:resultId" element={<ResultPage />} />
    </Routes>
  );
}

function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/upload");
  };

  return (
    <main className="flex flex-col items-center w-full text-center">
      {/* ✅ 히어로 영역 */}
      <section className="w-full bg-gray-500 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            당신의 악보를 새롭게 변환해보세요
          </h1>
          <p className="text-base md:text-lg text-white mb-8">
            간단한 업로드만으로 즉시 키 변경, 가사·멜로디 추출까지!
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded shadow transition"
          >
            지금 시작하기
          </button>
        </div>
      </section>

      {/* ✅ 가이드 영역 */}
      <section className="w-full max-w-4xl py-12 px-4">
        <h2 className="text-xl font-semibold mb-6">간단한 이용 가이드</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border rounded shadow-sm bg-white flex flex-col items-center">
            <div className="text-2xl font-bold mb-2">1</div>
            <h3 className="text-base font-semibold mb-2">악보 업로드</h3>
            <p className="text-gray-600 text-sm">
              PDF 또는 이미지를 선택하여 업로드하세요.
            </p>
          </div>
          <div className="p-6 border rounded shadow-sm bg-white flex flex-col items-center">
            <div className="text-2xl font-bold mb-2">2</div>
            <h3 className="text-base font-semibold mb-2">반음 선택</h3>
            <p className="text-gray-600 text-sm">
              원하는 반음만큼 조정값을 선택합니다.
            </p>
          </div>
          <div className="p-6 border rounded shadow-sm bg-white flex flex-col items-center">
            <div className="text-2xl font-bold mb-2">3</div>
            <h3 className="text-base font-semibold mb-2">다운로드</h3>
            <p className="text-gray-600 text-sm">
              변환된 악보를 즉시 다운로드합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ 푸터 */}
      <footer className="mt-12 text-xs text-gray-400">
        &copy; 2025 TranScore. All rights reserved. 비상업적 이용은 무료로 제공되며,
        상업적 이용 및 API 연동 시 별도 라이선스가 필요합니다.
      </footer>
    </main>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-red-500 mb-4">
        404 - 페이지를 찾을 수 없습니다
      </h1>
      <p className="text-gray-600">주소를 다시 확인해주세요.</p>
    </div>
  );
}
