'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  Users,
  Plus,
  Edit,
  PauseCircle,
  ArrowRight,
  Filter,
  ArrowUpDown,
  Search,
  List,
  BarChart3,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockJobs } from '@/lib/mock-data';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function JobManagement() {
  const { jobs, selectedJobId, setSelectedJobId, selectedJob, setIsNewJobModalOpen, t } = useApp();
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [mobileViewTab, setMobileViewTab] = useState<'list' | 'details'>('details');

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      j.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
      j.reqCode.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[var(--background)] h-[calc(100vh-3.5rem)]">
      {/* MOBILE TOGGLE TABS */}
      <div className="lg:hidden p-2 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]/40 flex items-center justify-center gap-2 shrink-0">
        <button
          onClick={() => setMobileViewTab('details')}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all ${
            mobileViewTab === 'details'
              ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-bold shadow-sm'
              : 'text-[var(--outline)] hover:text-[var(--foreground)]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{t('jobs.details_tab', 'Job Details & KPIs')}</span>
        </button>
        <button
          onClick={() => setMobileViewTab('list')}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all ${
            mobileViewTab === 'list'
              ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-bold shadow-sm'
              : 'text-[var(--outline)] hover:text-[var(--foreground)]'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>{t('jobs.list_tab', 'Requisitions List')} ({mockJobs.length})</span>
        </button>
      </div>

      {/* 1. LEFT COLUMN: Requisitions List Drawer */}
      <aside
        className={`w-full lg:w-72 xl:w-80 bg-[var(--background)] border-r border-[var(--outline-variant)]/40 flex flex-col justify-between shrink-0 select-none ${
          mobileViewTab === 'list' ? 'flex flex-1' : 'hidden lg:flex'
        }`}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[var(--outline-variant)]/40 flex items-center justify-between bg-[var(--surface-container-low)]/60">
            <h3 className="text-xs font-bold font-mono text-[var(--foreground)] uppercase tracking-wider">
              {t('exec.active_reqs', 'ACTIVE REQUISITIONS')}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-container)] border border-[var(--outline-variant)] text-[var(--primary)]">
              {mockJobs.length} {t('common.all', 'Total')}
            </span>
          </div>

          {/* Search and Sort/Filter Controls */}
          <div className="p-2 border-b border-[var(--outline-variant)]/30 space-y-2 bg-[var(--background)]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
              <input
                type="text"
                placeholder={t('jobs.filter_placeholder', 'Filter requisitions, req code, department...')}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded px-7 py-1 text-xs text-[var(--foreground)] placeholder-[var(--outline)] font-mono focus:outline-none focus:border-[var(--primary-container)]"
              />
            </div>
            <div className="flex gap-1.5">
              <button className="flex-1 py-1 px-2 rounded bg-[var(--surface-container-low)] hover:bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 text-[11px] font-mono text-[var(--outline)] hover:text-[var(--foreground)] flex items-center justify-center gap-1 transition-colors">
                <ArrowUpDown className="w-3 h-3" />
                <span>{t('common.sort', 'Sort')}</span>
              </button>
              <button className="flex-1 py-1 px-2 rounded bg-[var(--surface-container-low)] hover:bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 text-[11px] font-mono text-[var(--outline)] hover:text-[var(--foreground)] flex items-center justify-center gap-1 transition-colors">
                <Filter className="w-3 h-3" />
                <span>{t('common.filter', 'Filter')}</span>
              </button>
            </div>
          </div>

          {/* Requisitions List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredJobs.map((job) => {
              const isSelected = job.id === selectedJobId;
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setMobileViewTab('details');
                  }}
                  className={`p-3 rounded-xl border cursor-pointer relative overflow-hidden card-interactive ${
                    isSelected
                      ? 'bg-[var(--surface-container)] border-[var(--primary-container)] shadow-md shadow-[var(--primary-container)]/15'
                      : 'bg-[var(--surface-container-low)]/60 border-[var(--outline-variant)]/40 hover:bg-[var(--surface-container-low)] hover:border-[var(--outline)]/60'
                  }`}
                >
                  {/* Left Active Strip */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary-container)] rounded-l"></div>
                  )}

                  <div className="flex justify-between items-start mb-1.5 pl-1">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--foreground)] line-clamp-1 font-sans heading-tight">
                        {job.title}
                      </h4>
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded inline-block mt-1 font-semibold ${
                          job.department === 'ENGINEERING'
                            ? 'bg-[var(--severity-info-container)] text-[var(--severity-info)]'
                            : job.department === 'PRODUCT'
                            ? 'bg-[var(--severity-warning-container)] text-[var(--severity-warning)]'
                            : 'bg-[var(--severity-healthy-container)] text-[var(--severity-healthy)]'
                        }`}
                      >
                        {t(job.department, job.department)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold metric-val text-[var(--foreground)] block">
                        {job.totalApplicants}
                      </span>
                      <span className="text-[10px] text-[var(--outline)] font-mono">{t('common.candidates', 'Apps')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--outline-variant)]/30 pl-1 text-[11px] font-mono">
                    <span className="text-[var(--outline)]">{t('common.rate', 'Conv. Rate')}</span>
                    <div
                      className={`flex items-center gap-1 font-bold ${
                        job.conversionTrend.startsWith('+')
                          ? 'text-[var(--severity-healthy)]'
                          : 'text-[var(--severity-warning)]'
                      }`}
                    >
                      {job.conversionTrend.startsWith('+') ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{job.conversionTrend}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-3 border-t border-[var(--outline-variant)]/40 bg-[var(--surface-container-low)]/60">
          <button
            onClick={() => setIsNewJobModalOpen(true)}
            className="w-full bg-[var(--primary-container)] hover:brightness-110 text-[var(--on-primary)] font-bold text-xs font-mono py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-[var(--primary-container)]/20 cursor-pointer btn-interactive"
          >
            <Plus className="w-4 h-4" />
            <span>{t('jobs.create_job', 'New Job Requisition')}</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT MAIN CANVAS: Selected Requisition Details */}
      <main
        className={`flex-1 bg-[var(--background)] p-4 sm:p-6 lg:p-8 overflow-y-auto ${
          mobileViewTab === 'details' ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Section for Selected Job */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--outline-variant)]/40 pb-5">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                  {selectedJob.title}
                </h2>
                <StatusBadge
                  label={t('common.active', 'Active')}
                  variant="active"
                  showPulse={true}
                  glow={true}
                  size="xs"
                />
              </div>
              <p className="text-xs font-mono text-[var(--outline)]">
                {selectedJob.reqCode} • {t('jobs.hiring_manager', 'Hiring Manager:')}{' '}
                <span className="text-[var(--foreground)]">{selectedJob.hiringManager}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewJobModalOpen(true)}
                className="bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] border border-[var(--outline-variant)] px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-[var(--outline)]" />
                <span>{t('jobs.edit_job', 'Configure')}</span>
              </button>
              <button
                onClick={() => {
                  alert(`Requisition ${selectedJob.reqCode} status toggled.`);
                }}
                className="bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] text-[var(--foreground)] border border-[var(--outline-variant)] px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PauseCircle className="w-3.5 h-3.5 text-[var(--severity-warning)]" />
                <span>{selectedJob.status === 'ACTIVE' ? t('jobs.pause_job', 'Pause Requisition') : t('jobs.resume_job', 'Resume')}</span>
              </button>
            </div>
          </div>

          {/* Bento Grid KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* KPI 1: Total Applicants */}
            <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 rounded-xl p-5 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-[var(--outline)] uppercase tracking-wider">
                  {t('funnel.metric_total_vol', 'TOTAL APPLICANTS')}
                </span>
                <Users className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-[var(--foreground)]">
                  {selectedJob.totalApplicants}
                </span>
                <div className="w-full bg-[var(--background)] h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--primary-container)] w-[45%] h-full rounded-full"></div>
                </div>
                <p className="text-[10px] font-mono text-[var(--outline)] mt-2 text-right">
                  45% {t('common.rate', 'Capacity')}
                </p>
              </div>
            </div>

            {/* KPI 2: Time to Fill */}
            <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 rounded-xl p-5 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-[var(--outline)] uppercase tracking-wider">
                  {t('exec.avg_time_to_fill', 'TIME TO FILL (EST)')}
                </span>
                <Clock className="w-4 h-4 text-[var(--severity-warning)]" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-[var(--foreground)]">
                  {selectedJob.avgTimeToHireDays}{' '}
                  <span className="text-base text-[var(--outline)]">{t('common.days', 'days')}</span>
                </span>
                <div className="w-full bg-[var(--background)] h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--severity-warning)] w-[70%] h-full rounded-full"></div>
                </div>
                <p className="text-[10px] font-mono text-[var(--severity-warning)] mt-2 text-right">
                  {t('exec.avg_time_trend', 'Approaching SLA Threshold')}
                </p>
              </div>
            </div>

            {/* KPI 3: Funnel Health */}
            <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 rounded-xl p-5 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-[var(--outline)] uppercase tracking-wider">
                  {t('jobs.funnel_health', 'FUNNEL HEALTH')}
                </span>
                <ShieldCheck className="w-4 h-4 text-[var(--severity-healthy)]" />
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-mono text-[var(--severity-healthy)]">
                  {t(selectedJob.funnelHealth, selectedJob.funnelHealth)}
                </span>
                <div className="flex gap-1.5 mt-2">
                  <div className="h-1.5 flex-1 bg-[var(--severity-healthy)] rounded-full"></div>
                  <div className="h-1.5 flex-1 bg-[var(--severity-healthy)] rounded-full"></div>
                  <div className="h-1.5 flex-1 bg-[var(--severity-healthy)] rounded-full"></div>
                  <div className="h-1.5 flex-1 bg-[var(--surface-container-high)] rounded-full"></div>
                </div>
                <p className="text-[10px] font-mono text-[var(--outline)] mt-2 text-right">
                  Pass Rate: {selectedJob.conversionRate}%
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions / Link to Funnel & Candidates */}
          <div className="border border-[var(--outline-variant)]/50 rounded-xl p-5 sm:p-6 bg-[var(--surface-container-low)]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)]">
                {t('jobs.diagnose_funnel', 'Deep Pipeline Diagnostics for')} {selectedJob.title}
              </h3>
              <p className="text-xs text-[var(--outline)] font-mono mt-1">
                {t('exec.deep_funnel_card_desc', 'View stage bottlenecks, drop-off leakages, and candidate health scores.')}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="flex-1 sm:flex-none px-4 py-2 rounded bg-[var(--primary-container)] text-[var(--on-primary)] font-bold text-xs font-mono hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[var(--primary-container)]/20"
              >
                <span>{t('nav.funnel', 'Funnel Analytics')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/candidates"
                className="flex-1 sm:flex-none px-4 py-2 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[var(--foreground)] text-xs font-mono text-center transition-colors"
              >
                <span>{t('nav.candidates', 'Candidates')}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
