import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, Sparkles, Calendar, Archive, Coffee } from 'lucide-react';
import { toPersianDigits } from '../utils/persianDate';

export const ZeroGuiltModal: React.FC = () => {
  const { isZeroGuiltOpen, setIsZeroGuiltOpen, rolloverUnfinishedTasks, tasks } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr);

  if (!isZeroGuiltOpen || overdueTasks.length === 0) return null;

  const handleAction = (action: 'today' | 'someday' | 'archive') => {
    rolloverUnfinishedTasks(action);
    setIsZeroGuiltOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-teal-200 dark:border-teal-900/40 text-slate-900 dark:text-slate-100 flex flex-col text-center">
        {/* Close */}
        <button
          onClick={() => setIsZeroGuiltOpen(false)}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loving Heart Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-3">
          <Heart className="w-7 h-7 fill-teal-500/20" />
        </div>

        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          منطقه صفر عذاب وجدان!
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          تو {toPersianDigits(overdueTasks.length)} کار ناتمام از روزهای قبل داری. ولی گوش کن:
          <br />
          <strong className="text-teal-700 dark:text-teal-300">
            «تو مجرم نیستی و اینجا دادگاه نیست.»
          </strong>
          <br />
          گذشته تموم شده و سرزنش کردن خودت فقط انرژی امروزت رو می‌سوزونه. با این کارها چی‌کار کنیم؟
        </p>

        {/* Action Options */}
        <div className="space-y-2.5 mt-5">
          <button
            onClick={() => handleAction('today')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 font-bold text-xs transition-all text-right"
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="block font-bold">انتقال بدون سرزنش به امروز</span>
                <span className="text-[10px] text-teal-700/70 dark:text-teal-400 font-normal">
                  تاریخشون به امروز تغییر می‌کنه و تیک می‌زنی
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-teal-500 shrink-0" />
          </button>

          <button
            onClick={() => handleAction('someday')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all text-right"
          >
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="block font-bold">بسپار به «فرصت‌های بعدی»</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  از دید خارج میشن تا فعلاً استرس بهت ندن
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleAction('archive')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all text-right"
          >
            <div className="flex items-center gap-2.5">
              <Archive className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="block font-bold">آرشیو محترمانه</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  اگر دیگه الان برات مهم نیستن، رهاشون کن
                </span>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={() => setIsZeroGuiltOpen(false)}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mt-4"
        >
          فعلاً کاری نکن، بذار همینطور بمونن
        </button>
      </div>
    </div>
  );
};
