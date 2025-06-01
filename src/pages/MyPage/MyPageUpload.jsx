import React, { useEffect, useState } from "react";
import api from "../../lib/api";

export default function MyUploadPage() {
  const [uploadScores, setUploadScores] = useState([]);

  const fetchUploadScores = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("🚨 accessToken이 없습니다. 로그인이 필요합니다.");
        return;
      }

      const res = await api.get("/mypage/score", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadScores(res.data);
    } catch (err) {
      console.error("업로드 악보 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchUploadScores();
  }, []);

  const handleDelete = async (scoreId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      await api.delete(`/mypage/score/${scoreId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("삭제되었습니다!");
      fetchUploadScores();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">내가 업로드한 악보</h2>
      {uploadScores.length > 0 ? (
        <ul className="space-y-2">
          {uploadScores.map((s) => (
            <li key={s.score_id} className="p-3 border rounded shadow-sm bg-white flex justify-between items-center">
              <span>{s.score_id} (저장일: {new Date(s.saved_at).toLocaleString()})</span>
              <button
                onClick={() => handleDelete(s.score_id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">저장된 업로드 악보가 없습니다.</p>
      )}
    </section>
  );
}
