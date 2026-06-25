// src/components/NewsSection.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';

export default function NewsSection({ todayNews, onSave }) {
  const [news, setNews] = useState({ good: '', bad: '' });
  const [newsSaved, setNewsSaved] = useState(false);

  // ===== بارگذاری داده‌های امروز =====
  useEffect(() => {
    if (todayNews) {
      setNews({
        good: todayNews.good_news || '',
        bad: todayNews.bad_news || ''
      });
    }
  }, [todayNews]);

  const handleSave = async () => {
    if (news.good.trim() === '' && news.bad.trim() === '') return;
    const success = await onSave(news.good, news.bad);
    if (success) {
      setNewsSaved(true);
      setTimeout(() => setNewsSaved(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
      <h2 className="text-[#312E81] font-black text-lg mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <BookOpen size={20} className="text-blue-500" />
          اتفاقات امروز
        </span>
        <button 
          onClick={handleSave}
          className={`px-4 py-1.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all duration-300 ${
            newsSaved 
              ? 'bg-emerald-500 text-white' 
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
          }`}
        >
          {newsSaved ? (
            <><CheckCircle2 size={14} /> ثبت شد!</>
          ) : (
            todayNews ? 'به‌روزرسانی' : 'ثبت'
          )}
        </button>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
          <label className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-2">
            <ThumbsUp size={16} /> خبر خوب / اتفاق مثبت
          </label>
          <textarea 
            value={news.good}
            onChange={(e) => setNews({...news, good: e.target.value})}
            placeholder="امروز چه اتفاق خوبی افتاد؟"
            className="w-full bg-white border border-emerald-100 focus:border-emerald-300 rounded-xl p-3 text-emerald-900 font-medium text-sm min-h-[80px] resize-none focus:outline-none transition-all placeholder:text-emerald-300"
          />
        </div>
        
        <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100">
          <label className="flex items-center gap-2 text-sm font-bold text-rose-700 mb-2">
            <ThumbsDown size={16} /> چالش امروز / خبر بد
          </label>
          <textarea 
            value={news.bad}
            onChange={(e) => setNews({...news, bad: e.target.value})}
            placeholder="چه چیزی امروز اذیتت کرد؟ (تخلیه ذهن)"
            className="w-full bg-white border border-rose-100 focus:border-rose-300 rounded-xl p-3 text-rose-900 font-medium text-sm min-h-[80px] resize-none focus:outline-none transition-all placeholder:text-rose-300"
          />
        </div>
      </div>
    </div>
  );
}
