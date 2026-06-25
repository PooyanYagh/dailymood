// src/components/WishesSection.jsx
import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function WishesSection({ wishes, onSave, onToggle }) {
  const [newWish, setNewWish] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdd = async () => {
    if (newWish.trim()) {
      await onSave(newWish);
      setNewWish('');
    }
  };

  return (
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
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
          placeholder="خدایا از تو می‌خواهم که..."
          className="flex-1 bg-[#F8FAFC] border-2 border-transparent focus:border-indigo-100 rounded-xl p-3 text-[#1E1B4B] font-medium text-sm focus:outline-none transition-all placeholder:text-slate-400"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button 
          onClick={handleAdd}
          className="px-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 whitespace-nowrap"
        >
          ثبت خواسته
        </button>
      </div>

      <div className="space-y-3">
        {(isExpanded ? wishes : wishes.slice(0, 3)).map(wish => (
          <div key={wish.id} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${wish.is_fulfilled ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100 hover:border-indigo-100'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <button 
                onClick={() => onToggle(wish.id, wish.is_fulfilled)}
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
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 py-2 text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center"
        >
          {isExpanded ? 'بستن لیست' : `نمایش همه خواسته‌ها (${wishes.length})`}
        </button>
      )}
    </div>
  );
}