import React, { useEffect, useState } from 'react';
import api from '../lib/api';

const MyScoresPage = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    api.get('/mypage/score')  // 서버에서 내 악보 목록 요청
      .then(res => setScores(res.data))
      .catch(err => console.error('악보 불러오기 실패', err));
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">내 악보 목록</h2>
      {scores.length === 0 ? (
        <p className="text-gray-500">저장된 악보가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {scores.map(score => (
            <li key={score.id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{score.title || '제목 없음'}</h3>
              <p className="text-sm text-gray-500">ID: {score.id}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyScoresPage;
