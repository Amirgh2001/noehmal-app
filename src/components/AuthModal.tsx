import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, loginWithEmail, registerWithEmail } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGooglePickerOpen, setIsGooglePickerOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const res = loginWithEmail(email, password);
      if (!res.success) {
        setError(res.error || 'خطا در ورود به حساب.');
      }
    } else {
      const res = registerWithEmail(name, email, password);
      if (!res.success) {
        setError(res.error || 'خطا در ثبت‌نام.');
      }
    }
  };

  const handleQuickGoogleSelect = (gName: string, gEmail: string, gAvatar?: string) => {
    loginWithGoogle({
      name: gName,
      email: gEmail,
      avatar: gAvatar
    });
    setIsGooglePickerOpen(false);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    const finalEmail = customGoogleEmail.includes('@') ? customGoogleEmail.trim() : `${customGoogleEmail.trim()}@gmail.com`;
    const finalName = customGoogleName.trim() || finalEmail.split('@')[0];

    loginWithGoogle({
      name: finalName,
      email: finalEmail
    });
    setIsGooglePickerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setIsGooglePickerOpen(false);
          }}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Account Picker View */}
        {isGooglePickerOpen ? (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-1">
              {/* Google 4-color G Logo */}
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                ورود با حساب گوگل
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                یک حساب را برای اتصال به «نو اهمال» انتخاب کنید:
              </p>
            </div>

            {/* Quick Suggested Accounts */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickGoogleSelect('امیرحسین قاسمی', 'amirhosseinghasemi@gmail.com', 'https://api.dicebear.com/7.x/bottts/svg?seed=amirhossein')}
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 flex items-center justify-between text-right transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                    ا
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                      امیرحسین قاسمی
                    </span>
                    <span className="block text-[11px] text-slate-500 font-sans">
                      amirhosseinghasemi@gmail.com
                    </span>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </button>
            </div>

            {/* Enter another Google Account Form */}
            <form onSubmit={handleCustomGoogleSubmit} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                یا جیمیل دلخواه خود را وارد کنید:
              </span>
              <input
                type="text"
                placeholder="نام شما (اختیاری)"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="email"
                placeholder="name@gmail.com"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 font-sans"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setIsGooglePickerOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  بازگشت
                </button>
                <button
                  type="submit"
                  disabled={!customGoogleEmail.trim()}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold disabled:opacity-40"
                >
                  تایید و ورود
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Main Login / Register View */
          <div className="space-y-5">
            {/* Logo & Title */}
            <div className="text-center space-y-1">
              <img
                src="/icon.svg"
                alt="نو اهمال"
                className="w-12 h-12 mx-auto rounded-2xl shadow-md shadow-brand-500/25 object-contain"
              />
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {mode === 'login' ? 'ورود به حساب کاربری' : 'ساخت حساب کاربری جدید'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                همگام‌سازی ابری و ذخیره‌سازی همیشگی کارها و امتیازات
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                ورود به حساب
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                ثبت‌نام جدید
              </button>
            </div>

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={() => setIsGooglePickerOpen(true)}
              className="w-full flex items-center justify-center gap-3 p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>ورود سریع با گوگل (Continue with Google)</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-200 dark:border-slate-800" />
              <span className="text-[11px] text-slate-400">یا با ایمیل و رمز</span>
              <div className="flex-1 h-px bg-slate-200 dark:border-slate-800" />
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>نام و نام خانوادگی</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: امیرحسین قاسمی"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 font-sans"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>آدرس ایمیل</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 font-sans text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>رمز عبور (حداقل ۶ کاراکتر)</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 font-sans text-left"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-brand-600 hover:from-emerald-600 hover:to-brand-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all mt-2"
              >
                {mode === 'login' ? 'ورود به حساب نو اهمال' : 'ایجاد حساب کاربری رایگان'}
              </button>
            </form>

            {/* Guest / Close Helper */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                ادامه به عنوان مهمان (بدون ساخت حساب)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
