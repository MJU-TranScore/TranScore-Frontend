import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function KeyChangePage() {
  const navigate = useNavigate();
  const [currentKey, setCurrentKey] = useState("C");
  const [shift, setShift] = useState(0);
  const [transposedKey, setTransposedKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [scoreTitle, setScoreTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ 추가

  useEffect(() => {
    const latestScoreId = localStorage.getItem("latestScoreId");
    const latestKeySignature = localStorage.getItem("latestKeySignature");
    const latestScoreTitle = localStorage.getItem("latestScoreTitle");

    if (!latestScoreId) {
      alert("먼저 악보를 업로드하고 인식해주세요.");
      navigate("/");
      return;
    }

    setCurrentKey(latestKeySignature || "C");
    setScoreTitle(latestScoreTitle || "제목 정보 없음");
  }, [navigate]);

  const scoreId = localStorage.getItem("latestScoreId");

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await api.post("/transform/transpose-preview", {
          current_key: currentKey,
          shift: shift,
        });
        setTransposedKey(res.data.transposed_key);
        setMessage(res.data.message);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("변환 미리보기에 실패했습니다.");
      }
    };

    if (currentKey) {
      fetchPreview();
    }
  }, [shift, currentKey]);

  const handleShiftChange = (amount) => {
    const newShift = shift + amount;
    if (newShift >= -6 && newShift <= 6) {
      setShift(newShift);
    }
  };

  const handleTranspose = async () => {
    if (!scoreId) {
      alert("먼저 악보를 업로드해 주세요.");
      return;
    }

    try {
      setIsLoading(true); // ✅ 시작
      const res = await api.post(`/score/${scoreId}/transpose`, { shift });
      if (res.status === 201) {
        const { result_id } = res.data;
        navigate(`/key-change/${scoreId}/result/${result_id}`);
      } else {
        alert("키 변경에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("키 변경 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // ✅ 종료
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 mt-8 rounded-lg shadow text-center">
      <h2 className="text-2xl font-bold mb-2">키 변경</h2>

      <p className="text-gray-700 mb-4">
        현재 곡: <span className="font-semibold text-blue-600">{scoreTitle}</span>
      </p>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">현재 키</label>
        <input
          type="text"
          value={currentKey}
          onChange={(e) => setCurrentKey(e.target.value.toUpperCase())}
          className="border px-3 py-2 rounded w-24 text-center"
        />
      </div>

      <div className="mb-4 flex justify-center items-center space-x-4">
        <button
          onClick={() => handleShiftChange(-1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          disabled={isLoading}
        >
          -1
        </button>
        <span className="text-xl font-semibold">{shift}</span>
        <button
          onClick={() => handleShiftChange(1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          disabled={isLoading}
        >
          +1
        </button>
      </div>

      <div className="mb-4">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-gray-700">
              변경된 키: <span className="font-bold">{transposedKey}</span>
            </p>
            <p className="text-sm text-gray-500">{message}</p>
          </>
        )}
      </div>

      {isLoading && (
        <p className="text-black font-semibold mb-4">키 변경중입니다. 잠시만 기다려주세요.</p>
      )}

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
          disabled={isLoading}
        >
          처음으로
        </button>
        <button
          onClick={handleTranspose}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          disabled={isLoading}
        >
          변경하기
        </button>
      </div>
    </div>
  );
}
