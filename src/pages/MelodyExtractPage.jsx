import React, { useRef, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function MelodyExtractPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [resultId, setResultId] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [title, setTitle] = useState("");
  const [keySignature, setKeySignature] = useState("");
  const [midiPath, setMidiPath] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fileRef = useRef();
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setHasError(false);

    const rawName = selectedFile.name;
    const withoutExt = rawName.replace(/\.[^/.]+$/, "");
    const cleanTitle = withoutExt && withoutExt !== rawName ? withoutExt : "제목없음";

    console.log("📁 파일명:", rawName);
    console.log("📝 저장될 제목:", cleanTitle);

    setTitle(cleanTitle);
  };

  const handleExtractMelody = async () => {
    if (!file) {
      alert("파일을 먼저 업로드해주세요.");
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await api.post("/transform/score/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const resInfo = await api.get("/transform/score/info");
      const scoreId = resInfo.data.score_id;
      setImageUrl(resInfo.data.imageUrl);

      const resMelody = await api.post(
        `/transform/score/${scoreId}/melody`,
        { start_measure: 1, end_measure: 9999 },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const mp3Url = resMelody.data.mp3_path;
      const resultId = resMelody.data.result_id;

      if (mp3Url) {
        setAudioUrl(`http://localhost:5000/${mp3Url}`);
        setResultId(resultId);
        setKeySignature(resMelody.data.key_signature || "");
        setMidiPath(resMelody.data.midi_path || "");

        await api.post(`/mypage/result/${resultId}/save`, {
          title,
        });
        console.log("✅ 자동 저장 완료");
      } else {
        setHasError(true);
      }
    } catch (err) {
      console.error("멜로디 추출 중 에러:", err.response?.data || err.message);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (sec) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += sec;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleSaveToMyPage = async () => {
    if (!resultId) {
      alert("저장할 결과 ID가 없습니다.");
      return;
    }
    try {
      await api.post(`/mypage/result/${resultId}/save`, {
        title,
      });
      alert("마이페이지에 저장되었습니다!");
      navigate("/mypage");
    } catch (err) {
      console.error("마이페이지 저장 실패:", err);
      alert("저장 실패: " + err.message);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "melody.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("다운로드 실패:", err);
      alert("다운로드에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-xl font-bold mb-4">🎵 Melody Extract Page</h1>

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

      <button
        onClick={handleExtractMelody}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4"
        disabled={isLoading}
      >
        멜로디 추출 시작
      </button>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="악보 이미지"
          className="mt-6 border rounded w-1/2 mx-auto"
        />
      )}

      {title && (
        <div className="mt-4 text-center text-sm text-gray-600">
          <p><strong>제목:</strong> {title}</p>
          <p><strong>조성:</strong> {keySignature}</p>
          <p><strong>MIDI 파일:</strong> {midiPath.split("/").pop()}</p>
        </div>
      )}

      <div className="flex space-x-4 mt-4">
        {resultId && (
          <button
            onClick={handleSaveToMyPage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            마이페이지에 저장
          </button>
        )}
        {audioUrl && (
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            다운로드
          </button>
        )}
      </div>

      <div className="mt-6">
        {isLoading && (
          <p className="text-center text-gray-500">
            🎧 멜로디 추출 중입니다. 잠시만 기다려주세요...
          </p>
        )}
        {!isLoading && hasError && (
          <p className="text-center text-red-500">
            음원을 불러오는 데 실패했습니다.
          </p>
        )}
        {!isLoading && audioUrl && (
          <div className="mt-4 bg-gray-100 p-4 rounded shadow-inner">
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
            <div className="flex items-center justify-center space-x-6 mt-2">
              <button
                onClick={() => skipTime(-5)}
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                ⏪
              </button>
              <button
                onClick={togglePlay}
                className="p-4 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>
              <button
                onClick={() => skipTime(5)}
                className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                ⏩
              </button>
            </div>
            <div className="text-center text-xs text-gray-600 mt-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
