// src/components/BottomNav.jsx
import React from 'react';
import { Sun, BookOpen, Activity } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'today', icon: Sun, label: 'امروز' },
    { id: 'history', icon: BookOpen, label: 'تاریخچه' },
    { id: 'reports', icon: Activity, label: 'گزارشات' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-indigo-50 flex justify-around items-center p-4 z-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(79,70,229,0.05)] max-w-3xl mx-auto">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)} 
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className="text-[10px] font-black">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}