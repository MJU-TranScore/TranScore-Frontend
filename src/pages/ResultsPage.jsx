import React, { useState } from 'react';
import api from '../lib/api';

export default function ResultsPage({
  scoreId,
  currentKey,
  shift,
  resultKey,
  onEdit,
  onSave
}) {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!scoreId) {
      alert('scoreId가 존재하지 않습니다!');
      console.error('scoreId is missing:', scoreId);
      return;
    }

    setLoading(true);
    try {
      await api.post(`/mypage/score/${scoreId}/save`);
      const tr = await api.post(`/score/${scoreId}/transpose`, { shift });
      const tid = tr.data.transpose_result_id;
      await api.post(`/mypage/transpose/${tid}/save`);
      alert('마이페이지에 저장되었습니다.');
      onSave();
    } catch (err) {
      console.error(err);
      alert('변환 또는 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">결과 보기</h2>
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">현재 Key</p>
          <p className="text-lg font-semibold">{currentKey}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">± 반음</p>
          <p className="text-lg font-semibold">{shift}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">변환 후 Key</p>
          <p className="text-lg font-semibold">{resultKey}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
        >
          수정하기
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? '저장 중…' : '변환 및 저장'}
        </button>
      </div>
    </div>
  );
}
