'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Filter, Users, Briefcase } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useApp();

  const navItems = [
    {
      name: t('nav.overview_short', 'Overview'),
      href: '/executive',
      icon: LayoutDashboard,
      active: pathname === '/executive',
    },
    {
      name: t('nav.funnel_short', 'Funnel'),
      href: '/dashboard',
      icon: Filter,
      active: pathname === '/dashboard' || pathname === '/',
    },
    {
      name: t('nav.candidates_short', 'Candidates'),
      href: '/candidates',
      icon: Users,
      active: pathname === '/candidates',
    },
    {
      name: t('nav.jobs_short', 'Jobs'),
      href: '/jobs',
      icon: Briefcase,
      active: pathname === '/jobs',
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--background)]/95 backdrop-blur-md border-t border-[var(--outline-variant)]/60 px-2 flex items-center justify-around z-50 pointer-events-auto select-none shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer touch-manipulation ${
              item.active
                ? 'text-[var(--primary-container)] font-bold'
                : 'text-[var(--outline)] hover:text-[var(--foreground)] active:text-[var(--primary-container)]'
            }`}
          >
            <div
              className={`p-1 rounded-md transition-colors ${
                item.active ? 'bg-[var(--primary-container)]/15 border border-[var(--primary-container)]/40' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-tight mt-0.5">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
