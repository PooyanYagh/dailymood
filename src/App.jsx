// src/App.jsx
import React, { useState } from 'react';
import { Sun, BookOpen, Activity } from 'lucide-react';
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
    saveMood,
    saveNews,
    saveGratitude,
    saveWish,
    toggleWish,
    saveValue,
    saveMeditation
  } = useSupabase();

  // دیتای پیش‌فرض برای نمودار
  const defaultChartData = [
    { day: 'شنبه', score: 5 }, { day: 'یکشنبه', score: 6 }, 
    { day: 'دوشنبه', score: 4 }, { day: 'سه‌شنبه', score: 7 },
    { day: 'چهارشنبه', score: 6 }, { day: 'پنجشنبه', score: 8 },
    { day: 'امروز', score: 8 }
  ];

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
            <ReflectionSection />
            <WishesSection 
              wishes={history.wishes} 
              onSave={saveWish} 
              onToggle={toggleWish} 
            />
            <ValuesCompass onSaveValue={saveValue} />
            <MeditationStudio onSave={saveMeditation} />
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryTab history={history} />
        )}

        {activeTab === 'reports' && (
          <ReportsTab 
            stats={stats} 
            chartData={[]} 
            defaultChartData={defaultChartData} 
          />
        )}

      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}