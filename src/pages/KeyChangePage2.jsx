import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function KeyChangePage2() {
  const { resultId } = useParams();
  const navigate = useNavigate();

  const handleGoToResults = () => {
    // 결과 페이지로 이동
    navigate(`/result/transpose/${resultId}`);
  };

  const handleGoHome = () => {
    // 처음으로
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 mt-8 rounded-lg shadow text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-600">키 변경이 완료되었습니다!</h2>
      <p className="text-gray-700 mb-6">키 변경이 성공적으로 완료되었습니다. 결과를 확인해보세요!</p>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handleGoHome}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
        >
          처음으로
        </button>
        <button
          onClick={handleGoToResults}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          결과 보러가기
        </button>
      </div>
    </div>
  );
}
