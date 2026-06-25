// src/hooks/useSupabase.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabase() {
  const [todayData, setTodayData] = useState({
    mood: null,
    news: null,
    gratitude: null,
    reflection: null
  });
  const [history, setHistory] = useState({ 
    moods: [], 
    gratitudes: [], 
    wishes: [],
    news: [],
    meditations: [],
    values: []
  });
  const [stats, setStats] = useState({
    moodDistribution: { yellow: 0, green: 0, blue: 0, red: 0 },
    newsCount: { good: 0, bad: 0 },
    topGratitude: 'در حال محاسبه...',
    meditation: { totalHours: 0, totalDays: 0 },
    wishes: { fulfilled: 0, pending: 0 },
    topValue: 'در حال محاسبه...'
  });
  const [streakDays, setStreakDays] = useState(0);
  const [loading, setLoading] = useState(true);

  // ===== تابع کمکی برای تبدیل تاریخ به YYYY-MM-DD =====
  const toDateStr = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ===== دریافت بازه زمانی امروز =====
  const getTodayRange = () => {
    const today = toDateStr(new Date());
    return { 
      start: `${today}T00:00:00`, 
      end: `${today}T23:59:59` 
    };
  };

  // ===== بارگذاری داده‌های امروز =====
  const loadTodayData = async () => {
    try {
      const { start, end } = getTodayRange();

      const [moodRes, newsRes, gratitudeRes] = await Promise.all([
        supabase.from('mood_logs').select('*').gte('created_at', start).lte('created_at', end).order('created_at', { ascending: false }).limit(1),
        supabase.from('daily_events').select('*').gte('created_at', start).lte('created_at', end).order('created_at', { ascending: false }).limit(1),
        supabase.from('gratitude_logs').select('*').gte('created_at', start).lte('created_at', end).order('created_at', { ascending: false }).limit(1)
      ]);

      setTodayData({
        mood: moodRes.data?.[0] || null,
        news: newsRes.data?.[0] || null,
        gratitude: gratitudeRes.data?.[0] || null
      });

      return { 
        mood: moodRes.data?.[0] || null, 
        news: newsRes.data?.[0] || null, 
        gratitude: gratitudeRes.data?.[0] || null 
      };
    } catch (error) {
      console.error('Error loading today data:', error);
      return null;
    }
  };

  // ===== بارگذاری همه داده‌ها =====
  const loadAllData = async () => {
    setLoading(true);
    try {
      // بارگذاری داده‌های امروز
      await loadTodayData();

      // بارگذاری تاریخچه کامل
      const [moodHistory, gratitudeHistory, wishesData, newsData, meditationData, valuesData] = await Promise.all([
        supabase.from('mood_logs').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('gratitude_logs').select('*').order('created_at', { ascending: false }).limit(30),
        supabase.from('wishes').select('*').order('created_at', { ascending: false }).limit(30),
        supabase.from('daily_events').select('*').order('created_at', { ascending: false }).limit(30),
        supabase.from('meditation_logs').select('*').order('created_at', { ascending: false }).limit(30),
        supabase.from('value_ratings').select('*').order('created_at', { ascending: false }).limit(30)
      ]);

      setHistory({
        moods: moodHistory.data || [],
        gratitudes: gratitudeHistory.data || [],
        wishes: wishesData.data || [],
        news: newsData.data || [],
        meditations: meditationData.data || [],
        values: valuesData.data || []
      });

      // ===== محاسبه آمار =====
      
      // 1. توزیع احساسات
      if (moodHistory.data && moodHistory.data.length > 0) {
        const dist = { yellow: 0, green: 0, blue: 0, red: 0 };
        moodHistory.data.forEach(log => {
          if (dist[log.quadrant] !== undefined) dist[log.quadrant]++;
        });
        const total = moodHistory.data.length || 1;
        setStats(prev => ({
          ...prev,
          moodDistribution: {
            yellow: Math.round((dist.yellow / total) * 100),
            green: Math.round((dist.green / total) * 100),
            blue: Math.round((dist.blue / total) * 100),
            red: Math.round((dist.red / total) * 100)
          }
        }));

        // 2. محاسبه streak
        const uniqueDates = [...new Set(moodHistory.data.map(log => 
          toDateStr(log.created_at)
        ))].sort();
        
        let streak = 0;
        if (uniqueDates.length > 0) {
          const todayStr = toDateStr(new Date());
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = toDateStr(yesterday);
          
          if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
            streak = 1;
            for (let i = uniqueDates.length - 1; i > 0; i--) {
              const current = new Date(uniqueDates[i]);
              const prev = new Date(uniqueDates[i - 1]);
              const diffDays = Math.ceil(Math.abs(current - prev) / (1000 * 60 * 60 * 24));
              if (diffDays === 1) {
                streak++;
              } else {
                break;
              }
            }
          }
        }
        setStreakDays(streak);
      }

      // 3. آمار اخبار
      if (newsData.data) {
        let goodCount = 0;
        let badCount = 0;
        newsData.data.forEach(item => {
          if (item.good_news && item.good_news.trim() !== '') goodCount++;
          if (item.bad_news && item.bad_news.trim() !== '') badCount++;
        });
        setStats(prev => ({
          ...prev,
          newsCount: { good: goodCount, bad: badCount }
        }));
      }

      // 4. بیشترین شکرگزاری
      if (gratitudeHistory.data && gratitudeHistory.data.length > 0) {
        const catCounts = {};
        gratitudeHistory.data.forEach(log => {
          catCounts[log.category_name] = (catCounts[log.category_name] || 0) + 1;
        });
        const top = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
        if (top) setStats(prev => ({ ...prev, topGratitude: top[0] }));
      }

      // 5. آمار خواسته‌ها
      if (wishesData.data) {
        const fulfilled = wishesData.data.filter(w => w.is_fulfilled).length;
        setStats(prev => ({
          ...prev,
          wishes: { 
            fulfilled, 
            pending: wishesData.data.length - fulfilled 
          }
        }));
      }

      // 6. آمار مدیتیشن
      if (meditationData.data && meditationData.data.length > 0) {
        const totalSeconds = meditationData.data.reduce((sum, log) => sum + log.duration_seconds, 0);
        setStats(prev => ({
          ...prev,
          meditation: {
            totalHours: Math.round((totalSeconds / 3600) * 10) / 10,
            totalDays: meditationData.data.length
          }
        }));
      }

      // 7. ارزش غالب
      if (valuesData.data && valuesData.data.length > 0) {
        const valueCounts = {};
        valuesData.data.forEach(item => {
          valueCounts[item.value_name] = (valueCounts[item.value_name] || 0) + 1;
        });
        const topValue = Object.entries(valueCounts).sort((a, b) => b[1] - a[1])[0];
        if (topValue) {
          setStats(prev => ({ ...prev, topValue: topValue[0] }));
        }
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== عملیات CRUD =====
  
  const saveMood = async (emotion, quadrant) => {
    if (!emotion) return false;
    try {
      if (todayData.mood) {
        await supabase.from('mood_logs')
          .update({ 
            emotion_id: emotion.id, 
            emotion_label: emotion.label, 
            quadrant, 
            score: emotion.score 
          })
          .eq('id', todayData.mood.id);
      } else {
        await supabase.from('mood_logs')
          .insert({ 
            emotion_id: emotion.id, 
            emotion_label: emotion.label, 
            quadrant, 
            score: emotion.score 
          });
      }
      await loadTodayData();
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving mood:', error);
      return false;
    }
  };

  const saveNews = async (good, bad) => {
    if (!good?.trim() && !bad?.trim()) return false;
    try {
      if (todayData.news) {
        await supabase.from('daily_events')
          .update({ 
            good_news: good?.trim() || null, 
            bad_news: bad?.trim() || null 
          })
          .eq('id', todayData.news.id);
      } else {
        await supabase.from('daily_events')
          .insert({ 
            good_news: good?.trim() || null, 
            bad_news: bad?.trim() || null 
          });
      }
      await loadTodayData();
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving news:', error);
      return false;
    }
  };

  const saveGratitude = async (category, content) => {
    if (!content?.trim()) return false;
    try {
      if (todayData.gratitude) {
        await supabase.from('gratitude_logs')
          .update({ 
            category_name: category, 
            content: content.trim() 
          })
          .eq('id', todayData.gratitude.id);
      } else {
        await supabase.from('gratitude_logs')
          .insert({ 
            category_name: category, 
            content: content.trim() 
          });
      }
      await loadTodayData();
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving gratitude:', error);
      return false;
    }
  };

  const saveWish = async (content) => {
    if (!content?.trim()) return false;
    try {
      await supabase.from('wishes').insert({ content: content.trim() });
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving wish:', error);
      return false;
    }
  };

  const toggleWish = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await supabase.from('wishes')
        .update({ 
          is_fulfilled: newStatus, 
          fulfilled_at: newStatus ? new Date().toISOString() : null 
        })
        .eq('id', id);
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error toggling wish:', error);
      return false;
    }
  };

  const saveValue = async (valueName, score) => {
    try {
      const { start, end } = getTodayRange();
      const { data: existing } = await supabase
        .from('value_ratings')
        .select('*')
        .eq('value_name', valueName)
        .gte('created_at', start)
        .lte('created_at', end)
        .limit(1);
      
      if (existing && existing.length > 0) {
        await supabase
          .from('value_ratings')
          .update({ score })
          .eq('id', existing[0].id);
      } else {
        await supabase
          .from('value_ratings')
          .insert({ value_name: valueName, score });
      }
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving value:', error);
      return false;
    }
  };

  const saveMeditation = async (seconds, chakras, notes) => {
    try {
      await supabase.from('meditation_logs')
        .insert({ 
          duration_seconds: seconds, 
          active_chakras: chakras || [], 
          notes: notes || '' 
        });
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving meditation:', error);
      return false;
    }
  };

  const saveReflection = async (question, answer) => {
    if (!question?.trim() || !answer?.trim()) return false;
    try {
      await supabase.from('self_reflections')
        .insert({ 
          question: question.trim(), 
          answer: answer.trim() 
        });
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving reflection:', error);
      return false;
    }
  };

  // ===== بارگذاری اولیه =====
  useEffect(() => {
    loadAllData();
  }, []);

  return {
    todayData,
    history,
    stats,
    streakDays,
    loading,
    loadAllData,
    loadTodayData,
    saveMood,
    saveNews,
    saveGratitude,
    saveWish,
    toggleWish,
    saveValue,
    saveMeditation,
    saveReflection
  };
}
