import React, { useState } from 'react';
import { Task } from '../types';
import { useApp } from '../context/AppContext';
import { toPersianDigits, formatMinutes } from '../utils/persianDate';
import {
  Check,
  Play,
  Scissors,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  Clock,
  Sparkles
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  work: { label: 'کاری', color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' },
  study: { label: 'آموزش', color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' },
  personal: { label: 'شخصی', color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' },
  health: { label: 'سلامت', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' },
  chores: { label: 'کارهای خانه', color: 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300' },
  finance: { label: 'مالی', color: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300' },
};

const TIME_BLOCK_LABELS: Record<string, string> = {
  morning: 'صبح 🌅',
  afternoon: 'ظهر و عصر ☀️',
  evening: 'شب 🌙',
  anytime: 'در طول روز ⏱️',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const {
    toggleComplete,
    deleteTask,
    setFrog,
    addMicroStep,
    toggleMicroStep,
    deleteMicroStep,
    setActiveTimerTask,
    setActiveTab,
    setDeconstructingTask,
    setIsDeconstructorOpen
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [newStepText, setNewStepText] = useState('');

  const completedStepsCount = task.microSteps.filter(s => s.completed).length;
  const totalStepsCount = task.microSteps.length;
  const categoryInfo = CATEGORY_LABELS[task.category] || CATEGORY_LABELS.work;

  const handleStartTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTimerTask(task);
    setActiveTab('focus');
  };

  const handleDeconstruct = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeconstructingTask(task);
    setIsDeconstructorOpen(true);
  };

  const handleToggleFrog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFrog(task.id);
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    addMicroStep(task.id, newStepText.trim(), 2);
    setNewStepText('');
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden ${
        task.completed
          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-60'
          : task.isFrog
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-md shadow-emerald-500/5'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
      }`}
    >
      {/* Frog Indicator Ribbon */}
      {task.isFrog && !task.completed && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold py-0.5 px-3 flex items-center justify-between">
          <span>🐸 قورباغه فعال روز</span>
          <span className="text-white/80">تمرکز ویژه</span>
        </div>
      )}

      {/* Main Task Bar */}
      <div className="p-3.5 sm:p-4 flex items-start gap-3">
        {/* Completion Checkbox */}
        <button
          onClick={() => toggleComplete(task.id)}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
              : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-transparent'
          }`}
          title={task.completed ? 'علامت به عنوان ناتمام' : 'انجام شد'}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold text-sm sm:text-base leading-snug cursor-pointer select-none ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400'
              }`}
            >
              {task.title}
            </h3>

            {/* Micro steps progress pill */}
            {totalStepsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                {toPersianDigits(completedStepsCount)}/{toPersianDigits(totalStepsCount)}
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Badges / Meta row */}
          <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
            {/* Category */}
            <span className={`px-2 py-0.5 rounded-md font-medium text-[10px] ${categoryInfo.color}`}>
              {categoryInfo.label}
            </span>

            {/* Time block */}
            <span className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-slate-400" />
              {TIME_BLOCK_LABELS[task.timeBlock] || TIME_BLOCK_LABELS.anytime}
            </span>

            {/* Estimated time */}
            {task.estimatedMinutes > 0 && (
              <span className="text-[10px]">
                ⏱️ {formatMinutes(task.estimatedMinutes)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Start Focus Timer */}
          {!task.completed && (
            <button
              onClick={handleStartTimer}
              className="p-2 rounded-xl text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
              title="شروع تایمر روی این کار"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}

          {/* Deconstruct Task */}
          {!task.completed && (
            <button
              onClick={handleDeconstruct}
              className="p-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
              title="خرد کردن به قدم‌های ۲ دقیقه‌ای"
            >
              <Scissors className="w-4 h-4" />
            </button>
          )}

          {/* Frog Button */}
          {!task.completed && (
            <button
              onClick={handleToggleFrog}
              className={`p-2 rounded-xl transition-colors ${
                task.isFrog
                  ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60'
                  : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={task.isFrog ? 'حذف از حالت قورباغه روز' : 'تبدیل به قورباغه روز'}
            >
              <span className="text-sm">🐸</span>
            </button>
          )}

          {/* Expand micro-steps */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="نمایش ریزقدم‌ها"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Delete Task */}
          <button
            onClick={() => deleteTask(task.id)}
            className="p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="حذف کار"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Micro-steps section */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              ریزقدم‌های ۲ دقیقه‌ای (شروع بدون ترس):
            </span>
            <button
              onClick={handleDeconstruct}
              className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              خردکن هوشمند
            </button>
          </div>

          {/* Step list */}
          {task.microSteps.length > 0 ? (
            <div className="space-y-1.5">
              {task.microSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => toggleMicroStep(task.id, step.id)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                    <span
                      className={`text-xs ${
                        step.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {step.title}
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    {step.durationMinutes && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                        {toPersianDigits(step.durationMinutes)} دقیقه
                      </span>
                    )}
                    <button
                      onClick={() => deleteMicroStep(task.id, step.id)}
                      className="text-slate-300 hover:text-rose-500 p-1"
                      title="حذف قدم"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-1">
              هنوز ریزقدمی ثبت نشده. می‌تونی از خردکن هوشمند استفاده کنی یا دستی اضافه کنی.
            </p>
          )}

          {/* Add custom micro step form */}
          <form onSubmit={handleAddStep} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="ریزقدم جدید (مثلاً: باز کردن تب گوگل داکس)"
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!newStepText.trim()}
              className="p-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white"
              title="افزودن قدم"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
