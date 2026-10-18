import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MoodType } from '../types';
import { Smile, Sparkles } from 'lucide-react';

const MOODS: { type: MoodType; emoji: string; label: string; tip: string; color: string }[] = [
  {
    type: 'anxious',
    emoji: '😰',
    label: 'مضطرب و نگران',
    tip: 'اضطراب یعنی به کل کوه نگاه می‌کنی. فقط سنگ‌ریزه جلوی پات رو ببین؛ یک قدم ۲ دقیقه‌ای بردار.',
    color: 'hover:border-rose-400 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300'
  },
  {
    type: 'overwhelmed',
    emoji: '🤯',
    label: 'گیج و سردرگم',
    tip: 'مغزت اشباع شده! دکمه «تخلیه ذهن» رو بزن و همه چیز رو از سرت خارج کن روی کاغذ.',
    color: 'hover:border-purple-400 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300'
  },
  {
    type: 'tired',
    emoji: '🥱',
    label: 'خسته و بی‌انرژی',
    tip: 'شاید فقط به آب، کمی هوای تازه یا یک پیاده‌روی ۵ دقیقه‌ای نیاز داری. استراحت تنبلی نیست.',
    color: 'hover:border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300'
  },
  {
    type: 'neutral',
    emoji: '😐',
    label: 'عادی و خنثی',
    tip: 'منتظر حس و حال خاصی نباش؛ انگیزه بعد از شروع کردن میاد، نه قبل از اون!',
    color: 'hover:border-slate-400 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
  },
  {
    type: 'motivated',
    emoji: '⚡',
    label: 'پرانرژی و مشتاق',
    tip: 'فوق‌العاده‌ست! سریع قورباغه روزت رو ببلع قبل از اینکه این موج انرژی فروکش کنه.',
    color: 'hover:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
  },
  {
    type: 'confident',
    emoji: '💪',
    label: 'مصمم و مسلط',
    tip: 'امروز قراره یکی از پربارترین روزهات باشه. با تایمر پومودورو ۲۵ دقیقه‌ای ادامه بده.',
    color: 'hover:border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300'
  }
];

export const MoodTracker: React.FC = () => {
  const { moods, logMood } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    moods.length > 0 ? moods[0].mood : null
  );

  const activeMoodInfo = MOODS.find(m => m.type === selectedMood);

  const handleSelect = (m: MoodType) => {
    setSelectedMood(m);
    logMood(m);
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-brand-500" />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
            حال‌سنج و روانشناسی احساسی
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">ریشه‌یابی اهمال‌کاری</span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        تحقیقات دانشگاه هاروارد ثابت کرده تعویق انداختن کارها مشکل کمبود وقت نیست، بلکه نتیجه احساساتی مثل استرس، ترس از کامل نبودن یا خستگیه. همین الان چه حسی داری؟
      </p>

      {/* Mood Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {MOODS.map((item) => {
          const isSelected = selectedMood === item.type;
          return (
            <button
              key={item.type}
              onClick={() => handleSelect(item.type)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 ring-2 ring-brand-500/20 scale-105 font-bold'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-[11px] text-slate-700 dark:text-slate-200">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Psychological Advice Card */}
      {activeMoodInfo && (
        <div className={`p-4 rounded-2xl border transition-all ${activeMoodInfo.color}`}>
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold block mb-0.5">
                توصیه مربی برای حال فعلی تو:
              </span>
              <p className="text-xs leading-relaxed">
                {activeMoodInfo.tip}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
