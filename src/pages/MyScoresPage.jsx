import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function MyScoresPage() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/mypage/score'),
      api.get('/mypage/transpose'),
      api.get('/mypage/lyrics'),
      api.get('/mypage/melody'),
    ])
    .then(([r1, r2, r3, r4]) => {
      const list = [
        ...(Array.isArray(r1.data) ? r1.data.map(s => ({ ...s, type:'original' })) : []),
        ...(Array.isArray(r2.data) ? r2.data.map(t => ({ 
            ...t, 
            type:'transpose', 
            transpose_result_id: t.transform_transpose_id 
          })) : []),
        ...(Array.isArray(r3.data) ? r3.data.map(l => ({ ...l, type:'lyrics' })) : []),
        ...(Array.isArray(r4.data) ? r4.data.map(m => ({ ...m, type:'melody' })) : []),
      ];
      setItems(list);
    })
    .catch(err => {
      console.error('내 악보 목록 불러오기 실패', err);
      const local = JSON.parse(localStorage.getItem('savedScores') || '[]');
      setItems(local);
    })
    .finally(() => setLoading(false));
  }, []);

  const handleView = it => {
    if (it.type === 'original')  window.open(it.file_url, '_blank');
    if (it.type === 'transpose') window.open(`/result/transpose/${it.transpose_result_id}/image`, '_blank');
    if (it.type === 'lyrics')    window.open(`/result/lyrics/${it.lyrics_result_id}/text`, '_blank');
    if (it.type === 'melody')    window.open(`/result/melody/${it.melody_result_id}/info`, '_blank');
  };
  const handleDownload = it => {
    if (it.type === 'original')  window.open(it.file_url, '_blank');
    if (it.type === 'transpose') window.open(`/result/transpose/${it.transpose_result_id}/download`, '_blank');
    if (it.type === 'lyrics')    window.open(`/result/lyrics/${it.lyrics_result_id}/download`, '_blank');
    if (it.type === 'melody')    window.open(`/result/melody/${it.melody_result_id}/audio`, '_blank');
  };
  const handleDelete = it => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const ep = {
      original:  `/mypage/score/${it.id}`,
      transpose: `/mypage/transpose/${it.transpose_result_id}`,
      lyrics:    `/mypage/lyrics/${it.lyrics_result_id}`,
      melody:    `/mypage/melody/${it.melody_result_id}`
    }[it.type];
    api.delete(ep)
      .then(() => setItems(prev => prev.filter(x => x !== it)))
      .catch(err => console.error('삭제 실패', err));
  };

  if (loading) {
    return <p className="p-8 text-center text-gray-500">불러오는 중...</p>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">내 악보 목록</h2>
      {items.length === 0
        ? <p className="text-gray-500">저장된 악보가 없습니다.</p>
        : (
          <ul className="space-y-4">
            {items.map((it, i) => (
              <li key={i} className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                <div>
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 mr-2">
                    {it.type.toUpperCase()}
                  </span>
                  <span className="font-medium text-gray-800">
                    {it.title || it.type}
                  </span>
                  <div className="text-xs text-gray-400 mt-1">
                    {it.uploaded_at ? new Date(it.uploaded_at).toLocaleString() : ''}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={()=>handleView(it)} className="px-3 py-1 border rounded hover:bg-gray-100">보기</button>
                  <button onClick={()=>handleDownload(it)} className="px-3 py-1 border rounded hover:bg-gray-100">다운로드</button>
                  <button onClick={()=>handleDelete(it)} className="px-3 py-1 border rounded text-red-500 hover:bg-gray-100">삭제</button>
                </div>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
