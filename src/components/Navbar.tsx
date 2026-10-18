import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils/persianDate';
import { Flame, Sparkles, Sun, Moon, LifeBuoy, PlusCircle, BrainCircuit, Smartphone, User as UserIcon, LogOut, Check } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    stats,
    theme,
    toggleTheme,
    setIsRescueOpen,
    setIsBrainDumpOpen,
    addTask,
    setCurrentView,
    setIsPwaPromptOpen,
    user,
    setIsAuthModalOpen,
    logout
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleQuickAdd = () => {
    const title = window.prompt('عنوان کار مورد نظرت رو بنویس (یا بذار خردش کنیم):');
    if (title && title.trim()) {
      addTask({ title: title.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 text-right hover:opacity-85 transition-opacity"
          title="بازگشت به صفحه معرفی"
        >
          <img
            src="/icon.svg"
            alt="نو اهمال"
            className="w-10 h-10 rounded-xl shadow-md shadow-brand-500/20 object-contain hover:scale-105 transition-transform shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">نو اهمال</h1>
              <span className="text-[10px] font-bold bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                ضد تعویق
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              صفحه معرفی و دمو ⟵
            </p>
          </div>
        </button>

        {/* Center: XP and Streak Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="font-bold">{toPersianDigits(stats.streakDays)}</span>
            <span className="hidden md:inline">روز تداوم</span>
          </div>

          {/* XP & Level */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>سطح {toPersianDigits(stats.level)}</span>
            <span className="text-emerald-500/80">({toPersianDigits(stats.xp)} XP)</span>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Rescue Mode Emergency Button */}
          <button
            onClick={() => setIsRescueOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all"
            title="حالت نجات فوری از سردرگمی و استرس"
          >
            <LifeBuoy className="w-4 h-4 animate-spin-slow" />
            <span className="hidden sm:inline">نجاتم بده!</span>
          </button>

          {/* Fast Brain Dump */}
          <button
            onClick={() => setIsBrainDumpOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="تخلیه سریع افکار و ذهن"
          >
            <BrainCircuit className="w-4 h-4 text-indigo-500" />
            <span className="hidden md:inline">تخلیه ذهن</span>
          </button>

          {/* PWA Install Button */}
          <button
            onClick={() => setIsPwaPromptOpen(true)}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="نصب اپلیکیشن روی آیفون و لپ‌تاپ (PWA)"
          >
            <Smartphone className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="hidden lg:inline">نصب اپ</span>
          </button>

          {/* Quick Add */}
          <button
            onClick={handleQuickAdd}
            className="p-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white shadow-sm transition-all"
            title="ثبت سریع کار"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          {/* User Account / Profile Menu */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="پروفایل کاربری"
              >
                <div className="relative">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-emerald-400 object-cover bg-emerald-50 dark:bg-emerald-950"
                  />
                  {user.authProvider === 'google' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-xs">
                      <span className="text-[7px]">G</span>
                    </span>
                  )}
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-extrabold transition-all shadow-xs"
                title="ورود به حساب یا ساخت اکانت"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ورود / حساب</span>
              </button>
            )}

            {/* User Dropdown Menu */}
            {user && isUserMenuOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 text-right animate-fade-in space-y-2.5">
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="block text-xs font-black text-slate-900 dark:text-white truncate">
                    {user.name}
                  </span>
                  <span className="block text-[11px] text-slate-400 truncate font-sans">
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    <Check className="w-3 h-3" />
                    همگام‌سازی ابری فعال
                  </span>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج از حساب</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="تغییر پوسته شب و روز"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
