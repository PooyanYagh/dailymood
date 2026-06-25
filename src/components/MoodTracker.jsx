// src/components/MoodTracker.jsx
import React, { useState } from 'react';
import { Heart, ChevronLeft, CheckCircle2 } from 'lucide-react';

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

export default function MoodTracker({ todayMood, onSave }) {
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);

  const handleSave = async () => {
    if (!selectedEmotion || !selectedQuadrant) return;
    const success = await onSave(selectedEmotion, selectedQuadrant);
    if (success) {
      setMoodSaved(true);
      setTimeout(() => setMoodSaved(false), 3000);
    }
  };

  return (
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
          {Object.keys(emotionGrid).map(key => (
            <button 
              key={key}
              onClick={() => setSelectedQuadrant(key)} 
              className={`flex flex-col items-center justify-center p-6 rounded-2xl ${emotionGrid[key].lightBg} border ${emotionGrid[key].color.replace('bg-', 'border-')} hover:${emotionGrid[key].lightBg} transition-all hover:scale-[1.02]`}
            >
              <span className="text-3xl mb-2">{emotionGrid[key].icon}</span>
              <span className={`font-black text-sm ${emotionGrid[key].textColor}`}>
                {key === 'yellow' ? 'انرژی بالا' : key === 'red' ? 'انرژی بالا' : key === 'green' ? 'انرژی پایین' : 'انرژی پایین'}
              </span>
              <span className={`text-xs font-bold ${emotionGrid[key].textColor}`}>
                {key === 'yellow' || key === 'green' ? 'خوشایند' : 'ناخوشایند'}
              </span>
            </button>
          ))}
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
              onClick={handleSave}
              className={`mt-4 w-full py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${moodSaved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'}`}
            >
              {moodSaved ? <><CheckCircle2 size={16} /> ثبت شد!</> : (todayMood ? 'به‌روزرسانی وضعیت روحی 🌱' : 'ثبت وضعیت روحی 🌱')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}