import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { deconstructTask } from '../../utils/deconstructor';
import { MicroStep } from '../../types';
import {
  Rocket,
  CheckCircle2,
  XCircle,
  Scissors,
  LifeBuoy,
  Gift,
  Clock,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Brain,
  Headphones,
  Play,
  HeartHandshake,
  Zap,
  HelpCircle,
  Smartphone,
  User
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persianDate';

export const LandingPage: React.FC = () => {
  const {
    setCurrentView,
    theme,
    toggleTheme,
    addTask,
    setActiveTimerTask,
    setActiveTab,
    setIsPwaPromptOpen,
    user,
    setIsAuthModalOpen
  } = useApp();

  // Interactive Live Deconstructor Demo State
  const [demoInput, setDemoInput] = useState('نوشتن پایان‌نامه و مقاله دانشگاه');
  const [demoSteps, setDemoSteps] = useState<MicroStep[]>(() => deconstructTask('نوشتن پایان‌نامه و مقاله دانشگاه'));

  // Interactive Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleDeconstructDemo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!demoInput.trim()) return;
    const steps = deconstructTask(demoInput.trim());
    setDemoSteps(steps);
  };

  const handleSendToApp = () => {
    const task = addTask({
      title: demoInput.trim(),
      isFrog: true,
      microSteps: demoSteps
    });
    setActiveTimerTask(task);
    setActiveTab('focus');
    setCurrentView('app');
  };

  const PRESET_DEMOS = [
    'نوشتن پایان‌نامه یا مقاله',
    'تمیز کردن کامل اتاق و خانه',
    'پروژه کدنویسی و رفع باگ',
    'شروع ورزش و رفتن به باشگاه',
    'پاسخ به ایمیل‌ها و تماس‌های معوقه'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/icon.svg"
              alt="نو اهمال"
              className="w-11 h-11 rounded-2xl shadow-lg shadow-brand-500/25 object-contain hover:scale-105 transition-transform shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">نو اهمال</span>
                <span className="text-[10px] font-bold bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                  ضد تعویق
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                دستیار هوشمند مدیریت زمان بر پایه علوم اعصاب
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#why" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">چرا نو اهمال؟</a>
            <a href="#demo" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">دموی زنده</a>
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">امکانات ویژه</a>
            <a href="#science" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">پشتوانه علمی</a>
            <a href="#quiz" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">تست خودشناسی</a>
            <a href="#faq" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">سوالات</a>
          </nav>

          {/* Actions: Theme Toggle & CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="تغییر حالت شب و روز"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {user ? (
              <button
                onClick={() => setCurrentView('app')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                title="ورود به پنل کاربری"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                />
                <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>ورود / ساخت حساب</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('app')}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <Rocket className="w-4 h-4" />
              <span>ورود به اپلیکیشن</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>خداحافظی علمی با به تعویق انداختن کارها</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.25] tracking-tight max-w-4xl mx-auto">
            دیگه خودت رو سرزنش نکن؛{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-500">
              تو تنبل نیستی!
            </span>
            <br />
            مغزت فقط به یک متد متفاوت نیاز داره.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            «نو اهمال» اولین اپلیکیشن ضد تعویق است که بر پایه **روانشناسی رفتاری و علوم اعصاب** ساخته شده؛ نه با ساختن لیست‌های استرس‌زای ۱۰۰ تایی، بلکه با **شکستن مقاومت ۲ دقیقه‌ای مغز**، **تزریق دوپامین سالم** و **منطقه صفر عذاب وجدان**.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('app')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-500/30 active:scale-95 transition-all group"
            >
              <Rocket className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>همین الان شروع کن (بدون نیاز به ثبت‌نام)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <a
              href="#demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all"
            >
              <Scissors className="w-4 h-4 text-amber-500" />
              <span>تست زنده خردکن ۲ دقیقه‌ای</span>
            </a>

            <button
              onClick={() => setIsPwaPromptOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 font-bold text-sm transition-all"
            >
              <Smartphone className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>نصب نسخه موبایل (PWA)</span>
            </button>
          </div>

          {!user && (
            <div className="pt-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1.5 px-3.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>ورود با یک کلیک با گوگل (Continue with Google) یا ساخت حساب</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Trust Metrics */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center border-t border-slate-200/60 dark:border-slate-800/60">
            <div>
              <span className="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ۸۵٪+
              </span>
              <span className="text-[11px] text-slate-500">افزایش نرخ شروع کارها</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ۲ دقیقه
              </span>
              <span className="text-[11px] text-slate-500">کاهش انرژی فعال‌سازی</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black text-amber-500">
                ۱۰۰٪ آفلاین
              </span>
              <span className="text-[11px] text-slate-500">امن و محرمانه روی دستگاه</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
                رایگان
              </span>
              <span className="text-[11px] text-slate-500">بدون تبلیغات و بدون هزینه</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Live Widget (دموی زنده خردکن کارها) */}
      <section id="demo" className="max-w-4xl mx-auto px-4 py-12 scroll-mt-20">
        <div className="p-6 sm:p-9 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Scissors className="w-4 h-4" />
              <span>دموی تعاملی آنلاین: خودت امتحانش کن!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              کاری که مدام ازش فرار می‌کنی رو اینجا بنویس:
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              ببین چطور در ۱ ثانیه، غول بی‌شاخ و دم ذهنت به چند سنگ‌ریزه خنده‌دار زیر ۲ دقیقه تبدیل میشه:
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {PRESET_DEMOS.map(preset => (
              <button
                key={preset}
                onClick={() => {
                  setDemoInput(preset);
                  setDemoSteps(deconstructTask(preset));
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  demoInput === preset
                    ? 'bg-amber-500 text-white border-amber-500 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleDeconstructDemo} className="flex gap-2">
            <input
              type="text"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="مثلاً: شروع نوشتن فصل دوم پایان‌نامه یا مرتب کردن میز"
              className="flex-1 px-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition-all shrink-0 flex items-center gap-1.5"
            >
              <Scissors className="w-4 h-4" />
              <span>خردش کن!</span>
            </button>
          </form>

          {/* Generated Steps Preview */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                ریزقدم‌های آماده برای شروع بدون ترس:
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ قدم اول تضمیناً زیر ۲ دقیقه
              </span>
            </div>

            {demoSteps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {toPersianDigits(idx + 1)}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                    {step.title}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 mr-2">
                  {toPersianDigits(step.durationMinutes || 2)} دقیقه
                </span>
              </div>
            ))}

            {/* Launch into app with this task */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700/60">
              <span className="text-xs text-slate-500">
                آماده‌ای همین الان اولین قدم رو تیک بزنی؟
              </span>
              <button
                onClick={handleSendToApp}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>انتقال این کار به اپلیکیشن و شروع تایمر</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Problem vs Solution (اپ‌های معمولی در برابر نو اهمال) */}
      <section id="why" className="max-w-5xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            چرا اپلیکیشن‌های معمولی To-Do برای تو جواب نمیدن؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            اکثر اپ‌ها برای ربات‌ها طراحی شده‌اند، نه انسان‌هایی با احساسات واقعی، خستگی و استرس!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Apps Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-rose-900 dark:text-rose-200">اپ‌های سنتی (Todoist, Notion, کاغذ)</h3>
                <span className="text-xs text-rose-700/70 dark:text-rose-400">تولیدکننده اضطراب و احساس گناه</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>لیست‌های ۵۰ تایی وحشتناک:</strong> با باز کردن اپ، یک کوه از کارهای تمام‌نشده بهت هجوم میاره و درجا قفل می‌کنی (فلج تصمیم‌گیری).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>هشدارهای قرمز سرزنش‌کننده:</strong> اعلان‌های «۵ روز گذشته و انجام ندادی!» فقط احساس شرم ایجاد می‌کنند و باعث فرار به اینستاگرام میشن.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>بهانه‌ای برای اهمال‌کاری مضاعف:</strong> ساعت‌ها وقت صرف دسته‌بندی رنگی و نوشتن برنامه می‌کنی، بدون اینکه ۱ خط از کار واقعی پیش بره.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>فقط ثبت می‌کنند، کمکت نمی‌کنند:</strong> کارهای بزرگ مثل «درس خواندن» رو همونطور غول‌پیکر رها می‌کنند و هیچ روشی برای شروع ندارند.</span>
              </li>
            </ul>
          </div>

          {/* NoEhmal Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-400 dark:border-emerald-800 space-y-5 shadow-lg shadow-emerald-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-emerald-900 dark:text-emerald-200">رویکرد انقلابی «نو اهمال»</h3>
                <span className="text-xs text-emerald-700/80 dark:text-emerald-400">طراحی شده برای روانشناسی مغز انسان</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span><strong>قانون تک‌کاری و قورباغه روز:</strong> بقیه دنیا رو خاموش کن! فقط یک کار اصلی جلوت قرار می‌گیره تا خیالت از امروز راحت بشه.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span><strong>منطقه صفر عذاب وجدان:</strong> گذشته گذشته! بدون هیچ سرزنشی، کارهای معوقه با یک کلیک به امروز منتقل یا محترمانه آرشیو میشن.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span><strong>خردکن هوشمند ۲ دقیقه‌ای:</strong> مغز از کارهای بزرگ می‌ترسه؛ ما کار رو خرد می‌کنیم به قدم‌هایی که حتی یک کودک هم می‌تونه انجام بده.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span><strong>تایمر پرتاب ۵ دقیقه‌ای + نویز قهوه‌ای:</strong> به جای ۲ ساعت درس، فقط ۵ دقیقه شروع کن با صدای باران و نویز قهوه‌ای زنده بدون اینترنت.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Core Features Showcase (ویژگی‌های عمیق) */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Zap className="w-4 h-4" />
            <span>ابزارهای خلاقانه</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            هر چیزی که برای غلبه بر تعویق نیاز داری
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            طراحی شده با الهام از برترین روش‌های درمان شناختی-رفتاری (CBT) و علوم اعصاب
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">حالت نجات اضطراری (Rescue Mode)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              وقتی غرق در اضطراب شدی، با دکمه نجات همه صداها رو ساکت کن؛ تنفس ۴-۴-۴-۴ بگیر و با یک تعهد ۲ دقیقه‌ای ساده دوباره کنترل اوضاع رو به دست بگیر.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl">
              🐸
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">قورباغه روز و قانون ۳ کار</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              سخت‌ترین و مهم‌ترین کار روزت رو در کانون توجه بذار. وقتی صبح قورباغه رو بلعیدی، بقیه روزت با آرامش کامل و خیال راحت سپری میشه.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">خردکن جادویی ۲ دقیقه‌ای</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              هر کاری که حس خفگی بهت میده رو با ۱ کلیک به ریزقدم‌های فوق‌العاده ساده تبدیل کن تا انرژی فعال‌سازی اولیه مغزت به صفر برسه.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">تایمر پرتاب + نویز قهوه‌ای</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              شمارش معکوس پرتاب ۵ دقیقه‌ای به همراه تولید امواج صوتی نویز قهوه‌ای و صدای باران (کاملاً آفلاین با Web Audio API) برای خاموشی نجواهای ذهنی.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">صندوق جوایز و دوپامین سالم</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              با امتیازات تمرکزت جوایز واقعی خودت رو باز کن؛ تماشای فیلم، بازی ویدیویی یا قهوه دلخواه. تفریح لذت‌بخشه وقتی بدون عذاب وجدان باشه!
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">ساعت بیولوژیک ضد کوری زمان</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              تقسیم روز به صبح طلایی، ظهر روتین، عصر شخصی و شب آرام برای از بین بردن توهم «هنوز کلی وقت دارم» و واقع‌بین کردن درک زمان مغز.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Scientific Validation Section (پشتوانه علمی) */}
      <section id="science" className="max-w-5xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-white border border-brand-900/40 relative overflow-hidden space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-bold">
                <Brain className="w-4 h-4" />
                <span>علوم اعصاب و روانشناسی شناختی</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                چرا متد «نو اهمال» از نظر علمی جواب می‌دهد؟
              </h2>
            </div>
            <span className="text-xs text-brand-200/80 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 shrink-0 self-start">
              مبتنی بر تحقیقات هاروارد و کمبریج
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="text-xs font-black text-brand-300 block">دکتر فوشیا سیروا (Dr. Fuschia Sirois)</span>
              <h4 className="font-bold text-sm text-white">تنظیم هیجان، نه مدیریت زمان!</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                «اهمال‌کاری مشکل برنامه‌ریزی نیست، بلکه تلاش مغز برای فرار از احساسات منفی (اضطراب و ترس از شکست) است.» نو اهمال با سیستم حذف سرزنش این چرخه منفی را درجا قطع می‌کند.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="text-xs font-black text-emerald-300 block">جیمز کلیر (Atomic Habits)</span>
              <h4 className="font-bold text-sm text-white">قانون ۲ دقیقه برای شروع عادت‌ها</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                «وقتی کاری کمتر از ۲ دقیقه طول بکشد، آمیگدال مغز آن را به عنوان تهدید تلقی نمی‌کند.» با خردکن هوشمند، اولین قدم همیشه پیش‌پاافتاده و سهل‌الوصول است.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="text-xs font-black text-amber-300 block">مل رابینز (Mel Robbins)</span>
              <h4 className="font-bold text-sm text-white">قانون ۵ ثانیه برای شکستن اینرسی</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                فاصله بین تصمیم‌گیری و بهانه تراشیدن مغز ۵ ثانیه است. تایمر پرتاب موشک نو اهمال قبل از اینکه مغز دلایل تنبلی بتراشد، شما را در حالت عمل قرار می‌دهد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Interactive Quiz: «سبک اهمال‌کاری تو چیه؟» */}
      <section id="quiz" className="max-w-3xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="p-6 sm:p-9 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold">
              <Brain className="w-4 h-4" />
              <span>تست خودشناسی ۶۰ ثانیه‌ای</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              سبک اهمال‌کاری تو کدومه؟
            </h2>
            <p className="text-xs text-slate-500">
              با پاسخ به ۳ سوال سریع، ریشه اصلی فرار از کارهات رو کشف کن:
            </p>
          </div>

          <div className="space-y-5">
            {/* Question 1 */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                ۱. وقتی یک کار سنگین داری، چه فکری اول از همه میاد تو سرت؟
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 0, text: '«هنوز آمادگیش رو ندارم؛ بذار اول شرایط ایده‌آل بشه!» (کمال‌گرایی)' },
                  { id: 1, text: '«وای خیلی زیاده، اصلاً نمی‌دونم از کجا باید شروع کنم!» (فلج اضافه بار)' },
                  { id: 2, text: '«الان خسته‌ام، بذار یه دور اینستاگرام برم بعد شروع می‌کنم!» (فرار دوپامینی)' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setQuizAnswers(prev => ({ ...prev, 1: opt.id }))}
                    className={`p-3 rounded-xl border text-right text-xs transition-all ${
                      quizAnswers[1] === opt.id
                        ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 font-bold text-purple-900 dark:text-purple-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                ۲. وقتی کاری از دیروز ناتمام می‌مونه، چه احساسی داری؟
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 0, text: 'شرم و عذاب وجدان شدید؛ حس می‌کنم هیچ‌وقت آدم منظمی نمیشم.' },
                  { id: 1, text: 'سعی می‌کنم کلاً فراموشش کنم و بهش فکر نکنم تا حالم بد نشه.' },
                  { id: 2, text: 'اضطراب می‌گیرم و کلاً بازدهی امروز منم به فنا میره.' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setQuizAnswers(prev => ({ ...prev, 2: opt.id }))}
                    className={`p-3 rounded-xl border text-right text-xs transition-all ${
                      quizAnswers[2] === opt.id
                        ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 font-bold text-purple-900 dark:text-purple-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Result Box */}
            {quizAnswers[1] !== undefined && quizAnswers[2] !== undefined && (
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>نتیجه ارزیابی اختصاصی تو:</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  الگوی ذهنی تو نشان می‌دهد که علت اصلی تعویق، <strong>«فشار کمال‌گرایی و اضطراب ناشی از سرزنش خود»</strong> است. تو به یک لیست کاری نیاز نداری؛ بلکه به <strong>«خردکن ۲ دقیقه‌ای»</strong> و <strong>«سیستم صفر عذاب وجدان»</strong> نو اهمال نیاز داری تا بدون شرم و ترس، موتور کارت روشن بشه.
                </p>
                <button
                  onClick={() => setCurrentView('app')}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  <span>ورود به اپلیکیشن و درمان همین الگو</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. User Stories & Testimonials */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            داستان کسانی که مثل تو بودند
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            تجربه واقعی آدم‌هایی که هیچ‌وقت اهل برنامه‌ریزی نبودند
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              «همیشه از دیدن کتاب‌های قطور فرار می‌کردم. ویژگی خردکن جادویی کارها کاری کرد که فقط بگم ۵ دقیقه می‌شینم و همین ۵ دقیقه منو ساعت‌ها نگه می‌داره!»
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                س
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">سارا ر.</span>
                <span className="text-[10px] text-slate-400">دانشجوی داروسازی</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              «تسک‌های فریلنسری معوقه ۲ هفته‌ای رو توی ۳ ساعت تموم کردم. صدای نویز قهوه‌ای توکار اپلیکیشن واقعاً نجواهای مزاحم مغز رو خفه می‌کنه.»
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                ع
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">علی م.</span>
                <span className="text-[10px] text-slate-400">برنامه‌نویس و فریلنسر</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              «من ADHD دارم و تودولیست‌های سنتی برام مثل شکنجه‌گاه بودن. این اولین اپلیکیشنیه که وقتی کاری عقب می‌افته با اعلان‌های قرمز تحقیرم نمی‌کنه.»
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                م
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">مهرداد ک.</span>
                <span className="text-[10px] text-slate-400">طراح محصول</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Accordion */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>پاسخ به ابهامات تو</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            سوالات متداول
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'آیا برای استفاده نیاز به ثبت‌نام یا ایمیل و پسورد دارم؟',
              a: 'خیر! هیچ فرم ثبت‌نام خسته‌کننده‌ای وجود ندارد. با یک کلیک فوراً وارد برنامه می‌شوید و تمام اطلاعات به صورت امن روی مرورگر دستگاه خودتان ذخیره می‌شود.'
            },
            {
              q: 'چطور این اپلیکیشن را روی گوشی آیفون خودم نصب کنم؟',
              a: 'کافی است آدرس برنامه را در مرورگر Safari آیفون باز کنید، دکمه اشتراک‌گذاری (Share) در پایین صفحه را بزنید و گزینه «Add to Home Screen» را انتخاب کنید تا با آیکون زیبا روی صفحه اصلی گوشی شما نصب شود.'
            },
            {
              q: 'آیا اصوات تمرکز (نویز قهوه‌ای و باران) نیاز به دانلود دارند؟',
              a: 'خیر؛ تمام اصوات با تکنولوژی Web Audio API به شکل کامپیوتری و زنده داخل مرورگر تولید می‌شوند، یعنی حتی در حالت کاملاً آفلاین و در حالت پرواز هم بدون وقفه کار می‌کنند!'
            },
            {
              q: 'من واقعاً هیچ‌وقت در زندگیم برنامه نریختم، آیا برای من مفیده؟',
              a: 'دقیقاً نو اهمال برای شخص شما طراحی شده است! در این اپ قرار نیست تقویم پر کنید یا برنامه‌ریزی‌های طولانی داشته باشید. اپلیکیشن فقط دست شما را می‌گیرد و می‌گوید: «همین یک کار کوچک را برای ۲ دقیقه شروع کن».'
            },
            {
              q: 'اگر کامپیوترم را عوض کنم، داده‌های من از دست می‌روند؟',
              a: 'خیر؛ در بخش آمار و جوایز دکمه «دانلود فایل پشتیبان» وجود دارد که در ۱ ثانیه تمام کارهایتان را به صورت یک فایل سبک دانلود می‌کند و در هر دستگاه دیگری با دکمه «بازیابی» در دسترس خواهد بود.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-brand-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-brand-500" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="relative rounded-3xl bg-gradient-to-tr from-brand-600 via-emerald-600 to-teal-700 text-white p-8 sm:p-14 text-center overflow-hidden shadow-2xl shadow-emerald-950/20 space-y-6">
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-emerald-100">
            <HeartHandshake className="w-4 h-4" />
            <span>یک شانس دوباره به خودت بده</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black max-w-2xl mx-auto leading-tight">
            آماده‌ای برای همیشه از شر احساس گناه و کارهای عقب‌افتاده رها شی؟
          </h2>

          <p className="text-xs sm:text-base text-emerald-100/90 max-w-lg mx-auto">
            لازم نیست از فردا یک آدم جدید بشی؛ فقط همین الان وارد اپ شو و یک قدم ۲ دقیقه‌ای بردار.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setCurrentView('app')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-sm sm:text-base shadow-xl hover:bg-emerald-50 active:scale-95 transition-all"
            >
              <Rocket className="w-5 h-5 text-emerald-600" />
              <span>ورود مستقیم به وب‌اپلیکیشن (۱۰۰٪ رایگان)</span>
              <ArrowLeft className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 transition-colors">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <img
              src="/icon.svg"
              alt="نو اهمال"
              className="w-7 h-7 rounded-lg object-contain shrink-0"
            />
            <span className="font-bold text-slate-800 dark:text-slate-200">نو اهمال (NoEhmal)</span>
            <span>— همراه تو در مسیر پایان دادن به تعویق کارها</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="#why" className="hover:text-slate-800 dark:hover:text-slate-200">چرا نو اهمال؟</a>
            <a href="#features" className="hover:text-slate-800 dark:hover:text-slate-200">امکانات</a>
            <a href="#science" className="hover:text-slate-800 dark:hover:text-slate-200">روش علمی</a>
            <button onClick={() => setCurrentView('app')} className="font-bold text-brand-600 hover:underline">ورود به برنامه</button>
          </div>
        </div>
        <div className="text-center text-[11px] text-slate-400 mt-6">
          «کوچک‌ترین اقدام عملی، از بزرگ‌ترین نیت‌های ذهنی ارزشمندتر است.»
        </div>
      </footer>
    </div>
  );
};
