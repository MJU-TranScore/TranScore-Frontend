import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function UploadPage3({ xmlPath, pdfPath, scoreId, keySignature, title }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (scoreId) {
      localStorage.setItem('latestScoreId', scoreId);
      localStorage.setItem('latestKeySignature', keySignature || '');
      localStorage.setItem('latestScoreTitle', title || '제목 없음');
    }
  }, [scoreId, keySignature, title]);

  useEffect(() => {
    const saveScoreToMyPage = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('로그인 후 이용 가능합니다.');
          return;
        }

        await api.post(
          `/mypage/score/${scoreId}/save`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log('마이페이지에 업로드된 악보가 저장되었습니다!');
      } catch (err) {
        console.error('마이페이지 저장 실패:', err);
      }
    };

    if (scoreId) {
      saveScoreToMyPage();
    }
  }, [scoreId]);

  const goHome = () => navigate('/');
  const handleNavigate = (tab) => navigate(`/${tab}`);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-center space-y-6">
      <h2 className="text-2xl font-bold">악보가 정상적으로 인식되었습니다!</h2>

      <div className="grid gap-2 text-sm text-gray-800">
        <p>
          XML 파일 경로: <span className="text-blue-600 font-semibold">{xmlPath}</span>
        </p>
        <p>
          PDF 파일 경로: <span className="text-blue-600 font-semibold">{pdfPath}</span>
        </p>
        <p>
          제목: <span className="text-blue-600 font-semibold">{title || '제목 없음'}</span>
        </p>
        {keySignature && (
          <p>
            악보 키: <span className="text-blue-600 font-semibold">{keySignature}</span>
          </p>
        )}
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => handleNavigate('key-change')}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          키 변경
        </button>
        <button
          onClick={() => handleNavigate('lyrics-extract')}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          가사 추출
        </button>
        <button
          onClick={() => handleNavigate('melody-extract')}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          멜로디 추출
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={goHome}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
        >
          처음으로
        </button>
      </div>
    </div>
  );
}
