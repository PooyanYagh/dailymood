// src/components/Header.jsx
import React from 'react';
import { Sun } from 'lucide-react';

export default function Header({ streakDays }) {
  return (
    <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-b-[40px] pt-12 pb-24 px-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 p-24 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="flex justify-between items-center max-w-3xl mx-auto relative z-10">
        <div>
          <p className="text-indigo-200 text-sm mb-1 flex items-center gap-2">
            <Sun size={14} /> امروز، یک شروع تازه است
          </p>
          <h1 className="text-white text-2xl font-black">باغچه ذهن من 🌿</h1>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
          <p className="text-white text-xs font-bold opacity-80">زنجیره آگاهی</p>
          <p className="text-white text-xl font-black mt-1 flex items-center justify-center gap-1">
            🔥 {streakDays} <span className="text-sm font-normal">روز</span>
          </p>
        </div>
      </div>
    </div>
  );
}