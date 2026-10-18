import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { storage } from '../utils/storage';
import { toPersianDigits, formatMinutes } from '../utils/persianDate';
import {
  Trophy,
  CheckCircle2,
  Clock,
  Rocket,
  Download,
  Upload
} from 'lucide-react';

export const StatsView: React.FC = () => {
  const { stats } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const xpForNextLevel = 150;
  const currentLevelProgress = stats.xp % xpForNextLevel;
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / xpForNextLevel) * 100));

  const handleExport = () => {
    storage.exportBackup();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storage.importBackup(content);
      if (success) {
        alert('اطلاعات با موفقیت بازیابی شد!');
        window.location.reload();
      } else {
        alert('فایل پشتیبان نامعتبر است.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full space-y-6">
      {/* Level & Willpower Progress Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <span className="text-xs text-emerald-200 font-semibold block">
                سطح اراده و پشتکار تو:
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                قهرمان سطح {toPersianDigits(stats.level)}
              </h2>
              <span className="text-xs text-emerald-100/80">
                {toPersianDigits(stats.xp)} کل امتیازات تجربه (XP) کسب شده
              </span>
            </div>
          </div>

          <div className="text-right sm:text-left">
            <span className="text-xs text-emerald-200 font-bold block mb-1">
              پیشرفت تا سطح بعدی:
            </span>
            <span className="text-xl font-black text-amber-300 font-mono">
              {toPersianDigits(progressPercent)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-black/20 mt-5 overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-300 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">کارهای انجام شده</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {toPersianDigits(stats.completedTasksCount)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">پیروزی کوچک</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">قورباغه‌های بلعیده شده</span>
            <span className="text-base">🐸</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {toPersianDigits(stats.frogsCompletedCount)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">مانع بزرگ شکسته شد</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">کل دقایق تمرکز</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {formatMinutes(stats.focusMinutesTotal)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">تمرکز عمیق بدون حواس‌پرتی</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">پرتاب‌های ۵ دقیقه‌ای</span>
            <Rocket className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {toPersianDigits(stats.fiveMinLaunchesCount)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">شروع‌های بدون ترس</span>
          </div>
        </div>
      </div>

      {/* Backup and Data Management */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
            پشتیبان‌گیری و ماندگاری اطلاعات
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تمام داده‌ها به صورت امن در مرورگر خودت ذخیره شده‌اند. می‌تونی فایل پشتیبان بگیری تا روی دستگاه‌های دیگه هم داشته باشی.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 shadow-xs"
          >
            <Download className="w-4 h-4 text-brand-600" />
            <span>دانلود پشتیبان</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 shadow-xs"
          >
            <Upload className="w-4 h-4 text-sky-600" />
            <span>بازیابی فایل</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
