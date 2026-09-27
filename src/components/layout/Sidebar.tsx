'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Filter, Users, Briefcase, Settings } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Sidebar() {
  const pathname = usePathname();
  const { selectedJob, profile, t } = useApp();

  const navItems = [
    {
      name: t('nav.executive', 'Executive Overview'),
      href: '/executive',
      icon: LayoutDashboard,
      active: pathname === '/executive',
    },
    {
      name: t('nav.funnel', 'Funnel Analytics'),
      href: '/dashboard',
      icon: Filter,
      active: pathname === '/dashboard' || pathname === '/',
    },
    {
      name: t('nav.candidates', 'Candidate Explorer'),
      href: '/candidates',
      icon: Users,
      active: pathname === '/candidates',
    },
    {
      name: t('nav.jobs', 'Job Management'),
      href: '/jobs',
      icon: Briefcase,
      active: pathname === '/jobs',
    },
  ];

  return (
    <aside className="hidden lg:flex w-60 xl:w-64 bg-[var(--background)] border-r border-[var(--outline-variant)]/40 flex-col justify-between h-screen shrink-0 select-none z-30">
      <div>
        {/* Brand Header */}
        <Link
          href="/dashboard"
          className="p-4 xl:p-5 flex items-center gap-3 border-b border-[var(--outline-variant)]/20 hover:bg-[var(--surface-container-low)]/40 transition-colors"
        >
          <div className="w-8 h-8 xl:w-9 xl:h-9 rounded bg-[var(--surface-container)] border border-[var(--primary-container)]/40 flex items-center justify-center shadow-lg shadow-[var(--primary-container)]/10 overflow-hidden shrink-0">
            <img src="/logo.png" alt="Áp Lực Kế Logo" className="w-6 h-6 xl:w-7 xl:h-7 object-contain" />
          </div>
          <div>
            <h1 className="text-sm xl:text-base font-bold tracking-tight text-[var(--foreground)] flex items-center gap-1.5 font-sans">
              {t('brand.name', 'Áp Lực Kế')}
            </h1>
            <p className="text-[10px] xl:text-[11px] text-[var(--outline)] uppercase tracking-wider font-mono">
              {t('brand.subtitle', 'Recruitment Analytics')}
            </p>
          </div>
        </Link>

        {/* Persistent Selected Job Indicator */}
        <div className="mx-3 mt-3 p-2.5 rounded-[var(--radius-md)] glass-panel">
          <span className="text-[9px] xl:text-[10px] font-mono text-[var(--outline)] block uppercase">
            {t('nav.active_req', 'ACTIVE REQUISITION:')}
          </span>
          <p className="text-xs font-bold text-[var(--primary)] truncate font-sans mt-0.5">
            {selectedJob.title}
          </p>
          <span className="text-[10px] font-mono text-[var(--tertiary)]">
            {selectedJob.reqCode} • {selectedJob.department}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 xl:py-2.5 rounded text-xs font-medium transition-all ${
                  item.active
                    ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-semibold shadow-md shadow-[var(--primary-container)]/20'
                    : 'text-[var(--on-surface-variant)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container)]/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? 'text-[var(--on-primary)]' : 'text-[var(--outline)]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-[var(--outline-variant)]/30 space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
            pathname === '/settings'
              ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-semibold'
              : 'text-[var(--outline)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container)]/50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t('nav.settings', 'Settings')}</span>
        </Link>
        <Link
          href="/settings"
          className="pt-2 px-3 flex items-center gap-2.5 hover:bg-[var(--surface-container)]/40 rounded transition-colors group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--surface-container)] border border-[var(--outline-variant)] group-hover:border-[var(--primary-container)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--primary)]">
            {profile.avatarInitials || 'SA'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-[var(--foreground)] truncate group-hover:text-[var(--primary-container)] transition-colors">
              {profile.name}
            </p>
            <p className="text-[10px] text-[var(--outline)] font-mono truncate">{profile.role}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
