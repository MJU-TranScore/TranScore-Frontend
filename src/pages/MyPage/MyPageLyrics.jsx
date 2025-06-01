import React, { useEffect, useState } from "react";
import api from "../../lib/api";

export default function MyLyricsPage() {
  const [lyricsResults, setLyricsResults] = useState([]);

  const fetchLyricsResults = async () => {
    try {
      const res = await api.get("/mypage/result?type=lyrics");
      setLyricsResults(res.data);
    } catch (err) {
      console.error("가사 추출 결과 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchLyricsResults();
  }, []);

  const handleDelete = async (resultId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      await api.delete(`/mypage/result/${resultId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("삭제되었습니다!");
      fetchLyricsResults();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">가사 추출 결과</h2>
      {lyricsResults.length > 0 ? (
        <ul className="space-y-2">
          {lyricsResults.map((r) => (
            <li key={r.result_id} className="p-3 border rounded shadow-sm bg-white flex justify-between items-center">
              <span>결과 ID: {r.result_id} (저장일: {new Date(r.saved_at).toLocaleString()})</span>
              <button
                onClick={() => handleDelete(r.result_id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">저장된 가사 추출 결과가 없습니다.</p>
      )}
    </section>
  );
}
