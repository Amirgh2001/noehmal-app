import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, UserStats, Reward, MoodLog, MoodType, UserProfile } from '../types';
import { storage } from '../utils/storage';
import { soundFx } from '../utils/audioSynthesizer';
import { fireSuccessConfetti, fireFrogConfetti } from '../utils/confetti';

interface AppContextType {
  tasks: Task[];
  stats: UserStats;
  rewards: Reward[];
  moods: MoodLog[];
  theme: 'light' | 'dark';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentView: 'landing' | 'app';
  setCurrentView: (view: 'landing' | 'app') => void;
  toggleTheme: () => void;

  // User & Authentication
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: (googleData: { name: string; email: string; avatar?: string }) => void;
  loginWithEmail: (email: string, password: string) => { success: boolean; error?: string };
  registerWithEmail: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  
  // Task management
  addTask: (taskData: Partial<Task>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setFrog: (id: string) => void;
  toggleTopThree: (id: string) => void;
  
  // Micro steps
  addMicroStep: (taskId: string, title: string, duration?: number) => void;
  toggleMicroStep: (taskId: string, stepId: string) => void;
  deleteMicroStep: (taskId: string, stepId: string) => void;
  
  // Active focus
  activeTimerTask: Task | null;
  setActiveTimerTask: (task: Task | null) => void;
  addFocusMinutes: (minutes: number, isFiveMinLaunch?: boolean) => void;
  
  // Modals & Panels
  isRescueOpen: boolean;
  setIsRescueOpen: (open: boolean) => void;
  isDeconstructorOpen: boolean;
  setIsDeconstructorOpen: (open: boolean) => void;
  deconstructingTask: Task | null;
  setDeconstructingTask: (task: Task | null) => void;
  isBrainDumpOpen: boolean;
  setIsBrainDumpOpen: (open: boolean) => void;
  isZeroGuiltOpen: boolean;
  setIsZeroGuiltOpen: (open: boolean) => void;
  isPwaPromptOpen: boolean;
  setIsPwaPromptOpen: (open: boolean) => void;
  
  // Rewards & Mood
  redeemReward: (rewardId: string) => boolean;
  addReward: (reward: Omit<Reward, 'id' | 'unlocked'>) => void;
  logMood: (mood: MoodType, note?: string) => void;
  rolloverUnfinishedTasks: (action: 'today' | 'someday' | 'archive') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [stats, setStats] = useState<UserStats>(() => storage.getStats());
  const [rewards, setRewards] = useState<Reward[]>(() => storage.getRewards());
  const [moods, setMoods] = useState<MoodLog[]>(() => storage.getMoods());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => storage.getTheme());
  const [activeTab, setActiveTab] = useState<string>('today');
  const [currentView, setCurrentViewState] = useState<'landing' | 'app'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#app') {
      return 'app';
    }
    return 'landing';
  });

  const setCurrentView = (view: 'landing' | 'app') => {
    setCurrentViewState(view);
    if (typeof window !== 'undefined') {
      window.location.hash = view === 'app' ? '#app' : '';
    }
  };

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#app') {
        setCurrentViewState('app');
      } else if (window.location.hash === '' || window.location.hash === '#landing') {
        setCurrentViewState('landing');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Modals state
  const [isRescueOpen, setIsRescueOpen] = useState(false);
  const [isDeconstructorOpen, setIsDeconstructorOpen] = useState(false);
  const [deconstructingTask, setDeconstructingTask] = useState<Task | null>(null);
  const [isBrainDumpOpen, setIsBrainDumpOpen] = useState(false);
  const [isZeroGuiltOpen, setIsZeroGuiltOpen] = useState(false);
  const [isPwaPromptOpen, setIsPwaPromptOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(() => storage.getUser());
  const [activeTimerTask, setActiveTimerTask] = useState<Task | null>(null);

  // Sync theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.saveTheme(theme);
  }, [theme]);

  // Save changes to storage
  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.saveStats(stats);
  }, [stats]);

  useEffect(() => {
    storage.saveRewards(rewards);
  }, [rewards]);

  useEffect(() => {
    storage.saveMoods(moods);
  }, [moods]);

  // Check for unfinished tasks on startup to offer zero-guilt rollover
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const unfinishedPast = tasks.some(
      t => !t.completed && t.dueDate && t.dueDate < todayStr
    );
    if (unfinishedPast) {
      // Auto suggest zero guilt reset without nagging
      setTimeout(() => setIsZeroGuiltOpen(true), 1200);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addXP = (amount: number) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 150) + 1;
      return {
        ...prev,
        xp: newXP,
        level: newLevel
      };
    });
  };

  const addTask = (taskData: Partial<Task>): Task => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: taskData.title || 'کار جدید',
      description: taskData.description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      priority: taskData.priority || 'medium',
      category: taskData.category || 'work',
      timeBlock: taskData.timeBlock || 'morning',
      isFrog: taskData.isFrog || false,
      isTopThree: taskData.isTopThree || false,
      estimatedMinutes: taskData.estimatedMinutes || 25,
      actualMinutes: 0,
      urgency: taskData.urgency || 'urgent',
      importance: taskData.importance || 'important',
      microSteps: taskData.microSteps || [],
      notes: taskData.notes || '',
    };

    // If this is set as Frog, ensure other tasks unset frog
    setTasks(prev => {
      if (newTask.isFrog) {
        return [newTask, ...prev.map(t => ({ ...t, isFrog: false }))];
      }
      return [newTask, ...prev];
    });

    addXP(10); // Reward for taking initiative to write down a task!
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) {
          if (updates.isFrog) {
            return { ...t, isFrog: false };
          }
          return t;
        }
        return { ...t, ...updates };
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (activeTimerTask?.id === id) {
      setActiveTimerTask(null);
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task;
        const willBeCompleted = !task.completed;

        if (willBeCompleted) {
          soundFx.playSuccessChime();

          if (task.isFrog) {
            fireFrogConfetti();
            addXP(100);
            setStats(s => ({ ...s, frogsCompletedCount: s.frogsCompletedCount + 1, completedTasksCount: s.completedTasksCount + 1 }));
          } else {
            fireSuccessConfetti();
            addXP(35);
            setStats(s => ({ ...s, completedTasksCount: s.completedTasksCount + 1 }));
          }

          // Complete all micro-steps as well
          const updatedSteps = task.microSteps.map(ms => ({ ...ms, completed: true }));

          return {
            ...task,
            completed: true,
            completedAt: new Date().toISOString(),
            microSteps: updatedSteps
          };
        } else {
          return {
            ...task,
            completed: false,
            completedAt: undefined
          };
        }
      })
    );
  };

  const setFrog = (id: string) => {
    setTasks(prev =>
      prev.map(t => ({
        ...t,
        isFrog: t.id === id ? !t.isFrog : false,
        isTopThree: t.id === id ? true : t.isTopThree
      }))
    );
  };

  const toggleTopThree = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          return { ...t, isTopThree: !t.isTopThree };
        }
        return t;
      })
    );
  };

  const addMicroStep = (taskId: string, title: string, duration = 2) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const newStep = {
          id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title,
          completed: false,
          durationMinutes: duration
        };
        return {
          ...t,
          microSteps: [...t.microSteps, newStep]
        };
      })
    );
    addXP(5);
  };

  const toggleMicroStep = (taskId: string, stepId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const updated = t.microSteps.map(step => {
          if (step.id !== stepId) return step;
          const nextState = !step.completed;
          if (nextState) {
            soundFx.playSuccessChime();
            addXP(15);
          }
          return { ...step, completed: nextState };
        });

        // If all microsteps done, auto suggest completing main task
        const allDone = updated.length > 0 && updated.every(s => s.completed);

        return {
          ...t,
          microSteps: updated,
          completed: allDone ? true : t.completed,
          completedAt: allDone && !t.completed ? new Date().toISOString() : t.completedAt
        };
      })
    );
  };

  const deleteMicroStep = (taskId: string, stepId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          microSteps: t.microSteps.filter(s => s.id !== stepId)
        };
      })
    );
  };

  const addFocusMinutes = (minutes: number, isFiveMinLaunch = false) => {
    setStats(prev => ({
      ...prev,
      focusMinutesTotal: prev.focusMinutesTotal + minutes,
      fiveMinLaunchesCount: isFiveMinLaunch ? prev.fiveMinLaunchesCount + 1 : prev.fiveMinLaunchesCount,
      xp: prev.xp + minutes * 2
    }));

    if (activeTimerTask) {
      setTasks(prev =>
        prev.map(t =>
          t.id === activeTimerTask.id
            ? { ...t, actualMinutes: (t.actualMinutes || 0) + minutes }
            : t
        )
      );
    }
  };

  const redeemReward = (rewardId: string): boolean => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || stats.xp < reward.costXP) return false;

    setStats(prev => ({ ...prev, xp: prev.xp - reward.costXP }));
    setRewards(prev =>
      prev.map(r =>
        r.id === rewardId
          ? { ...r, unlocked: true, redeemedAt: new Date().toISOString() }
          : r
      )
    );
    fireSuccessConfetti();
    soundFx.playSuccessChime();
    return true;
  };

  const addReward = (rewardData: Omit<Reward, 'id' | 'unlocked'>) => {
    const newRew: Reward = {
      ...rewardData,
      id: `rew-${Date.now()}`,
      unlocked: false
    };
    setRewards(prev => [...prev, newRew]);
  };

  const logMood = (mood: MoodType, note?: string) => {
    const entry: MoodLog = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mood,
      note
    };
    setMoods(prev => [entry, ...prev.slice(0, 30)]);
    addXP(10);
  };

  const rolloverUnfinishedTasks = (action: 'today' | 'someday' | 'archive') => {
    const todayStr = new Date().toISOString().split('T')[0];
    setTasks(prev =>
      prev.map(task => {
        if (task.completed || !task.dueDate || task.dueDate >= todayStr) return task;
        if (action === 'today') {
          return { ...task, dueDate: todayStr };
        } else if (action === 'someday') {
          return { ...task, dueDate: undefined, isFrog: false, isTopThree: false };
        } else {
          return { ...task, completed: true, notes: (task.notes ? task.notes + ' ' : '') + '(آرشیو بدون سرزنش)' };
        }
      })
    );
    soundFx.playSuccessChime();
  };

  const loginWithGoogle = (googleData: { name: string; email: string; avatar?: string }) => {
    const db = storage.getAccountsDB();
    const emailKey = googleData.email.trim().toLowerCase();
    const existing = db[emailKey];

    const profile: UserProfile = existing
      ? existing.user
      : {
          id: `user-g-${Date.now()}`,
          name: googleData.name || 'کاربر گوگل',
          email: emailKey,
          avatar: googleData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${emailKey}`,
          authProvider: 'google',
          createdAt: new Date().toISOString()
        };

    db[emailKey] = {
      user: profile
    };
    storage.saveAccountsDB(db);
    storage.saveUser(profile);
    setUser(profile);
    setIsAuthModalOpen(false);
    soundFx.playSuccessChime();
    fireSuccessConfetti();
  };

  const loginWithEmail = (email: string, password: string): { success: boolean; error?: string } => {
    const emailKey = email.trim().toLowerCase();
    const db = storage.getAccountsDB();
    const account = db[emailKey];

    if (!account) {
      return { success: false, error: 'حسابی با این آدرس ایمیل یافت نشد. لطفاً ابتدا ثبت‌نام کنید.' };
    }

    if (account.passwordHash && account.passwordHash !== password) {
      return { success: false, error: 'رمز عبور وارد شده نادرست است.' };
    }

    storage.saveUser(account.user);
    setUser(account.user);
    setIsAuthModalOpen(false);
    soundFx.playSuccessChime();
    fireSuccessConfetti();
    return { success: true };
  };

  const registerWithEmail = (name: string, email: string, password: string): { success: boolean; error?: string } => {
    const emailKey = email.trim().toLowerCase();
    if (!name.trim()) return { success: false, error: 'لطفاً نام و نام خانوادگی خود را وارد کنید.' };
    if (!emailKey.includes('@') || !emailKey.includes('.')) return { success: false, error: 'آدرس ایمیل نامعتبر است.' };
    if (password.length < 6) return { success: false, error: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' };

    const db = storage.getAccountsDB();
    if (db[emailKey]) {
      return { success: false, error: 'حسابی با این ایمیل از قبل وجود دارد. لطفاً وارد شوید.' };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: emailKey,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${emailKey}`,
      authProvider: 'email',
      createdAt: new Date().toISOString()
    };

    db[emailKey] = {
      user: newUser,
      passwordHash: password
    };
    storage.saveAccountsDB(db);
    storage.saveUser(newUser);
    setUser(newUser);
    setIsAuthModalOpen(false);
    soundFx.playSuccessChime();
    fireSuccessConfetti();
    return { success: true };
  };

  const logout = () => {
    storage.saveUser(null);
    setUser(null);
    soundFx.playSuccessChime();
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        stats,
        rewards,
        moods,
        theme,
        activeTab,
        setActiveTab,
        currentView,
        setCurrentView,
        toggleTheme,
        user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        setFrog,
        toggleTopThree,
        addMicroStep,
        toggleMicroStep,
        deleteMicroStep,
        activeTimerTask,
        setActiveTimerTask,
        addFocusMinutes,
        isRescueOpen,
        setIsRescueOpen,
        isDeconstructorOpen,
        setIsDeconstructorOpen,
        deconstructingTask,
        setDeconstructingTask,
        isBrainDumpOpen,
        setIsBrainDumpOpen,
        isZeroGuiltOpen,
        setIsZeroGuiltOpen,
        isPwaPromptOpen,
        setIsPwaPromptOpen,
        redeemReward,
        addReward,
        logMood,
        rolloverUnfinishedTasks
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
