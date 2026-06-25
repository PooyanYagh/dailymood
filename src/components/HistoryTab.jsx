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
        
        {/* لیست احساسات */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-500 mb-4 border-b border-slate-100 pb-2">
            😊 حس و حال‌های اخیر
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.moods.length > 0 ? (
              history.moods.map((log, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 text-sm">{log.emotion_label}</span>
                  <span className="text-xs font-bold text-slate-400" dir="ltr">
                    {new Date(log.created_at).toLocaleDateString('fa-IR')} - {new Date(log.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">هنوز احساسی ثبت نکرده‌اید.</p>
            )}
          </div>
        </div>

        {/* لیست اخبار خوب/بد */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-500 mb-4 border-b border-slate-100 pb-2">
            📰 اخبار و اتفاقات
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.news && history.news.length > 0 ? (
              history.news.map((log, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {log.good_news && (
                    <div className="flex items-start gap-2 text-emerald-700">
                      <ThumbsUp size={16} className="shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{log.good_news}</p>
                    </div>
                  )}
                  {log.bad_news && (
                    <div className="flex items-start gap-2 text-rose-700 mt-1">
                      <ThumbsDown size={16} className="shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{log.bad_news}</p>
                    </div>
                  )}
                  <p className="text-[10px] font-bold text-slate-400 mt-2 text-left" dir="ltr">
                    {new Date(log.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">هنوز خبری ثبت نکرده‌اید.</p>
            )}
          </div>
        </div>

        {/* لیست شکرگزاری‌ها */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 mb-4 border-b border-slate-100 pb-2">
            🌟 شکرگزاری‌ها
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.gratitudes.length > 0 ? (
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