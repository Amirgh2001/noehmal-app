import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Timer, LayoutGrid, Clock, Gift } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'today', label: 'امروز', icon: CheckCircle2 },
    { id: 'focus', label: 'تایمر پرتاب', icon: Timer },
    { id: 'schedule', label: 'برنامه زمانی', icon: Clock },
    { id: 'matrix', label: 'ماتریس', icon: LayoutGrid },
    { id: 'rewards', label: 'جوایز و آمار', icon: Gift },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom,8px)] pt-1 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-5 h-1 bg-brand-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
