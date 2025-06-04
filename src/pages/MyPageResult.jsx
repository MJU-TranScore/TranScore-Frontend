import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function MyPageResult() {
  const { resultId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [keySignature, setKeySignature] = useState("");
  const [midiPath, setMidiPath] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/mypage/result/${resultId}/view`);
        const data = res.data;

        setTitle(data.title);
        setImageUrl(data.image_url);
        setKeySignature(data.key_signature);
        setMidiPath(data.midi_path);
      } catch (err) {
        console.error("결과 조회 실패:", err);
        alert("결과를 불러오는 데 실패했습니다.");
      }
    };

    fetchResult();
  }, [resultId]);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="악보 이미지"
          className="w-full max-w-md mb-4 mx-auto"
        />
      )}
      <p className="text-center text-gray-600 mb-2">조성: {keySignature}</p>
      <a
        href={`http://localhost:5000/${midiPath}`}
        className="block text-center bg-green-600 text-white py-2 rounded hover:bg-green-700"
        download
      >
        🎵 MIDI 다운로드
      </a>
      <button
        onClick={() => navigate("/mypage")}
        className="mt-4 block mx-auto bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
      >
        마이페이지로 돌아가기
      </button>
    </div>
  );
}
