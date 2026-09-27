'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import {
  Activity,
  Clock,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { TimelineDataPoint } from '@/lib/types';
import { DebouncedResponsiveContainer } from './DebouncedResponsiveContainer';
import { ChartEmptyState } from '@/components/ui/ChartEmptyState';

interface SynchronizedTimelineChartsProps {
  timelineData: TimelineDataPoint[];
  targetSlaDays?: number;
  targetHiresPerPeriod?: number;
  id?: string;
  onResetFilter?: () => void;
}

export function SynchronizedTimelineCharts({
  timelineData,
  targetSlaDays = 14,
  targetHiresPerPeriod = 3,
  id = 'synchronized-timeline-view',
  onResetFilter,
}: SynchronizedTimelineChartsProps) {
  const [highlightSla, setHighlightSla] = useState(true);

  if (!timelineData || timelineData.length === 0) {
    return (
      <ChartEmptyState
        title="No Timeline Data Captured"
        description="The selected time window or filters did not yield any pipeline activity points."
        diagnosticTip="Try expanding the timeline scrubber range above or resetting active filters to view all historical volume."
        actionLabel="Reset Time Window"
        onAction={onResetFilter}
        iconType="data"
      />
    );
  }

  // Calculate high-level summary metrics
  const totalApplied = timelineData.reduce((acc, p) => acc + (p.applied || 0), 0);
  const totalHired = timelineData.reduce((acc, p) => acc + (p.hired || 0), 0);
  const avgVelocity = Number(
    (timelineData.reduce((acc, p) => acc + (p.avgDays || 0), 0) / timelineData.length).toFixed(1)
  );

  return (
    <div className="w-full space-y-4" id={id}>
      {/* Synchronization Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[var(--surface-container)] rounded-lg p-3 border border-[var(--outline-variant)]/40 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--secondary)] animate-pulse" />
          <span className="font-bold text-[var(--foreground)]">
            SYNCHRONIZED TIMELINE TELEMETRY
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-container-high)] text-[var(--primary)] border border-[var(--primary-container)]/30">
            syncId: pipeline-cross-chart-sync
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[var(--outline)]">
          <span>
            Total Volume: <strong className="text-[var(--foreground)]">{totalApplied}</strong>
          </span>
          <span>
            Total Hires: <strong className="text-[var(--primary-container)]">{totalHired}</strong>
          </span>
          <span>
            Avg Velocity: <strong className={avgVelocity > targetSlaDays ? 'text-[var(--severity-warning)]' : 'text-[var(--severity-healthy)]'}>{avgVelocity}d</strong>
          </span>
        </div>
      </div>

      {/* Chart 1: Application Inflow & Hires Volume */}
      <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--primary-container)]" />
            <span className="text-xs font-bold font-mono text-[var(--foreground)] uppercase tracking-wider">
              1. Candidate Inflow & Hires Volume
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--outline)]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-[var(--primary-container)]"></span>
              Applied
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-[var(--severity-healthy)]"></span>
              Hired
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 border-t-2 border-dashed border-[var(--secondary)]"></span>
              Target ({targetHiresPerPeriod}/period)
            </span>
          </div>
        </div>

        <DebouncedResponsiveContainer height={220}>
          <ComposedChart
            syncId="pipeline-cross-chart-sync"
            data={timelineData}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="appliedSyncGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 72, 79, 0.3)" vertical={false} />
            <XAxis
              dataKey="displayDate"
              tick={{ fill: '#dae2fd', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#3e484f' }}
              axisLine={{ stroke: '#3e484f' }}
            />
            <YAxis
              tick={{ fill: '#87929a', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#3e484f' }}
              axisLine={{ stroke: '#3e484f' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as TimelineDataPoint;
                return (
                  <div className="rounded-lg bg-[var(--surface-container-high)]/95 border border-[var(--outline-variant)] p-2.5 shadow-xl font-mono text-xs">
                    <div className="font-bold text-[var(--foreground)] border-b border-[var(--outline-variant)]/50 pb-1 mb-1.5 flex items-center justify-between gap-3">
                      <span>{label}</span>
                      <span className="text-[10px] text-[var(--primary)] font-normal">Volume Telemetry</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between gap-4">
                        <span className="text-[var(--outline)]">Total Applied:</span>
                        <span className="font-bold text-[var(--primary)]">{d.applied}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[var(--outline)]">Tech Interview:</span>
                        <span className="font-semibold text-[var(--secondary)]">{d.techInterview}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[var(--outline)]">Hired:</span>
                        <span className="font-bold text-[var(--severity-healthy)]">+{d.hired}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            {/* Item 19: Benchmark Overlay Line for Target Hires */}
            <ReferenceLine
              y={targetHiresPerPeriod}
              stroke="#ffb95f"
              strokeDasharray="4 4"
              strokeOpacity={0.8}
              label={{
                value: `Target Hires (${targetHiresPerPeriod})`,
                fill: '#ffb95f',
                fontSize: 9,
                position: 'insideTopRight',
              }}
            />
            {/* Item 20: Smooth Chart Entry Animation */}
            <Area
              type="monotone"
              dataKey="applied"
              stroke="#38bdf8"
              strokeWidth={2}
              fill="url(#appliedSyncGrad)"
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="hired"
              fill="#45e3ce"
              barSize={12}
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </DebouncedResponsiveContainer>
      </div>

      {/* Chart 2: Hiring Velocity & Dwell Time (Days to Progress) */}
      <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--secondary)]" />
            <span className="text-xs font-bold font-mono text-[var(--foreground)] uppercase tracking-wider">
              2. Pipeline Velocity & Dwell Time (Avg. Days)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--outline)]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-[var(--secondary)]"></span>
              Actual Dwell Days
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 border-t-2 border-dashed border-[var(--severity-critical-muted)]"></span>
              Max SLA ({targetSlaDays} Days)
            </span>
          </div>
        </div>

        <DebouncedResponsiveContainer height={180}>
          <LineChart
            syncId="pipeline-cross-chart-sync"
            data={timelineData}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 72, 79, 0.3)" vertical={false} />
            <XAxis
              dataKey="displayDate"
              tick={{ fill: '#dae2fd', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#3e484f' }}
              axisLine={{ stroke: '#3e484f' }}
            />
            <YAxis
              tick={{ fill: '#87929a', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#3e484f' }}
              axisLine={{ stroke: '#3e484f' }}
              domain={[0, 'dataMax + 6']}
              tickFormatter={(v) => `${v}d`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as TimelineDataPoint;
                const isBreached = d.avgDays > targetSlaDays;
                return (
                  <div className="rounded-lg bg-[var(--surface-container-high)]/95 border border-[var(--outline-variant)] p-2.5 shadow-xl font-mono text-xs">
                    <div className="font-bold text-[var(--foreground)] border-b border-[var(--outline-variant)]/50 pb-1 mb-1.5 flex items-center justify-between gap-3">
                      <span>{label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isBreached ? 'bg-[var(--severity-critical-bg)] text-[var(--severity-critical-muted)]' : 'bg-[var(--severity-healthy-bg)] text-[var(--severity-healthy)]'}`}>
                        {isBreached ? 'SLA BREACHED' : 'SLA OK'}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between gap-4">
                        <span className="text-[var(--outline)]">Avg Dwell Time:</span>
                        <span className={`font-bold ${isBreached ? 'text-[var(--severity-critical-muted)]' : 'text-[var(--secondary)]'}`}>
                          {d.avgDays} days
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[var(--outline)]">Target SLA:</span>
                        <span className="text-[var(--on-surface-variant)]">{targetSlaDays} days</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-[var(--outline)]">Variance:</span>
                        <span className={`font-bold ${d.avgDays - targetSlaDays > 0 ? 'text-[var(--severity-warning)]' : 'text-[var(--severity-healthy)]'}`}>
                          {d.avgDays - targetSlaDays > 0 ? `+${(d.avgDays - targetSlaDays).toFixed(1)}d` : `${(d.avgDays - targetSlaDays).toFixed(1)}d`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            {/* Item 19: Benchmark Overlay Line for SLA Target */}
            <ReferenceLine
              y={targetSlaDays}
              stroke="#ff6b6b"
              strokeDasharray="4 4"
              strokeOpacity={0.85}
              label={{
                value: `Max SLA (${targetSlaDays}d)`,
                fill: '#ff6b6b',
                fontSize: 9,
                position: 'insideBottomRight',
              }}
            />
            {/* Item 20: Smooth Chart Entry Animation */}
            <Line
              type="monotone"
              dataKey="avgDays"
              stroke="#ffb95f"
              strokeWidth={2.5}
              dot={{ fill: '#ffb95f', r: 3 }}
              activeDot={{ r: 6, fill: '#38bdf8', stroke: '#0b1326', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </LineChart>
        </DebouncedResponsiveContainer>
      </div>

      <div className="text-[10px] font-mono text-[var(--outline)] text-right">
        💡 Hover over any interval in either chart to synchronize telemetry inspection simultaneously.
      </div>
    </div>
  );
}
