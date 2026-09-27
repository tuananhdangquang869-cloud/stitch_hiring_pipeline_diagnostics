'use client';

import React from 'react';

export type StatusBadgeVariant =
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'info'
  | 'active'
  | 'blocked';

interface StatusBadgeProps {
  label: string;
  variant?: StatusBadgeVariant;
  showPulse?: boolean;
  glow?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function StatusBadge({
  label,
  variant = 'healthy',
  showPulse = false,
  glow = false,
  size = 'xs',
  className = '',
}: StatusBadgeProps) {
  // Color configuration based on semantic design tokens
  const variantStyles: Record<
    StatusBadgeVariant,
    { badge: string; dot: string; glowClass: string }
  > = {
    healthy: {
      badge: 'bg-[var(--severity-healthy-container)] text-[var(--severity-healthy)] border-[var(--severity-healthy)]/40',
      dot: 'bg-[var(--severity-healthy)] text-[var(--severity-healthy)]',
      glowClass: 'glow-healthy',
    },
    warning: {
      badge: 'bg-[var(--severity-warning-container)] text-[var(--severity-warning)] border-[var(--severity-warning)]/40',
      dot: 'bg-[var(--severity-warning)] text-[var(--severity-warning)]',
      glowClass: 'glow-warning',
    },
    critical: {
      badge: 'bg-[var(--severity-critical-container)] text-[var(--severity-critical-muted)] border-[var(--severity-critical-muted)]/40',
      dot: 'bg-[var(--severity-critical-muted)] text-[var(--severity-critical-muted)]',
      glowClass: 'glow-critical',
    },
    info: {
      badge: 'bg-[var(--severity-info-container)] text-[var(--severity-info)] border-[var(--primary-container)]/40',
      dot: 'bg-[var(--primary-container)] text-[var(--primary-container)]',
      glowClass: 'glow-primary',
    },
    active: {
      badge: 'bg-[var(--surface-container-high)] text-[var(--primary)] border-[var(--primary-container)]/50',
      dot: 'bg-[var(--severity-healthy)] text-[var(--severity-healthy)]',
      glowClass: 'glow-healthy',
    },
    blocked: {
      badge: 'bg-[var(--surface-container)] text-[var(--outline)] border-[var(--outline-variant)]',
      dot: 'bg-[var(--outline)] text-[var(--outline)]',
      glowClass: '',
    },
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const dotSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  };

  const current = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-bold border transition-all select-none ${
        sizeStyles[size]
      } ${current.badge} ${glow ? current.glowClass : ''} ${className}`}
    >
      {showPulse && (
        <span className="relative flex shrink-0 items-center justify-center">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${current.dot}`}
          />
          <span
            className={`relative inline-flex rounded-full ${dotSizes[size]} ${current.dot}`}
          />
        </span>
      )}
      <span>{label}</span>
    </span>
  );
}
