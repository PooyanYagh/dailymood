// src/components/GratitudeSection.jsx
import React, { useState, useEffect } from 'react';
import { Sparkles, PlusCircle, X, CheckCircle2 } from 'lucide-react';

const DEFAULT_CATEGORIES = ['خانواده', 'شغل', 'سلامتی', 'آرامش درون', 'رشد شخصی', 'مالی'];

export default function GratitudeSection({ todayGratitude, onSave }) {
  const [text, setText] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCat, setSelectedCat] = useState('خانواده');
  const [newCat, setNewCat] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [saved, setSaved] = useState(false);

  // ===== بارگذاری داده‌های امروز =====
  useEffect(() => {
    if (todayGratitude) {
      setText(todayGratitude.content || '');
      setSelectedCat(todayGratitude.category_name || 'خانواده');
    }
  }, [todayGratitude]);

  const handleSave = async () => {
    if (text.trim() === '') return;
    const success = await onSave(selectedCat, text);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleAddCategory = () => {
    if (newCat.trim()) {
      setCategories([...categories, newCat.trim()]);
      setSelectedCat(newCat.trim());
      setNewCat('');
      setShowNewCat(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
          <Sparkles size={20} className="text-amber-400" />
          دفترچه شکرگزاری
        </h2>
        {saved && <span className="text-xs font-bold text-emerald-600">✅ ثبت شد!</span>}
      </div>
      
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-400 mb-2">موضوع شکرگزاری امروز:</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCat === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          
          {!showNewCat ? (
            <button 
              onClick={() => setShowNewCat(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 flex items-center gap-1 hover:bg-indigo-100 transition-all"
            >
              <PlusCircle size={14} /> جدید
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-white border border-indigo-200 rounded-lg overflow-hidden pr-2">
              <input 
                type="text" 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="موضوع جدید..."
                className="text-xs p-1.5 focus:outline-none text-indigo-900 w-24"
                autoFocus
              />
              <button onClick={handleAddCategory} className="bg-indigo-600 text-white px-2 py-1.5 text-xs font-bold">ثبت</button>
              <button onClick={() => setShowNewCat(false)} className="text-slate-400 px-1"><X size={14}/></button>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative">
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`خدایا شکرت بابت ${selectedCat}...`}
          className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-[#1E1B4B] font-medium text-sm min-h-[100px] resize-none focus:outline-none transition-all placeholder:text-slate-400"
        />
        
        <button 
          onClick={handleSave}
          className={`absolute bottom-4 left-4 px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition-all duration-300 ${
            saved 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'
          }`}
        >
          {saved ? (
            <><CheckCircle2 size={14} /> ثبت شد!</>
          ) : (
            todayGratitude ? 'به‌روزرسانی 🌌' : 'ثبت در کائنات 🌌'
          )}
        </button>
      </div>
    </div>
  );
}
