import React from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { Play, Scissors, CheckCircle, ShieldCheck, Plus } from 'lucide-react';
import { toPersianDigits } from '../utils/persianDate';

export const DailyFrog: React.FC = () => {
  const { tasks, toggleComplete, setActiveTimerTask, setActiveTab, setDeconstructingTask, setIsDeconstructorOpen, addTask } = useApp();

  const frogTask = tasks.find(t => t.isFrog && !t.completed);
  const completedFrog = tasks.find(t => t.isFrog && t.completed);

  // Top 3 tasks
  const topTasks = tasks.filter(t => t.isTopThree && !t.completed && !t.isFrog).slice(0, 2);
  const completedTodayCount = tasks.filter(t => t.completed && t.dueDate === new Date().toISOString().split('T')[0]).length;

  const handleStartFocus = (task: Task) => {
    setActiveTimerTask(task);
    setActiveTab('focus');
  };

  const handleDeconstruct = (task: Task) => {
    setDeconstructingTask(task);
    setIsDeconstructorOpen(true);
  };

  const handleCreateFrog = () => {
    const title = window.prompt('🐸 قورباغه امروزت چیه؟ (همون کاری که هی ازش فرار می‌کردی):');
    if (title && title.trim()) {
      addTask({
        title: title.trim(),
        isFrog: true,
        priority: 'frog',
        isTopThree: true
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Frog Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white p-5 sm:p-7 shadow-xl shadow-emerald-950/20">
        {/* Ambient Decorative circles */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-emerald-200">
              <span className="text-base">🐸</span>
              <span>قانون تک‌کاری و قورباغه روز</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {frogTask
                ? 'فقط روی همین یک کار تمرکز کن!'
                : completedFrog
                ? 'آفرین قهرمان! قورباغه امروز رو بلعیدی 🎉'
                : 'امروز قراره چه قورباغه‌ای رو قورت بدی؟'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-md">
              {frogTask
                ? 'بقیه کارها رو موقتاً فراموش کن. اگر فقط همین یک کار انجام بشه، امروز پیروز شدی.'
                : completedFrog
                ? 'بزرگترین مانع امروزت برداشته شد. الان با خیال راحت کارهای سبک‌تر رو پیش ببر.'
                : 'برای رهایی از سردرگمی، مهم‌ترین و سخت‌ترین کار امروزت رو انتخاب کن.'}
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shrink-0 self-start sm:self-auto">
            <div className="text-center">
              <span className="block text-xl font-black text-emerald-300">
                {toPersianDigits(completedTodayCount)}
              </span>
              <span className="text-[10px] text-emerald-100/80">انجام شده امروز</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <span className="block text-xl font-black text-amber-300">
                {toPersianDigits(tasks.filter(t => !t.completed).length)}
              </span>
              <span className="text-[10px] text-emerald-100/80">کل باقی‌مانده</span>
            </div>
          </div>
        </div>

        {/* The Active Frog Item */}
        {frogTask ? (
          <div className="relative mt-5 p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-all hover:bg-white/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleComplete(frogTask.id)}
                  className="mt-0.5 w-6 h-6 rounded-lg border-2 border-white/60 hover:border-emerald-300 flex items-center justify-center transition-all group"
                  title="تکمیل قورباغه امروز"
                >
                  <CheckCircle className="w-4 h-4 opacity-0 group-hover:opacity-100 text-emerald-300 transition-opacity" />
                </button>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug">
                    {frogTask.title}
                  </h3>
                  {frogTask.description && (
                    <p className="text-xs text-emerald-100/80 mt-1">{frogTask.description}</p>
                  )}
                  {frogTask.microSteps && frogTask.microSteps.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-200">
                      <span>قدم‌های ۲ دقیقه‌ای:</span>
                      <span className="font-bold">
                        {toPersianDigits(frogTask.microSteps.filter(s => s.completed).length)} از{' '}
                        {toPersianDigits(frogTask.microSteps.length)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => handleDeconstruct(frogTask)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors"
                  title="خرد کردن به قدم‌های ۲ دقیقه‌ای"
                >
                  <Scissors className="w-3.5 h-3.5 text-amber-300" />
                  <span>خرد کن</span>
                </button>

                <button
                  onClick={() => handleStartFocus(frogTask)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-slate-950 text-xs font-black shadow-lg shadow-emerald-400/30 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>پرتاب ۵ دقیقه‌ای</span>
                </button>
              </div>
            </div>
          </div>
        ) : !completedFrog ? (
          <div className="mt-5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-dashed border-white/30 text-center flex flex-col items-center justify-center gap-2">
            <p className="text-xs text-emerald-100">
              هنوز قورباغه امروزت رو تعیین نکردی! انتخابش کن تا خیالت راحت بشه.
            </p>
            <button
              onClick={handleCreateFrog}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>تعیین قورباغه روز</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Rule of 3 (Secondary key tasks for the day) */}
      {topTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              ۲ کار فرعی مهم امروز (قانون ۳ کار طلایی)
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              اگر قورباغه تموم شد، برو سراغ این‌ها
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="w-4 h-4 rounded-md border border-slate-400 hover:border-brand-500 flex items-center justify-center shrink-0"
                  />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => handleStartFocus(task)}
                  className="p-1.5 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800 shrink-0"
                  title="شروع تمرکز"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
