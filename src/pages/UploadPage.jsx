import React, { useRef, useState, useEffect } from 'react'
import api from '../lib/api'
import ResultsPage from './ResultsPage'

const KEY_LIST = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function transposeKey(originalKey, shift) {
  const index = KEY_LIST.indexOf(originalKey)
  return index < 0 ? originalKey : KEY_LIST[(index + shift + 12) % 12]
}

export default function UploadPage({ onConverted }) {
  const fileRef = useRef()
  const [stage, setStage] = useState('form')
  const [title, setTitle] = useState('')
  const [timeSignature, setTimeSignature] = useState('')
  const [file, setFile] = useState(null)
  const [scoreId, setScoreId] = useState(null)
  const [currentKey, setCurrentKey] = useState('')
  const [shift, setShift] = useState(0)
  const [resultKey, setResultKey] = useState('')

  useEffect(() => {
    if (currentKey) {
      setResultKey(transposeKey(currentKey, Number(shift)))
    }
  }, [currentKey, shift])

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    setFile(selectedFile)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await api.post('/score/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      console.log('upload response:', response.data)

      const id = response.data.score_id || response.data.id
      setScoreId(id) // ✅ 상태 반영
      console.log('scoreId =', id)

      try {
        const infoResponse = await api.get(`/score/${id}`)
        console.log('score info:', infoResponse.data)
        setCurrentKey(infoResponse.data.key || 'C')
      } catch (infoErr) {
        console.error('메타 조회 실패', infoErr.response?.status, infoErr.response?.data)
        alert('메타 조회에 실패했습니다.')
      }
    } catch (err) {
      console.error('업로드 단계 에러', err)
      alert('파일 업로드에 실패했습니다.')
    }
  }

  const handleShowResults = () => {
    if (!file) {
      alert('파일을 업로드해주세요.')
      return
    }
    if (!title || !timeSignature) {
      alert('제목과 박자를 모두 입력해주세요.')
      return
    }
    setStage('results')
  }

  if (stage === 'results') {
    return (
      <ResultsPage
        scoreId={scoreId}
        currentKey={currentKey}
        shift={shift}
        resultKey={resultKey}
        onEdit={() => setStage('form')}
        onSave={onConverted}
      />
    )
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
        <>
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
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-20 border rounded px-2 py-1"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">변환 후 Key</p>
              <p className="text-xl font-semibold">{resultKey || '-'}</p>
            </div>
          </div>
          <button
            onClick={handleShowResults}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            결과 보기
          </button>
        </>
      )}
    </div>
  )
}
