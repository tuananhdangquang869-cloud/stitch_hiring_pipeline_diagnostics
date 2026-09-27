'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Filter,
  Sliders,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Brush,
  ResponsiveContainer,
} from 'recharts';
import { TimelineDataPoint, TimeRangePreset } from '@/lib/types';
import { DebouncedResponsiveContainer } from './DebouncedResponsiveContainer';

interface FunnelTimeScrubberProps {
  timelineData: TimelineDataPoint[];
  selectedPreset: TimeRangePreset;
  onPresetChange: (preset: TimeRangePreset) => void;
  onRangeChange?: (startIndex: number, endIndex: number, filteredPoints: TimelineDataPoint[]) => void;
  className?: string;
}

export function FunnelTimeScrubber({
  timelineData,
  selectedPreset,
  onPresetChange,
  onRangeChange,
  className = '',
}: FunnelTimeScrubberProps) {
  const [brushRange, setBrushRange] = useState<{ startIndex: number; endIndex: number }>({
    startIndex: 0,
    endIndex: Math.max(timelineData.length - 1, 0),
  });

  const presets: Array<{ id: TimeRangePreset; label: string; count: number }> = [
    { id: '7D', label: 'Last 7D', count: 1 },
    { id: '30D', label: 'Last 30D', count: 4 },
    { id: '90D', label: 'Last 90D', count: 12 },
    { id: 'YTD', label: 'YTD', count: Math.floor(timelineData.length * 0.75) || 8 },
    { id: 'ALL', label: 'All-Time', count: timelineData.length },
  ];

  // Active dates display
  const activeStart = timelineData[brushRange.startIndex]?.displayDate || timelineData[0]?.displayDate || 'Start';
  const activeEnd = timelineData[brushRange.endIndex]?.displayDate || timelineData[timelineData.length - 1]?.displayDate || 'Now';

  const handleBrushChange = (range: { startIndex?: number; endIndex?: number }) => {
    const s = range.startIndex ?? 0;
    const e = range.endIndex ?? timelineData.length - 1;
    setBrushRange({ startIndex: s, endIndex: e });
    if (onRangeChange) {
      const sliced = timelineData.slice(s, e + 1);
      onRangeChange(s, e, sliced);
    }
  };

  const handlePresetSelect = (preset: TimeRangePreset) => {
    onPresetChange(preset);
    const targetCount = presets.find((p) => p.id === preset)?.count || timelineData.length;
    const end = timelineData.length - 1;
    const start = Math.max(0, end - targetCount + 1);
    setBrushRange({ startIndex: start, endIndex: end });
    if (onRangeChange) {
      onRangeChange(start, end, timelineData.slice(start, end + 1));
    }
  };

  const resetScrubber = () => {
    handlePresetSelect('ALL');
  };

  return (
    <div className={`bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded-xl p-3 sm:p-4 ${className}`}>
      {/* Header & Preset Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[var(--primary-container)]" />
          <span className="text-xs font-mono font-bold text-[var(--foreground)] tracking-wide">
            TIMELINE SCRUBBER & HISTORICAL ZOOM
          </span>
          <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-container)] text-[var(--primary)] border border-[var(--primary-container)]/30">
            {activeStart} → {activeEnd}
          </span>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {presets.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-bold shadow-xs'
                    : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)]/40'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
          <button
            onClick={resetScrubber}
            title="Reset Zoom"
            className="p-1.5 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] text-[var(--outline)] hover:text-[var(--foreground)] border border-[var(--outline-variant)]/40 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mini Interactive Timeline Area & Brush Slider */}
      <div className="w-full h-24 relative bg-[var(--surface-container-lowest)]/80 rounded-lg p-1.5 border border-[var(--outline-variant)]/40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={timelineData}
            margin={{ top: 4, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="scrubberGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="dropGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffb95f" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffb95f" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="displayDate"
              tick={{ fill: '#87929a', fontSize: 9, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              height={15}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as TimelineDataPoint;
                return (
                  <div className="rounded bg-[var(--surface-container-highest)] border border-[var(--outline-variant)] px-2 py-1 text-[10px] font-mono shadow-md">
                    <span className="text-[var(--foreground)] font-bold">{label}</span>: {d.applied} applied / {d.hired} hired
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="applied"
              stroke="#38bdf8"
              strokeWidth={1.5}
              fill="url(#scrubberGradient)"
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Brush
              dataKey="displayDate"
              height={22}
              stroke="#38bdf8"
              fill="#131b2e"
              startIndex={brushRange.startIndex}
              endIndex={brushRange.endIndex}
              onChange={handleBrushChange}
              travellerWidth={10}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-[var(--outline)]">
        <span>◀ Drag handles to scrub through time window</span>
        <span>{timelineData.length} data intervals captured</span>
      </div>
    </div>
  );
}
