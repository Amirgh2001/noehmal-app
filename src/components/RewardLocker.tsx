import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Sparkles, Plus, Check, Lock, Unlock } from 'lucide-react';
import { toPersianDigits } from '../utils/persianDate';

export const RewardLocker: React.FC = () => {
  const { rewards, stats, redeemReward, addReward } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState('100');
  const [newIcon, setNewIcon] = useState('🎁');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addReward({
      title: newTitle.trim(),
      costXP: parseInt(newCost, 10) || 100,
      icon: newIcon,
      description: 'جایزه شخصی تعریف شده توسط خودت'
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-slate-900 text-white p-6 sm:p-7 shadow-xl shadow-purple-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-purple-200">
              <Gift className="w-4 h-4" />
              <span>صندوق جوایز و ترشح دوپامین سالم</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              جایزه بدون عذاب وجدان!
            </h2>
            <p className="text-xs sm:text-sm text-purple-100/90 max-w-md">
              لذت تفریح و استراحت فقط زمانی واقعیه که با تلاش و تمرکز به دست اومده باشه. امتیازاتت رو خرج جوایز دلخواهت کن!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shrink-0">
            <div>
              <span className="text-[10px] text-purple-200 block">امتیاز در دسترس تو:</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300">
                {toPersianDigits(stats.xp)} XP
              </span>
            </div>
            <Sparkles className="w-8 h-8 text-amber-300 animate-bounce-gentle" />
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
          جوایز موجود برای دریافت:
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100"
        >
          <Plus className="w-4 h-4" />
          <span>تعریف جایزه جدید</span>
        </button>
      </div>

      {/* Add Custom Reward Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            چه جایزه‌ای بهت انرژی میده؟
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-slate-500">آیکون جایزه:</span>
            {['🎁', '☕', '🎬', '🎮', '🍕', '🏖️', '📚'].map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setNewIcon(emoji)}
                className={`text-lg p-1 rounded-lg border ${newIcon === emoji ? 'border-purple-500 bg-purple-50' : 'border-transparent'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="عنوان جایزه (مثلاً: نیم ساعت تماشای بازی فوتبال)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="هزینه XP"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                ثبت
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rewards.map((reward) => {
          const canAfford = stats.xp >= reward.costXP;
          return (
            <div
              key={reward.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                reward.unlocked
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {reward.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                    {reward.title}
                  </h4>
                  {reward.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {reward.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  {toPersianDigits(reward.costXP)} XP
                </span>

                {reward.unlocked ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4" />
                    باز شده و استفاده شده
                  </span>
                ) : (
                  <button
                    onClick={() => redeemReward(reward.id)}
                    disabled={!canAfford}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm active:scale-95'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>دریافت جایزه!</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>امتیاز ناکافی</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
