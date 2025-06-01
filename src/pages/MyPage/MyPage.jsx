// src/pages/MyPage/MyPage.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function MyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      <div className="flex gap-4 mb-6">
        <Link to="uploads" className="px-3 py-2 bg-blue-100 rounded">내가 업로드한 악보</Link>
        <Link to="transpose" className="px-3 py-2 bg-blue-100 rounded">키 변환 결과</Link>
        <Link to="lyrics" className="px-3 py-2 bg-blue-100 rounded">가사 추출 결과</Link>
        <Link to="melody" className="px-3 py-2 bg-blue-100 rounded">멜로디 추출 결과</Link>
      </div>
      <Outlet />
    </div>
  );
}
