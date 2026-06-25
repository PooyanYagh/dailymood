// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Sparkles, Sun, Wind, 
  Activity, CheckCircle2, ChevronLeft,
  Play, Square, ThumbsUp, ThumbsDown, Star,
  PlusCircle, BookOpen, Compass, Lightbulb, X
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { supabase } from './lib/supabase';

// دیتای جامع احساسات
const emotionGrid = {
  yellow: {
    id: 'yellow', name: 'انرژی بالا، خوشایند', color: 'bg-amber-400', lightBg: 'bg-amber-50', textColor: 'text-amber-700', icon: '☀️',
    emotions: [
      { id: 'y1', label: 'شاد', score: 8 }, { id: 'y2', label: 'هیجان‌زده', score: 9 },
      { id: 'y3', label: 'پرانرژی', score: 9 }, { id: 'y4', label: 'امیدوار', score: 8 },
      { id: 'y5', label: 'مغرور', score: 7 }, { id: 'y6', label: 'باانگیزه', score: 9 },
      { id: 'y7', label: 'خلاق', score: 8 }, { id: 'y8', label: 'شگفت‌زده', score: 8 }
    ]
  },
  green: {
    id: 'green', name: 'انرژی پایین، خوشایند', color: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-700', icon: '🍃',
    emotions: [
      { id: 'g1', label: 'آرام', score: 8 }, { id: 'g2', label: 'ریلکس', score: 8 },
      { id: 'g3', label: 'راضی', score: 7 }, { id: 'g4', label: 'متعادل', score: 8 },
      { id: 'g5', label: 'شکرگزار', score: 9 }, { id: 'g6', label: 'امن', score: 7 },
      { id: 'g7', label: 'متمرکز', score: 8 }, { id: 'g8', label: 'پذیرا', score: 8 }
    ]
  },
  red: {
    id: 'red', name: 'انرژی بالا، ناخوشایند', color: 'bg-rose-500', lightBg: 'bg-rose-50', textColor: 'text-rose-700', icon: '🔥',
    emotions: [
      { id: 'r1', label: 'عصبانی', score: 2 }, { id: 'r2', label: 'مضطرب', score: 3 },
      { id: 'r3', label: 'کلافه', score: 3 }, { id: 'r4', label: 'استرسی', score: 2 },
      { id: 'r5', label: 'وحشت‌زده', score: 1 }, { id: 'r6', label: 'بی‌قرار', score: 4 },
      { id: 'r7', label: 'حسود', score: 3 }, { id: 'r8', label: 'خشمگین', score: 1 }
    ]
  },
  blue: {
    id: 'blue', name: 'انرژی پایین، ناخوشایند', color: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-700', icon: '🌧️',
    emotions: [
      { id: 'b1', label: 'غمگین', score: 3 }, { id: 'b2', label: 'خسته', score: 4 },
      { id: 'b3', label: 'ناامید', score: 2 }, { id: 'b4', label: 'بی‌حوصله', score: 4 },
      { id: 'b5', label: 'تنها', score: 2 }, { id: 'b6', label: 'افسرده', score: 1 },
      { id: 'b7', label: 'بی‌تفاوت', score: 4 }, { id: 'b8', label: 'فرسوده', score: 2 }
    ]
  }
};

