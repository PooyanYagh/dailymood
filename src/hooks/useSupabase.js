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
  const [history, setHistory] = useState({ moods: [], gratitudes: [], wishes: [] });
  const [stats, setStats] = useState({
    moodDistribution: { yellow: 0, green: 0, blue: 0, red: 0 },
    newsCount: { good: 0, bad: 0 },
    topGratitude: 'در حال محاسبه...',
    meditation: { totalHours: 0, totalDays: 0 },
    wishes: { fulfilled: 0, pending: 0 }
  });
  const [streakDays, setStreakDays] = useState(0);

  const getTodayRange = () => {
    const today = new Date().toISOString().split('T')[0];
    return { start: `${today}T00:00:00`, end: `${today}T23:59:59` };
  };

  const loadAllData = async () => {
    try {
      const { start, end } = getTodayRange();

      // بارگذاری داده‌های امروز
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

      // بارگذاری تاریخچه
      const [moodHistory, gratitudeHistory, wishesData] = await Promise.all([
        supabase.from('mood_logs').select('*').order('created_at', { ascending: false }).limit(30),
        supabase.from('gratitude_logs').select('*').order('created_at', { ascending: false }).limit(15),
        supabase.from('wishes').select('*').order('created_at', { ascending: false })
      ]);

      setHistory({
        moods: moodHistory.data || [],
        gratitudes: gratitudeHistory.data || [],
        wishes: wishesData.data || []
      });

      // محاسبه آمار
      if (moodHistory.data) {
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

        // محاسبه streak
        const uniqueDates = [...new Set(moodHistory.data.map(log => 
          new Date(log.created_at).toISOString().split('T')[0]
        ))];
        let streak = 0;
        if (uniqueDates.length > 0) {
          const todayStr = new Date().toISOString().split('T')[0];
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
            streak = 1;
            let lastDate = new Date(uniqueDates[0]);
            for (let i = 1; i < uniqueDates.length; i++) {
              const diffDays = Math.ceil(Math.abs(lastDate - new Date(uniqueDates[i])) / (1000 * 60 * 60 * 24));
              if (diffDays === 1) { streak++; lastDate = new Date(uniqueDates[i]); }
              else break;
            }
          }
        }
        setStreakDays(streak);
      }

      if (gratitudeHistory.data) {
        const catCounts = {};
        gratitudeHistory.data.forEach(log => {
          catCounts[log.category_name] = (catCounts[log.category_name] || 0) + 1;
        });
        const top = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
        if (top) setStats(prev => ({ ...prev, topGratitude: top[0] }));
      }

      if (wishesData.data) {
        const fulfilled = wishesData.data.filter(w => w.is_fulfilled).length;
        setStats(prev => ({
          ...prev,
          wishes: { fulfilled, pending: wishesData.data.length - fulfilled }
        }));
      }

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // ===== عملیات CRUD =====
  
  const saveMood = async (emotion, quadrant) => {
    if (!emotion) return;
    try {
      if (todayData.mood) {
        await supabase.from('mood_logs')
          .update({ emotion_id: emotion.id, emotion_label: emotion.label, quadrant, score: emotion.score })
          .eq('id', todayData.mood.id);
      } else {
        await supabase.from('mood_logs')
          .insert({ emotion_id: emotion.id, emotion_label: emotion.label, quadrant, score: emotion.score });
      }
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving mood:', error);
      return false;
    }
  };

  const saveNews = async (good, bad) => {
    if (!good.trim() && !bad.trim()) return;
    try {
      if (todayData.news) {
        await supabase.from('daily_events')
          .update({ good_news: good.trim() || null, bad_news: bad.trim() || null })
          .eq('id', todayData.news.id);
      } else {
        await supabase.from('daily_events')
          .insert({ good_news: good.trim() || null, bad_news: bad.trim() || null });
      }
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving news:', error);
      return false;
    }
  };

  const saveGratitude = async (category, content) => {
    if (!content.trim()) return;
    try {
      if (todayData.gratitude) {
        await supabase.from('gratitude_logs')
          .update({ category_name: category, content: content.trim() })
          .eq('id', todayData.gratitude.id);
      } else {
        await supabase.from('gratitude_logs')
          .insert({ category_name: category, content: content.trim() });
      }
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving gratitude:', error);
      return false;
    }
  };

  const saveWish = async (content) => {
    if (!content.trim()) return;
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
        .update({ is_fulfilled: newStatus, fulfilled_at: newStatus ? new Date().toISOString() : null })
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
      await supabase.from('value_ratings').insert({ value_name: valueName, score });
      return true;
    } catch (error) {
      console.error('Error saving value:', error);
      return false;
    }
  };

  const saveMeditation = async (seconds, chakras, notes) => {
    try {
      await supabase.from('meditation_logs')
        .insert({ duration_seconds: seconds, active_chakras: chakras, notes });
      await loadAllData();
      return true;
    } catch (error) {
      console.error('Error saving meditation:', error);
      return false;
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return {
    todayData,
    history,
    stats,
    streakDays,
    loadAllData,
    saveMood,
    saveNews,
    saveGratitude,
    saveWish,
    toggleWish,
    saveValue,
    saveMeditation
  };
}