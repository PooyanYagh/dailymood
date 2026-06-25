// src/components/ReportsTab.jsx
import React, { useEffect, useState } from 'react';
import { 
  Activity, Wind, Compass, CheckCircle2, Sparkles,
  ThumbsUp, ThumbsDown
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ReportsTab({ stats, chartData, defaultChartData }) {
  const [chartDataState, setChartDataState] = useState([]);

  // استفاده از داده‌های واقعی یا پیش‌فرض
  useEffect(() => {
    if (chartData && chartData.length > 0) {
      setChartDataState(chartData);
    } else {
      setChartDataState(defaultChartData || getDefaultChartData());
    }
  }, [chartData]);

  // دیتای پیش‌فرض برای نمودار
  const getDefaultChartData = () => {
    const today = new Date();
    const days = [];
    const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayName = weekDays[d.getDay()];
      days.push({
        day: dayName,
        score: 5 + Math.floor(Math.random() * 5), // مقدار پیش‌فرض تصادفی
        date: d.toISOString().split('T')[0]
      });
    }
    return days;
  };

  // تبدیل داده‌های چارت به فرمت مناسب
  const getChartData = () => {
    if (chartDataState && chartDataState.length > 0) {
      return chartDataState;
    }
    return defaultChartData || getDefaultChartData();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(79,70,229,0.06)] border border-indigo-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#312E81] font-black text-lg flex items-center gap-2">
            <Activity size={20} className="text-purple-500" />
            داشبورد و گزارشات (۳۰ روز گذشته)
          </h2>
        </div>

        {/* ===== توزیع احساسات ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <h3 className="text-xs font-black text-slate-500 mb-3">سهم رنگ‌های احساسی من</h3>
            <div className="flex w-full h-4 rounded-full overflow-hidden mb-3">
              <div style={{ width: `${stats.moodDistribution?.yellow || 0}%` }} className="bg-amber-400" />
              <div style={{ width: `${stats.moodDistribution?.green || 0}%` }} className="bg-emerald-500" />
              <div style={{ width: `${stats.moodDistribution?.blue || 0}%` }} className="bg-blue-500" />
              <div style={{ width: `${stats.moodDistribution?.red || 0}%` }} className="bg-rose-500" />
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {stats.moodDistribution?.yellow || 0}٪ انرژی بالا/مثبت
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {stats.moodDistribution?.green || 0}٪ آرامش/مثبت
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {stats.moodDistribution?.blue || 0}٪ خستگی/غم
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {stats.moodDistribution?.red || 0}٪ خشم/اضطراب
              </div>
            </div>
          </div>

          {/* ===== آمار اخبار ===== */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100 text-center flex flex-col justify-center">
              <span className="text-lg mb-1">👍</span>
              <p className="text-xl font-black text-emerald-700">{stats.newsCount?.good || 0}</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-1">اتفاق خوب ثبت شده</p>
            </div>
            <div className="bg-rose-50/50 rounded-2xl p-3 border border-rose-100 text-center flex flex-col justify-center">
              <span className="text-lg mb-1">👎</span>
              <p className="text-xl font-black text-rose-700">{stats.newsCount?.bad || 0}</p>
              <p className="text-[10px] font-bold text-rose-600 mt-1">چالش / اتفاق بد</p>
            </div>
            <div className="col-span-2 bg-indigo-50/50 rounded-2xl p-3 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" />
                <p className="text-xs font-bold text-indigo-900">بیشترین شکرگزاری بابت:</p>
              </div>
              <p className="text-sm font-black text-indigo-700 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                {stats.topGratitude || 'هنوز ثبت نشده'}
              </p>
            </div>
          </div>
        </div>

        {/* ===== آمار مدیتیشن و خواسته‌ها ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-cyan-50/50 rounded-2xl p-4 border border-cyan-100 flex flex-col justify-center items-center text-center">
            <Wind size={24} className="text-cyan-500 mb-2" />
            <p className="text-lg font-black text-cyan-700" dir="ltr">{stats.meditation?.totalHours || 0} h</p>
            <p className="text-[10px] font-bold text-cyan-600 mt-1">مدیتیشن در {stats.meditation?.totalDays || 0} روز</p>
          </div>
          
          <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100 flex flex-col justify-center items-center text-center">
            <Compass size={24} className="text-purple-500 mb-2" />
            <p className="text-xs font-black text-purple-700 mt-1 leading-tight">
              {stats.topValue || 'در حال محاسبه...'}
            </p>
            <p className="text-[10px] font-bold text-purple-600 mt-2">ارزش غالب این ماه</p>
          </div>

          <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 flex flex-col justify-center items-center text-center">
            <CheckCircle2 size={24} className="text-amber-500 mb-2" />
            <p className="text-sm font-black text-amber-700">{stats.wishes?.fulfilled || 0} محقق شده</p>
            <p className="text-[10px] font-bold text-amber-600 mt-1">و {stats.wishes?.pending || 0} در انتظار تجلی</p>
          </div>
        </div>
        
        {/* ===== نمودار ارتعاش و آرامش ===== */}
        <h3 className="text-xs font-black text-slate-500 mb-4">نمودار ارتعاش و آرامش (هفته گذشته)</h3>
        <div className="h-48 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                tick={{ fill: '#94A3B8', fontSize: 10 }} 
                tickLine={false} 
                axisLine={false} 
                domain={[0, 10]} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                  fontSize: '12px', 
                  textAlign: 'right', 
                  direction: 'rtl' 
                }}
                itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                labelStyle={{ fontWeight: 'bold', color: '#1E1B4B' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                name="سطح ارتعاش" 
                stroke="#8B5CF6" 
                strokeWidth={4} 
                dot={{ fill: '#FFFFFF', stroke: '#8B5CF6', strokeWidth: 3, r: 5 }} 
                activeDot={{ r: 8, fill: '#4F46E5', stroke: '#C7D2FE' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {getChartData().length === 0 && (
          <p className="text-center text-xs text-slate-400 mt-2">هنوز داده‌ای برای نمایش وجود ندارد</p>
        )}
      </div>
    </div>
  );
}
