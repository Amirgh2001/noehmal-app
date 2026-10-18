import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { FocusMode, AmbientSoundType } from '../types';
import { soundFx } from '../utils/audioSynthesizer';
import { toPersianDigits } from '../utils/persianDate';
import { fireSuccessConfetti } from '../utils/confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Rocket,
  Flame,
  Coffee,
  CheckCircle2,
  CloudRain,
  Waves,
  Trees
} from 'lucide-react';

const MODE_CONFIGS: Record<FocusMode, { title: string; defaultMinutes: number; description: string }> = {
  five_min_launch: {
    title: 'پرتاب ۵ دقیقه‌ای موشک 🚀',
    defaultMinutes: 5,
    description: 'فقط ۵ دقیقه شروع کن! بعد از ۵ دقیقه آزادی متوقف بشی (۹۰٪ مواقع ادامه میدی).'
  },
  pomodoro: {
    title: 'پومودورو ۲۵ دقیقه‌ای 🍅',
    defaultMinutes: 25,
    description: 'یک دور کامل تمرکز عمیق بدون هرگونه حواس‌پرتی یا نگاه کردن به شبکه‌های اجتماعی.'
  },
  short_break: {
    title: 'استراحت کوتاه ☕',
    defaultMinutes: 5,
    description: 'بلند شو، یک لیوان آب بخور و چند قدم راه برو.'
  },
  long_break: {
    title: 'استراحت طولانی 🌿',
    defaultMinutes: 15,
    description: 'ذهنت رو رها کن تا برای دور بعدی شارژ بشه.'
  },
  flow: {
    title: 'جریان آزاد (بدون محدودیت) 🌊',
    defaultMinutes: 0,
    description: 'تایمر به سمت بالا می‌شماره، بدون هیچ استرس یا فشار زمانی.'
  }
};

