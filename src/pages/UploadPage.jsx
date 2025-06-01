import React, { useRef, useState } from 'react';
import api from '../lib/api';
import UploadPage2 from './UploadPage2';
import UploadPage3 from './UploadPage3';

export default function UploadPage() {
  const fileRef = useRef();
  const [stage, setStage] = useState('form'); // 'form' | 'results' | 'recognized'
  const [title, setTitle] = useState('');
  const [timeSignature, setTimeSignature] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [scoreId, setScoreId] = useState(null);
  const [xmlPath, setXmlPath] = useState('');
  const [pdfPath, setPdfPath] = useState('');
  const [keySignature, setKeySignature] = useState(''); // 👈 추가!

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setUploadedFileUrl(url);
  };

  const handleShowResults = async () => {
    if (!file) {
      alert('파일을 업로드해주세요.');
      return;
    }
    if (!title || !timeSignature) {
      alert('제목과 박자를 모두 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/score/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('upload response:', response.data);
      const id = response.data.score_id;
      setScoreId(id);

      setStage('results');
    } catch (err) {
      console.error('업로드 에러:', err);
      alert('파일 업로드에 실패했습니다.');
    }
  };

  const handleRecognize = async () => {
    try {
      const response = await api.post('/score/recognize', { score_id: scoreId });
      console.log('recognize response:', response.data);

      setXmlPath(response.data.xml_path);
      setPdfPath(response.data.pdf_path);
      setKeySignature(response.data.key); // 👈 추가: 인식된 키 저장

      setStage('recognized');
    } catch (err) {
      console.error('인식 에러:', err);
      alert('악보 인식에 실패했습니다.');
    }
  };

  if (stage === 'results') {
    return (
      <UploadPage2
        fileUrl={uploadedFileUrl}
        onBack={() => setStage('form')}
        onRecognize={handleRecognize}
      />
    );
  }

  if (stage === 'recognized') {
    return (
      <UploadPage3
        xmlPath={xmlPath}
        pdfPath={pdfPath}
        scoreId={scoreId} // 👈 scoreId 전달
        keySignature={keySignature} // 👈 인식된 키 전달
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow space-y-6">
      <div>
        <label className="block text-gray-700">곡 제목</label>
        <input
          type="text"
          placeholder="곡 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-gray-700">박자 (예: 4/4)</label>
        <input
          type="text"
          placeholder="4/4"
          value={timeSignature}
          onChange={(e) => setTimeSignature(e.target.value)}
          className="w-full border rounded px-3 py-2 placeholder-gray-400"
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
          <p className="text-gray-700">
            선택된 파일: <strong>{file.name}</strong>
          </p>
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
        <button
          onClick={handleShowResults}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          결과 보기
        </button>
      )}
    </div>
  );
}
