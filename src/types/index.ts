export type TaskPriority = 'frog' | 'high' | 'medium' | 'low';

export type TaskCategory = 'work' | 'study' | 'personal' | 'health' | 'chores' | 'finance';

export type TimeBlock = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface MicroStep {
  id: string;
  title: string;
  completed: boolean;
  durationMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  dueDate?: string; // YYYY-MM-DD
  priority: TaskPriority;
  category: TaskCategory;
  timeBlock: TimeBlock;
  isFrog: boolean; // قورباغه روز - بزرگترین و مهم‌ترین کار
  isTopThree: boolean; // جزو ۳ کار کلیدی روز
  estimatedMinutes: number;
  actualMinutes: number;
  microSteps: MicroStep[];
  urgency: 'urgent' | 'not-urgent';
  importance: 'important' | 'not-important';
  notes?: string;
}

export type MoodType = 'anxious' | 'overwhelmed' | 'tired' | 'neutral' | 'motivated' | 'confident';

export interface MoodLog {
  id: string;
  timestamp: string;
  mood: MoodType;
  note?: string;
}

export interface Reward {
  id: string;
  title: string;
  costXP: number;
  unlocked: boolean;
  redeemedAt?: string;
  icon: string;
  description?: string;
}

export type FocusMode = 'five_min_launch' | 'pomodoro' | 'short_break' | 'long_break' | 'flow';

export type AmbientSoundType = 'none' | 'brown_noise' | 'rain' | 'cafe' | 'forest';

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedTasksCount: number;
  frogsCompletedCount: number;
  focusMinutesTotal: number;
  fiveMinLaunchesCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider: 'google' | 'email' | 'guest';
  createdAt: string;
}
