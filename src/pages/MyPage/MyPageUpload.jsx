// src/pages/MyPage/MyPageUpload.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 라우터 hook
import api from '../../lib/api';

export default function MyPageUpload() {
  const [uploadScores, setUploadScores] = useState([]);
  const navigate = useNavigate(); // ✅

  const fetchUploadScores = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('🚨 accessToken이 없습니다. 로그인이 필요합니다.');
        return;
      }

      const res = await api.get('/mypage/score', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadScores(res.data);
    } catch (err) {
      console.error('업로드 악보 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchUploadScores();
  }, []);

  const handleDelete = async (scoreId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      await api.delete(`/mypage/score/${scoreId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('삭제되었습니다!');
      fetchUploadScores();
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // ✅ 악보 보기 버튼 클릭
  const handleViewScore = (scoreId) => {
    navigate(`/score/view/${scoreId}`);
  };

  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">내 악보 목록</h2>
      {uploadScores.length > 0 ? (
        <ul className="space-y-4">
          {uploadScores.map((s) => (
            <li
              key={s.score_id}
              className="p-4 border rounded shadow-sm bg-white flex justify-between items-center"
            >
              {/* 왼쪽: 정보 */}
              <div>
                <div className="text-sm text-gray-500">ID: {s.score_id}</div>
                <div className="text-lg font-semibold">{s.title || '제목 없음'}</div>
                <div className="text-sm text-gray-500">
                  파일명: {s.original_filename}
                </div>
                <div className="text-sm text-gray-500">
                  저장일: {new Date(s.saved_at).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">조성: {s.key || '반음'}</div>
              </div>

              {/* 오른쪽: 버튼 */}
              <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                <button
                  onClick={() => handleViewScore(s.score_id)}
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
                >
                  악보 보기
                </button>
                <button
                  onClick={() => handleDelete(s.score_id)}
                  className="px-3 py-1 border rounded text-sm text-red-500 hover:bg-red-100"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">저장된 업로드 악보가 없습니다.</p>
      )}
    </section>
  );
}
