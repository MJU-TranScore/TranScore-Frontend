import React, { useRef, useState, useEffect } from 'react';
import api from '../lib/api';

const KEY_LIST = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
function transposeKey(orig, shift) {
  const idx = KEY_LIST.indexOf(orig);
  if (idx < 0) return orig;
  return KEY_LIST[(idx + shift + 12) % 12];
}

export default function UploadPage({ onConverted }) {
  const fileRef = useRef();
  const [title, setTitle]                 = useState('');
  const [timeSignature, setTimeSignature] = useState('');
  const [file, setFile]                   = useState(null);
  const [currentKey, setCurrentKey]       = useState('');
  const [shift, setShift]                 = useState(0);
  const [resultKey, setResultKey]         = useState('');
  const [loading, setLoading]             = useState(false);

  useEffect(() => {
    if (currentKey) {
      setResultKey(transposeKey(currentKey, Number(shift)));
    }
  }, [currentKey, shift]);

  const handleFileChange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);

    try {
      const form = new FormData();
      form.append('file', f);
      const up = await api.post('/score/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const scoreId = up.data.id;

      await api.post(`/mypage/score/${scoreId}/save`);

      const info = await api.get(`/score/${scoreId}`);
      setCurrentKey(info.data.key || 'C');
    } catch (err) {
      console.error('파일 업로드/저장 에러:', err.response?.status, err.response?.data);
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleUpload = async () => {
    if (!/^\d+\/\d+$/.test(timeSignature)) {
      alert('올바른 박자 형식이 아닙니다. 예: 4/4');
      return;
    }
    if (!title || !timeSignature || !file) {
      alert('제목, 박자, 파일을 모두 입력/선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const up = await api.post('/score/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const scoreId = up.data.id;

      await api.post(`/mypage/score/${scoreId}/save`);

      const tr = await api.post(`/score/${scoreId}/transpose`, { key: shift });
      const transposeId = tr.data.transpose_result_id;

      await api.post(`/mypage/transpose/${transposeId}/save`);

      setTitle('');
      setTimeSignature('');
      setFile(null);
      setCurrentKey('');
      setShift(0);
      setResultKey('');
      onConverted();
    } catch (err) {
      console.error('업로드/변환 에러:', err.response?.status, err.response?.data);
      alert('서버 오류가 발생했습니다. 콘솔을 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-8 space-y-6">
        <div>
          <label className="block text-gray-700">곡 제목</label>
          <input
            type="text"
            placeholder="곡 제목을 입력하세요"
            className="w-full border rounded px-3 py-2 placeholder-gray-400"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700">박자 (예: 4/4)</label>
          <input
            type="text"
            placeholder="4/4"
            className="w-full border rounded px-3 py-2 placeholder-gray-400"
            value={timeSignature}
            onChange={e => setTimeSignature(e.target.value)}
          />
        </div>

        <div
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer"
        >
          {!file ? (
            <>
              <p className="text-gray-600">PDF 또는 이미지 업로드</p>
              <p className="text-sm text-gray-400">클릭 또는 드래그</p>
            </>
          ) : (
            <p className="text-gray-700"><strong>{file.name}</strong> 선택됨</p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div className="space-y-4">
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-gray-500">현재 Key</p>
                <p className="text-xl font-semibold">{currentKey || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">± 반음</label>
                <input
                  type="number"
                  min={-7}
                  max={7}
                  className="w-20 border rounded px-2 py-1"
                  value={shift}
                  onChange={e => setShift(e.target.value)}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">변환 후 Key</p>
                <p className="text-xl font-semibold">{resultKey || '-'}</p>
              </div>
            </div>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? '처리 중...' : '업로드 & 변환'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
