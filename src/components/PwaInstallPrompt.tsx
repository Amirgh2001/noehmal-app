import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Share,
  PlusSquare,
  X,
  Sparkles,
  Download,
  CheckCircle2,
  Laptop
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PwaInstallPromptProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ forceOpen = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [activeTab, setActiveTab] = useState<'ios' | 'other'>('ios');

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isStandaloneMode);

    // Detect device platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);

    if (isIOSDevice) {
      setActiveTab('ios');
    } else {
      setActiveTab('other');
    }

    // Capture beforeinstallprompt for Android/Chrome/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if previously dismissed (show after 1.5s if not dismissed and not in standalone)
    if (!isStandaloneMode) {
      const dismissed = localStorage.getItem('noehmal_pwa_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Update open state if forceOpen changes
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('noehmal_pwa_dismissed', 'true');
    if (onClose) onClose();
  };

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsOpen(false);
    }
    setDeferredPrompt(null);
  };

  if (!isOpen && !forceOpen) return null;
  if (isStandalone && !forceOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-200 dark:border-brand-900/40 text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/icon.svg"
            alt="نو اهمال"
            className="w-12 h-12 rounded-2xl shadow-lg shadow-brand-500/25 object-contain shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-[10px] font-bold mb-0.5">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>تجربه اختصاصی وب‌اپلیکیشن (PWA)</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              نصب مستقیم «نو اهمال» روی دستگاه تو
            </h3>
          </div>
        </div>

        {/* Why PWA Benefits */}
        <div className="p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/50 text-xs text-brand-900 dark:text-brand-200 space-y-1 mb-5">
          <p className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-500" />
            چرا بهتر است از نسخه PWA استفاده کنی؟
          </p>
          <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 pr-5 list-disc">
            <li>اجرای تمام‌صفحه بدون کادر و نوار آدرس مرورگر (دقیقاً مثل یک اپلیکیشن بومی)</li>
            <li>دسترسی سریع با ۱ لمس از صفحه اصلی گوشی یا دسکتاپ</li>
            <li>بارگذاری سریع و دسترسی به تایمر و اصوات آرامش‌بخش حتی بدون اینترنت</li>
          </ul>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'ios'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>راهنمای آیفون (iOS)</span>
          </button>
          <button
            onClick={() => setActiveTab('other')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'other'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Laptop className="w-4 h-4 text-sky-500" />
            <span>اندروید و لپ‌تاپ</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        {activeTab === 'ios' ? (
          <div className="space-y-3.5">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                ۱
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  در مرورگر Safari دکمه اشتراک‌گذاری (Share) را بزنید
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  آیکون مربع با فلش رو به بالا{' '}
                  <Share className="w-3.5 h-3.5 inline text-sky-500" /> در پایین صفحه
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                ۲
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  گزینه «Add to Home Screen» را لمس کنید
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  با آیکون مربع و علامت مثبت{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline text-emerald-500" /> (افزودن به صفحه اصلی)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                ۳
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  دکمه «Add» (افزودن) در گوشه بالای صفحه را بزنید
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  کار تمام است! آیکون نو اهمال روی صفحه اصلی آیفون شما ظاهر می‌شود.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {deferredPrompt && (
              <button
                onClick={handleNativeInstall}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 text-white font-black text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>نصب ۱ کلیکی روی این مرورگر</span>
              </button>
            )}

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                ۱
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  در منوی مرورگر (کروم یا اج)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  آیکون ۳ نقطه در گوشه بالا یا آیکون نصب در نوار آدرس را بزنید.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                ۲
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  گزینه «Install App» یا «نصب برنامه» را انتخاب کنید
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  برنامه مثل یک نرم‌افزار سبک دسکتاپ یا اپ اندروید در لیست اپلیکیشن‌های شما قرار می‌گیرد.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action */}
        <div className="pt-5 mt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDismiss}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
          >
            متوجه شدم؛ بعداً نصب می‌کنم
          </button>
          <button
            onClick={handleDismiss}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            ورود به برنامه
          </button>
        </div>
      </div>
    </div>
  );
};
