'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Activity,
  Upload,
  Briefcase,
  LayoutGrid,
  List,
  Clock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { FunnelStage, Candidate } from '@/lib/types';
import { StageDetailModal } from '@/components/modals/StageDetailModal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CandidateExplorerSkeleton } from '@/components/ui/Skeleton';

// SLA thresholds per stage type for health index calculation
const STAGE_SLA_DAYS: Record<string, number> = {
  applied: 3,
  screen: 5,
  screening: 5,
  tech: 8,
  technical: 8,
  interview: 8,
  assignment: 7,
  panel: 5,
  offer: 4,
  portfolio: 5,
  case: 6,
};

function computeCandidateHealth(daysInStage: number, stageName: string, status: string): number {
  if (status === 'HIRED') return 100;
  
  const stageKey = stageName.toLowerCase();
  let sla = 7;
  for (const [k, v] of Object.entries(STAGE_SLA_DAYS)) {
    if (stageKey.includes(k)) {
      sla = v;
      break;
    }
  }

  const ratio = daysInStage / sla;
  let score: number;
  if (ratio <= 0.5) {
    score = 95 - Math.round(ratio * 10);
  } else if (ratio <= 1.0) {
    score = 90 - Math.round((ratio - 0.5) * 30);
  } else if (ratio <= 1.5) {
    score = 75 - Math.round((ratio - 1.0) * 40);
  } else {
    score = Math.max(10, Math.round(55 - (ratio - 1.5) * 30));
  }

  if (status === 'DROPPED') {
    score = Math.min(score, 35);
  }

  return Math.min(100, Math.max(0, score));
}

