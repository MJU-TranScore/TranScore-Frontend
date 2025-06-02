// src/pages/ScoreViewPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function ScoreViewPage() {
  const { scoreId } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await api.get(`/score/${scoreId}`);
        setScore(res.data);
      } catch (err) {
        console.error('악보 정보 불러오기 실패:', err);
        setError('악보 정보를 불러오는데 실패했습니다.');
      }
    };
    fetchScore();
  }, [scoreId]);

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );
  }

  if (!score) {
    return (
      <div className="text-center mt-10 text-gray-500">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">업로드한 악보</h1>
      <div className="flex flex-col items-center space-y-4">
        {/* ✅ 업로드된 이미지 보여주기 */}
        <img
          // ⚠️ 이 부분이 중요! 서버 절대 경로로 직접 접근하도록 수정
          src={`http://localhost:5000/uploaded_scores/${score.original_filename}`}
          alt="악보 이미지"
          className="w-full max-w-md border shadow rounded"
        />
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded shadow"
        >
          이전으로
        </button>
      </div>
    </div>
  );
}
