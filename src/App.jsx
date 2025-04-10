import React from 'react';

function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-white-800 text-black">
        <h1 className="text-2xl font-bold">TranScore</h1>
        <div className="space-x-4">
          <button className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded">로그인</button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded">회원가입</button>
        </div>
      </header>

      <nav className="bg-black-100 shadow-inner px-6 py-3 flex space-x-6 text-white-700 font-medium">
        <button className="hover:text-blue-600 transition">악보 인식</button>
        <button className="hover:text-blue-600 transition">커뮤니티</button>
      </nav>

      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="border-4 border-dashed border-gray-300 rounded-lg p-10 text-center w-2/3 max-w-xl">
          <p className="text-lg text-gray-600 mb-4">PDF 또는 이미지 파일을 여기에 드래그 앤 드롭하세요</p>
          <p className="text-sm text-gray-400">또는 클릭하여 파일 선택</p>
        </div>
      </div>
    </div>
  );
}

export default App;

