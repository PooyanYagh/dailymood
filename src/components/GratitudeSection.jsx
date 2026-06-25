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
  
  // ===== State برای نگهداری متن هر دسته‌بندی =====
  const [categoryTexts, setCategoryTexts] = useState({});

  // ===== بارگذاری داده‌های امروز =====
  useEffect(() => {
    if (todayGratitude) {
      // اگر داده‌ای وجود دارد، آن را در state ذخیره کن
      setCategoryTexts(prev => ({
        ...prev,
        [todayGratitude.category_name]: todayGratitude.content || ''
      }));
      
      // اگر دسته‌بندی انتخاب شده با دسته‌بندی داده‌شده یکی است، متن را نمایش بده
      if (selectedCat === todayGratitude.category_name) {
        setText(todayGratitude.content || '');
      }
    }
  }, [todayGratitude]);

  // ===== تغییر دسته‌بندی =====
  const handleCategoryChange = (cat) => {
    setSelectedCat(cat);
    // اگر برای این دسته‌بندی متنی ذخیره شده، آن را نمایش بده
    if (categoryTexts[cat]) {
      setText(categoryTexts[cat]);
    } else {
      setText(''); // اگر متنی وجود ندارد، خالی کن
    }
  };

  // ===== تغییر متن =====
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    // ذخیره موقت در state
    setCategoryTexts(prev => ({
      ...prev,
      [selectedCat]: newText
    }));
  };

  // ===== ثبت شکرگزاری =====
  const handleSave = async () => {
    if (text.trim() === '') return;
    const success = await onSave(selectedCat, text);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // پس از ثبت موفق، متن را در state نگه دار
      setCategoryTexts(prev => ({
        ...prev,
        [selectedCat]: text
      }));
    }
  };

  // ===== افزودن دسته‌بندی جدید =====
  const handleAddCategory = () => {
    if (newCat.trim()) {
      setCategories([...categories, newCat.trim()]);
      setSelectedCat(newCat.trim());
      setNewCat('');
      setShowNewCat(false);
      // متن را خالی کن
      setText('');
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
          <Sparkles size={20} className="text-amber-400" />
          دفترچه شکرگزاری
        </h2>
        {saved && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            ✅ ثبت شد!
          </span>
        )}
      </div>
      
      {/* ===== انتخاب دسته‌بندی ===== */}
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-400 mb-2">موضوع شکرگزاری امروز:</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, idx) => {
            const hasData = categoryTexts[cat] && categoryTexts[cat].trim() !== '';
            return (
              <button
                key={idx}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCat === cat 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
                {hasData && selectedCat === cat && (
                  <span className="text-[8px]">📝</span>
                )}
                {hasData && selectedCat !== cat && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                )}
              </button>
            );
          })}
          
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
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button onClick={handleAddCategory} className="bg-indigo-600 text-white px-2 py-1.5 text-xs font-bold">ثبت</button>
              <button onClick={() => setShowNewCat(false)} className="text-slate-400 px-1"><X size={14}/></button>
            </div>
          )}
        </div>
      </div>
      
      {/* ===== نمایش وضعیت ثبت برای دسته‌بندی فعلی ===== */}
      {categoryTexts[selectedCat] && categoryTexts[selectedCat].trim() !== '' && (
        <div className="mb-3 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full inline-block">
          ✅ برای "{selectedCat}" ثبت شده است
        </div>
      )}
      
      {/* ===== ورودی متن ===== */}
      <div className="relative">
        <textarea 
          value={text}
          onChange={handleTextChange}
          placeholder={`خدایا شکرت بابت ${selectedCat}...`}
          className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-[#1E1B4B] font-medium text-sm min-h-[100px] resize-none focus:outline-none transition-all placeholder:text-slate-400"
        />
        
        {/* ===== دکمه ثبت ===== */}
        <button 
          onClick={handleSave}
          className={`absolute bottom-4 left-4 px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition-all duration-300 ${
            saved 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
              : categoryTexts[selectedCat] && categoryTexts[selectedCat].trim() !== ''
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600'
                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'
          }`}
        >
          {saved ? (
            <><CheckCircle2 size={14} /> ثبت شد!</>
          ) : (
            categoryTexts[selectedCat] && categoryTexts[selectedCat].trim() !== '' 
              ? 'به‌روزرسانی 🌌' 
              : 'ثبت در کائنات 🌌'
          )}
        </button>
      </div>

      {/* ===== نمایش تعداد دسته‌بندی‌های ثبت شده ===== */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryTexts).map(([cat, content]) => {
            if (content && content.trim() !== '') {
              return (
                <span key={cat} className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                  ✅ {cat}
                </span>
              );
            }
            return null;
          })}
          {Object.values(categoryTexts).every(v => !v || v.trim() === '') && (
            <span className="text-[9px] text-slate-400">هنوز هیچ دسته‌بندی ثبت نشده</span>
          )}
        </div>
        {Object.values(categoryTexts).some(v => v && v.trim() !== '') && (
          <p className="text-[9px] text-slate-400 mt-1.5">
            {Object.values(categoryTexts).filter(v => v && v.trim() !== '').length} دسته‌بندی ثبت شده
          </p>
        )}
      </div>
    </div>
  );
}
