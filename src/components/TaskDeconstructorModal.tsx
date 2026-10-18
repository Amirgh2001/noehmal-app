import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { deconstructTask } from '../utils/deconstructor';
import { MicroStep } from '../types';
import { X, Scissors, Plus, Trash2, CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { toPersianDigits } from '../utils/persianDate';

export const TaskDeconstructorModal: React.FC = () => {
  const {
    isDeconstructorOpen,
    setIsDeconstructorOpen,
    deconstructingTask,
    updateTask,
    setActiveTimerTask,
    setActiveTab
  } = useApp();

  const [steps, setSteps] = useState<MicroStep[]>([]);
  const [newStepTitle, setNewStepTitle] = useState('');

  useEffect(() => {
    if (deconstructingTask) {
      if (deconstructingTask.microSteps && deconstructingTask.microSteps.length > 0) {
        setSteps(deconstructingTask.microSteps);
      } else {
        const generated = deconstructTask(deconstructingTask.title);
        setSteps(generated);
      }
    }
  }, [deconstructingTask]);

  if (!isDeconstructorOpen || !deconstructingTask) return null;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim()) return;
    const newStep: MicroStep = {
      id: `ms-${Date.now()}`,
      title: newStepTitle.trim(),
      durationMinutes: 2,
      completed: false
    };
    setSteps(prev => [...prev, newStep]);
    setNewStepTitle('');
  };

  const handleRemove = (id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveAndStart = () => {
    updateTask(deconstructingTask.id, { microSteps: steps });
    setIsDeconstructorOpen(false);
    setActiveTimerTask(deconstructingTask);
    setActiveTab('focus');
  };

  const handleSaveOnly = () => {
    updateTask(deconstructingTask.id, { microSteps: steps });
    setIsDeconstructorOpen(false);
  };

  const handleRegenerate = () => {
    const generated = deconstructTask(deconstructingTask.title);
    setSteps(generated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-200 dark:border-amber-900/40 text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                خردکن جادویی کار به قدم‌های ۲ دقیقه‌ای
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                قانون روانشناسی: وقتی قدم اول کمتر از ۲ دقیقه باشه، مقاومت مغز شکسته میشه.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDeconstructorOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Title Banner */}
        <div className="p-3.5 my-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 shrink-0">
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
            کار اصلی:
          </span>
          <p className="text-sm font-black text-slate-900 dark:text-white">
            {deconstructingTask.title}
          </p>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-1 pr-1">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>قدم‌های کوچک پیشنهادی:</span>
            <button
              onClick={handleRegenerate}
              className="text-[11px] text-amber-600 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              تولید مجدد قدم‌ها
            </button>
          </div>

          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 gap-2"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[11px] font-bold flex items-center justify-center shrink-0">
                  {toPersianDigits(idx + 1)}
                </span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {step.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  {toPersianDigits(step.durationMinutes || 2)} دقیقه
                </span>
                <button
                  onClick={() => handleRemove(step.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add custom step */}
          <form onSubmit={handleAddCustom} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="ریزقدم دلخواه جدید بنویس..."
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!newStepTitle.trim()}
              className="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 disabled:opacity-40 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن</span>
            </button>
          </form>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleSaveOnly}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ذخیره در لیست
          </button>
          <button
            onClick={handleSaveAndStart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>ذخیره و شروع قدم اول با تایمر</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
