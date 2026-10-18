import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DailyFrog } from './components/DailyFrog';
import { TaskCard } from './components/TaskCard';
import { FocusTimer } from './components/FocusTimer';
import { EisenhowerMatrix } from './components/EisenhowerMatrix';
import { TimeBlockSchedule } from './components/TimeBlockSchedule';
import { RewardLocker } from './components/RewardLocker';
import { StatsView } from './components/StatsView';
import { MoodTracker } from './components/MoodTracker';
import { RescueModal } from './components/RescueModal';
import { TaskDeconstructorModal } from './components/TaskDeconstructorModal';
import { BrainDumpModal } from './components/BrainDumpModal';
import { ZeroGuiltModal } from './components/ZeroGuiltModal';
import { LandingPage } from './components/landing/LandingPage';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { AuthModal } from './components/AuthModal';
import { getTodayJalali, getGreeting, toPersianDigits } from './utils/persianDate';
import {
  CheckCircle2,
  Timer,
  LayoutGrid,
  Clock,
  Gift,
  Plus,
  LifeBuoy,
  HeartHandshake
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const {
    tasks,
    activeTab,
    setActiveTab,
    addTask,
    setIsRescueOpen,
    setIsZeroGuiltOpen,
    currentView,
    isPwaPromptOpen,
    setIsPwaPromptOpen
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('active');
  const [quickInput, setQuickInput] = useState('');

  const today = getTodayJalali();
  const greeting = getGreeting();

  if (currentView === 'landing') {
    return (
      <>
        <LandingPage />
        <RescueModal />
        <TaskDeconstructorModal />
        <BrainDumpModal />
        <ZeroGuiltModal />
        <PwaInstallPrompt forceOpen={isPwaPromptOpen} onClose={() => setIsPwaPromptOpen(false)} />
        <AuthModal />
      </>
    );
  }

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    addTask({
      title: quickInput.trim(),
      dueDate: new Date().toISOString().split('T')[0]
    });
    setQuickInput('');
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'active' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const overdueTasksCount = tasks.filter(
    t => !t.completed && t.dueDate && t.dueDate < new Date().toISOString().split('T')[0]
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5 sm:py-8 space-y-6 pb-24 sm:pb-12">
        {/* Hero Greeting & Persian Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{greeting.icon}</span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {greeting.text}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {greeting.quote}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              📅 {today.fullFormatted}
            </div>

            {overdueTasksCount > 0 && (
              <button
                onClick={() => setIsZeroGuiltOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 transition-colors"
                title="مشاهده سیستم بدون عذاب وجدان"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{toPersianDigits(overdueTasksCount)} کار معوقه (بدون سرزنش)</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden sm:flex items-center gap-1 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
          {[
            { id: 'today', label: 'امروز و قورباغه', icon: CheckCircle2 },
            { id: 'focus', label: 'تایمر پرتاب و تمرکز', icon: Timer },
            { id: 'schedule', label: 'ریتم و زمان‌بندی روز', icon: Clock },
            { id: 'matrix', label: 'ماتریس آیزنهاور', icon: LayoutGrid },
            { id: 'rewards', label: 'جوایز، پیشرفت و آمار', icon: Gift },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Contents */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Emotional Mood Tracker */}
            <MoodTracker />

            {/* Daily Frog Component */}
            <DailyFrog />

            {/* Tasks Header & Filters */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    لیست کارهای امروز
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">
                    ({toPersianDigits(filteredTasks.length)})
                  </span>
                </div>

                {/* Filter badges */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setFilterStatus('active')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === 'active'
                        ? 'bg-brand-500 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    فعال
                  </button>
                  <button
                    onClick={() => setFilterStatus('completed')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === 'completed'
                        ? 'bg-brand-500 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    انجام شده
                  </button>
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === 'all'
                        ? 'bg-brand-500 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    همه
                  </button>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {[
                  { id: 'all', label: 'همه دسته‌ها' },
                  { id: 'work', label: '💼 کاری' },
                  { id: 'study', label: '📚 آموزش' },
                  { id: 'personal', label: '🌱 شخصی' },
                  { id: 'health', label: '🍎 سلامت' },
                  { id: 'chores', label: '🧹 خانه' },
                  { id: 'finance', label: '💳 مالی' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                      filterCategory === cat.id
                        ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Quick Add Input Bar */}
              <form onSubmit={handleQuickAdd} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="کار جدید بنویس... (مثلاً: تماس با استاد یا مطالعه ۵ صفحه)"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!quickInput.trim()}
                  className="absolute left-2 p-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white transition-all shadow-sm"
                  title="ثبت کار"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Tasks List */}
              <div className="space-y-2.5 pt-1">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      هیچ کاری در این نما وجود نداره!
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      می‌تونی یک کار جدید اضافه کنی، یا دکمه «تخلیه ذهن» رو برای سازماندهی افکارت بزنی.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'focus' && <FocusTimer />}

        {activeTab === 'schedule' && <TimeBlockSchedule />}

        {activeTab === 'matrix' && <EisenhowerMatrix />}

        {activeTab === 'rewards' && (
          <div className="space-y-8">
            <RewardLocker />
            <StatsView />
          </div>
        )}
      </main>

      {/* Floating Panic / Rescue Button on mobile */}
      <button
        onClick={() => setIsRescueOpen(true)}
        className="sm:hidden fixed bottom-18 left-4 z-40 p-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/30 flex items-center justify-center active:scale-95 transition-transform"
        title="حالت نجات فوری"
      >
        <LifeBuoy className="w-5 h-5" />
      </button>

      {/* Mobile Bottom Navigation (iPhone touch friendly) */}
      <BottomNav />

      {/* Global Modals */}
      <RescueModal />
      <TaskDeconstructorModal />
      <BrainDumpModal />
      <ZeroGuiltModal />
      <PwaInstallPrompt forceOpen={isPwaPromptOpen} onClose={() => setIsPwaPromptOpen(false)} />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