export function CandidateExplorer() {
  const {
    selectedJob,
    selectedJobId,
    setIsCsvModalOpen,
    candidates: allCandidates,
    stagesByJob,
    t,
  } = useApp();

  const [activeStageFilter, setActiveStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'health_asc' | 'health_desc' | 'days_desc'>('health_asc');
  const [filterBySelectedJobOnly, setFilterBySelectedJobOnly] = useState<boolean>(true);
  const [diagnosingCandidate, setDiagnosingCandidate] = useState<Candidate | null>(null);
  const [diagnosingStage, setDiagnosingStage] = useState<FunnelStage | null>(null);
  const [viewFormat, setViewFormat] = useState<'table' | 'cards'>('cards');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Reset to page 1 when filter/search/job changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStageFilter, searchQuery, filterBySelectedJobOnly, selectedJobId, sortBy, pageSize]);

  // Filter candidates
  let filteredCandidates = allCandidates.map((c) => ({
    ...c,
    healthIndex: computeCandidateHealth(c.timeInStageDays, c.currentStage, c.status),
  }));

  if (filterBySelectedJobOnly) {
    filteredCandidates = filteredCandidates.filter((c) => c.jobId === selectedJobId);
  }

  if (activeStageFilter !== 'all') {
    filteredCandidates = filteredCandidates.filter((c) =>
      c.currentStage.toLowerCase().includes(activeStageFilter.toLowerCase())
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredCandidates = filteredCandidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.candidateId.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
    );
  }

  // Sort candidates
  filteredCandidates.sort((a, b) => {
    if (sortBy === 'health_asc') return a.healthIndex - b.healthIndex;
    if (sortBy === 'health_desc') return b.healthIndex - a.healthIndex;
    if (sortBy === 'days_desc') return b.timeInStageDays - a.timeInStageDays;
    return 0;
  });

  // Calculate Pagination Slices
  const totalRecords = filteredCandidates.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  const stageTabs = [
    { label: t('candidates.all_stages', 'All Stages'), key: 'all' },
    { label: t('candidates.stage_screening', 'Screening'), key: 'screen' },
    { label: t('candidates.stage_technical', 'Technical'), key: 'tech' },
    { label: t('candidates.stage_offer', 'Offer'), key: 'offer' },
  ];

  // Diagnose button handler: opens StageDetailModal scoped to candidate's stage
  const handleDiagnose = (candidate: Candidate) => {
    const jobStages = stagesByJob[candidate.jobId] || stagesByJob['req-142'] || [];
    const matched = jobStages.find(
      (s) =>
        s.name.toLowerCase().includes(candidate.currentStage.toLowerCase()) ||
        candidate.currentStage.toLowerCase().includes(s.name.toLowerCase())
    );

    const stageObj: FunnelStage = matched || {
      id: `stage-${candidate.jobId}-diag`,
      name: candidate.currentStage,
      stageOrder: 2,
      volumeIn: 45,
      volumePassed: 18,
      volumeDropped: 27,
      dropRate: 60.0,
      avgDaysInStage: candidate.timeInStageDays,
      targetDaysInStage: 5.0,
      isBottleneck: candidate.timeInStageDays > 8,
    };

    setDiagnosingCandidate(candidate);
    setDiagnosingStage(stageObj);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--background)] p-3 sm:p-6 pb-20 lg:pb-6">
      {/* Top Banner & Job Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-5 border-b border-[var(--outline-variant)]/40">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h2 className="text-base sm:text-xl font-bold text-[var(--foreground)] tracking-tight">
              {t('candidates.title', 'Candidate Explorer')}
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono font-medium bg-[var(--surface-container)] border border-[var(--primary-container)]/40 text-[var(--primary)] truncate max-w-[200px]">
              {filterBySelectedJobOnly ? selectedJob.title : t('candidates.all_open_roles', 'All Open Roles')}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[var(--outline)] font-mono mt-0.5">
            {t('candidates.subtitle', 'Real-time pipeline diagnostics & SLA Health Index (0-100) monitoring')}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterBySelectedJobOnly(!filterBySelectedJobOnly)}
            className={`flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 rounded text-xs font-mono border transition-all cursor-pointer truncate ${
              filterBySelectedJobOnly
                ? 'bg-[var(--surface-container)] border-[var(--primary-container)] text-[var(--primary)]'
                : 'bg-[var(--surface-container-low)] border-[var(--outline-variant)] text-[var(--outline)] hover:text-[var(--foreground)]'
            }`}
          >
            {filterBySelectedJobOnly
              ? `${t('candidates.role_prefix', 'Role:')} ${selectedJob.title}`
              : t('candidates.all_open_roles', 'All Roles')}
          </button>
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[var(--primary-container)] text-[var(--on-primary)] text-xs font-bold font-mono hover:brightness-110 transition-all shadow-md shadow-[var(--primary-container)]/20 cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('header.import_csv', 'Import CSV')}</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs, View Switcher & Search Bar */}
      <div className="py-3 flex flex-col gap-3">
        {/* Stage Filter Pills */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center p-1 rounded-lg bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 overflow-x-auto no-scrollbar flex-1">
            {stageTabs.map((tab) => {
              const isActive = activeStageFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveStageFilter(tab.key)}
                  className={`px-2.5 sm:px-3 py-1 rounded text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[var(--surface-container-high)] text-[var(--foreground)] shadow-sm border border-[var(--outline-variant)]/60'
                      : 'text-[var(--outline)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Cards vs Table */}
          <div className="flex items-center p-1 rounded-lg bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 shrink-0">
            <button
              onClick={() => setViewFormat('cards')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewFormat === 'cards'
                  ? 'bg-[var(--surface-container-high)] text-[var(--primary-container)]'
                  : 'text-[var(--outline)] hover:text-[var(--foreground)]'
              }`}
              title={t('candidates.card_view', 'Card View')}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewFormat('table')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewFormat === 'table'
                  ? 'bg-[var(--surface-container-high)] text-[var(--primary-container)]'
                  : 'text-[var(--outline)] hover:text-[var(--foreground)]'
              }`}
              title={t('candidates.table_view', 'Table View')}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
            <input
              type="text"
              placeholder={t('candidates.search_placeholder', 'Search candidate name, ID, email, role...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--outline)] focus:outline-none focus:border-[var(--primary-container)] font-mono"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded-lg px-2.5 py-1.5 text-xs text-[var(--outline)] font-mono flex-1 sm:flex-none">
              <ArrowUpDown className="w-3 h-3 text-[var(--primary-container)]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[var(--foreground)] outline-none cursor-pointer w-full text-xs font-mono"
              >
                <option value="health_asc" className="bg-[var(--surface-container-low)]">
                  {t('candidates.sort_health_asc', 'Health: Lowest First (Urgent)')}
                </option>
                <option value="health_desc" className="bg-[var(--surface-container-low)]">
                  {t('candidates.sort_health_desc', 'Health: Highest First')}
                </option>
                <option value="days_desc" className="bg-[var(--surface-container-low)]">
                  {t('candidates.sort_days_desc', 'Stagnation: Days in Stage')}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate List/Grid */}
      <div className="flex-1 mt-2">
        {paginatedCandidates.length === 0 ? (
          <div className="p-8 text-center bg-[var(--surface-container-low)]/40 border border-[var(--outline-variant)]/40 rounded-xl">
            <p className="text-sm font-mono text-[var(--outline)]">
              {t('candidates.empty_state', 'No candidates match the filter criteria.')}
            </p>
          </div>
        ) : viewFormat === 'cards' ? (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {paginatedCandidates.map((c) => {
              const isCritical = c.healthIndex < 50;
              const isWarning = c.healthIndex >= 50 && c.healthIndex < 75;

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between card-interactive ${
                    isCritical
                      ? 'bg-[var(--surface-container)] border-[var(--severity-critical-muted)]/40 hover:border-[var(--severity-critical-muted)]'
                      : isWarning
                      ? 'bg-[var(--surface-container)] border-[var(--severity-warning)]/40 hover:border-[var(--severity-warning)]'
                      : 'bg-[var(--surface-container)] border-[var(--outline-variant)]/60 hover:border-[var(--primary-container)]/60'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--foreground)] heading-tight">{c.name}</h4>
                        <span className="text-[10px] font-mono text-[var(--outline)]">
                          {c.candidateId} • {c.email}
                        </span>
                      </div>
                      <StatusBadge
                        label={`${t('candidates.health_prefix', 'Health')} ${c.healthIndex}`}
                        variant={isCritical ? 'critical' : isWarning ? 'warning' : 'healthy'}
                        showPulse={isCritical}
                        glow={isCritical}
                        size="xs"
                      />
                    </div>

                    {/* Stage & Days in stage */}
                    <div className="mt-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-[var(--on-surface-variant)] flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-[var(--primary-container)]" />
                        <span>{t(c.currentStage, c.currentStage)}</span>
                      </span>
                      <span className="text-[var(--outline)] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {c.timeInStageDays} {t('common.days', 'd')} {t('candidates.in_stage', 'in stage')}
                        </span>
                      </span>
                    </div>

                    {/* Recruiter */}
                    <div className="mt-2 text-[10px] font-mono text-[var(--outline)]">
                      {t('candidates.recruiter_label', 'Recruiter:')} <span className="text-[var(--foreground)]">{c.assignedRecruiter}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-[var(--outline-variant)]/40 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--outline)]">
                      {t('candidates.status_label', 'Status:')}{' '}
                      <span
                        className={
                          c.status === 'DROPPED'
                            ? 'text-[var(--severity-critical-muted)] font-bold'
                            : c.status === 'HIRED'
                            ? 'text-[var(--severity-healthy)] font-bold'
                            : 'text-[var(--primary)]'
                        }
                      >
                        {t(c.status, c.status)}
                      </span>
                    </span>
                    <button
                      onClick={() => handleDiagnose(c)}
                      className="px-2.5 py-1 rounded bg-[var(--background)] border border-[var(--primary-container)]/40 hover:bg-[var(--primary-container)] hover:text-[var(--on-primary)] text-[var(--primary)] text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Activity className="w-3 h-3" />
                      <span>{t('candidates.diagnose_btn', 'Diagnose')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="border border-[var(--outline-variant)]/60 rounded-xl overflow-hidden bg-[var(--surface-container-low)]/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono min-w-[700px]">
                <thead className="bg-[var(--surface-container)] border-b border-[var(--outline-variant)]/60 text-[11px] text-[var(--outline)]">
                  <tr>
                    <th className="p-3">{t('candidates.col_candidate', 'Candidate')}</th>
                    <th className="p-3">{t('candidates.col_stage', 'Current Stage')}</th>
                    <th className="p-3">{t('candidates.col_time_in_stage', 'Time in Stage')}</th>
                    <th className="p-3">{t('candidates.col_health', 'Health Index')}</th>
                    <th className="p-3">{t('candidates.col_recruiter', 'Recruiter')}</th>
                    <th className="p-3 text-right">{t('candidates.col_actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--outline-variant)]/30">
                  {paginatedCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--surface-container)]/40 transition-colors">
                      <td className="p-3">
                        <span className="font-semibold text-[var(--foreground)] block">{c.name}</span>
                        <span className="text-[10px] text-[var(--outline)]">
                          {c.candidateId} • {c.email}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--on-surface-variant)]">{t(c.currentStage, c.currentStage)}</td>
                      <td className="p-3 text-[var(--foreground)] font-semibold">
                        {c.timeInStageDays} {t('common.days', 'days')}
                      </td>
                      <td className="p-3">
                        <StatusBadge
                          label={`${c.healthIndex}/100`}
                          variant={c.healthIndex < 50 ? 'critical' : c.healthIndex < 75 ? 'warning' : 'healthy'}
                          showPulse={c.healthIndex < 50}
                          glow={c.healthIndex < 50}
                          size="xs"
                        />
                      </td>
                      <td className="p-3 text-[var(--outline)]">{c.assignedRecruiter}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDiagnose(c)}
                          className="px-2.5 py-1 rounded bg-[var(--surface-container)] hover:bg-[var(--primary-container)] hover:text-[var(--on-primary)] border border-[var(--primary-container)]/40 text-[var(--primary)] text-xs font-mono font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Activity className="w-3 h-3" />
                          <span>{t('candidates.diagnose_btn', 'Diagnose')}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex items-center justify-between text-xs font-mono text-[var(--outline)] pt-3 border-t border-[var(--outline-variant)]/40">
        <span>
          {t('common.showing', 'Showing')} {totalRecords > 0 ? startIndex + 1 : 0}–{endIndex} {t('common.of', 'of')} {totalRecords} {t('common.candidates', 'candidates')}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage <= 1}
            className="p-1.5 rounded bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 text-[var(--foreground)] disabled:opacity-40 hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-[var(--foreground)]">
            {safeCurrentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage >= totalPages}
            className="p-1.5 rounded bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 text-[var(--foreground)] disabled:opacity-40 hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stage Detail Diagnostics Modal Drawer when "Diagnose" clicked */}
      {diagnosingStage && (
        <StageDetailModal
          stage={diagnosingStage}
          onClose={() => {
            setDiagnosingStage(null);
            setDiagnosingCandidate(null);
          }}
        />
      )}
    </div>
  );
}
