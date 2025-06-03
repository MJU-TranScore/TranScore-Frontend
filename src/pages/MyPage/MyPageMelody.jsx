import React, { useEffect, useState } from "react";
import api from "../../lib/api";

export default function MyMelodyPage() {
  const [melodyResults, setMelodyResults] = useState([]);

  const fetchMelodyResults = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("🚨 accessToken이 없습니다. 로그인이 필요합니다.");
        return;
      }

      const res = await api.get("/mypage/result?type=melody", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMelodyResults(res.data);
    } catch (err) {
      console.error("멜로디 추출 결과 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchMelodyResults();
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
      fetchMelodyResults();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">멜로디 추출 결과</h2>
      {melodyResults.length > 0 ? (
        <ul className="space-y-4">
          {melodyResults.map((r) => (
            <li
              key={r.result_id}
              className="p-4 border rounded shadow-sm bg-white flex justify-between items-center"
            >
              {/* 왼쪽: 정보 */}
              <div>
                <div className="text-sm text-gray-500">ID: {r.result_id}</div>
                <div className="text-lg font-semibold">
                  {r.title || "제목 없음"}
                </div>
                <div className="text-sm text-gray-500">
                  파일명: {r.original_filename || "없음"}
                </div>
                <div className="text-sm text-gray-500">
                  저장일: {new Date(r.saved_at).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  조성: {r.key || "없음"}
                </div>
              </div>

              {/* 오른쪽: 버튼 */}
              <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                <a
                  href={`http://localhost:5000/result/melody/${r.result_id}/audio`}
                  download
                  className="px-3 py-1 border rounded text-sm text-green-600 hover:bg-green-100"
                >
                  다운로드
                </a>
                <button
                  onClick={() => handleDelete(r.result_id)}
                  className="px-3 py-1 border rounded text-sm text-red-500 hover:bg-red-100"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">저장된 멜로디 추출 결과가 없습니다.</p>
      )}
    </section>
  );
}