export const FocusTimer: React.FC = () => {
  const { activeTimerTask, setActiveTimerTask, addFocusMinutes, toggleComplete, tasks } = useApp();

  const [mode, setMode] = useState<FocusMode>('five_min_launch');
  const [secondsRemaining, setSecondsRemaining] = useState(5 * 60);
  const [countUpSeconds, setCountUpSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('brown_noise');
  const [isMuted, setIsMuted] = useState(false);

  const initialTotalSecondsRef = useRef(5 * 60);

  // Switch modes
  const handleModeChange = (newMode: FocusMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'flow') {
      setCountUpSeconds(0);
    } else {
      const secs = MODE_CONFIGS[newMode].defaultMinutes * 60;
      setSecondsRemaining(secs);
      initialTotalSecondsRef.current = secs;
    }
  };

  // Timer interval loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      if (!isMuted && ambientSound !== 'none') {
        soundFx.startAmbient(ambientSound);
      }

      interval = setInterval(() => {
        if (mode === 'flow') {
          setCountUpSeconds((prev) => prev + 1);
        } else {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              // Timer Finished!
              handleSessionComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      soundFx.stopAmbient();
    }

    return () => {
      if (interval) clearInterval(interval);
      soundFx.stopAmbient();
    };
  }, [isRunning, mode, ambientSound, isMuted]);

  // Handle successful finish
  const handleSessionComplete = () => {
    setIsRunning(false);
    soundFx.stopAmbient();
    soundFx.playSuccessChime();
    fireSuccessConfetti();

    const minutesCompleted = Math.round(initialTotalSecondsRef.current / 60);
    addFocusMinutes(minutesCompleted, mode === 'five_min_launch');
  };

  const handleTogglePlay = () => {
    if (!isRunning) {
      soundFx.playTibetanBowl();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    soundFx.stopAmbient();
    if (mode === 'flow') {
      setCountUpSeconds(0);
    } else {
      setSecondsRemaining(initialTotalSecondsRef.current);
    }
  };

  const handleTaskComplete = () => {
    if (activeTimerTask) {
      toggleComplete(activeTimerTask.id);
      setActiveTimerTask(null);
    }
  };

  // Format time display
  const displaySeconds = mode === 'flow' ? countUpSeconds : secondsRemaining;
  const mins = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Progress percentage
  const progressPercent =
    mode === 'flow'
      ? 100
      : initialTotalSecondsRef.current > 0
      ? ((initialTotalSecondsRef.current - secondsRemaining) / initialTotalSecondsRef.current) * 100
      : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 gap-1 overflow-x-auto">
        <button
          onClick={() => handleModeChange('five_min_launch')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            mode === 'five_min_launch'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>پرتاب ۵ دقیقه‌ای</span>
        </button>

        <button
          onClick={() => handleModeChange('pomodoro')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            mode === 'pomodoro'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>پومودورو ۲۵ دقیقه</span>
        </button>

        <button
          onClick={() => handleModeChange('short_break')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            mode === 'short_break'
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>استراحت</span>
        </button>

        <button
          onClick={() => handleModeChange('flow')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            mode === 'flow'
              ? 'bg-indigo-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>جریان آزاد</span>
        </button>
      </div>

      {/* Main Focus Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl flex flex-col items-center text-center">
        {/* Glow backdrop */}
        <div
          className={`absolute inset-0 opacity-10 blur-3xl pointer-events-none transition-colors duration-700 ${
            isRunning ? 'bg-emerald-500' : 'bg-slate-500'
          }`}
        />

        {/* Selected Task Target */}
        <div className="w-full max-w-md mb-6">
          {activeTimerTask ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2">
              <div className="text-right overflow-hidden">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                  تمرکز فعلی روی کار:
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">
                  {activeTimerTask.isFrog ? '🐸 ' : ''}{activeTimerTask.title}
                </p>
              </div>

              <button
                onClick={handleTaskComplete}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-[11px] hover:bg-emerald-600 shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>اتمام کار</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-500">کاری انتخاب نشده (تمرکز کلی)</span>
              {tasks.filter(t => !t.completed).length > 0 && (
                <select
                  onChange={(e) => {
                    const task = tasks.find(t => t.id === e.target.value);
                    if (task) setActiveTimerTask(task);
                  }}
                  defaultValue=""
                  className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300"
                >
                  <option value="" disabled>انتخاب کار...</option>
                  {tasks.filter(t => !t.completed).map(t => (
                    <option key={t.id} value={t.id}>
                      {t.isFrog ? '🐸 ' : ''}{t.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Circular Clock Display */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
          {/* SVG Progress Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className={`transition-all duration-500 ${
                mode === 'five_min_launch'
                  ? 'stroke-emerald-500'
                  : mode === 'pomodoro'
                  ? 'stroke-rose-500'
                  : 'stroke-indigo-500'
              }`}
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 115}
              strokeDashoffset={2 * Math.PI * 115 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Clock */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums font-mono">
              {toPersianDigits(formattedTime)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {MODE_CONFIGS[mode].title}
            </span>
            {isRunning && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                در حال تمرکز عمیق
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 mb-6">
          {MODE_CONFIGS[mode].description}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="شروع مجدد تایمر"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-black text-base shadow-xl active:scale-95 transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                : 'bg-gradient-to-r from-emerald-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 shadow-emerald-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 fill-white" />
                <span>توقف موقت</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-white" />
                <span>شروع تمرکز</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl border transition-colors ${
              isMuted
                ? 'border-rose-200 dark:border-rose-900 text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isMuted ? 'صدا قطع است' : 'قطع صدای پس‌زمینه'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Ambient Sound Selector */}
        <div className="w-full pt-8 mt-6 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 block mb-2.5">
            صداهای تمرکز مغزی (تولید زنده بدون نیاز به اینترنت):
          </span>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: 'brown_noise', label: 'نویز قهوه‌ای (خاموشی افکار)', icon: Waves },
              { id: 'rain', label: 'باران آرام', icon: CloudRain },
              { id: 'cafe', label: 'زمزمه کافه', icon: Coffee },
              { id: 'forest', label: 'نسیم جنگل', icon: Trees },
              { id: 'none', label: 'سکوت', icon: VolumeX },
            ].map((snd) => {
              const Icon = snd.icon;
              const isSelected = ambientSound === snd.id;
              return (
                <button
                  key={snd.id}
                  onClick={() => {
                    setAmbientSound(snd.id as AmbientSoundType);
                    if (isRunning && snd.id !== 'none') {
                      soundFx.startAmbient(snd.id as any);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{snd.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
