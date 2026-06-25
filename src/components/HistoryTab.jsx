// src/components/HistoryTab.jsx
import React, { useState } from 'react';
import { 
  BookOpen, ThumbsUp, ThumbsDown, 
  Heart, Sparkles, Wind, Compass, 
  CheckCircle2, X
} from 'lucide-react';

export default function HistoryTab({ history }) {
  const [activeFilter, setActiveFilter] = useState('all'); // all | moods | news | gratitude | wishes | meditation | values

  // محاسبه تعداد هر بخش
  const counts = {
    moods: history.moods?.length || 0,
    news: history.news?.length || 0,
    gratitude: history.gratitudes?.length || 0,
    wishes: history.wishes?.length || 0,
    meditation: history.meditations?.length || 0,
    values: history.values?.length || 0
  };

  // فیلتر کردن بر اساس نوع
  const getFilteredItems = () => {
    const allItems = [];

    // احساسات
    if (activeFilter === 'all' || activeFilter === 'moods') {
      history.moods?.forEach(item => {
        allItems.push({
          ...item,
          type: 'mood',
          icon: '😊',
          title: item.emotion_label,
          subtitle: 'احساس',
          date: item.created_at
        });
      });
    }

    // اخبار (خوب/بد)
    if (activeFilter === 'all' || activeFilter === 'news') {
      history.news?.forEach(item => {
        if (item.good_news) {
          allItems.push({
            ...item,
            type: 'news-good',
            icon: '👍',
            title: item.good_news,
            subtitle: 'خبر خوب',
            date: item.created_at
          });
        }
        if (item.bad_news) {
          allItems.push({
            ...item,
            type: 'news-bad',
            icon: '👎',
            title: item.bad_news,
            subtitle: 'چالش',
            date: item.created_at
          });
        }
      });
    }

    // شکرگزاری
    if (activeFilter === 'all' || activeFilter === 'gratitude') {
      history.gratitudes?.forEach(item => {
        allItems.push({
          ...item,
          type: 'gratitude',
          icon: '🌟',
          title: item.content,
          subtitle: `شکرگزاری - ${item.category_name}`,
          date: item.created_at
        });
      });
    }

    // خواسته‌ها
    if (activeFilter === 'all' || activeFilter === 'wishes') {
      history.wishes?.forEach(item => {
        allItems.push({
          ...item,
          type: 'wish',
          icon: item.is_fulfilled ? '✅' : '🤲',
          title: item.content,
          subtitle: item.is_fulfilled ? 'محقق شده ✨' : 'در انتظار تحقق',
          date: item.created_at
        });
      });
    }

    // مدیتیشن
    if (activeFilter === 'all' || activeFilter === 'meditation') {
      history.meditations?.forEach(item => {
        const minutes = Math.floor(item.duration_seconds / 60);
        const seconds = item.duration_seconds % 60;
        allItems.push({
          ...item,
          type: 'meditation',
          icon: '🧘',
          title: `${minutes} دقیقه و ${seconds} ثانیه`,
          subtitle: `مدیتیشن - ${item.active_chakras?.length || 0} چاکرا فعال`,
          date: item.created_at
        });
      });
    }

    // ارزش‌ها
    if (activeFilter === 'all' || activeFilter === 'values') {
      history.values?.forEach(item => {
        allItems.push({
          ...item,
          type: 'value',
          icon: '⭐',
          title: `${item.value_name}: ${item.score}/۵`,
          subtitle: 'ارزش روزانه',
          date: item.created_at
        });
      });
    }

    // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
    return allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredItems = getFilteredItems();

  // تابع نمایش آیکون بر اساس نوع
  const getTypeBadge = (type) => {
    const badges = {
      'mood': 'bg-rose-100 text-rose-700',
      'news-good': 'bg-emerald-100 text-emerald-700',
      'news-bad': 'bg-rose-100 text-rose-700',
      'gratitude': 'bg-amber-100 text-amber-700',
      'wish': 'bg-indigo-100 text-indigo-700',
      'meditation': 'bg-cyan-100 text-cyan-700',
      'value': 'bg-purple-100 text-purple-700'
    };
    return badges[type] || 'bg-slate-100 text-slate-700';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'mood': 'احساس',
      'news-good': 'خبر خوب',
      'news-bad': 'چالش',
      'gratitude': 'شکرگزاری',
      'wish': 'خواسته',
      'meditation': 'مدیتیشن',
      'value': 'ارزش'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-500" />
            مرور گذشته
          </h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {filteredItems.length} مورد
          </span>
        </div>

        {/* فیلترها */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'all' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            همه ({filteredItems.length})
          </button>
          <button
            onClick={() => setActiveFilter('moods')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'moods' 
                ? 'bg-rose-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            😊 احساسات ({counts.moods})
          </button>
          <button
            onClick={() => setActiveFilter('news')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'news' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📰 اخبار ({counts.news})
          </button>
          <button
            onClick={() => setActiveFilter('gratitude')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'gratitude' 
                ? 'bg-amber-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌟 شکرگزاری ({counts.gratitude})
          </button>
          <button
            onClick={() => setActiveFilter('wishes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'wishes' 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🤲 خواسته‌ها ({counts.wishes})
          </button>
          <button
            onClick={() => setActiveFilter('meditation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'meditation' 
                ? 'bg-cyan-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🧘 مدیتیشن ({counts.meditation})
          </button>
          <button
            onClick={() => setActiveFilter('values')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'values' 
                ? 'bg-purple-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⭐ ارزش‌ها ({counts.values})
          </button>
        </div>

        {/* لیست آیتم‌ها */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div 
                key={`${item.type}-${item.id || index}`} 
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* آیکون */}
                  <div className="text-2xl shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  
                  {/* محتوا */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getTypeBadge(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                      {item.subtitle && (
                        <span className="text-[10px] font-bold text-slate-400">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#1E1B4B] leading-relaxed">
                      {item.title}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 text-left" dir="ltr">
                      {new Date(item.date).toLocaleDateString('fa-IR')} - {new Date(item.date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-sm font-bold text-slate-400">هیچ موردی در این بخش یافت نشد.</p>
              <p className="text-xs text-slate-300 mt-1">با ثبت فعالیت‌های روزانه، این بخش پر خواهد شد.</p>
            </div>
          )}
        </div>

        {/* آمار کلی */}
        {filteredItems.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <div className="text-center p-2 bg-rose-50 rounded-xl">
              <p className="text-lg font-black text-rose-600">{counts.moods}</p>
              <p className="text-[8px] font-bold text-rose-400">احساسات</p>
            </div>
            <div className="text-center p-2 bg-emerald-50 rounded-xl">
              <p className="text-lg font-black text-emerald-600">{counts.news}</p>
              <p className="text-[8px] font-bold text-emerald-400">اخبار</p>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded-xl">
              <p className="text-lg font-black text-amber-600">{counts.gratitude}</p>
              <p className="text-[8px] font-bold text-amber-400">شکرگزاری</p>
            </div>
            <div className="text-center p-2 bg-indigo-50 rounded-xl">
              <p className="text-lg font-black text-indigo-600">{counts.wishes}</p>
              <p className="text-[8px] font-bold text-indigo-400">خواسته‌ها</p>
            </div>
            <div className="text-center p-2 bg-cyan-50 rounded-xl">
              <p className="text-lg font-black text-cyan-600">{counts.meditation}</p>
              <p className="text-[8px] font-bold text-cyan-400">مدیتیشن</p>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-xl">
              <p className="text-lg font-black text-purple-600">{counts.values}</p>
              <p className="text-[8px] font-bold text-purple-400">ارزش‌ها</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
