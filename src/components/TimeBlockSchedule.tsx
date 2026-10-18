import React from 'react';
import { useApp } from '../context/AppContext';
import { Task, TimeBlock } from '../types';
import { Sunrise, Sun, Sunset, Moon, Plus, Play } from 'lucide-react';
import { toPersianDigits, formatMinutes } from '../utils/persianDate';

const BLOCKS: { id: TimeBlock; label: string; timeRange: string; icon: React.ReactNode; desc: string; color: string }[] = [
  {
    id: 'morning',
    label: 'صبح طلایی',
    timeRange: '۰۸:۰۰ الی ۱۲:۰۰',
    icon: <Sunrise className="w-5 h-5 text-amber-500" />,
    desc: 'اوج اراده و تمرکز مغز (بهترین زمان برای بلعیدن قورباغه روز)',
    color: 'border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20'
  },
  {
    id: 'afternoon',
    label: 'ظهر و بعدازظهر',
    timeRange: '۱۲:۰۰ الی ۱۷:۰۰',
    icon: <Sun className="w-5 h-5 text-yellow-500" />,
    desc: 'پاسخ به ایمیل‌ها، هماهنگی‌ها، خریدهای روزمره و کارهای سبک‌تر',
    color: 'border-yellow-200 dark:border-yellow-900/40 bg-yellow-50/30 dark:bg-yellow-950/20'
  },
  {
    id: 'evening',
    label: 'عصر و غروب',
    timeRange: '۱۷:۰۰ الی ۲۱:۰۰',
    icon: <Sunset className="w-5 h-5 text-orange-500" />,
    desc: 'ورزش، یادگیری آزاد، کارهای شخصی و مرتب‌سازی خانه',
    color: 'border-orange-200 dark:border-orange-900/40 bg-orange-50/30 dark:bg-orange-950/20'
  },
  {
    id: 'anytime',
    label: 'شب و قبل از خواب',
    timeRange: '۲۱:۰۰ به بعد',
    icon: <Moon className="w-5 h-5 text-indigo-400" />,
    desc: 'تخلیه ذهن، مرور بدون قضاوت روز و شارژ انرژی برای فردا',
    color: 'border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20'
  }
];

export const TimeBlockSchedule: React.FC = () => {
  const { tasks, toggleComplete, setActiveTimerTask, setActiveTab, addTask } = useApp();

  const handleQuickAddBlockTask = (block: TimeBlock) => {
    const title = window.prompt(`عنوان کار جدید برای بلاک زمانی ${block}:`);
    if (title && title.trim()) {
      addTask({
        title: title.trim(),
        timeBlock: block
      });
    }
  };

  const handleStartFocus = (task: Task) => {
    setActiveTimerTask(task);
    setActiveTab('focus');
  };

  return (
    <div className="w-full space-y-4">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
          ساعت بیولوژیک و ریتم روزانه (ضد کوری زمان)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          یکی از دلایل تعویق انداختن کارها، توهم «هنوز کلی وقت دارم» است. با دیدن بخش‌های زمانی روز، مغز واقع‌بین میشه.
        </p>
      </div>

      {/* Grid of Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BLOCKS.map((block) => {
          const blockTasks = tasks.filter(t => t.timeBlock === block.id && !t.completed);
          const totalEstimatedMins = blockTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 25), 0);

          return (
            <div
              key={block.id}
              className={`rounded-3xl border ${block.color} p-4 sm:p-5 flex flex-col justify-between shadow-sm`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                      {block.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        {block.label}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {toPersianDigits(block.timeRange)}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {formatMinutes(totalEstimatedMins)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 my-2.5 leading-snug">
                  {block.desc}
                </p>

                {/* Tasks List */}
                <div className="space-y-1.5 my-3">
                  {blockTasks.length > 0 ? (
                    blockTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                          <button
                            onClick={() => toggleComplete(task.id)}
                            className="w-4 h-4 rounded border border-slate-400 hover:border-emerald-500 flex items-center justify-center shrink-0"
                          />
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                            {task.isFrog ? '🐸 ' : ''}{task.title}
                          </span>
                        </div>
                        <button
                          onClick={() => handleStartFocus(task)}
                          className="p-1 rounded text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800 shrink-0"
                          title="شروع تمرکز"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-400 italic">
                      کاری برای این بخش برنامه‌ریزی نشده
                    </div>
                  )}
                </div>
              </div>

              {/* Add Task to this block */}
              <button
                onClick={() => handleQuickAddBlockTask(block.id)}
                className="mt-2 w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-white/60 dark:hover:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن کار به این بازه</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
