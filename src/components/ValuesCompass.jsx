// src/components/ValuesCompass.jsx
import React, { useState, useEffect } from 'react';
import { Compass, Star, PlusCircle, X, CheckCircle2 } from 'lucide-react';

const DEFAULT_VALUES = [
  { id: 1, name: 'سلامتی فیزیکی و روانی', score: 0 },
  { id: 2, name: 'خانواده و روابط موثر', score: 0 },
  { id: 3, name: 'توسعه فردی و یادگیری', score: 0 },
  { id: 4, name: 'آرامش و تعادل درون', score: 0 },
  { id: 5, name: 'مسئولیت‌پذیری و شغل', score: 0 },
];

export default function ValuesCompass({ onSaveValue, todayValues }) {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [newValue, setNewValue] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // ===== بارگذاری داده‌های امروز =====
  useEffect(() => {
    if (todayValues && todayValues.length > 0) {
      const updatedValues = values.map(v => {
        const found = todayValues.find(tv => tv.value_name === v.name);
        return found ? { ...v, score: found.score } : v;
      });
      setValues(updatedValues);
    }
  }, [todayValues]);

  const handleRate = (id, score) => {
    setValues(values.map(v => v.id === id ? { ...v, score } : v));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      let allSuccess = true;
      const valuesToSave = values.filter(v => v.score > 0);
      
      if (valuesToSave.length === 0) {
        setSaveStatus('error');
        setIsSaving(false);
        return;
      }

      for (const value of valuesToSave) {
        const success = await onSaveValue(value.name, value.score);
        if (!success) allSuccess = false;
      }

      setSaveStatus(allSuccess ? 'success' : 'error');
      
      if (allSuccess) {
        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving values:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddValue = () => {
    if (newValue.trim()) {
      setValues([...values, { id: Date.now(), name: newValue.trim(), score: 0 }]);
      setNewValue('');
      setShowNewInput(false);
    }
  };

  const handleRemoveValue = (id) => {
    if (values.length > 1) {
      setValues(values.filter(v => v.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
          <Compass size={20} className="text-teal-500" />
          قطب‌نمای ارزش‌های من
        </h2>
        
        {saveStatus === 'success' && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={14} /> ثبت شد!
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            ⚠️ خطا در ثبت
          </span>
        )}
      </div>
      
      <p className="text-xs font-bold text-slate-400 mb-6">
        امروز چقدر بر اساس ارزش‌های اصلی‌ات زندگی کردی؟ (هر ارزش را امتیاز بده)
      </p>
      
      <div className="space-y-4">
        {values.map((val) => (
          <div key={val.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all group">
            <span className="font-bold text-sm text-[#1E1B4B] mb-2 sm:mb-0 flex items-center gap-2">
              {val.name}
              {val.score > 0 && (
                <span className="text-xs font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {val.score}/۵
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1" dir="ltr">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => handleRate(val.id, star)}
                    className="transition-transform hover:scale-125 focus:outline-none"
                    title={`امتیاز ${star} از ۵`}
                  >
                    <Star 
                      size={22} 
                      fill={star <= val.score ? '#F59E0B' : 'transparent'} 
                      color={star <= val.score ? '#F59E0B' : '#CBD5E1'}
                    />
                  </button>
                ))}
              </div>
              
              {values.length > 1 && (
                <button
                  onClick={() => handleRemoveValue(val.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-500 p-1 rounded-full hover:bg-rose-50"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {!showNewInput ? (
          <button 
            onClick={() => setShowNewInput(true)}
            className="w-full py-3 mt-2 text-sm text-indigo-600 font-bold border-2 border-dashed border-indigo-100 hover:bg-indigo-50 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} /> افزودن ارزش جدید
          </button>
        ) : (
          <div className="flex gap-2 mt-4 bg-slate-50 p-2 rounded-2xl border border-indigo-100">
            <input 
              type="text" 
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="ارزش جدید (مثلاً: صداقت)..."
              className="flex-1 bg-white border border-slate-200 focus:border-indigo-300 rounded-xl p-2 text-[#1E1B4B] font-medium text-sm focus:outline-none transition-all"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddValue()}
            />
            <button 
              onClick={handleAddValue}
              className="px-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
              ثبت
            </button>
            <button 
              onClick={() => setShowNewInput(false)}
              className="px-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
            >
              لغو
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={handleSaveAll}
          disabled={isSaving || values.every(v => v.score === 0)}
          className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            isSaving 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : values.every(v => v.score === 0)
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : saveStatus === 'success'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'
          }`}
        >
          {isSaving ? (
            <>
              <span className="animate-spin">⏳</span>
              در حال ثبت...
            </>
          ) : saveStatus === 'success' ? (
            <>
              <CheckCircle2 size={18} />
              ثبت شد!
            </>
          ) : (
            <>
              <Compass size={18} />
              {values.every(v => v.score === 0) 
                ? 'لطفاً حداقل یک ارزش را امتیاز دهید' 
                : 'ثبت ارزش‌های امروز 🌱'}
            </>
          )}
        </button>
        
        {values.some(v => v.score > 0) && (
          <p className="text-[10px] text-slate-400 text-center mt-2">
            {values.filter(v => v.score > 0).length} ارزش امتیاز داده شده است
          </p>
        )}
      </div>
    </div>
  );
}
