'use client';

import React, { useState } from 'react';
import {
  Users,
  Globe,
  Briefcase,
  Sparkles,
  TrendingUp,
  Clock,
  Filter,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { CohortChannelRow, CohortCell } from '@/lib/types';
import { ChartEmptyState } from '@/components/ui/ChartEmptyState';

interface CohortAnalysisHeatmapProps {
  cohortData: CohortChannelRow[];
  id?: string;
  onResetFilters?: () => void;
}

export function CohortAnalysisHeatmap({
  cohortData,
  id = 'cohort-heatmap-chart',
  onResetFilters,
}: CohortAnalysisHeatmapProps) {
  const [activeMetric, setActiveMetric] = useState<'conversion' | 'velocity'>('conversion');
  const [hoveredCell, setHoveredCell] = useState<CohortCell | null>(null);

  if (!cohortData || cohortData.length === 0) {
    return (
      <ChartEmptyState
        title="No Sourcing Cohort Data"
        description="No applicant source attribution or weekly cohort velocity data is available for the active period."
        diagnosticTip="Verify candidate sourcing tags (Referral, LinkedIn, Direct, Agency) or expand the inspection date window."
        actionLabel="Reload Cohort Data"
        onAction={onResetFilters}
        iconType="data"
      />
    );
  }

  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

  // Color generator based on metric & value
  const getCellColorStyle = (cell: CohortCell) => {
    if (activeMetric === 'conversion') {
      const rate = cell.passThroughRate;
      if (rate >= 25) {
        return 'bg-[rgba(69,227,206,0.28)] text-[var(--severity-healthy)] border-[rgba(69,227,206,0.5)] font-bold shadow-xs';
      }
      if (rate >= 14) {
        return 'bg-[rgba(56,189,248,0.22)] text-[var(--primary)] border-[rgba(56,189,248,0.4)] font-medium';
      }
      if (rate >= 8) {
        return 'bg-[rgba(255,185,95,0.2)] text-[var(--severity-warning)] border-[rgba(255,185,95,0.35)]';
      }
      return 'bg-[rgba(255,107,107,0.22)] text-[var(--severity-critical-muted)] border-[rgba(255,107,107,0.4)] font-semibold';
    } else {
      // Velocity in Days: lower is better
      const days = cell.avgVelocityDays;
      if (days <= 10) {
        return 'bg-[rgba(69,227,206,0.28)] text-[var(--severity-healthy)] border-[rgba(69,227,206,0.5)] font-bold shadow-xs';
      }
      if (days <= 14) {
        return 'bg-[rgba(56,189,248,0.22)] text-[var(--primary)] border-[rgba(56,189,248,0.4)] font-medium';
      }
      if (days <= 17) {
        return 'bg-[rgba(255,185,95,0.2)] text-[var(--severity-warning)] border-[rgba(255,185,95,0.35)]';
      }
      return 'bg-[rgba(255,107,107,0.22)] text-[var(--severity-critical-muted)] border-[rgba(255,107,107,0.4)] font-semibold';
    }
  };

  const getChannelIcon = (name: string) => {
    switch (name) {
      case 'Employee Referral':
        return <Users className="w-3.5 h-3.5 text-[var(--severity-healthy)]" />;
      case 'LinkedIn Outbound':
        return <Globe className="w-3.5 h-3.5 text-[var(--primary-container)]" />;
      case 'Direct Career Page':
        return <Briefcase className="w-3.5 h-3.5 text-[var(--secondary)]" />;
      case 'Executive Search / Agency':
        return <Sparkles className="w-3.5 h-3.5 text-[var(--tertiary)]" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-[var(--outline)]" />;
    }
  };

  return (
    <div className="w-full space-y-4" id={id}>
      {/* Metric Selector & Legend Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--surface-container)] rounded-xl p-3.5 border border-[var(--outline-variant)]/40">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--primary-container)]" />
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--foreground)]">
              CANDIDATE COHORT VELOCITY & SOURCE EFFICIENCY
            </h4>
          </div>
          <p className="text-[11px] font-mono text-[var(--outline)] mt-0.5">
            Pass-through conversion rate & stage velocity across sourcing channels and calendar cohorts
          </p>
        </div>

        {/* Metric Mode Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <span className="text-[10px] text-[var(--outline)]">METRIC:</span>
          <div className="bg-[var(--surface-container-low)] p-0.5 rounded-lg border border-[var(--outline-variant)]/60 flex items-center">
            <button
              onClick={() => setActiveMetric('conversion')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                activeMetric === 'conversion'
                  ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-bold shadow-xs'
                  : 'text-[var(--outline)] hover:text-[var(--foreground)]'
              }`}
            >
              Conversion Rate %
            </button>
            <button
              onClick={() => setActiveMetric('velocity')}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                activeMetric === 'velocity'
                  ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-bold shadow-xs'
                  : 'text-[var(--outline)] hover:text-[var(--foreground)]'
              }`}
            >
              Velocity (Days)
            </button>
          </div>
        </div>
      </div>

      {/* Main Heatmap Matrix Grid */}
      <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded-xl p-4 overflow-x-auto">
        <div className="min-w-[680px]">
          {/* Column Headers (Weeks) */}
          <div className="grid grid-cols-10 gap-2 pb-2 border-b border-[var(--outline-variant)]/40 text-center font-mono text-xs font-bold text-[var(--outline)]">
            <div className="col-span-2 text-left pl-2">SOURCING CHANNEL</div>
            {weeks.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Heatmap Rows */}
          <div className="space-y-2.5 mt-3">
            {cohortData.map((row) => (
              <div
                key={row.channelId}
                className="grid grid-cols-10 gap-2 items-center text-xs font-mono group"
              >
                {/* Channel Label */}
                <div className="col-span-2 flex items-center gap-2 pl-2 pr-1 truncate">
                  {getChannelIcon(row.channelName)}
                  <div className="truncate">
                    <span className="text-[var(--foreground)] font-semibold truncate block text-xs">
                      {row.channelName}
                    </span>
                    <span className="text-[10px] text-[var(--outline)] block">
                      {row.totalCandidates} cands • {row.avgConversion}% avg
                    </span>
                  </div>
                </div>

                {/* 8 Week Cells */}
                {row.weeks.map((cell) => {
                  const styleClass = getCellColorStyle(cell);
                  return (
                    <div
                      key={`${row.channelId}-${cell.week}`}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`h-11 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer relative hover:scale-105 hover:z-10 ${styleClass}`}
                    >
                      <span className="text-xs font-mono">
                        {activeMetric === 'conversion'
                          ? `${cell.passThroughRate}%`
                          : `${cell.avgVelocityDays}d`}
                      </span>
                      <span className="text-[9px] opacity-75 font-mono">
                        {cell.hiredCount}/{cell.applicants}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Hovered Cell Detail Box */}
        {hoveredCell ? (
          <div className="mt-4 p-3 rounded-lg bg-[var(--surface-container-high)] border border-[var(--primary-container)]/50 flex items-center justify-between font-mono text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-container)]"></div>
              <div>
                <span className="font-bold text-[var(--foreground)]">
                  {hoveredCell.channel} • {hoveredCell.week} Cohort
                </span>
                <span className="text-[var(--outline)] ml-2">
                  ({hoveredCell.applicants} applicants, {hoveredCell.hiredCount} hired)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span>
                Conversion: <strong className="text-[var(--primary-container)]">{hoveredCell.passThroughRate}%</strong>
              </span>
              <span>
                Velocity: <strong className="text-[var(--severity-healthy)]">{hoveredCell.avgVelocityDays} days</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-2 rounded-lg bg-[var(--surface-container)]/40 border border-[var(--outline-variant)]/20 text-center font-mono text-[11px] text-[var(--outline)]">
            Hover over any cohort block for granular candidate pass-through & velocity diagnostics
          </div>
        )}
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--outline)] px-1">
        <div className="flex items-center gap-2">
          <span>EFFICIENCY SCALE:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[rgba(69,227,206,0.5)]"></span>
            <span>Optimal (≥25%)</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-3 h-3 rounded bg-[rgba(56,189,248,0.4)]"></span>
            <span>Moderate (14-25%)</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-3 h-3 rounded bg-[rgba(255,185,95,0.4)]"></span>
            <span>Lagging (8-14%)</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-3 h-3 rounded bg-[rgba(255,107,107,0.4)]"></span>
            <span>Critical (&lt;8%)</span>
          </div>
        </div>
        <span>W1 - W8: Rolling 8-week candidate inflow</span>
      </div>
    </div>
  );
}
