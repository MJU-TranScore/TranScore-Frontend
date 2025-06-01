import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function KeyChangePage() {
  const navigate = useNavigate();
  const [currentKey, setCurrentKey] = useState("C"); // 기본: "C"
  const [shift, setShift] = useState(0);
  const [transposedKey, setTransposedKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  // 최신 악보 정보 가져오기
  useEffect(() => {
    const latestScoreId = localStorage.getItem("latestScoreId");
    const latestKeySignature = localStorage.getItem("latestKeySignature");

    if (!latestScoreId) {
      alert("먼저 악보를 업로드하고 인식해주세요.");
      navigate("/");
      return;
    }

    // localStorage에 저장된 값을 state로 세팅
    setCurrentKey(latestKeySignature || "C");
  }, [navigate]);

  // 인식된 scoreId (저장된 값)
  const scoreId = localStorage.getItem("latestScoreId");

  // 미리보기 API 호출
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await api.post("/transpose-preview", {
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

    // currentKey가 유효할 때만 호출
    if (currentKey) {
      fetchPreview();
    }
  }, [shift, currentKey]);

  // 키 조정 핸들러
  const handleShiftChange = (amount) => {
    const newShift = shift + amount;
    if (newShift >= -6 && newShift <= 6) {
      setShift(newShift);
    }
  };

  // "변경하기" 버튼 클릭: 실제 키 변환 API 호출
  const handleTranspose = async () => {
    if (!scoreId) {
      alert("먼저 악보를 업로드해 주세요.");
      return;
    }

    try {
      const res = await api.post(`/score/${scoreId}/transpose`, { shift });
      console.log("키 변환 요청 응답:", res.data); // 👉 확인용 콘솔로그
      if (res.status === 201) {
        const { result_id } = res.data;
        console.log("받은 result_id:", result_id); // 👉 확인용 콘솔로그

        // 👉 여기서 올바른 라우트로 이동!
        navigate(`/key-change/${scoreId}/result/${result_id}`);
      } else {
        alert("키 변경에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("키 변경 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 mt-8 rounded-lg shadow text-center">
      <h2 className="text-2xl font-bold mb-4">키 변경</h2>

      {/* 현재 키 */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">현재 키</label>
        <input
          type="text"
          value={currentKey}
          onChange={(e) => setCurrentKey(e.target.value.toUpperCase())}
          className="border px-3 py-2 rounded w-24 text-center"
        />
      </div>

      {/* 반음 이동 */}
      <div className="mb-4 flex justify-center items-center space-x-4">
        <button
          onClick={() => handleShiftChange(-1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          -1
        </button>
        <span className="text-xl font-semibold">{shift}</span>
        <button
          onClick={() => handleShiftChange(1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          +1
        </button>
      </div>

      {/* 미리보기 */}
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

      {/* 버튼 */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
        >
          처음으로
        </button>
        <button
          onClick={handleTranspose}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          변경하기
        </button>
      </div>
    </div>
  );
}