export default function MindfulApp() {
  // === State: Navigation ===
  const [activeTab, setActiveTab] = useState('today');

  // === State: Today's Data (برای نمایش داده‌های امروز) ===
  const [todayMood, setTodayMood] = useState(null);
  const [todayNewsId, setTodayNewsId] = useState(null);
  const [todayGratitudeId, setTodayGratitudeId] = useState(null);

  // === State: Dynamic Data & History ===
  const [chartData, setChartData] = useState([]);
  const [historyLogs, setHistoryLogs] = useState({ moods: [], gratitudes: [] });
  const [streakDays, setStreakDays] = useState(0);

  // === State: Mood ===
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);

  // === State: Good/Bad News ===
  const [news, setNews] = useState({ good: '', bad: '' });
  const [newsSaved, setNewsSaved] = useState(false);

  // === State: Gratitude ===
  const [gratitudeText, setGratitudeText] = useState('');
  const [gratitudeCategories, setGratitudeCategories] = useState(['خانواده', 'شغل', 'سلامتی', 'آرامش درون', 'رشد شخصی', 'مالی']);
  const [selectedGratitudeCat, setSelectedGratitudeCat] = useState('خانواده');
  const [newCatInput, setNewCatInput] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [isGratitudeSaved, setIsGratitudeSaved] = useState(false);

  // === State: Chakras ===
  const [chakras, setChakras] = useState([
    { id: 1, name: 'ریشه (Root)', color: 'bg-red-500', shadow: 'shadow-red-500/50', active: false },
    { id: 2, name: 'خاجی (Sacral)', color: 'bg-orange-500', shadow: 'shadow-orange-500/50', active: false },
    { id: 3, name: 'خورشیدی (Solar)', color: 'bg-yellow-400', shadow: 'shadow-yellow-400/50', active: false },
    { id: 4, name: 'قلب (Heart)', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50', active: false },
    { id: 5, name: 'گلو (Throat)', color: 'bg-cyan-500', shadow: 'shadow-cyan-500/50', active: false },
    { id: 6, name: 'چشم سوم (3rd Eye)', color: 'bg-indigo-600', shadow: 'shadow-indigo-600/50', active: false },
    { id: 7, name: 'تاج (Crown)', color: 'bg-purple-500', shadow: 'shadow-purple-500/50', active: false },
  ]);

  // === State: Meditation ===
  const [meditationState, setMeditationState] = useState({ isActive: false, seconds: 0, isFinished: false });
  const [postMeditationNote, setPostMeditationNote] = useState('');
  const [selectedPostChakras, setSelectedPostChakras] = useState([]);
  const timerRef = useRef(null);

  // === State: Wishes ===
  const [wishes, setWishes] = useState([]);
  const [newWishText, setNewWishText] = useState('');
  const [isWishesExpanded, setIsWishesExpanded] = useState(false);

  // === State: Self Reflection ===
  const [customQuestion, setCustomQuestion] = useState('');
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);

  // === State: Life Values ===
  const [lifeValues, setLifeValues] = useState([
    { id: 1, name: 'سلامتی فیزیکی و روانی', score: 0 },
    { id: 2, name: 'خانواده و روابط موثر', score: 0 },
    { id: 3, name: 'توسعه فردی و یادگیری', score: 0 },
    { id: 4, name: 'آرامش و تعادل درون', score: 0 },
    { id: 5, name: 'مسئولیت‌پذیری و شغل', score: 0 },
  ]);
  const [newValueInput, setNewValueInput] = useState('');
  const [showNewValueInput, setShowNewValueInput] = useState(false);

  // === State: Report Stats ===
  const [reportStats, setReportStats] = useState({
    moodDistribution: { yellow: 0, green: 0, blue: 0, red: 0 },
    newsCount: { good: 0, bad: 0 },
    topGratitude: 'در حال محاسبه...',
    meditation: { totalHours: 0, totalDays: 0 },
    topValue: 'در حال محاسبه...',
    wishes: { fulfilled: 0, pending: 0 }
  });

  // === Helper: Get today's date range ===
  const getTodayRange = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      start: `${today}T00:00:00`,
      end: `${today}T23:59:59`
    };
  };

  // === Load Today's Data from Supabase ===
  const loadTodayData = async () => {
    try {
      const { start, end } = getTodayRange();
      
      // 1. گرفتن احساس امروز
      const { data: moodToday } = await supabase
        .from('mood_logs')
        .select('*')
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (moodToday && moodToday.length > 0) {
        setTodayMood(moodToday[0]);
        setSelectedEmotion({
          id: moodToday[0].emotion_id,
          label: moodToday[0].emotion_label,
          score: moodToday[0].score
        });
        setSelectedQuadrant(moodToday[0].quadrant);
      } else {
        setTodayMood(null);
      }

      // 2. گرفتن اخبار امروز
      const { data: newsToday } = await supabase
        .from('daily_events')
        .select('*')
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (newsToday && newsToday.length > 0) {
        setTodayNewsId(newsToday[0].id);
        setNews({
          good: newsToday[0].good_news || '',
          bad: newsToday[0].bad_news || ''
        });
      } else {
        setTodayNewsId(null);
        setNews({ good: '', bad: '' });
      }

      // 3. گرفتن شکرگزاری امروز
      const { data: gratitudeToday } = await supabase
        .from('gratitude_logs')
        .select('*')
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (gratitudeToday && gratitudeToday.length > 0) {
        setTodayGratitudeId(gratitudeToday[0].id);
        setGratitudeText(gratitudeToday[0].content);
        setSelectedGratitudeCat(gratitudeToday[0].category_name);
      } else {
        setTodayGratitudeId(null);
        setGratitudeText('');
      }

    } catch (error) {
      console.error('Error loading today data:', error);
    }
  };

  // === Load All Data from Supabase ===
  const loadAllData = async () => {
    try {
      const { data: moodData } = await supabase
        .from('mood_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);
      
      const { data: gratitudeData } = await supabase
        .from('gratitude_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);
      
      const { data: wishesData } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: meditationData } = await supabase
        .from('meditation_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (moodData) {
        setHistoryLogs(prev => ({ ...prev, moods: moodData }));

        // Dynamic Chart Data (Last 7 days)
        const recentMoods = [...moodData].slice(0, 7).reverse();
        const dynamicChartData = recentMoods.map(log => ({
          day: new Date(log.created_at).toLocaleDateString('fa-IR', { weekday: 'short' }),
          score: log.score || 0
        }));
        setChartData(dynamicChartData);

        // Streak Calculation
        const uniqueDates = [...new Set(moodData.map(log => new Date(log.created_at).toISOString().split('T')[0]))];
        let currentStreak = 0;
        
        if (uniqueDates.length > 0) {
          const todayStr = new Date().toISOString().split('T')[0];
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
            currentStreak = 1;
            let lastDate = new Date(uniqueDates[0]);
            
            for (let i = 1; i < uniqueDates.length; i++) {
              const checkDate = new Date(uniqueDates[i]);
              const diffTime = Math.abs(lastDate - checkDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              
              if (diffDays === 1) {
                currentStreak++;
                lastDate = checkDate;
              } else {
                break;
              }
            }
          }
        }
        setStreakDays(currentStreak);

        const distribution = { yellow: 0, green: 0, blue: 0, red: 0 };
        moodData.forEach(log => {
          if (distribution[log.quadrant] !== undefined) {
            distribution[log.quadrant]++;
          }
        });
        const total = moodData.length || 1;
        setReportStats(prev => ({
          ...prev,
          moodDistribution: {
            yellow: Math.round((distribution.yellow / total) * 100),
            green: Math.round((distribution.green / total) * 100),
            blue: Math.round((distribution.blue / total) * 100),
            red: Math.round((distribution.red / total) * 100)
          }
        }));
      }

      if (gratitudeData) {
        setHistoryLogs(prev => ({ ...prev, gratitudes: gratitudeData }));
        const catCounts = {};
        gratitudeData.forEach(log => {
          catCounts[log.category_name] = (catCounts[log.category_name] || 0) + 1;
        });
        const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
        if (topCat) {
          setReportStats(prev => ({ ...prev, topGratitude: topCat[0] }));
        }
      }

      if (wishesData) {
        const fulfilled = wishesData.filter(w => w.is_fulfilled).length;
        const pending = wishesData.filter(w => !w.is_fulfilled).length;
        setWishes(wishesData);
        setReportStats(prev => ({ ...prev, wishes: { fulfilled, pending } }));
      }

      if (meditationData) {
        const totalSeconds = meditationData.reduce((sum, log) => sum + log.duration_seconds, 0);
        setReportStats(prev => ({
          ...prev,
          meditation: {
            totalHours: Math.round((totalSeconds / 3600) * 10) / 10,
            totalDays: meditationData.length
          }
        }));
      }

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // === Load data on mount ===
  useEffect(() => {
    loadAllData();
    loadTodayData();
  }, []);

  // === Meditation Timer ===
  useEffect(() => {
    if (meditationState.isActive) {
      timerRef.current = setInterval(() => {
        setMeditationState(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [meditationState.isActive]);

  // === Handlers ===
  const startMeditation = () => setMeditationState({ isActive: true, seconds: 0, isFinished: false });
  
  const stopMeditation = () => {
    clearInterval(timerRef.current);
    setMeditationState(prev => ({ ...prev, isActive: false, isFinished: true }));
    setSelectedPostChakras([]);
  };

  const togglePostChakra = (id) => {
    setSelectedPostChakras(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]);
  };

  const saveMeditation = async () => {
    try {
      await supabase.from('meditation_logs').insert({
        duration_seconds: meditationState.seconds,
        active_chakras: selectedPostChakras,
        notes: postMeditationNote
      });
      setChakras(chakras.map(c => selectedPostChakras.includes(c.id) ? { ...c, active: true } : c));
      setMeditationState({ isActive: false, seconds: 0, isFinished: false });
      setPostMeditationNote('');
      loadAllData();
    } catch (error) {
      console.error('Error saving meditation:', error);
    }
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAddCategory = () => {
    if (newCatInput.trim() !== '') {
      setGratitudeCategories([...gratitudeCategories, newCatInput.trim()]);
      setSelectedGratitudeCat(newCatInput.trim());
      setNewCatInput('');
      setShowNewCatInput(false);
    }
  };

  const handleAddWish = async () => {
    if (newWishText.trim() !== '') {
      try {
        const { data, error } = await supabase
          .from('wishes')
          .insert({ content: newWishText.trim() })
          .select();
        if (error) throw error;
        setWishes([{ id: data[0].id, content: newWishText.trim(), is_fulfilled: false, created_at: new Date().toISOString() }, ...wishes]);
        setNewWishText('');
        loadAllData();
      } catch (error) {
        console.error('Error adding wish:', error);
      }
    }
  };

  const toggleWish = async (id) => {
    try {
      const wish = wishes.find(w => w.id === id);
      if (!wish) return;
      const newStatus = !wish.is_fulfilled;
      const { error } = await supabase
        .from('wishes')
        .update({ 
          is_fulfilled: newStatus, 
          fulfilled_at: newStatus ? new Date().toISOString() : null 
        })
        .eq('id', id);
      if (error) throw error;
      setWishes(wishes.map(w => w.id === id ? { ...w, is_fulfilled: newStatus } : w));
      loadAllData();
    } catch (error) {
      console.error('Error toggling wish:', error);
    }
  };

  // === Save Mood (با قابلیت به‌روزرسانی امروز) ===
  const saveMood = async () => {
    if (!selectedEmotion || !selectedQuadrant) return;
    try {
      if (todayMood) {
        // به‌روزرسانی احساس امروز
        const { error } = await supabase
          .from('mood_logs')
          .update({
            emotion_id: selectedEmotion.id,
            emotion_label: selectedEmotion.label,
            quadrant: selectedQuadrant,
            score: selectedEmotion.score
          })
          .eq('id', todayMood.id);
        if (error) throw error;
      } else {
        // درج احساس جدید
        await supabase.from('mood_logs').insert({
          emotion_id: selectedEmotion.id,
          emotion_label: selectedEmotion.label,
          quadrant: selectedQuadrant,
          score: selectedEmotion.score
        });
      }
      setMoodSaved(true);
      setTimeout(() => setMoodSaved(false), 3000);
      loadAllData();
      loadTodayData();
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  // === Save News (با قابلیت به‌روزرسانی امروز) ===
  const saveNews = async () => {
    if (news.good.trim() === '' && news.bad.trim() === '') return;
    try {
      if (todayNewsId) {
        // به‌روزرسانی اخبار امروز
        const { error } = await supabase
          .from('daily_events')
          .update({
            good_news: news.good.trim() || null,
            bad_news: news.bad.trim() || null
          })
          .eq('id', todayNewsId);
        if (error) throw error;
      } else {
        // درج اخبار جدید
        await supabase.from('daily_events').insert({
          good_news: news.good.trim() || null,
          bad_news: news.bad.trim() || null
        });
      }
      setNewsSaved(true);
      setTimeout(() => setNewsSaved(false), 3000);
      loadAllData();
      loadTodayData();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  // === Save Gratitude (با قابلیت به‌روزرسانی امروز) ===
  const saveGratitude = async () => {
    if (gratitudeText.trim() === '') return;
    try {
      if (todayGratitudeId) {
        // به‌روزرسانی شکرگزاری امروز
        const { error } = await supabase
          .from('gratitude_logs')
          .update({
            category_name: selectedGratitudeCat,
            content: gratitudeText.trim()
          })
          .eq('id', todayGratitudeId);
        if (error) throw error;
      } else {
        // درج شکرگزاری جدید
        await supabase.from('gratitude_logs').insert({
          category_name: selectedGratitudeCat,
          content: gratitudeText.trim()
        });
      }
      setIsGratitudeSaved(true);
      setTimeout(() => setIsGratitudeSaved(false), 3000);
      loadAllData();
      loadTodayData();
    } catch (error) {
      console.error('Error saving gratitude:', error);
    }
  };

  // === Save Reflection ===
  const saveReflection = async () => {
    if (customQuestion.trim() === '' || reflectionAnswer.trim() === '') return;
    try {
      await supabase.from('self_reflections').insert({
        question: customQuestion.trim(),
        answer: reflectionAnswer.trim()
      });
      setIsReflectionSaved(true);
      setTimeout(() => setIsReflectionSaved(false), 3000);
      setCustomQuestion('');
      setReflectionAnswer('');
    } catch (error) {
      console.error('Error saving reflection:', error);
    }
  };

  // === Rate Value ===
  const rateValue = async (valueId, score) => {
    const value = lifeValues.find(v => v.id === valueId);
    if (!value) return;
    try {
      await supabase.from('value_ratings').insert({
        value_name: value.name,
        score: score
      });
      setLifeValues(lifeValues.map(v => v.id === valueId ? { ...v, score } : v));
      loadAllData();
    } catch (error) {
      console.error('Error saving value rating:', error);
    }
  };

  const handleAddValue = () => {
    if (newValueInput.trim() !== '') {
      setLifeValues([...lifeValues, { id: Date.now(), name: newValueInput.trim(), score: 0 }]);
      setNewValueInput('');
      setShowNewValueInput(false);
    }
  };

  // Fallback data if DB is empty
  const defaultChartData = [
    { day: 'شنبه', score: 5 }, { day: 'یکشنبه', score: 6 }, { day: 'دوشنبه', score: 4 },
    { day: 'سه‌شنبه', score: 7 }, { day: 'چهارشنبه', score: 6 }, { day: 'پنجشنبه', score: 8 },
    { day: 'امروز', score: selectedEmotion ? selectedEmotion.score : 8 }, 
  ];

  const activeChakrasCount = chakras.filter(c => c.active).length;

  return (
    <div 
      className="min-h-screen bg-[#F8F9FE] pb-24 font-sans text-slate-800" 
      dir="rtl"
      style={{ fontFamily: '"Vazirmatn", "Dana-FaNum", "Dana", Tahoma, sans-serif' }}
    >
      {/* ================= HEADER ================= */}
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-12 space-y-6 relative z-20">

        {/* ================= TAB 1: TODAY ================= */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            
            {/* 1. MOOD TRACKER */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
              <h2 className="text-[#312E81] font-black text-lg mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Heart size={20} className="text-rose-400" />
                  امروز چه احساسی داری؟
                </span>
                {selectedQuadrant && (
                  <button 
                    onClick={() => { setSelectedQuadrant(null); setSelectedEmotion(null); }}
                    className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-indigo-100 transition-colors"
                  >
                    <ChevronLeft size={14} /> بازگشت
                  </button>
                )}
              </h2>

              {/* نمایش وضعیت ثبت امروز */}
              {todayMood && !selectedQuadrant && (
                <div className="mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <p className="text-sm font-bold text-emerald-700">
                    ✅ امروز احساس خود را ثبت کردی: <span className="text-emerald-900">{todayMood.emotion_label}</span>
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedQuadrant(todayMood.quadrant);
                      setSelectedEmotion({
                        id: todayMood.emotion_id,
                        label: todayMood.emotion_label,
                        score: todayMood.score
                      });
                    }}
                    className="mt-2 text-xs font-bold text-indigo-600 underline"
                  >
                    ویرایش
                  </button>
                </div>
              )}

              {!selectedQuadrant ? (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSelectedQuadrant('yellow')} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-all hover:scale-[1.02]">
                    <span className="text-3xl mb-2">☀️</span>
                    <span className="font-black text-amber-600 text-sm">انرژی بالا</span>
                    <span className="text-xs font-bold text-amber-500">خوشایند</span>
                  </button>
                  <button onClick={() => setSelectedQuadrant('red')} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all hover:scale-[1.02]">
                    <span className="text-3xl mb-2">🔥</span>
                    <span className="font-black text-rose-600 text-sm">انرژی بالا</span>
                    <span className="text-xs font-bold text-rose-500">ناخوشایند</span>
                  </button>
                  <button onClick={() => setSelectedQuadrant('green')} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all hover:scale-[1.02]">
                    <span className="text-3xl mb-2">🍃</span>
                    <span className="font-black text-emerald-600 text-sm">انرژی پایین</span>
                    <span className="text-xs font-bold text-emerald-500">خوشایند</span>
                  </button>
                  <button onClick={() => setSelectedQuadrant('blue')} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all hover:scale-[1.02]">
                    <span className="text-3xl mb-2">🌧️</span>
                    <span className="font-black text-blue-600 text-sm">انرژی پایین</span>
                    <span className="text-xs font-bold text-blue-500">ناخوشایند</span>
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in duration-300">
                  <div className={`mb-4 p-3 rounded-xl flex items-center justify-center gap-2 ${emotionGrid[selectedQuadrant].lightBg} ${emotionGrid[selectedQuadrant].textColor}`}>
                    <span className="text-xl">{emotionGrid[selectedQuadrant].icon}</span>
                    <span className="font-bold text-sm">دقیقاً چه حسی داری؟</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {emotionGrid[selectedQuadrant].emotions.map(emotion => (
                      <button
                        key={emotion.id}
                        onClick={() => setSelectedEmotion(emotion)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border-2 
                          ${selectedEmotion?.id === emotion.id 
                            ? `${emotionGrid[selectedQuadrant].color} text-white border-transparent shadow-md scale-105` 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                          }`}
                      >
                        {emotion.label}
                      </button>
                    ))}
                  </div>
                  {selectedEmotion && (
                    <button 
                      onClick={saveMood}
                      className={`mt-4 w-full py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${moodSaved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'}`}
                    >
                      {moodSaved ? <><CheckCircle2 size={16} /> ثبت شد!</> : (todayMood ? 'به‌روزرسانی وضعیت روحی 🌱' : 'ثبت وضعیت روحی 🌱')}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 2. GOOD NEWS / BAD NEWS */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
              <h2 className="text-[#312E81] font-black text-lg mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen size={20} className="text-blue-500" />
                  اتفاقات امروز
                </span>
                <button 
                  onClick={saveNews}
                  className={`px-4 py-1.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all duration-300 ${newsSaved ? 'bg-emerald-500 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                >
                  {newsSaved ? <><CheckCircle2 size={14} /> ثبت شد!</> : (todayNewsId ? 'به‌روزرسانی' : 'ثبت')}
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
                  ></textarea>
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
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 3. GRATITUDE JOURNAL */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-400" />
                  دفترچه شکرگزاری
                </h2>
              </div>
              
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 mb-2">موضوع شکرگزاری امروز:</p>
                <div className="flex flex-wrap gap-2">
                  {gratitudeCategories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedGratitudeCat(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedGratitudeCat === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                  
                  {!showNewCatInput ? (
                    <button 
                      onClick={() => setShowNewCatInput(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 flex items-center gap-1 hover:bg-indigo-100 transition-all"
                    >
                      <PlusCircle size={14} /> جدید
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 bg-white border border-indigo-200 rounded-lg overflow-hidden pr-2">
                      <input 
                        type="text" 
                        value={newCatInput}
                        onChange={(e) => setNewCatInput(e.target.value)}
                        placeholder="موضوع جدید..."
                        className="text-xs p-1.5 focus:outline-none text-indigo-900 w-24"
                        autoFocus
                      />
                      <button onClick={handleAddCategory} className="bg-indigo-600 text-white px-2 py-1.5 text-xs font-bold">ثبت</button>
                      <button onClick={() => setShowNewCatInput(false)} className="text-slate-400 px-1"><X size={14}/></button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <textarea 
                  value={gratitudeText}
                  onChange={(e) => setGratitudeText(e.target.value)}
                  placeholder={`خدایا شکرت بابت ${selectedGratitudeCat}...`}
                  className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-[#1E1B4B] font-medium text-sm min-h-[100px] resize-none focus:outline-none transition-all placeholder:text-slate-400"
                ></textarea>
                
                <button 
                  onClick={saveGratitude}
                  className={`absolute bottom-4 left-4 px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition-all duration-300 ${isGratitudeSaved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'}`}
                >
                  {isGratitudeSaved ? <><CheckCircle2 size={14} /> ثبت شد!</> : (todayGratitudeId ? 'به‌روزرسانی 🌌' : 'ثبت در کائنات 🌌')}
                </button>
              </div>
            </div>

            {/* 3.5 SELF REFLECTION */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
                  <Lightbulb size={20} className="text-amber-500" />
                  پرسشگری و خودشناسی
                </h2>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-100 mb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl">💭</div>
                <p className="text-xs font-bold text-amber-600 mb-2">سوال امروز من:</p>
                <input 
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="سوالی که امروز می‌خواهم از خودم بپرسم را اینجا می‌نویسم..."
                  className="w-full bg-white/60 border border-amber-200 focus:border-amber-400 rounded-xl p-3 text-[#1E1B4B] font-black text-sm focus:outline-none transition-all placeholder:text-amber-700/40 relative z-10"
                />
              </div>
              
              <div className="relative">
                <textarea 
                  value={reflectionAnswer}
                  onChange={(e) => setReflectionAnswer(e.target.value)}
                  placeholder="پاسخ من به این سوال (بدون قضاوت)..."
                  className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-[#1E1B4B] font-medium text-sm min-h-[120px] resize-none focus:outline-none transition-all placeholder:text-slate-400"
                ></textarea>
                
                <button 
                  onClick={saveReflection}
                  className={`absolute bottom-4 left-4 px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition-all duration-300 ${isReflectionSaved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'}`}
                >
                  {isReflectionSaved ? <><CheckCircle2 size={14} /> ثبت شد!</> : 'ثبت پرسش و پاسخ ✍️'}
                </button>
              </div>
            </div>

            {/* 4. WISHES */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
                  <span className="text-xl">🤲</span>
                  نجواها و خواسته‌های من
                </h2>
              </div>
              <p className="text-xs font-bold text-slate-400 mb-4">خواسته‌هایت را مکتوب کن و وقتی به آنها رسیدی، با لذت تیک بزن.</p>
              
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newWishText}
                  onChange={(e) => setNewWishText(e.target.value)}
                  placeholder="خدایا از تو می‌خواهم که..."
                  className="flex-1 bg-[#F8FAFC] border-2 border-transparent focus:border-indigo-100 rounded-xl p-3 text-[#1E1B4B] font-medium text-sm focus:outline-none transition-all placeholder:text-slate-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWish()}
                />
                <button 
                  onClick={handleAddWish}
                  className="px-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 whitespace-nowrap"
                >
                  ثبت خواسته
                </button>
              </div>

              <div className="space-y-3 transition-all duration-300">
                {(isWishesExpanded ? wishes : wishes.slice(0, 3)).map(wish => (
                  <div key={wish.id} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${wish.is_fulfilled ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100 hover:border-indigo-100'}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <button 
                        onClick={() => toggleWish(wish.id)}
                        className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors ${wish.is_fulfilled ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-300 text-transparent hover:border-indigo-400'}`}
                      >
                        <CheckCircle2 size={16} strokeWidth={3} />
                      </button>
                      <div className="truncate">
                        <p className={`font-bold text-sm truncate ${wish.is_fulfilled ? 'text-emerald-700 line-through opacity-70' : 'text-[#1E1B4B]'}`}>
                          {wish.content}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                          {new Date(wish.created_at).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </div>
                    {wish.is_fulfilled && (
                      <span className="shrink-0 text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg ml-2">محقق شد ✨</span>
                    )}
                  </div>
                ))}
              </div>
              
              {wishes.length > 3 && (
                <button 
                  onClick={() => setIsWishesExpanded(!isWishesExpanded)}
                  className="w-full mt-4 py-2 text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center"
                >
                  {isWishesExpanded ? 'بستن لیست' : `نمایش همه خواسته‌ها (${wishes.length})`}
                </button>
              )}
            </div>

            {/* 5. LIFE VALUES COMPASS */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
                  <Compass size={20} className="text-teal-500" />
                  قطب‌نمای ارزش‌های من
                </h2>
              </div>
              <p className="text-xs font-bold text-slate-400 mb-6">امروز چقدر بر اساس ارزش‌های اصلی‌ات زندگی کردی؟ (رتبه‌بندی کن)</p>
              
              <div className="space-y-4">
                {lifeValues.map((val) => (
                  <div key={val.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all">
                    <span className="font-bold text-sm text-[#1E1B4B] mb-2 sm:mb-0">{val.name}</span>
                    <div className="flex gap-1" dir="ltr">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          onClick={() => rateValue(val.id, star)}
                          className="transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star 
                            size={22} 
                            fill={star <= val.score ? '#F59E0B' : 'transparent'} 
                            color={star <= val.score ? '#F59E0B' : '#CBD5E1'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                
                {!showNewValueInput ? (
                  <button 
                    onClick={() => setShowNewValueInput(true)}
                    className="w-full py-3 mt-2 text-sm text-indigo-600 font-bold border-2 border-dashed border-indigo-100 hover:bg-indigo-50 rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={16} /> افزودن ارزش جدید
                  </button>
                ) : (
                  <div className="flex gap-2 mt-4 bg-slate-50 p-2 rounded-2xl border border-indigo-100">
                    <input 
                      type="text" 
                      value={newValueInput}
                      onChange={(e) => setNewValueInput(e.target.value)}
                      placeholder="ارزش جدید (مثلاً: صداقت)..."
                      className="flex-1 bg-white border border-slate-200 focus:border-indigo-300 rounded-xl p-2 text-[#1E1B4B] font-medium text-sm focus:outline-none transition-all"
                      autoFocus
                    />
                    <button 
                      onClick={handleAddValue}
                      className="px-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                    >
                      ثبت
                    </button>
                    <button 
                      onClick={() => setShowNewValueInput(false)}
                      className="px-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
                    >
                      لغو
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 6. MEDITATION STUDIO */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50 overflow-hidden relative">
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
                  <Wind size={20} className="text-cyan-500" />
                  استودیو مدیتیشن
                </h2>
                {!meditationState.isActive && !meditationState.isFinished && (
                  <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {activeChakrasCount} / ۷ چاکرا فعال
                  </div>
                )}
              </div>
              
              {!meditationState.isActive && !meditationState.isFinished ? (
                <div className="text-center py-6 relative z-10">
                  <div className="w-24 h-24 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🧘‍♂️</span>
                  </div>
                  <h3 className="font-black text-[#1E1B4B] text-lg mb-2">زمان تمرکز و رهایی</h3>
                  <p className="text-sm font-medium text-slate-500 mb-8 max-w-sm mx-auto">
                    فرقی نمی‌کند ۵ دقیقه باشد یا یک ساعت. چشمانت را ببند و روی تنفست تمرکز کن. بعد از تمرین مشخص می‌کنیم کدام چاکراها فعال شدند.
                  </p>
                  
                  <button 
                    onClick={startMeditation}
                    className="mx-auto flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black hover:bg-indigo-700 hover:scale-105 transition-all"
                  >
                    <Play size={20} fill="currentColor" />
                    شروع مدیتیشن
                  </button>
                </div>
              ) : meditationState.isActive ? (
                <div className="text-center py-10 animate-in zoom-in duration-500 relative z-10">
                  <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full opacity-20 animate-ping bg-indigo-500"></div>
                    <div className="absolute inset-4 rounded-full opacity-40 animate-pulse bg-indigo-500"></div>
                    <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.3)]">
                      <span className="text-3xl animate-bounce">✨</span>
                    </div>
                  </div>
                  <h3 className="font-black text-xl mb-2 text-indigo-900">در حال مدیتیشن...</h3>
                  <p className="text-sm font-bold text-slate-400 mb-8">روی دم و بازدم تمرکز کن.</p>
                  
                  <div className="text-6xl font-black text-[#1E1B4B] mb-8 font-mono tracking-widest" dir="ltr">
                    {formatTime(meditationState.seconds)}
                  </div>
                  
                  <button 
                    onClick={stopMeditation}
                    className="mx-auto flex items-center gap-2 px-8 py-4 rounded-2xl bg-rose-50 text-rose-600 font-black hover:bg-rose-100 transition-colors"
                  >
                    <Square size={20} fill="currentColor" />
                    پایان مدیتیشن
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                  <div className="bg-indigo-50 p-4 rounded-2xl mb-6 text-center border border-indigo-100">
                    <span className="text-4xl block mb-2">🧘‍♀️</span>
                    <h3 className="font-black text-indigo-900 text-lg">خسته نباشی!</h3>
                    <p className="text-indigo-600 text-sm font-bold mt-1" dir="ltr">زمان تمرین: {formatTime(meditationState.seconds)}</p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-black text-[#1E1B4B] mb-3">
                      در این تمرین، روی کدام چاکراها کار کردی یا احساس انرژی داشتی؟
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {chakras.map(chakra => {
                        const isSelected = selectedPostChakras.includes(chakra.id);
                        return (
                          <button
                            key={chakra.id}
                            onClick={() => togglePostChakra(chakra.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${isSelected ? `${chakra.color} border-transparent text-white shadow-lg` : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}
                          >
                            <div className={`w-3 h-3 rounded-full mb-2 ${isSelected ? 'bg-white' : chakra.color}`}></div>
                            <span className="text-xs font-bold text-center leading-tight">{chakra.name.split(' ')[0]}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  <label className="block text-sm font-black text-[#1E1B4B] mb-2">
                    یادداشت بعد از تمرین (افکار و احساسات):
                  </label>
                  <textarea 
                    value={postMeditationNote}
                    onChange={(e) => setPostMeditationNote(e.target.value)}
                    placeholder="احساس سبکی می‌کنم، کمی ذهنم درگیر کار بود اما..."
                    className="w-full bg-[#F8FAFC] border-2 border-slate-100 focus:border-indigo-200 rounded-2xl p-4 text-[#1E1B4B] font-medium text-sm min-h-[100px] resize-none focus:outline-none transition-all placeholder:text-slate-400 mb-4"
                  ></textarea>
                  
                  <button 
                    onClick={saveMeditation}
                    className="w-full py-4 rounded-2xl font-black text-white bg-indigo-600 shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex justify-center items-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    ثبت لاگ و پاکسازی چاکراها
                  </button>
                </div>
              )}

              {!meditationState.isActive && !meditationState.isFinished && (
                <div className="absolute -bottom-10 -left-10 flex gap-2 opacity-20 pointer-events-none rotate-12">
                  {chakras.map(c => (
                    <div key={c.id} className={`w-8 h-32 rounded-full ${c.color} ${c.active ? 'opacity-100' : 'opacity-30'}`}></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
              <h2 className="text-[#312E81] font-black text-lg mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-500" />
                مرور گذشته
              </h2>
              
              {/* لیست احساسات */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-500 mb-4 border-b border-slate-100 pb-2">حس و حال‌های اخیر</h3>
                <div className="space-y-3">
                  {historyLogs.moods.length > 0 ? historyLogs.moods.map((log, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700 text-sm">{log.emotion_label}</span>
                      <span className="text-xs font-bold text-slate-400" dir="ltr">
                        {new Date(log.created_at).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-400">هنوز احساسی ثبت نکرده‌اید.</p>
                  )}
                </div>
              </div>

              {/* لیست شکرگزاری‌ها */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 mb-4 border-b border-slate-100 pb-2">شکرگزاری‌ها</h3>
                <div className="space-y-3">
                  {historyLogs.gratitudes.length > 0 ? historyLogs.gratitudes.map((log, i) => (
                    <div key={i} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-50">
                      <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black mb-2">{log.category_name}</span>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed">{log.content}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-3 text-left" dir="ltr">
                        {new Date(log.created_at).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-400">هنوز شکرگزاری ثبت نکرده‌اید.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 3: REPORTS ================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
                  <Activity size={20} className="text-purple-500" />
                  داشبورد و گزارشات (۳۰ روز گذشته)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <h3 className="text-xs font-black text-slate-500 mb-3">سهم رنگ‌های احساسی من</h3>
                  <div className="flex w-full h-4 rounded-full overflow-hidden mb-3">
                    <div style={{ width: `${reportStats.moodDistribution.yellow}%` }} className="bg-amber-400" title="انرژی بالا و مثبت"></div>
                    <div style={{ width: `${reportStats.moodDistribution.green}%` }} className="bg-emerald-500" title="آرامش و مثبت"></div>
                    <div style={{ width: `${reportStats.moodDistribution.blue}%` }} className="bg-blue-500" title="خستگی و غم"></div>
                    <div style={{ width: `${reportStats.moodDistribution.red}%` }} className="bg-rose-500" title="اضطراب و خشم"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold"><span className="w-2 h-2 rounded-full bg-amber-400"></span>{reportStats.moodDistribution.yellow}٪ انرژی بالا/مثبت</div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>{reportStats.moodDistribution.green}٪ آرامش/مثبت</div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold"><span className="w-2 h-2 rounded-full bg-blue-500"></span>{reportStats.moodDistribution.blue}٪ خستگی/غم</div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold"><span className="w-2 h-2 rounded-full bg-rose-500"></span>{reportStats.moodDistribution.red}٪ خشم/اضطراب</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100 text-center flex flex-col justify-center">
                     <span className="text-lg mb-1">👍</span>
                     <p className="text-xl font-black text-emerald-700">{reportStats.newsCount.good}</p>
                     <p className="text-[10px] font-bold text-emerald-600 mt-1">اتفاق خوب ثبت شده</p>
                   </div>
                   <div className="bg-rose-50/50 rounded-2xl p-3 border border-rose-100 text-center flex flex-col justify-center">
                     <span className="text-lg mb-1">👎</span>
                     <p className="text-xl font-black text-rose-700">{reportStats.newsCount.bad}</p>
                     <p className="text-[10px] font-bold text-rose-600 mt-1">چالش / اتفاق بد</p>
                   </div>
                   <div className="col-span-2 bg-indigo-50/50 rounded-2xl p-3 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                     <div className="flex items-center gap-2">
                       <Sparkles size={16} className="text-indigo-500" />
                       <p className="text-xs font-bold text-indigo-900">بیشترین شکرگزاری بابت:</p>
                     </div>
                     <p className="text-sm font-black text-indigo-700 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                       {reportStats.topGratitude}
                     </p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <div className="bg-cyan-50/50 rounded-2xl p-4 border border-cyan-100 flex flex-col justify-center items-center text-center transition-all hover:bg-cyan-50">
                  <Wind size={24} className="text-cyan-500 mb-2" />
                  <p className="text-lg font-black text-cyan-700" dir="ltr">{reportStats.meditation.totalHours} h</p>
                  <p className="text-[10px] font-bold text-cyan-600 mt-1">مدیتیشن در {reportStats.meditation.totalDays} روز</p>
                </div>
                
                <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100 flex flex-col justify-center items-center text-center transition-all hover:bg-purple-50">
                  <Compass size={24} className="text-purple-500 mb-2" />
                  <p className="text-xs font-black text-purple-700 mt-1 leading-tight">{reportStats.topValue}</p>
                  <p className="text-[10px] font-bold text-purple-600 mt-2">ارزش غالب این ماه</p>
                </div>

                <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 flex flex-col justify-center items-center text-center transition-all hover:bg-amber-50">
                  <CheckCircle2 size={24} className="text-amber-500 mb-2" />
                  <p className="text-sm font-black text-amber-700">{reportStats.wishes.fulfilled} محقق شده</p>
                  <p className="text-[10px] font-bold text-amber-600 mt-1">و {reportStats.wishes.pending} در انتظار تجلی</p>
                </div>
              </div>
              
              <h3 className="text-xs font-black text-slate-500 mb-4">نمودار ارتعاش و آرامش</h3>
              <div className="h-48 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.length > 0 ? chartData : defaultChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px', textAlign: 'right', direction: 'rtl' }}
                      itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                    />
                    <Line 
                      type="monotone" dataKey="score" name="سطح ارتعاش" stroke="#8B5CF6" strokeWidth={4} 
                      dot={{ fill: '#FFFFFF', stroke: '#8B5CF6', strokeWidth: 3, r: 5 }} 
                      activeDot={{ r: 8, fill: '#4F46E5', stroke: '#C7D2FE' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= BOTTOM NAVIGATION ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-indigo-50 flex justify-around items-center p-4 z-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(79,70,229,0.05)] max-w-3xl mx-auto">
        <button onClick={() => setActiveTab('today')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'today' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <Sun size={24} strokeWidth={activeTab === 'today' ? 2.5 : 2} />
          <span className="text-[10px] font-black">امروز</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <BookOpen size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
          <span className="text-[10px] font-black">تاریخچه</span>
        </button>
        <button onClick={() => setActiveTab('reports')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'reports' ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <Activity size={24} strokeWidth={activeTab === 'reports' ? 2.5 : 2} />
          <span className="text-[10px] font-black">گزارشات</span>
        </button>
      </div>

    </div>
  );
}
