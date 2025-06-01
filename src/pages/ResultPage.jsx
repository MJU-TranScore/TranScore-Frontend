import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function ResultPage() {
  const { resultId } = useParams();
  const navigate = useNavigate();

  const handleSaveToMypage = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(`/mypage/result/${resultId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('마이페이지에 저장되었습니다!');
    } catch (err) {
      console.error(err);
      alert('저장 실패: ' + err.message);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 mt-8 rounded-lg shadow text-center">
      <h2 className="text-2xl font-bold mb-4">변경된 악보 결과</h2>
      <img
        src={`http://localhost:5000/result/transpose/${resultId}/image`}
        alt="변경된 악보 이미지"
        className="w-full max-w-md mb-4 border rounded shadow"
      />
      <div className="flex justify-center space-x-4 mt-6">
        <a
          href={`http://localhost:5000/result/transpose/${resultId}/download`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          download
        >
          다운로드
        </a>
        <button
          onClick={handleSaveToMypage}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          마이페이지에 저장
        </button>
        <button
          onClick={handleGoHome}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
        >
          처음으로
        </button>
      </div>
    </div>
  );
}
