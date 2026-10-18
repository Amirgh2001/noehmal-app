import { Task, Reward, UserStats, MoodLog, UserProfile } from '../types';

const STORAGE_KEYS = {
  TASKS: 'noehmal_tasks_v1',
  STATS: 'noehmal_stats_v1',
  REWARDS: 'noehmal_rewards_v1',
  MOODS: 'noehmal_moods_v1',
  THEME: 'noehmal_theme_v1',
  LAST_LOGIN: 'noehmal_last_date_v1',
  USER: 'noehmal_user_v1',
  ACCOUNTS_DB: 'noehmal_accounts_db_v1',
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'seed-task-1',
    title: '🐸 قورباغه روز: انتخاب و شروع مهم‌ترین کاری که ازش فرار می‌کردی',
    description: 'قانون طلایی: فقط یک کار بزرگ رو انتخاب کن و بقیه رو موقتاً کنار بذار.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'frog',
    category: 'work',
    timeBlock: 'morning',
    isFrog: true,
    isTopThree: true,
    estimatedMinutes: 25,
    actualMinutes: 0,
    urgency: 'urgent',
    importance: 'important',
    microSteps: [
      { id: 'ms-1', title: 'فقط میز یا محیط کارت رو خلوت کن (۲ دقیقه)', completed: true, durationMinutes: 2 },
      { id: 'ms-2', title: 'تایمر ۵ دقیقه‌ای پرتاب رو روشن کن', completed: false, durationMinutes: 5 },
      { id: 'ms-3', title: 'بدون وسواس، اولین کلمه یا خط اول رو بنویس', completed: false, durationMinutes: 3 }
    ]
  },
  {
    id: 'seed-task-2',
    title: 'تخلیه ذهن و نوشتن تمام دل‌مشغولی‌ها',
    description: 'تمام فکرهایی که تو سرت وول می‌خورن رو بریز بیرون تا آرامش بگیری.',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'high',
    category: 'personal',
    timeBlock: 'morning',
    isFrog: false,
    isTopThree: true,
    estimatedMinutes: 10,
    actualMinutes: 0,
    urgency: 'urgent',
    importance: 'important',
    microSteps: [
      { id: 'ms-4', title: 'زدن دکمه تخلیه ذهن در بالای صفحه', completed: false, durationMinutes: 1 },
      { id: 'ms-5', title: 'تایپ هر چیزی که نگرانت می‌کنه بدون سانسور', completed: false, durationMinutes: 5 }
    ]
  },
  {
    id: 'seed-task-3',
    title: 'نوشیدن یک لیوان آب خنک و ۲ دقیقه تنفس عمیق',
    description: 'اهمال‌کاری ریشه در استرس و خستگی مغز داره. به بدنت توجه کن.',
    completed: true,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    category: 'health',
    timeBlock: 'afternoon',
    isFrog: false,
    isTopThree: true,
    estimatedMinutes: 5,
    actualMinutes: 5,
    urgency: 'not-urgent',
    importance: 'important',
    microSteps: []
  }
];

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew-1',
    title: 'نوشیدن یک فنجان چای یا قهوه با شکلات دلخواه ☕',
    costXP: 50,
    unlocked: true,
    icon: '☕',
    description: 'جایزه برای انجام اولین تمرکز ۵ دقیقه‌ای'
  },
  {
    id: 'rew-2',
    title: 'تماشای یک قسمت سریال یا ویدیوی یوتیوب بدون عذاب وجدان 🎬',
    costXP: 150,
    unlocked: false,
    icon: '🎬',
    description: 'جایزه بعد از بلعیدن قورباغه روز!'
  },
  {
    id: 'rew-3',
    title: 'نیم ساعت بازی ویدیویی یا گردش آزاد در شبکه‌های اجتماعی 🎮',
    costXP: 250,
    unlocked: false,
    icon: '🎮',
    description: 'لذت واقعی زمانیه که کارهای اصلیت انجام شده باشن'
  },
  {
    id: 'rew-4',
    title: 'پیاده‌روی و سفارش خوراکی محبوب 🍕',
    costXP: 400,
    unlocked: false,
    icon: '🍕',
    description: 'جشن اتمام یک روز بدون اهمال‌کاری'
  }
];

export const INITIAL_STATS: UserStats = {
  xp: 75,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedTasksCount: 1,
  frogsCompletedCount: 0,
  focusMinutesTotal: 10,
  fiveMinLaunchesCount: 1
};

export const storage = {
  getTasks: (): Task[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  },
  saveTasks: (tasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  },

  getStats: (): UserStats => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  },
  saveStats: (stats: UserStats) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats', e);
    }
  },

  getRewards: (): Reward[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REWARDS);
      return data ? JSON.parse(data) : INITIAL_REWARDS;
    } catch {
      return INITIAL_REWARDS;
    }
  },
  saveRewards: (rewards: Reward[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    } catch (e) {
      console.error('Failed to save rewards', e);
    }
  },

  getMoods: (): MoodLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOODS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveMoods: (moods: MoodLog[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
    } catch (e) {
      console.error('Failed to save moods', e);
    }
  },

  getTheme: (): 'light' | 'dark' => {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (theme === 'dark' || theme === 'light') return theme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  },
  saveTheme: (theme: 'light' | 'dark') => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {}
  },

  exportBackup: () => {
    const data = {
      tasks: storage.getTasks(),
      stats: storage.getStats(),
      rewards: storage.getRewards(),
      moods: storage.getMoods(),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noehmal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importBackup: (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.tasks) storage.saveTasks(parsed.tasks);
      if (parsed.stats) storage.saveStats(parsed.stats);
      if (parsed.rewards) storage.saveRewards(parsed.rewards);
      if (parsed.moods) storage.saveMoods(parsed.moods);
      return true;
    } catch {
      return false;
    }
  },

  getUser: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveUser: (user: UserProfile | null) => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
  },

  getAccountsDB: (): Record<string, { user: UserProfile; passwordHash?: string; data?: any }> => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS_DB);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  saveAccountsDB: (db: Record<string, { user: UserProfile; passwordHash?: string; data?: any }>) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS_DB, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save accounts db', e);
    }
  }
};
