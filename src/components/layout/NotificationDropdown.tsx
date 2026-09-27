'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertOctagon, AlertTriangle, CheckCircle, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, t } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 rounded-lg hover:bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:text-[var(--foreground)] transition-colors focus:outline-none cursor-pointer"
        title={t('header.notifications', 'Notifications')}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--severity-warning)] ring-2 ring-[var(--background)] animate-pulse"></span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--background)] border border-[var(--outline-variant)] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-[var(--outline-variant)]/50 flex items-center justify-between bg-[var(--surface-container-low)]/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--foreground)] font-sans">
                {t('notif.title', 'Notifications')}
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[var(--primary-container)]/20 text-[var(--primary-container)] text-[10px] font-mono font-bold">
                  {unreadCount} {t('common.all', 'new')}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[10px] font-mono text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3 h-3" />
                <span>{t('notif.mark_all_read', 'Mark all read')}</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-[var(--outline-variant)]/30 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-xs font-mono text-center text-[var(--outline)]">
                {t('notif.empty', 'No new notifications')}
              </p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    setIsOpen(false);
                  }}
                  className={`p-3 block hover:bg-[var(--surface-container-low)]/80 transition-colors ${
                    !n.read ? 'bg-[var(--surface-container)]/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'critical' ? (
                        <AlertOctagon className="w-4 h-4 text-[var(--severity-critical-muted)]" />
                      ) : n.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-[var(--severity-warning)]" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-[var(--severity-healthy)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[var(--foreground)] truncate">{t(n.title, n.title)}</p>
                        <span className="text-[10px] font-mono text-[var(--outline)]">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[var(--outline)] mt-0.5 leading-snug line-clamp-2">
                        {t(n.message, n.message)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-[var(--outline-variant)]/40 bg-[var(--surface-container-low)]/60 text-center">
            <Link
              href="/executive"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-mono text-[var(--primary-container)] hover:underline"
            >
              {t('notif.view_all_telemetry', 'View all pipeline telemetry →')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
