import React from 'react';

export default function UploadPage3({ xmlPath, pdfPath, scoreId, keySignature }) {
  const goHome = () => {
    window.location.href = '/';
  };

  const handleNavigate = (tab) => {
    // 인식된 악보 정보를 로컬 스토리지에 저장
    localStorage.setItem('latestScoreId', scoreId);
    localStorage.setItem('latestKeySignature', keySignature || ''); // 혹시 키 정보도 저장할 수 있도록
    window.location.href = `/${tab}`; // 각 기능 페이지로 이동
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-center space-y-4">
      <h2 className="text-2xl font-bold">악보가 정상적으로 인식되었습니다!</h2>
      <div>
        <p className="text-gray-700">
          XML 파일 경로: <span className="text-blue-600">{xmlPath}</span>
        </p>
        <p className="text-gray-700">
          PDF 파일 경로: <span className="text-blue-600">{pdfPath}</span>
        </p>
      </div>

      {/* 키 정보 표시 */}
      {keySignature && (
        <p className="text-gray-700">
          악보 키: <span className="text-blue-600 font-bold">{keySignature}</span>
        </p>
      )}

      {/* 기능 버튼 3개를 한 줄에 배치 */}
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
