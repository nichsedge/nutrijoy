"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Calendar, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '../AppContext';
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
  const { state } = useApp();
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
          "flex flex-col items-center gap-1.5 transition-all relative group min-w-[64px]",
          isActive ? "text-primary" : "text-muted-foreground hover:text-primary/60"
        )}
      >
        <div className={cn(
          "p-2.5 rounded-2xl transition-all duration-300",
          isActive ? "bg-primary/10 glow-primary scale-110" : "group-hover:bg-primary/5"
        )}>
          <Icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
        </div>
        <span className={cn(
          "text-[8px] font-black uppercase tracking-wider text-center leading-tight transition-all",
          isActive ? "opacity-100 translate-y-0" : "opacity-60 group-hover:opacity-100"
        )}>
          {item.label}
        </span>
        {isActive && (
          <motion.div 
            layoutId="nav-pill"
            className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.6)]"
          />
        )}
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
      <nav className="fixed bottom-6 left-4 right-4 max-w-[calc(448px-2rem)] mx-auto glass-premium px-4 py-3 flex justify-between items-center z-50 rounded-[2.5rem] shadow-2xl border border-white/40 backdrop-blur-3xl">
        <div className="flex flex-1 justify-around items-center">
          {leftItems.map(renderNavItem)}
        </div>
        
        <div className="mx-2 relative">
          <ActionHub />
        </div>

        <div className="flex flex-1 justify-around items-center">
          {rightItems.map(renderNavItem)}
        </div>
      </nav>
    </div>
  );
}
