// src/components/MeditationStudio.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Square, CheckCircle2 } from 'lucide-react';

const CHAKRAS = [
  { id: 1, name: 'ریشه (Root)', color: 'bg-red-500' },
  { id: 2, name: 'خاجی (Sacral)', color: 'bg-orange-500' },
  { id: 3, name: 'خورشیدی (Solar)', color: 'bg-yellow-400' },
  { id: 4, name: 'قلب (Heart)', color: 'bg-emerald-500' },
  { id: 5, name: 'گلو (Throat)', color: 'bg-cyan-500' },
  { id: 6, name: 'چشم سوم (3rd Eye)', color: 'bg-indigo-600' },
  { id: 7, name: 'تاج (Crown)', color: 'bg-purple-500' },
];

export default function MeditationStudio({ onSave }) {
  const [state, setState] = useState({ isActive: false, seconds: 0, isFinished: false });
  const [selectedChakras, setSelectedChakras] = useState([]);
  const [note, setNote] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (state.isActive) {
      timerRef.current = setInterval(() => {
        setState(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state.isActive]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startMeditation = () => setState({ isActive: true, seconds: 0, isFinished: false });
  const stopMeditation = () => {
    clearInterval(timerRef.current);
    setState(prev => ({ ...prev, isActive: false, isFinished: true }));
    setSelectedChakras([]);
  };

  const toggleChakra = (id) => {
    setSelectedChakras(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    await onSave(state.seconds, selectedChakras, note);
    setState({ isActive: false, seconds: 0, isFinished: false });
    setNote('');
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
          <Wind size={20} className="text-cyan-500" />
          استودیو مدیتیشن
        </h2>
      </div>
      
      {!state.isActive && !state.isFinished ? (
        <div className="text-center py-6">
          <div className="w-24 h-24 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🧘‍♂️</span>
          </div>
          <h3 className="font-black text-[#1E1B4B] text-lg mb-2">زمان تمرکز و رهایی</h3>
          <p className="text-sm font-medium text-slate-500 mb-8 max-w-sm mx-auto">
            فرقی نمی‌کند ۵ دقیقه باشد یا یک ساعت. چشمانت را ببند و روی تنفست تمرکز کن.
          </p>
          <button 
            onClick={startMeditation}
            className="mx-auto flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black hover:bg-indigo-700 hover:scale-105 transition-all"
          >
            <Play size={20} fill="currentColor" />
            شروع مدیتیشن
          </button>
        </div>
      ) : state.isActive ? (
        <div className="text-center py-10">
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
            {formatTime(state.seconds)}
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
        <div>
          <div className="bg-indigo-50 p-4 rounded-2xl mb-6 text-center border border-indigo-100">
            <span className="text-4xl block mb-2">🧘‍♀️</span>
            <h3 className="font-black text-indigo-900 text-lg">خسته نباشی!</h3>
            <p className="text-indigo-600 text-sm font-bold mt-1" dir="ltr">زمان تمرین: {formatTime(state.seconds)}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-black text-[#1E1B4B] mb-3">
              روی کدام چاکراها کار کردی یا احساس انرژی داشتی؟
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {CHAKRAS.map(chakra => {
                const isSelected = selectedChakras.includes(chakra.id);
                return (
                  <button
                    key={chakra.id}
                    onClick={() => toggleChakra(chakra.id)}
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="احساس سبکی می‌کنم، کمی ذهنم درگیر کار بود اما..."
            className="w-full bg-[#F8FAFC] border-2 border-slate-100 focus:border-indigo-200 rounded-2xl p-4 text-[#1E1B4B] font-medium text-sm min-h-[100px] resize-none focus:outline-none transition-all placeholder:text-slate-400 mb-4"
          />
          
          <button 
            onClick={handleSave}
            className="w-full py-4 rounded-2xl font-black text-white bg-indigo-600 shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex justify-center items-center gap-2"
          >
            <CheckCircle2 size={20} />
            ثبت لاگ و پاکسازی چاکراها
          </button>
        </div>
      )}
    </div>
  );
}