'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Calendar, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppState } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { ActionHub } from './ActionHub';
import { motion } from 'framer-motion';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const state = useAppState();
  const t = getTranslation(state.profile?.language || 'en');

  const leftItems: NavItem[] = [
    { href: '/', icon: Home, label: t.dashboard },
    { href: '/history', icon: History, label: t.journal },
  ];

  const rightItems: NavItem[] = [
    { href: '/planner', icon: Calendar, label: t.planner },
    { href: '/settings', icon: Settings, label: t.settings },
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex flex-col items-center gap-1 transition-all relative group min-w-[56px] py-0.5',
          isActive ? 'text-primary font-black' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <div
          className={cn(
            'p-2 rounded-2xl transition-all duration-300',
            isActive ? 'bg-primary/15 text-primary scale-105 shadow-2xs' : 'group-hover:bg-accent/40'
          )}
        >
          <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
        </div>
        <span
          className={cn(
            'text-[8px] font-black uppercase tracking-wider text-center leading-tight transition-all',
            isActive ? 'text-primary opacity-100' : 'opacity-60 group-hover:opacity-100'
          )}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      <header className="p-6 pb-2">
        <h1 className="text-2xl font-black text-primary flex items-center gap-2 tracking-tight">
          <span className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center text-lg font-black shadow-sm">
            N
          </span>
          {t.appName}
        </h1>
      </header>
      <main className="flex-1 overflow-y-auto px-5 py-3 pb-36">{children}</main>
      <nav className="fixed bottom-5 left-4 right-4 max-w-[calc(448px-2rem)] mx-auto bg-white/95 backdrop-blur-2xl px-4 py-2 flex justify-between items-center z-50 rounded-[2.5rem] shadow-xl border border-slate-100/90">
        <div className="flex flex-1 justify-around items-center">{leftItems.map(renderNavItem)}</div>

        <div className="mx-2 relative">
          <ActionHub />
        </div>

        <div className="flex flex-1 justify-around items-center">{rightItems.map(renderNavItem)}</div>
      </nav>
    </div>
  );
}
