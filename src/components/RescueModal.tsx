import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audioSynthesizer';
import { X, HeartHandshake, ArrowLeft, Play, ShieldAlert, Sparkles } from 'lucide-react';

export const RescueModal: React.FC = () => {
  const { isRescueOpen, setIsRescueOpen, tasks, setActiveTimerTask, setActiveTab, addTask } = useApp();
  const [step, setStep] = useState<'breathe' | 'choose' | 'launch'>('breathe');
  const [breathePhase, setBreathePhase] = useState<'دم' | 'حبس' | 'بازدم' | 'آرامش'>('دم');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState('');

  // Box breathing timer
  useEffect(() => {
    if (!isRescueOpen || step !== 'breathe') return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phases
        setBreathePhase((current) => {
          if (current === 'دم') return 'حبس';
          if (current === 'حبس') return 'بازدم';
          if (current === 'بازدم') return 'آرامش';
          return 'دم';
        });
        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRescueOpen, step]);

  if (!isRescueOpen) return null;

  const handleLaunchMicroFocus = () => {
    soundFx.playTibetanBowl();
    let task = tasks.find(t => t.title === selectedTaskTitle && !t.completed);
    if (!task && selectedTaskTitle.trim()) {
      task = addTask({
        title: selectedTaskTitle.trim(),
        isFrog: true,
        priority: 'frog',
        estimatedMinutes: 5,
        microSteps: [
          { id: `rescue-${Date.now()}-1`, title: 'فقط ۲ دقیقه شروع ساده بدون قضاوت', completed: false, durationMinutes: 2 },
          { id: `rescue-${Date.now()}-2`, title: 'تصمیم‌گیری برای ادامه کار', completed: false, durationMinutes: 3 }
        ]
      });
    }

    if (task) {
      setActiveTimerTask(task);
    }
    setIsRescueOpen(false);
    setActiveTab('focus');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 dark:border-rose-900/40 text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsRescueOpen(false)}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Breathe & Decompress */}
        {step === 'breathe' && (
          <div className="flex flex-col items-center text-center space-y-6 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 text-xs font-bold">
              <ShieldAlert className="w-4 h-4" />
              حالت نجات و آرامش ذهن
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                نفس عمیق بکش؛ هیچ فاجعه‌ای رخ نداده!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm">
                اهمال‌کاری به خاطر تنبلی نیست؛ به خاطر اینه که مغزت احساس اضطراب یا خستگی کرده. اول با این ریتم آروم شو:
              </p>
            </div>

            {/* Breathing Visualizer Circle */}
            <div className="relative w-44 h-44 flex items-center justify-center my-4">
              <div
                className={`absolute inset-0 rounded-full border-4 border-rose-400/40 transition-all duration-1000 ease-in-out ${
                  breathePhase === 'دم'
                    ? 'scale-110 bg-rose-500/15 border-rose-500'
                    : breathePhase === 'حبس'
                    ? 'scale-110 bg-amber-500/15 border-amber-500'
                    : breathePhase === 'بازدم'
                    ? 'scale-90 bg-sky-500/15 border-sky-500'
                    : 'scale-95 bg-emerald-500/15 border-emerald-500'
                }`}
              />
              <div className="z-10 flex flex-col items-center">
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {breathePhase}
                </span>
                <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                  {secondsLeft}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  تنفس ۴ ثانیه‌ای
                </span>
              </div>
            </div>

            <div className="w-full flex items-center justify-between pt-2">
              <button
                onClick={() => setIsRescueOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                بستن و بازگشت
              </button>
              <button
                onClick={() => setStep('choose')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-500/30 active:scale-95 transition-all"
              >
                <span>آروم‌تر شدم، قدم بعدی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Micro Triage (The One Thing) */}
        {step === 'choose' && (
          <div className="flex flex-col space-y-6 pt-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold">
              <HeartHandshake className="w-4 h-4" />
              قدم دوم: فقط یک کار کوچک
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                الان تمام کارهای دنیا رو فراموش کن!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                اگر قرار باشه فقط و فقط یک کار بسیار کوچک انتخاب کنی که کمی بار فکری‌ت سبک بشه، اون چیه؟
              </p>
            </div>

            {/* Choose from existing tasks or write new */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                انتخاب از لیست امروز، یا نوشتن کاری ساده:
              </label>

              <input
                type="text"
                placeholder="مثلاً: فقط باز کردن فایل مقاله یا پوشیدن کفش"
                value={selectedTaskTitle}
                onChange={(e) => setSelectedTaskTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />

              {tasks.filter(t => !t.completed).length > 0 && (
                <div className="space-y-1.5 pt-1 max-h-36 overflow-y-auto">
                  <span className="text-[11px] text-slate-500">پیشنهادات سریع از لیست تو:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tasks.filter(t => !t.completed).slice(0, 4).map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTaskTitle(t.title)}
                        className={`text-xs px-3 py-1.5 rounded-lg border text-right transition-all truncate max-w-full ${
                          selectedTaskTitle === t.title
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {t.isFrog ? '🐸 ' : ''}{t.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Psychological Reassurance */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p>
                <strong>قرارداد با خودت:</strong> تو متعهد نیستی کل کار رو تموم کنی! فقط ۲ دقیقه بهش دست می‌زنی. بعد از ۲ دقیقه اگر نخواستی، آزادی که متوقف بشی.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep('breathe')}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                مرحله قبل
              </button>
              <button
                onClick={handleLaunchMicroFocus}
                disabled={!selectedTaskTitle.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>شروع پرتاب ۲ دقیقه‌ای</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
