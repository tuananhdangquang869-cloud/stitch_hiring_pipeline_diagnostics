'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LayoutDashboard, Upload, Shield } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsCsvModalOpen, profile, t } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg hover:bg-[var(--surface-container)] transition-colors cursor-pointer focus:outline-none"
        title={t('header.profile', 'Admin Profile')}
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--surface-container)] border border-[var(--outline-variant)] flex items-center justify-center text-[11px] font-mono font-bold text-[var(--primary)]">
          {profile.avatarInitials || 'SA'}
        </div>
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--background)] border border-[var(--outline-variant)] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Info Header */}
          <div className="p-4 border-b border-[var(--outline-variant)]/50 bg-[var(--surface-container-low)]/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-container)] border border-[var(--primary)]/50 flex items-center justify-center text-sm font-mono font-bold text-[var(--primary)]">
                {profile.avatarInitials || 'SA'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--foreground)] truncate font-sans">
                  {profile.name}
                </p>
                <p className="text-[10px] text-[var(--outline)] font-mono truncate">
                  {profile.email}
                </p>
                <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-[var(--surface-container-high)] text-[var(--primary)] text-[9px] font-mono font-bold">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Menu Items */}
          <div className="p-2 space-y-0.5">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[var(--foreground)] hover:bg-[var(--surface-container-low)] transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[var(--outline)]" />
              <span>{t('profile.menu_settings', 'Settings & Thresholds')}</span>
            </Link>

            <Link
              href="/executive"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[var(--foreground)] hover:bg-[var(--surface-container-low)] transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[var(--outline)]" />
              <span>{t('profile.menu_telemetry', 'Executive Telemetry')}</span>
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                setIsCsvModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 text-xs font-mono text-[var(--foreground)] hover:bg-[var(--surface-container-low)] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[var(--outline)]" />
              <span>{t('profile.menu_import_csv', 'Import Candidate CSV')}</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-[var(--outline-variant)]/40 bg-[var(--surface-container-low)]/40 flex items-center justify-between text-[10px] font-mono text-[var(--outline)] px-3 py-2">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-[var(--severity-healthy)]" />
              {t('profile.storage_badge', 'Saved in LocalStorage')}
            </span>
            <span className="text-[var(--primary)]">v1.0.0</span>
          </div>
        </div>
      )}
    </div>
  );
}
