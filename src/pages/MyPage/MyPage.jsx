// src/pages/MyPage/MyPage.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function MyPage() {
  const linkClass =
    'px-3 py-2 rounded transition-colors duration-200 hover:bg-blue-200';
  const activeLinkClass = 'bg-blue-300 text-white';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      <div className="flex gap-2 mb-6">
        <NavLink
          to="uploads"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : 'bg-blue-100'}`
          }
        >
          내가 업로드한 악보
        </NavLink>
        <NavLink
          to="transpose"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : 'bg-blue-100'}`
          }
        >
          키 변환 결과
        </NavLink>
        <NavLink
          to="lyrics"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : 'bg-blue-100'}`
          }
        >
          가사 추출 결과
        </NavLink>
        <NavLink
          to="melody"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeLinkClass : 'bg-blue-100'}`
          }
        >
          멜로디 추출 결과
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
