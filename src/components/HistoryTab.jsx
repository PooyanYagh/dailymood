// src/components/HistoryTab.jsx
import React from 'react';
import { BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function HistoryTab({ history }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
        <h2 className="text-[#312E81] font-black text-lg mb-6 flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-500" />
          مرور گذشته
        </h2>
        
        {/* احساسات */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-500 mb-4 border-b border-slate-100 pb-2">😊 حس و حال‌های اخیر</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.moods && history.moods.length > 0 ? (
              history.moods.map((log, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 text-sm">{log.emotion_label}</span>
                  <span className="text-xs font-bold text-slate-400" dir="ltr">
                    {new Date(log.created_at).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">هنوز احساسی ثبت نکرده‌اید.</p>
            )}
          </div>
        </div>

        {/* شکرگزاری‌ها */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 mb-4 border-b border-slate-100 pb-2">🌟 شکرگزاری‌ها</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.gratitudes && history.gratitudes.length > 0 ? (
              history.gratitudes.map((log, i) => (
                <div key={i} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-50">
                  <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black mb-2">
                    {log.category_name}
                  </span>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">{log.content}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 text-left" dir="ltr">
                    {new Date(log.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">هنوز شکرگزاری ثبت نکرده‌اید.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}