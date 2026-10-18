import React from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { Flame, Star, Clock, Trash2, Play, Plus } from 'lucide-react';
import { toPersianDigits } from '../utils/persianDate';

export const EisenhowerMatrix: React.FC = () => {
  const { tasks, toggleComplete, setActiveTimerTask, setActiveTab, addTask } = useApp();

  const activeTasks = tasks.filter(t => !t.completed);

  // Quadrant 1: Urgent & Important (Do First)
  const q1 = activeTasks.filter(t => t.urgency === 'urgent' && t.importance === 'important');
  // Quadrant 2: Not Urgent & Important (Schedule / Growth)
  const q2 = activeTasks.filter(t => t.urgency === 'not-urgent' && t.importance === 'important');
  // Quadrant 3: Urgent & Not Important (Delegate / Fast)
  const q3 = activeTasks.filter(t => t.urgency === 'urgent' && t.importance === 'not-important');
  // Quadrant 4: Not Urgent & Not Important (Eliminate)
  const q4 = activeTasks.filter(t => t.urgency === 'not-urgent' && t.importance === 'not-important');

  const handleStartFocus = (task: Task) => {
    setActiveTimerTask(task);
    setActiveTab('focus');
  };

  const handleQuickAdd = (urgency: 'urgent' | 'not-urgent', importance: 'important' | 'not-important') => {
    const title = window.prompt('عنوان کار برای این بخش از ماتریس:');
    if (title && title.trim()) {
      addTask({
        title: title.trim(),
        urgency,
        importance
      });
    }
  };

  const renderQuadrant = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    tasksList: Task[],
    headerColor: string,
    borderColor: string,
    bgColor: string,
    defaultUrgency: 'urgent' | 'not-urgent',
    defaultImportance: 'important' | 'not-important'
  ) => {
    return (
      <div className={`rounded-3xl border ${borderColor} ${bgColor} p-4 sm:p-5 flex flex-col justify-between min-h-[260px] shadow-sm`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60 mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl text-white ${headerColor}`}>
                {icon}
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {toPersianDigits(tasksList.length)}
            </span>
          </div>

          {/* List */}
          <div className="space-y-2 overflow-y-auto max-h-56 pr-1">
            {tasksList.length > 0 ? (
              tasksList.map(task => (
                <div
                  key={task.id}
                  className="group p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="w-4 h-4 rounded border border-slate-400 hover:border-emerald-500 shrink-0 flex items-center justify-center"
                      title="تکمیل کار"
                    />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      {task.isFrog ? '🐸 ' : ''}{task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleStartFocus(task)}
                      className="p-1 rounded text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800"
                      title="شروع تایمر روی این کار"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 italic">
                کاری در این خانه نیست
              </div>
            )}
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => handleQuickAdd(defaultUrgency, defaultImportance)}
          className="mt-3 w-full py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-white/60 dark:hover:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن به این خانه</span>
        </button>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Introduction Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            ماتریس آیزنهاور: قطب‌نمای تصمیم‌گیری
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            آسیب‌های بی‌پلان بودن زمانی شروع میشه که کارهای «فوری اما بی‌ارزش» وقت کارهای «مهم و حیاتی» رو می‌گیرن.
          </p>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Q1: Do First */}
        {renderQuadrant(
          '۱. همین الان انجام بده!',
          'فوری و مهم (بحران‌ها و قورباغه)',
          <Flame className="w-4 h-4" />,
          q1,
          'bg-rose-500',
          'border-rose-200 dark:border-rose-900/40',
          'bg-rose-50/40 dark:bg-rose-950/20',
          'urgent',
          'important'
        )}

        {/* Q2: Schedule / Growth */}
        {renderQuadrant(
          '۲. برنامه‌ریزی کن و رشد کن',
          'مهم ولی غیرفوری (آینده‌ساز، ورزش، مهارت)',
          <Star className="w-4 h-4" />,
          q2,
          'bg-emerald-500',
          'border-emerald-200 dark:border-emerald-900/40',
          'bg-emerald-50/40 dark:bg-emerald-950/20',
          'not-urgent',
          'important'
        )}

        {/* Q3: Delegate / Fast */}
        {renderQuadrant(
          '۳. سریع و خلاصه ردش کن',
          'فوری اما کم‌اهمیت (تماس‌ها و پیام‌های روتین)',
          <Clock className="w-4 h-4" />,
          q3,
          'bg-amber-500',
          'border-amber-200 dark:border-amber-900/40',
          'bg-amber-50/40 dark:bg-amber-950/20',
          'urgent',
          'not-important'
        )}

        {/* Q4: Eliminate */}
        {renderQuadrant(
          '۴. حذف کن یا نادیده بگیر',
          'نه فوری و نه مهم (اتلاف وقت و شبکه‌های اجتماعی)',
          <Trash2 className="w-4 h-4" />,
          q4,
          'bg-slate-500',
          'border-slate-200 dark:border-slate-800',
          'bg-slate-50 dark:bg-slate-900/40',
          'not-urgent',
          'not-important'
        )}
      </div>
    </div>
  );
};
