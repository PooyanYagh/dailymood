// src/components/ReflectionSection.jsx
import React, { useState } from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export default function ReflectionSection() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (question.trim() === '' || answer.trim() === '') return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setQuestion('');
    setAnswer('');
  };

  return (
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
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="سوالی که امروز می‌خواهم از خودم بپرسم را اینجا می‌نویسم..."
          className="w-full bg-white/60 border border-amber-200 focus:border-amber-400 rounded-xl p-3 text-[#1E1B4B] font-black text-sm focus:outline-none transition-all placeholder:text-amber-700/40 relative z-10"
        />
      </div>
      
      <div className="relative">
        <textarea 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="پاسخ من به این سوال (بدون قضاوت)..."
          className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-[#1E1B4B] font-medium text-sm min-h-[120px] resize-none focus:outline-none transition-all placeholder:text-slate-400"
        />
        
        <button 
          onClick={handleSave}
          className={`absolute bottom-4 left-4 px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition-all duration-300 ${saved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'}`}
        >
          {saved ? <><CheckCircle2 size={14} /> ثبت شد!</> : 'ثبت پرسش و پاسخ ✍️'}
        </button>
      </div>
    </div>
  );
}