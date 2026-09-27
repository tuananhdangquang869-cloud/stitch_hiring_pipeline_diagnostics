'use client';

import React from 'react';
import { Upload, Globe, Sun, Moon, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function Header() {
  const pathname = usePathname();
  const {
    selectedJob,
    timeRange,
    setTimeRange,
    setIsCsvModalOpen,
    language,
    setLanguage,
    theme,
    setTheme,
    t,
  } = useApp();

  const ranges = ['7D', '30D', '90D', 'YTD'];

  const cycleTheme = () => {
    const order: Array<'dark' | 'light' | 'high-contrast'> = ['dark', 'light', 'high-contrast'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const themeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Zap;
  const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'HC';

  const getPageTitle = () => {
    if (pathname === '/executive') {
      return { title: t('header.page_executive', 'Executive Overview'), code: 'C-SUITE' };
    }
    if (pathname === '/candidates') {
      return { title: t('header.page_candidates', 'Candidate Explorer'), code: selectedJob.reqCode };
    }
    if (pathname === '/jobs') {
      return { title: t('header.page_jobs', 'Job Management'), code: `${selectedJob.department}` };
    }
    if (pathname === '/settings') {
      return { title: t('header.page_settings', 'System Settings'), code: 'CONFIG' };
    }
    return { title: selectedJob.title, code: selectedJob.reqCode };
  };

  const { title, code } = getPageTitle();

  const toggleLanguage = () => {
    const nextLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLang);
  };

  return (
    <header className="h-14 bg-[var(--background)] border-b border-[var(--outline-variant)]/40 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left Title / Context */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Logo Brand */}
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2 mr-1 shrink-0">
          <div className="w-7 h-7 rounded bg-[var(--surface-container)] border border-[var(--primary-container)]/40 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
          </div>
        </Link>

        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)] tracking-tight truncate">
            {title}
          </h2>
          {code && (
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-medium rounded bg-[var(--surface-container)] border border-[var(--outline-variant)] text-[var(--primary)] shrink-0">
              {code}
            </span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={cycleTheme}
          title={`Theme: ${themeLabel}`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--surface-container-low)] hover:bg-[var(--surface-container)] border border-[var(--outline-variant)]/70 hover:border-[var(--primary-container)]/60 text-xs font-mono transition-all cursor-pointer shadow-sm"
        >
          {React.createElement(themeIcon, { className: 'w-3.5 h-3.5 text-[var(--primary)]' })}
          <span className="text-[11px] font-bold text-[var(--primary)] uppercase hidden sm:inline">
            {themeLabel}
          </span>
        </button>

        {/* Quick Language Toggle */}
        <button
          type="button"
          onClick={toggleLanguage}
          title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--surface-container-low)] hover:bg-[var(--surface-container)] border border-[var(--outline-variant)]/70 hover:border-[var(--primary-container)]/60 text-xs font-mono transition-all cursor-pointer shadow-sm"
        >
          <span className="text-xs select-none">
            {language === 'vi' ? '🇻🇳' : '🇺🇸'}
          </span>
          <span className="text-[11px] font-bold text-[var(--primary)] uppercase">
            {language}
          </span>
        </button>

        {/* CSV Ingestion Button */}
        <button
          onClick={() => setIsCsvModalOpen(true)}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--primary-container)]/40 text-[var(--primary)] text-xs font-mono transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('header.import_csv', 'Import CSV')}</span>
          <span className="sm:hidden text-[10px]">CSV</span>
        </button>

        {/* System Status (Desktop only) */}
        <div className="hidden xl:flex items-center">
          <StatusBadge
            label={`${t('common.sys', 'SYS:')} ${t('common.optimal', 'OPTIMAL')}`}
            variant="healthy"
            showPulse={true}
            glow={true}
            size="xs"
          />
        </div>

        {/* Time Range Pill Toggle */}
        <div className="hidden md:flex items-center p-0.5 rounded bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs font-mono font-medium transition-all cursor-pointer ${
                timeRange === r
                  ? 'bg-[var(--surface-container-high)] text-[var(--foreground)] font-bold shadow-sm'
                  : 'text-[var(--outline)] hover:text-[var(--foreground)]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* User Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
