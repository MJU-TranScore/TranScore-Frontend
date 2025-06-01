import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function MyScoresPage() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      api.get('/mypage/score'),
      api.get('/mypage/transpose'),
      api.get('/mypage/lyrics'),
      api.get('/mypage/melody'),
    ])
    .then(([r1, r2, r3, r4]) => {
      const list = [
        ...(r1.data.map(s => ({ ...s, type: 'original' }))),
        ...(r2.data.map(t => ({ ...t, type: 'transpose', resultId: t.transform_transpose_id }))),
        ...(r3.data.map(l => ({ ...l, type: 'lyrics', resultId: l.lyrics_result_id }))),
        ...(r4.data.map(m => ({ ...m, type: 'melody', resultId: m.melody_result_id }))),
      ];
      setItems(list);
    })
    .catch(err => {
      console.error(err);
      setItems(JSON.parse(localStorage.getItem('savedScores') || '[]'));
    })
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (it) => {
    let delReq;
    if (it.type === 'original')
      delReq = api.delete(`/mypage/score/${it.id}`);
    else if (it.type === 'transpose')
      delReq = api.delete(`/mypage/transpose/${it.resultId}`);
    else if (it.type === 'lyrics')
      delReq = api.delete(`/mypage/lyrics/${it.resultId}`);
    else
      delReq = api.delete(`/mypage/melody/${it.resultId}`);

    delReq.then(() => loadData());
  };

  if (loading) {
    return <p className="text-center text-gray-500">불러오는 중…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">내 악보</h2>
      {items.length === 0 && <p className="text-gray-500">저장된 악보가 없습니다.</p>}
      {items.map((it, i) => (
        <div key={i} className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
          <div>
            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 mr-2">
              {it.type.toUpperCase()}
            </span>
            <span className="font-medium">{it.title || it.id}</span>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => {
                if (it.type === 'original')
                  window.open(it.file_url, '_blank');
                else if (it.type === 'transpose')
                  window.open(`/result/transpose/${it.resultId}/image`, '_blank');
                else if (it.type === 'lyrics')
                  window.open(`/result/lyrics/${it.resultId}/text`, '_blank');
                else
                  window.open(`/result/melody/${it.resultId}/audio`, '_blank');
              }}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              보기
            </button>
            <button
              onClick={() => handleDelete(it)}
              className="px-3 py-1 border rounded text-red-500 hover:bg-gray-100"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
