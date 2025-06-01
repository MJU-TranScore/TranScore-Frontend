import React, { useState } from "react";
import api from "../lib/api";

export default function MelodyExtractPage() {
  const [scoreId, setScoreId] = useState(""); // 입력된 score_id
  const [resultId, setResultId] = useState(null);
  const [melodyInfo, setMelodyInfo] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMelodyExtract = async () => {
    if (!scoreId) {
      alert("score_id를 입력하세요!");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ 멜로디 추출 요청
      const res = await api.post(`/score/${scoreId}/melody`);
      const { result_id } = res.data;
      setResultId(result_id);

      // 2️⃣ 추출된 멜로디 정보 조회
      const infoRes = await api.get(`/result/melody/${result_id}/info`);
      setMelodyInfo(infoRes.data);

      // 3️⃣ 오디오 URL 설정
      setAudioUrl(`/result/melody/${result_id}/audio`);
    } catch (err) {
      console.error("멜로디 추출 실패:", err);
      alert("멜로디 추출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-center space-y-4">
      <h2 className="text-2xl font-bold mb-4">멜로디 추출</h2>

      <div className="space-y-2">
        <input
          type="text"
          value={scoreId}
          onChange={(e) => setScoreId(e.target.value)}
          placeholder="score_id를 입력하세요"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleMelodyExtract}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "추출 중..." : "멜로디 추출 요청"}
        </button>
      </div>

      {resultId && (
        <div className="mt-4 text-left">
          <h3 className="text-lg font-semibold">추출 결과</h3>
          <p><strong>Result ID:</strong> {resultId}</p>

          {melodyInfo && (
            <div className="bg-gray-100 p-2 mt-2 rounded">
              <h4 className="font-medium">멜로디 메타 정보</h4>
              <pre className="text-sm">{JSON.stringify(melodyInfo, null, 2)}</pre>
            </div>
          )}

          {audioUrl && (
            <div className="mt-4">
              <h4 className="font-medium">멜로디 오디오</h4>
              <audio controls src={audioUrl} className="w-full mt-2"></audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
