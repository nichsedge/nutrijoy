"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Calendar, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { ActionHub } from './ActionHub';

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useApp();
  const t = getTranslation(state.profile?.language || 'en');

  const leftItems = [
    { href: '/', icon: Home, label: t.dashboard },
    { href: '/history', icon: History, label: t.journal },
  ];

  const rightItems = [
    { href: '/planner', icon: Calendar, label: t.planner },
    { href: '/settings', icon: Settings, label: t.settings },
  ];

  const renderNavItem = (item: any) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        <div className={cn(
          "p-2 rounded-xl transition-all",
          isActive ? "bg-primary/10" : ""
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background pb-20">
      <header className="p-6 pb-2">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center text-xl font-headline">N</span>
          {t.appName}
        </h1>
      </header>
      <main className="flex-1 overflow-y-auto px-6 py-4">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-white/50 px-6 py-3 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex flex-1 justify-around items-center">
          {leftItems.map(renderNavItem)}
        </div>
        
        <ActionHub />

        <div className="flex flex-1 justify-around items-center">
          {rightItems.map(renderNavItem)}
        </div>
      </nav>
    </div>
  );
}
