'use client';

import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  Clock,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { mockExecutiveSummary } from '@/lib/mock-data';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ChartExportActions } from '@/components/funnel/charts/ChartExportActions';

export function ExecutiveOverview() {
  const { t } = useApp();
  const {
    activeReqs,
    activeReqsTrend,
    timeToFill,
    timeToFillTrend,
    offerAcceptanceRate,
    criticalBottleneck,
    capacityWarning,
    ytdFunnel,
  } = mockExecutiveSummary;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--background)] p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--outline-variant)]/40 pb-4 sm:pb-5">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                {t('exec.title', 'Executive Overview')}
              </h2>
              <span className="px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-medium bg-[var(--surface-container)] border border-[var(--primary-container)]/40 text-[var(--primary)]">
                {t('exec.badge', 'C-Suite & HR Leadership')}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[var(--outline)] font-mono mt-1">
              {t('exec.subtitle', 'High-level hiring velocity, bottleneck alerts, and organization capacity')}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <StatusBadge
              label={`${t('exec.ytd_status', 'YTD Status:')} ${t('common.active', 'ACTIVE')}`}
              variant="healthy"
              showPulse={true}
              glow={true}
              size="sm"
            />
          </div>
        </div>

        {/* 1. Critical Alert Banners */}
        <div className="space-y-3">
          {/* Critical Bottleneck Alert */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--severity-critical-bg)] border border-[var(--severity-critical-muted)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[var(--severity-critical-container)] text-[var(--severity-critical-muted)] shrink-0 mt-0.5">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--severity-critical-muted)] font-bold">
                  {t(criticalBottleneck.title, criticalBottleneck.title)}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[var(--foreground)] mt-0.5">
                  {t(criticalBottleneck.message, criticalBottleneck.message)}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="self-end sm:self-center px-3.5 py-1.5 rounded bg-[var(--severity-critical-container)] hover:brightness-125 text-[var(--severity-critical-muted)] text-xs font-mono font-bold transition-colors shrink-0 shadow-sm"
            >
              {t('common.diagnose', 'Diagnose')}
            </Link>
          </div>

          {/* Capacity Warning Alert */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--severity-warning-bg)] border border-[var(--severity-warning)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[var(--severity-warning-container)] text-[var(--severity-warning)] shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--severity-warning)] font-bold">
                  {t(capacityWarning.title, capacityWarning.title)}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[var(--foreground)] mt-0.5">
                  {t(capacityWarning.message, capacityWarning.message)}
                </p>
              </div>
            </div>
            <StatusBadge
              label={t('exec.impact_high', 'Impact: High')}
              variant="warning"
              showPulse={true}
              glow={true}
              size="xs"
              className="self-end sm:self-center shrink-0"
            />
          </div>
        </div>

        {/* 2. Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Open Requisitions */}
          <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm card-interactive hover:border-[var(--primary)]/60">
            <div className="flex items-center justify-between">
              <span className="label-meta text-[var(--outline)]">
                {t('exec.active_reqs', 'ACTIVE REQUISITIONS')}
              </span>
              <Briefcase className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-bold metric-val text-[var(--foreground)]">
                {activeReqs}
              </span>
              <span className="text-xs text-[var(--outline)] ml-1.5 font-mono">{t('common.roles', 'roles')}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[var(--severity-healthy)] font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{activeReqsTrend} {t('exec.active_reqs_trend', 'vs last quarter')}</span>
            </div>
          </div>

          {/* Card 2: Avg Time to Fill */}
          <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm card-interactive hover:border-[var(--severity-warning)]/60">
            <div className="flex items-center justify-between">
              <span className="label-meta text-[var(--outline)]">
                {t('exec.avg_time_to_fill', 'AVG TIME TO FILL')}
              </span>
              <Clock className="w-4 h-4 text-[var(--severity-warning)]" />
            </div>
            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-bold metric-val text-[var(--foreground)]">
                {timeToFill}
              </span>
              <span className="text-xs text-[var(--outline)] ml-1.5 font-mono">{t('common.days', 'days')}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[var(--severity-warning)] font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{timeToFillTrend} {t('exec.avg_time_trend', 'vs SLA target')}</span>
            </div>
          </div>

          {/* Card 3: Offer Acceptance Rate */}
          <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm card-interactive hover:border-[var(--severity-healthy)]/60">
            <div className="flex items-center justify-between">
              <span className="label-meta text-[var(--outline)]">
                {t('exec.offer_acceptance_rate', 'OFFER ACCEPTANCE RATE')}
              </span>
              <CheckCircle2 className="w-4 h-4 text-[var(--severity-healthy)]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold metric-val text-[var(--severity-healthy)]">
                {offerAcceptanceRate}
              </span>
              <span className="text-sm font-bold text-[var(--severity-healthy)] font-mono">%</span>
            </div>
            <div className="mt-2.5 text-xs text-[var(--outline)] font-mono">
              {t('exec.benchmark_optimal', 'Benchmark: >85% (Optimal)')}
            </div>
          </div>
        </div>

        {/* 3. YTD Funnel Diagnostics */}
        <div id="executive-funnel-container" className="bg-[var(--surface-container-low)]/60 border border-[var(--outline-variant)]/50 rounded-xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--primary-container)]" />
              <h3 className="text-sm font-bold text-[var(--foreground)] font-sans">
                {t('exec.ytd_funnel_title', 'Organization-Wide YTD Funnel Flow')}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--outline)] hidden sm:inline">
                10,450 {t('exec.total_applicants_badge', 'Total Inflow')}
              </span>
              <ChartExportActions
                className="no-export"
                targetElementId="executive-funnel-container"
                chartTitle="Organization YTD Hiring Funnel Report"
              />
            </div>
          </div>

          {/* Stage Progress Bars */}
          <div className="space-y-3.5 pt-1">
            {ytdFunnel.map((item, idx) => {
              const rate = item.conversionRate ?? (100 - item.dropRate);
              return (
                <div key={item.stage} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[var(--surface-container)] border border-[var(--outline-variant)] flex items-center justify-center text-[10px] font-bold text-[var(--primary)]">
                        {idx + 1}
                      </span>
                      <span className="text-[var(--foreground)] font-medium">{t(item.stage, item.stage)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--outline)]">{item.count.toLocaleString()} {t('common.candidates', 'candidates')}</span>
                      <span className="font-bold text-[var(--primary-container)] w-10 text-right">{rate}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-[var(--background)] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${rate}%`,
                        backgroundColor:
                          rate > 70 ? 'var(--severity-healthy)' : rate > 30 ? 'var(--primary-container)' : 'var(--severity-critical-muted)',
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Quick Action Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard"
            className="p-4 rounded-xl bg-[var(--surface-container)]/80 hover:bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 hover:border-[var(--primary-container)]/60 transition-all flex items-center justify-between group"
          >
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary-container)] transition-colors">
                {t('exec.deep_funnel_card_title', 'Deep Funnel Diagnostics')}
              </h4>
              <p className="text-[11px] text-[var(--outline)] font-mono mt-0.5">
                {t('exec.deep_funnel_card_desc', 'Inspect drop-off leakages and stage SLAs per job')}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--outline)] group-hover:text-[var(--primary-container)] group-hover:translate-x-1 transition-all shrink-0" />
          </Link>

          <Link
            href="/candidates"
            className="p-4 rounded-xl bg-[var(--surface-container)]/80 hover:bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 hover:border-[var(--primary-container)]/60 transition-all flex items-center justify-between group"
          >
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--primary-container)] transition-colors">
                {t('exec.candidate_health_card_title', 'Candidate Health Explorer')}
              </h4>
              <p className="text-[11px] text-[var(--outline)] font-mono mt-0.5">
                {t('exec.candidate_health_card_desc', 'Manage candidate health scores and SLA alarms')}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--outline)] group-hover:text-[var(--primary-container)] group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
