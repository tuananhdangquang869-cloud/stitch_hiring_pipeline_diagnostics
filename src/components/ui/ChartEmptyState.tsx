'use client';

import React from 'react';
import {
  AlertCircle,
  FilterX,
  Database,
  BarChart2,
  RefreshCw,
  Search,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export interface ChartEmptyStateProps {
  title?: string;
  description?: string;
  diagnosticTip?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  iconType?: 'filter' | 'data' | 'search' | 'chart';
  minHeight?: number | string;
  className?: string;
}

export function ChartEmptyState({
  title = 'No Pipeline Data Captured',
  description = 'There are currently no candidate entries or stage progressions matching the active filters.',
  diagnosticTip = 'Diagnostic Tip: Try broadening your date range scrubber, clearing stage filters, or switching to All-Time view.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  iconType = 'chart',
  minHeight = 300,
  className = '',
}: ChartEmptyStateProps) {
  const renderGraphic = () => {
    return (
      <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
        {/* Ambient Pulsing Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-[var(--outline-variant)]/40 animate-ping opacity-20"></div>
        <div className="absolute inset-2 rounded-full border border-dashed border-[var(--primary)]/30 animate-spin" style={{ animationDuration: '24s' }}></div>
        <div className="absolute inset-4 rounded-full bg-[var(--surface-container-high)]/80 backdrop-blur-md border border-[var(--outline-variant)]/60 shadow-inner flex items-center justify-center">
          {iconType === 'filter' && <FilterX className="w-8 h-8 text-[var(--secondary)]" />}
          {iconType === 'data' && <Database className="w-8 h-8 text-[var(--primary)]" />}
          {iconType === 'search' && <Search className="w-8 h-8 text-[var(--tertiary)]" />}
          {iconType === 'chart' && <BarChart2 className="w-8 h-8 text-[var(--primary)]" />}
        </div>
        
        {/* Micro Telemetry Indicator */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--secondary)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--secondary)]"></span>
        </span>
      </div>
    );
  };

  return (
    <div
      className={`w-full flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-xl bg-[var(--surface-container-low)]/70 border border-dashed border-[var(--outline-variant)]/70 transition-all ${className}`}
      style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
    >
      {renderGraphic()}

      {/* Main Title & Description */}
      <h4 className="text-sm sm:text-base font-bold text-[var(--foreground)] font-mono tracking-wide">
        {title}
      </h4>
      <p className="text-xs text-[var(--outline)] max-w-md mt-1.5 leading-relaxed font-sans">
        {description}
      </p>

      {/* Diagnostic Guidance Banner */}
      {diagnosticTip && (
        <div className="mt-4 max-w-lg w-full bg-[var(--surface-container)]/80 border border-[var(--primary-container)]/30 rounded-lg p-2.5 sm:p-3 flex items-start gap-2.5 text-left shadow-xs">
          <Info className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
          <div className="flex-1 text-[11px] font-mono text-[var(--on-surface-variant)] leading-normal">
            <strong className="text-[var(--primary)]">Diagnostic Intelligence: </strong>
            {diagnosticTip}
          </div>
        </div>
      )}

      {/* Interactive Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-5 flex items-center gap-3 flex-wrap justify-center font-mono">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--primary-container)] text-[var(--on-primary)] text-xs font-bold hover:brightness-110 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{actionLabel}</span>
            </button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-container)] text-[var(--foreground)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)]/60 text-xs transition-all cursor-pointer"
            >
              <span>{secondaryActionLabel}</span>
              <ArrowRight className="w-3 h-3 text-[var(--outline)]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
