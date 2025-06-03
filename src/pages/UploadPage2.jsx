import React, { useState } from 'react';

export default function UploadPage2({ fileUrl, onBack, onRecognize }) {
  const [isRecognizing, setIsRecognizing] = useState(false);

  const handleRecognizeClick = async () => {
    setIsRecognizing(true);
    await onRecognize(); // 비동기 처리 예상
    setIsRecognizing(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-center">
      <h2 className="text-2xl font-bold mb-4">업로드한 악보</h2>
      {fileUrl && (
        <img
          src={fileUrl}
          alt="Uploaded score"
          className="mx-auto max-w-[400px] rounded shadow"
        />
      )}
      {isRecognizing && (
        <p className="mt-4 text-black-600 font-semibold">인식중입니다. 잠시만 기다려주세요...</p>
      )}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          disabled={isRecognizing}
        >
          이전으로
        </button>
        <button
          onClick={handleRecognizeClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          disabled={isRecognizing}
        >
          인식하기
        </button>
      </div>
    </div>
  );
}
