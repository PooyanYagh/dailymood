// src/components/HistoryTab.jsx
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, ThumbsUp, ThumbsDown, 
  Heart, Sparkles, Wind, Compass, 
  CheckCircle2, X, Star, TrendingUp, TrendingDown
} from 'lucide-react';

export default function HistoryTab({ history }) {
  const [activeFilter, setActiveFilter] = useState('all');

  // ===== محاسبه آمار ارزش‌ها =====
  const valueStats = useMemo(() => {
    if (!history.values || history.values.length === 0) {
      return { average: 0, total: 0, ranked: [], counts: {} };
    }

    // محاسبه میانگین هر ارزش
    const valueMap = {};
    history.values.forEach(item => {
      if (!valueMap[item.value_name]) {
        valueMap[item.value_name] = { scores: [], total: 0, count: 0 };
      }
      valueMap[item.value_name].scores.push(item.score);
      valueMap[item.value_name].total += item.score;
      valueMap[item.value_name].count += 1;
    });

    // محاسبه میانگین و رتبه‌بندی
    const ranked = Object.keys(valueMap).map(name => {
      const avg = valueMap[name].total / valueMap[name].count;
      return {
        name,
        average: Math.round(avg * 10) / 10,
        count: valueMap[name].count,
        scores: valueMap[name].scores
      };
    });

    // مرتب‌سازی بر اساس میانگین (بالاترین اول)
    ranked.sort((a, b) => b.average - a.average);

    // میانگین کلی
    const allScores = history.values.map(v => v.score);
    const overallAvg = allScores.reduce((a, b) => a + b, 0) / allScores.length;

    return {
      average: Math.round(overallAvg * 10) / 10,
      total: history.values.length,
      ranked,
      counts: valueMap
    };
  }, [history.values]);

  // ===== محاسبه تعداد هر بخش =====
  const counts = {
    moods: history.moods?.length || 0,
    news: history.news?.length || 0,
    gratitude: history.gratitudes?.length || 0,
    wishes: history.wishes?.length || 0,
    meditation: history.meditations?.length || 0,
    values: history.values?.length || 0
  };

  // ===== فیلتر کردن بر اساس نوع =====
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

    // اخبار
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

    return allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredItems = getFilteredItems();

  // ===== تابع نمایش برچسب نوع =====
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

  // ===== تابع نمایش ستاره برای ارزش‌ها =====
  const renderStars = (score) => {
    return '⭐'.repeat(score) + '☆'.repeat(5 - score);
  };

  return (
    <div className="space-y-6">
      {/* ===== بخش ارزش‌ها - میانگین و رتبه‌بندی ===== */}
      {history.values && history.values.length > 0 && (
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
          <h2 className="text-[#312E81] font-black text-lg mb-4 flex items-center gap-2">
            <Compass size={20} className="text-teal-500" />
            تحلیل ارزش‌ها
          </h2>
          
          {/* میانگین کلی */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl mb-4 border border-indigo-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-500">میانگین کلی ارزش‌ها</p>
                <p className="text-2xl font-black text-indigo-700">{valueStats.average} / ۵</p>
              </div>
              <div className="text-2xl">
                {renderStars(Math.round(valueStats.average))}
              </div>
              <div className="text-xs font-bold text-slate-400">
                {valueStats.total} ثبت شده
              </div>
            </div>
          </div>

          {/* رتبه‌بندی ارزش‌ها */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 mb-2">رتبه‌بندی ارزش‌ها (بر اساس میانگین)</p>
            
            {valueStats.ranked.map((item, index) => {
              const rankColors = [
                'bg-amber-500 text-white',
                'bg-slate-400 text-white',
                'bg-amber-700 text-white',
                'bg-indigo-100 text-indigo-700',
                'bg-slate-100 text-slate-600'
              ];
              const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
              
              return (
                <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${rankColors[index] || 'bg-slate-100'}`}>
                    {rankIcon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1E1B4B]">{item.name}</span>
                      <span className="text-sm font-black text-indigo-600">{item.average} / ۵</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs">{renderStars(Math.round(item.average))}</span>
                      <span className="text-[9px] font-bold text-slate-400">({item.count} بار ثبت)</span>
                    </div>
                    {/* نوار پیشرفت */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(item.average / 5) * 100}%`,
                          background: `linear-gradient(to right, #6366f1, #8b5cf6)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* جدول تعداد ثبت‌ها */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {valueStats.ranked.map(item => (
              <div key={item.name} className="text-center p-2 bg-slate-50 rounded-xl">
                <p className="text-[8px] font-bold text-slate-400 truncate">{item.name}</p>
                <p className="text-sm font-black text-indigo-600">{item.count} بار</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== لیست کامل تاریخچه ===== */}
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

        {/* ===== فیلترها ===== */}
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

        {/* ===== لیست آیتم‌ها ===== */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div 
                key={`${item.type}-${item.id || index}`} 
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  
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

        {/* ===== آمار کلی ===== */}
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
