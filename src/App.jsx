// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useSupabase } from './hooks/useSupabase';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MoodTracker from './components/MoodTracker';
import NewsSection from './components/NewsSection';
import GratitudeSection from './components/GratitudeSection';
import ReflectionSection from './components/ReflectionSection';
import WishesSection from './components/WishesSection';
import ValuesCompass from './components/ValuesCompass';
import MeditationStudio from './components/MeditationStudio';
import HistoryTab from './components/HistoryTab';
import ReportsTab from './components/ReportsTab';

export default function MindfulApp() {
  const [activeTab, setActiveTab] = useState('today');
  
  const {
    todayData,
    history,
    stats,
    streakDays,
    loading,
    loadTodayData,
    saveMood,
    saveNews,
    saveGratitude,
    saveWish,
    toggleWish,
    saveValue,
    saveMeditation,
    saveReflection
  } = useSupabase();

  // ===== تابع کمکی برای تبدیل تاریخ به YYYY-MM-DD =====
  const toDateStr = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ===== تابع تولید داده‌های نمودار از تاریخچه =====
  const getChartDataFromHistory = () => {
    const today = new Date();
    const data = [];
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

    if (!history.moods || history.moods.length === 0) {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayIndex = d.getDay();
        data.push({
          day: i === 0 ? 'امروز' : days[dayIndex],
          score: null,
          date: toDateStr(d),
          hasData: false
        });
      }
      return data;
    }

    const moodMap = {};
    history.moods.forEach(mood => {
      const dateStr = toDateStr(mood.created_at);
      moodMap[dateStr] = mood.score;
    });

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = toDateStr(d);
      const dayIndex = d.getDay();
      const dayName = i === 0 ? 'امروز' : days[dayIndex];

      const hasData = moodMap[dateStr] !== undefined;
      const score = hasData ? moodMap[dateStr] : null;

      data.push({
        day: dayName,
        score: score,
        date: dateStr,
        hasData: hasData
      });
    }

    return data;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-sm font-bold text-slate-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-24 font-sans text-slate-800" dir="rtl">
      <Header streakDays={streakDays} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-12 space-y-6 relative z-20">
        
        {activeTab === 'today' && (
          <div className="space-y-6">
            <MoodTracker 
              todayMood={todayData.mood} 
              onSave={saveMood} 
            />
            
            <NewsSection 
              todayNews={todayData.news} 
              onSave={saveNews} 
            />
            
            <GratitudeSection 
              todayGratitude={todayData.gratitude} 
              onSave={saveGratitude} 
            />
            
            <ReflectionSection onSave={saveReflection} />
            
            <WishesSection 
              wishes={history.wishes} 
              onSave={saveWish} 
              onToggle={toggleWish} 
            />
            
            <ValuesCompass 
              onSaveValue={saveValue}
              todayValues={history.values} 
            />
            
            <MeditationStudio onSave={saveMeditation} />
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryTab history={history} />
        )}

        {activeTab === 'reports' && (
          <ReportsTab 
            stats={stats} 
            chartData={getChartDataFromHistory()} 
          />
        )}

      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
