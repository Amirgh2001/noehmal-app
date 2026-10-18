import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, BrainCircuit, Check, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audioSynthesizer';
import { fireSuccessConfetti } from '../utils/confetti';

export const BrainDumpModal: React.FC = () => {
  const { isBrainDumpOpen, setIsBrainDumpOpen, addTask } = useApp();
  const [rawText, setRawText] = useState('');

  if (!isBrainDumpOpen) return null;

  const handleProcessDump = () => {
    const lines = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) return;

    lines.forEach((line) => {
      // Determine category based on common words
      let category: 'work' | 'study' | 'personal' | 'health' | 'chores' | 'finance' = 'personal';
      const l = line.toLowerCase();
      if (l.includes('درس') || l.includes('کتاب') || l.includes('امتحان')) category = 'study';
      else if (l.includes('کار') || l.includes('ایمیل') || l.includes('پروژه')) category = 'work';
      else if (l.includes('خرید') || l.includes('بانک') || l.includes('پول')) category = 'finance';
      else if (l.includes('ورزش') || l.includes('دکتر') || l.includes('قرص')) category = 'health';
      else if (l.includes('تمیز') || l.includes('اتاق') || l.includes('لباس')) category = 'chores';

      addTask({
        title: line,
        category,
        dueDate: new Date().toISOString().split('T')[0],
        timeBlock: 'anytime'
      });
    });

    soundFx.playSuccessChime();
    fireSuccessConfetti();
    setRawText('');
    setIsBrainDumpOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-indigo-200 dark:border-indigo-900/40 text-slate-900 dark:text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                تخلیه ذهن و سطل زباله فکری
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                هر فکری که تو سرت وول می‌خوره رو بدون سانسور بنویس (هر خط یک فکر).
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBrainDumpOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tip Box */}
        <div className="p-3 my-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            لازم نیست نگران اولویت‌ها یا زمان باشی؛ فقط تایپ کن تا ذهنت سبک بشه. ما برات مرتبش می‌کنیم!
          </span>
        </div>

        {/* Text Area */}
        <textarea
          rows={6}
          placeholder="مثلاً:
زنگ زدن به دانشگاه برای تاییدیه
شستن ظرف‌های دیشب
ارسال رزومه به شرکت
خرید قرص ویتامین"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
        />

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {rawText.split('\n').filter(l => l.trim().length > 0).length} فکر آماده تبدیل به کار
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBrainDumpOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              انصراف
            </button>
            <button
              onClick={handleProcessDump}
              disabled={!rawText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>تبدیل همه به کارهای منظم</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
