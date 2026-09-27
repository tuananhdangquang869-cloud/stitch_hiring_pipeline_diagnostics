'use client';

import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { FunnelStage } from '@/lib/types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    payload: FunnelStage & {
      conversionRate?: number;
      passed?: number;
      dropped?: number;
      stage?: string;
    };
    color?: string;
  }>;
  label?: string;
}

export function FunnelChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const stageName = label || data.name || data.stage || 'Pipeline Stage';
  const volumeIn = data.volumeIn ?? Number(payload[0].value) ?? 0;
  const volumePassed = data.volumePassed ?? data.passed ?? 0;
  const volumeDropped = data.volumeDropped ?? data.dropped ?? (volumeIn - volumePassed);
  const dropRate = data.dropRate ?? (volumeIn > 0 ? (volumeDropped / volumeIn) * 100 : 0);
  const conversionRate = 100 - dropRate;
  
  const avgDays = data.avgDaysInStage ?? 0;
  const targetDays = data.targetDaysInStage ?? 5;
  const daysDelta = avgDays - targetDays;
  const isSlaBreached = daysDelta > 0;

  // Benchmark stats
  const benchmarkDrop = data.benchmarkDropRate ?? 45.0;
  const benchmarkDiff = dropRate - benchmarkDrop;
  const isBetterThanBenchmark = benchmarkDiff < 0;

  return (
    <div className="z-50 min-w-[260px] max-w-[320px] rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-high)]/95 p-3.5 shadow-2xl backdrop-blur-md font-sans text-xs">
      {/* Tooltip Header */}
      <div className="flex items-center justify-between border-b border-[var(--outline-variant)]/60 pb-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-container)]"></div>
          <span className="font-mono font-bold text-[var(--foreground)] tracking-wide text-xs">
            {stageName.toUpperCase()}
          </span>
        </div>
        {data.isBottleneck && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--severity-critical-bg)] text-[var(--severity-critical-muted)] font-mono text-[9px] font-bold border border-[var(--severity-critical-muted)]/40">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>BOTTLENECK</span>
          </span>
        )}
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Conversion Rate */}
        <div className="bg-[var(--surface-container)]/80 rounded-lg p-2 border border-[var(--outline-variant)]/40">
          <span className="text-[9px] font-mono text-[var(--outline)] uppercase tracking-wider block">
            Conversion Rate
          </span>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="text-sm font-bold font-mono text-[var(--primary-container)]">
              {conversionRate.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[var(--outline)] font-mono">
              ({volumePassed}/{volumeIn})
            </span>
          </div>
        </div>

        {/* Drop-Off Rate */}
        <div className="bg-[var(--surface-container)]/80 rounded-lg p-2 border border-[var(--outline-variant)]/40">
          <span className="text-[9px] font-mono text-[var(--outline)] uppercase tracking-wider block">
            Drop-Off Rate
          </span>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className={`text-sm font-bold font-mono ${dropRate > 50 ? 'text-[var(--severity-warning)]' : 'text-[var(--foreground)]'}`}>
              {dropRate.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[var(--severity-critical-muted)] font-mono">
              (-{volumeDropped})
            </span>
          </div>
        </div>
      </div>

      {/* Benchmark Delta Section */}
      <div className="bg-[var(--surface-container-low)] rounded-lg p-2.5 mb-2.5 border border-[var(--outline-variant)]/30 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[var(--on-surface-variant)]">Industry Benchmark:</span>
          <span className="text-[var(--foreground)] font-semibold">{benchmarkDrop.toFixed(0)}% drop</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[var(--outline-variant)]/30">
          <span className="text-[var(--on-surface-variant)]">Benchmark Delta:</span>
          <span className={`flex items-center gap-1 font-bold ${isBetterThanBenchmark ? 'text-[var(--severity-healthy)]' : 'text-[var(--severity-warning)]'}`}>
            {isBetterThanBenchmark ? (
              <>
                <TrendingDown className="w-3 h-3 text-[var(--severity-healthy)]" />
                <span>{Math.abs(benchmarkDiff).toFixed(1)}% better</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-3 h-3 text-[var(--severity-warning)]" />
                <span>+{benchmarkDiff.toFixed(1)}% higher drop</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Dwell Time & SLA Status */}
      <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[var(--outline)]">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[var(--outline)]" />
          <span>Avg Dwell: <strong className="text-[var(--foreground)]">{avgDays}d</strong> (Target: {targetDays}d)</span>
        </div>
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isSlaBreached ? 'bg-[var(--severity-warning-bg)] text-[var(--severity-warning)]' : 'bg-[var(--severity-healthy-bg)] text-[var(--severity-healthy)]'}`}>
          {isSlaBreached ? `+${daysDelta.toFixed(1)}d SLA` : 'SLA OK'}
        </span>
      </div>
    </div>
  );
}
