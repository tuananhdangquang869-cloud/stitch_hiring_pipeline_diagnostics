'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingDown,
  AlertTriangle,
  Download,
  Plus,
  Search,
  ChevronRight,
  Activity,
  Layers,
  ExternalLink,
  Briefcase,
  Sparkles,
  X,
  CheckCircle2,
  BarChart3,
  Grid,
  GitCommit,
  Sliders,
  Maximize2,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DropReason, CandidateLeakage, FunnelStage, TimeRangePreset, TimelineDataPoint } from '@/lib/types';
import { mockJobTimelines, mockCohortData } from '@/lib/mock-data';
import { StageDetailModal } from '@/components/modals/StageDetailModal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FunnelDashboardSkeleton } from '@/components/ui/Skeleton';
import { DropOffWaterfallChart } from './charts/DropOffWaterfallChart';
import { CohortAnalysisHeatmap } from './charts/CohortAnalysisHeatmap';
import { FunnelTimeScrubber } from './charts/FunnelTimeScrubber';
import { ChartExportActions } from './charts/ChartExportActions';
import { FunnelChartTooltip } from './charts/FunnelChartTooltip';
import { SynchronizedTimelineCharts } from './charts/SynchronizedTimelineCharts';
import { ChartEmptyState } from '@/components/ui/ChartEmptyState';

export function FunnelDashboard() {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    selectedJob,
    currentStages,
    stagesByJob,
    isStageModalOpen,
    setIsStageModalOpen,
    setIsNewJobModalOpen,
    isLoadingFunnel,
    t,
  } = useApp();

  const [selectedStageId, setSelectedStageId] = useState<string>('stage-3');
  const [searchJobQuery, setSearchJobQuery] = useState<string>('');
  const [showMobileInspector, setShowMobileInspector] = useState<boolean>(false);
  const [modalStage, setModalStage] = useState<FunnelStage | null>(null);

  // Section 2 Interactive State
  const [activeVisualizationView, setActiveVisualizationView] = useState<'funnel' | 'waterfall' | 'cohort' | 'synchronized'>('funnel');
  const [timePreset, setTimePreset] = useState<TimeRangePreset>('ALL');
  const [timelineMultiplier, setTimelineMultiplier] = useState<number>(1.0);

  // Live Stage Diagnostics State
  const [stageDropReasons, setStageDropReasons] = useState<DropReason[]>([]);
  const [stageLeakages, setStageLeakages] = useState<CandidateLeakage[]>([]);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState<boolean>(false);
  const [computedAvgDays, setComputedAvgDays] = useState<number>(12.4);

  const baseStages = currentStages && currentStages.length > 0
    ? currentStages
    : stagesByJob[selectedJobId] || stagesByJob['req-142'] || [];

  // Dynamically scale stage volume according to the time scrubber window
  const stages = useMemo(() => {
    return baseStages.map((s) => {
      const volIn = Math.max(1, Math.round(s.volumeIn * timelineMultiplier));
      const volDrop = Math.round(volIn * (s.dropRate / 100));
      const volPass = volIn - volDrop;
      return {
        ...s,
        volumeIn: volIn,
        volumePassed: volPass,
        volumeDropped: volDrop,
      };
    });
  }, [baseStages, timelineMultiplier]);

  const selectedStage =
    stages.find((s) => s.id === selectedStageId) ||
    stages.find((s) => s.isBottleneck) ||
    stages[0] || {
      id: 'stage-3',
      name: 'Tech Interview',
      stageOrder: 3,
      volumeIn: 224,
      volumePassed: 64,
      volumeDropped: 160,
      dropRate: 71.4,
      avgDaysInStage: 12.4,
      targetDaysInStage: 8.0,
      isBottleneck: true,
      benchmarkDropRate: 52.0,
      benchmarkConversionRate: 48.0,
      benchmarkAvgDays: 7.5,
    };

  // Timeline dataset for selected job
  const jobTimeline = useMemo(() => {
    return mockJobTimelines[selectedJobId] || mockJobTimelines['req-142'] || [];
  }, [selectedJobId]);

  // Cohort dataset for selected job
  const jobCohorts = useMemo(() => {
    return mockCohortData[selectedJobId] || mockCohortData['req-142'] || [];
  }, [selectedJobId]);

  // Fetch live stage diagnostics whenever selectedStage or selectedJob changes
  useEffect(() => {
    let isMounted = true;
    const fetchStageDiagnostics = async () => {
      if (!selectedStage?.id) return;
      setIsLoadingDiagnostics(true);
      try {
        const res = await fetch(
          `/api/stage-diagnostics?stageId=${encodeURIComponent(selectedStage.id)}&jobId=${encodeURIComponent(selectedJobId)}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setStageDropReasons(json.data.dropReasons || []);
            setStageLeakages(json.data.leakages || []);
            if (typeof json.data.avgDaysInStage === 'number') {
              setComputedAvgDays(json.data.avgDaysInStage);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching stage diagnostics:', err);
      } finally {
        if (isMounted) setIsLoadingDiagnostics(false);
      }
    };

    fetchStageDiagnostics();
    return () => {
      isMounted = false;
    };
  }, [selectedStage?.id, selectedJobId]);

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchJobQuery.toLowerCase()) ||
      j.reqCode.toLowerCase().includes(searchJobQuery.toLowerCase())
  );

  const handleOpenStageModal = (stageToOpen?: FunnelStage) => {
    setModalStage(stageToOpen || selectedStage);
    setIsStageModalOpen(true);
  };

  const handleScrubberRangeChange = (
    startIndex: number,
    endIndex: number,
    filteredPoints: TimelineDataPoint[]
  ) => {
    const totalPoints = jobTimeline.length || 1;
    const ratio = Math.max(0.1, filteredPoints.length / totalPoints);
    setTimelineMultiplier(ratio);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] bg-[var(--background)]">
      {/* MOBILE ONLY: Horizontal Job Selection Chips */}
      <div className="lg:hidden p-3 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]/40 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {jobs.map((job) => {
            const isSelected = job.id === selectedJobId;
            return (
              <button
                key={job.id}
                onClick={() => {
                  setSelectedJobId(job.id);
                  const jobStages = stagesByJob[job.id] || [];
                  if (jobStages.length > 0) {
                    const bottleneck = jobStages.find((s) => s.isBottleneck) || jobStages[0];
                    setSelectedStageId(bottleneck.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-bold shadow-md shadow-[var(--primary-container)]/20'
                    : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:text-[var(--foreground)] border border-[var(--outline-variant)]/60'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>{job.title}</span>
                <span className="text-[10px] opacity-80">({job.totalApplicants})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. DESKTOP LEFT COLUMN: Requisition Picker */}
      <div className="hidden lg:flex w-60 xl:w-64 bg-[var(--background)] border-r border-[var(--outline-variant)]/40 flex-col justify-between shrink-0 select-none">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Job Search Box */}
          <div className="p-3 border-b border-[var(--outline-variant)]/30">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
              <input
                type="text"
                placeholder={t('funnel.search_job_placeholder', 'Search Jobs...')}
                value={searchJobQuery}
                onChange={(e) => setSearchJobQuery(e.target.value)}
                className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded px-7 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--outline)] focus:outline-none focus:border-[var(--primary-container)] font-mono"
              />
            </div>
          </div>

          {/* Job Cards List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredJobs.map((job) => {
              const isSelected = job.id === selectedJobId;
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    const jobStages = stagesByJob[job.id] || [];
                    if (jobStages.length > 0) {
                      const bottleneck = jobStages.find((s) => s.isBottleneck) || jobStages[0];
                      setSelectedStageId(bottleneck.id);
                    }
                  }}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--surface-container)] border-[var(--primary-container)] shadow-md shadow-[var(--primary-container)]/10'
                      : 'bg-[var(--surface-container-low)]/60 border-[var(--outline-variant)]/40 hover:border-[var(--outline)]/60 hover:bg-[var(--surface-container-low)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-[var(--foreground)] line-clamp-1">
                      {job.title}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--outline)] ml-1 shrink-0">
                      {job.reqCode.replace('REQ-', '#')}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        job.department === 'ENGINEERING'
                          ? 'bg-[var(--severity-info-container)] text-[var(--severity-info)]'
                          : job.department === 'PRODUCT'
                          ? 'bg-[var(--severity-warning-container)] text-[var(--severity-warning)]'
                          : 'bg-[var(--severity-healthy-container)] text-[var(--severity-healthy)]'
                      }`}
                    >
                      {t(job.department, job.department)}
                    </span>
                    <span
                      className={`font-semibold ${
                        job.conversionTrend?.startsWith('+') ? 'text-[var(--severity-healthy)]' : 'text-[var(--severity-warning)]'
                      }`}
                    >
                      {job.conversionTrend}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action: New Requisition */}
        <div className="p-3 border-t border-[var(--outline-variant)]/30">
          <button
            onClick={() => setIsNewJobModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-[var(--primary-container)] text-[var(--on-primary)] text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-[var(--primary-container)]/20 font-mono cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('funnel.add_job', 'New Requisition')}</span>
          </button>
        </div>
      </div>

      {/* 2. CENTER COLUMN: Analytics, Charts & Funnel Canvas */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 bg-[var(--background)] relative grid-bg-overlay space-y-5">
        {isLoadingFunnel ? (
          <FunnelDashboardSkeleton />
        ) : (
          <>
            {/* Top 3 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Card 1: Avg Time to Hire */}
              <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 rounded-xl p-4 shadow-sm hover:border-[var(--primary)]/60 card-interactive">
                <span className="label-meta text-[var(--outline)]">
                  {t('funnel.metric_avg_time', 'AVG. TIME TO HIRE')}
                </span>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold metric-val text-[var(--foreground)]">
                    {selectedJob.avgTimeToHireDays}
                  </span>
                  <span className="text-xs text-[var(--outline)] font-mono">{t('common.days', 'days')}</span>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[var(--severity-healthy)] font-mono">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{selectedJob.timeVsPrevTrend} {t('common.days', 'days')} vs prev</span>
                </div>
              </div>

              {/* Card 2: Overall Conversion */}
              <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)]/60 rounded-xl p-4 shadow-sm hover:border-[var(--primary)]/60 card-interactive">
                <span className="label-meta text-[var(--outline)]">
                  {t('funnel.metric_conversion_rate', 'OVERALL CONVERSION')}
                </span>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold metric-val text-[var(--primary-container)]">
                    {selectedJob.conversionRate}
                  </span>
                  <span className="text-xs text-[var(--outline)] font-mono">%</span>
                </div>
                <div className="mt-3 w-full bg-[var(--surface-container-low)] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--primary-container)] h-full rounded-full"
                    style={{ width: `${Math.min(selectedJob.conversionRate * 10, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Card 3: Primary Bottleneck */}
              <div className="bg-[var(--surface-container)] border border-[var(--severity-critical-container)]/50 rounded-xl p-4 shadow-sm relative overflow-hidden card-interactive">
                <div className="absolute right-2 top-2 w-12 h-12 bg-[var(--severity-critical-muted)]/5 rounded-full blur-xl pointer-events-none"></div>
                <span className="label-meta text-[var(--severity-critical-muted)] font-bold">
                  {t('funnel.bottleneck_badge', 'PRIMARY BOTTLENECK')}
                </span>
                <div className="mt-1.5 text-lg sm:text-xl font-bold heading-tight text-[var(--foreground)] truncate">
                  {t(selectedJob.primaryBottleneck, selectedJob.primaryBottleneck)}
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[var(--severity-critical-muted)] font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-[var(--severity-critical-muted)]" />
                  <span>{selectedJob.bottleneckDropRate}% {t('funnel.metric_bottleneck_drop', 'drop-off rate')}</span>
                </div>
              </div>
            </div>

            {/* Item 13: Time Scrubber Component */}
            <FunnelTimeScrubber
              timelineData={jobTimeline}
              selectedPreset={timePreset}
              onPresetChange={setTimePreset}
              onRangeChange={handleScrubberRangeChange}
            />

            {/* Visualization Canvas Container */}
            <div
              id="funnel-visualization-container"
              className="bg-[var(--surface-container-low)]/80 border border-[var(--outline-variant)]/50 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm"
            >
              {/* Visualization Header & View Switcher Bar */}
              <div className="no-export flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--outline-variant)]/40 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--primary-container)]" />
                  <h3 className="text-sm font-bold text-[var(--foreground)] font-sans tracking-wide">
                    {selectedJob.title} — Analytics & Diagnostics
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* View Mode Tabs */}
                  <div className="bg-[var(--surface-container-low)] p-0.5 rounded-lg border border-[var(--outline-variant)]/60 flex items-center font-mono text-xs">
                    <button
                      onClick={() => setActiveVisualizationView('funnel')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        activeVisualizationView === 'funnel'
                          ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-bold shadow-xs'
                          : 'text-[var(--outline)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      <GitCommit className="w-3 h-3" />
                      <span>Funnel Flow</span>
                    </button>
                    <button
                      onClick={() => setActiveVisualizationView('waterfall')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        activeVisualizationView === 'waterfall'
                          ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-bold shadow-xs'
                          : 'text-[var(--outline)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      <BarChart3 className="w-3 h-3" />
                      <span>Drop-Off Waterfall</span>
                    </button>
                    <button
                      onClick={() => setActiveVisualizationView('cohort')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        activeVisualizationView === 'cohort'
                          ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-bold shadow-xs'
                          : 'text-[var(--outline)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      <Grid className="w-3 h-3" />
                      <span>Cohort Heatmap</span>
                    </button>
                    <button
                      onClick={() => setActiveVisualizationView('synchronized')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        activeVisualizationView === 'synchronized'
                          ? 'bg-[var(--primary-container)] text-[var(--on-primary)] font-bold shadow-xs'
                          : 'text-[var(--outline)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>Sync Telemetry</span>
                    </button>
                  </div>

                  {/* Item 16: Export Actions Button */}
                  <ChartExportActions
                    targetElementId="funnel-visualization-container"
                    chartTitle={`${selectedJob.title} ${activeVisualizationView.toUpperCase()} Diagnostics`}
                  />

                  {/* Drawer Open Shortcut */}
                  <button
                    onClick={() => handleOpenStageModal(selectedStage)}
                    className="px-2.5 py-1 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--primary-container)]/40 text-[var(--primary)] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="hidden sm:inline">Deep Dive</span>
                  </button>
                </div>
              </div>

              {/* View 1: Vertical Funnel Flow Representation */}
              {activeVisualizationView === 'funnel' && (
                stages.length === 0 ? (
                  <ChartEmptyState
                    title="No Pipeline Stages Configured"
                    description="This job requisition currently has no active stages or candidates in the pipeline."
                    diagnosticTip="Verify that this requisition is ACTIVE or select another job from the left panel."
                    actionLabel="Select REQ-142 (Default)"
                    onAction={() => setSelectedJobId('req-142')}
                    iconType="chart"
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-4 space-y-3 max-w-2xl mx-auto w-full">
                  {stages.map((stage, idx) => {
                    const isSelected = stage.id === selectedStageId;
                    const maxVol = stages[0]?.volumeIn || 1;
                    const widthPct = Math.max((stage.volumeIn / maxVol) * 100, 34);

                    return (
                      <div key={stage.id} className="w-full flex flex-col items-center group">
                        {/* Stage Container Box */}
                        <div
                          style={{ width: `${widthPct}%` }}
                          className="min-w-[260px] max-w-full transition-all duration-200"
                        >
                          <div
                            onClick={() => {
                              setSelectedStageId(stage.id);
                              setShowMobileInspector(true);
                            }}
                            onDoubleClick={() => handleOpenStageModal(stage)}
                            className={`px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? stage.isBottleneck
                                  ? 'bg-[var(--severity-warning-bg)] border-2 border-[var(--severity-warning)] shadow-lg shadow-[var(--severity-warning)]/15'
                                  : 'bg-[var(--severity-info-bg)] border-2 border-[var(--primary-container)] shadow-lg shadow-[var(--primary-container)]/15'
                                : stage.isBottleneck
                                ? 'bg-[var(--surface-container-high)] border border-[var(--severity-warning)]/60 hover:border-[var(--severity-warning)]'
                                : 'bg-[var(--surface-container)] border border-[var(--outline-variant)]/80 hover:border-[var(--primary)]/80'
                            }`}
                          >
                            {/* Left Stage Name */}
                            <div className="flex items-center gap-2 truncate pr-2">
                              <span className="text-xs font-mono font-bold text-[var(--outline)]">
                                0{stage.stageOrder}
                              </span>
                              <span
                                className={`text-xs font-mono font-semibold tracking-wider truncate ${
                                  isSelected ? 'text-[var(--foreground)]' : 'text-[var(--on-surface-variant)]'
                                }`}
                              >
                                {t(stage.name, stage.name).toUpperCase()}
                              </span>
                            </div>

                            {/* Right Count & Drop Badge */}
                            <div className="flex items-center gap-2 shrink-0 font-mono">
                              <span className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                                {stage.volumeIn.toLocaleString()}
                              </span>
                              {stage.dropRate > 0 && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--severity-critical-muted)]/50 text-[10px] font-bold text-[var(--severity-critical-muted)]">
                                  <span>-{Math.round(stage.dropRate)}%</span>
                                  <TrendingDown className="w-2.5 h-2.5 text-[var(--severity-critical-muted)]" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Flow connection arrow between stages */}
                        {idx < stages.length - 1 && (
                          <div className="my-1 flex flex-col items-center text-[10px] font-mono text-[var(--outline)]">
                            <div className="w-0.5 h-2.5 bg-[var(--outline-variant)]/60"></div>
                            <span className="text-[10px] text-[var(--outline)]">
                              Leak: {stage.volumeDropped} ↗
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* View 2: Drop-Off Waterfall Visualization (Item #14) */}
              {activeVisualizationView === 'waterfall' && (
                <DropOffWaterfallChart
                  stages={stages}
                  selectedStageId={selectedStageId}
                  onSelectStage={(stageId) => {
                    setSelectedStageId(stageId);
                    setShowMobileInspector(true);
                  }}
                />
              )}

              {/* View 3: Cohort Analysis Heatmap (Item #15) */}
              {activeVisualizationView === 'cohort' && (
                <CohortAnalysisHeatmap cohortData={jobCohorts} />
              )}

              {/* View 4: Synchronized Cross-Chart Timeline (Item #18, #19, #20) */}
              {activeVisualizationView === 'synchronized' && (
                <SynchronizedTimelineCharts
                  timelineData={jobTimeline}
                  targetSlaDays={selectedJob.targetDaysToFill || 14}
                  onResetFilter={() => setTimePreset('ALL')}
                />
              )}

              {/* Mobile Button to toggle Inspector Drawer */}
              <div className="lg:hidden mt-4 pt-3 border-t border-[var(--outline-variant)]/30">
                <button
                  onClick={() => setShowMobileInspector(true)}
                  className="w-full py-2 px-3 rounded bg-[var(--surface-container)] border border-[var(--primary-container)]/40 text-[var(--primary)] text-xs font-bold font-mono flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-[var(--severity-warning)]" />
                  <span>{t('common.inspect', 'Inspect')} {t(selectedStage.name, selectedStage.name)}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Drawer Backdrop */}
      {showMobileInspector && (
        <div
          onClick={() => setShowMobileInspector(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* 3. RIGHT COLUMN: Stage Diagnostics Inspector Drawer */}
      <div
        className={`bg-[var(--surface-container-low)] border-l border-[var(--outline-variant)]/40 flex flex-col justify-between shrink-0 select-none overflow-y-auto ${
          showMobileInspector
            ? 'fixed inset-y-0 right-0 z-50 w-full sm:w-96 shadow-2xl flex lg:static lg:inset-auto lg:z-auto lg:w-72 xl:w-80 lg:shadow-none'
            : 'hidden lg:flex lg:w-72 xl:w-80'
        }`}
      >
        <div className="p-4 xl:p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--outline-variant)]/40">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
              <Activity className="w-4 h-4 text-[var(--severity-warning)]" />
              <span>{t('funnel.inspector_title', 'Stage Diagnostics')}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenStageModal(selectedStage)}
                title="Open full detailed view"
                className="p-1 rounded hover:bg-[var(--surface-container)] text-[var(--outline)] hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowMobileInspector(false)}
                className="lg:hidden p-1 rounded hover:bg-[var(--surface-container)] text-[var(--outline)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Stage & SLA Metrics */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[var(--foreground)]">{t(selectedStage.name, selectedStage.name)}</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-container)] border border-[var(--outline-variant)] text-[var(--outline)]">
                Stage {selectedStage.stageOrder}
              </span>
            </div>

            <div className="mt-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--outline)]">
                {t('candidates.col_time_in_stage', 'AVG. TIME IN STAGE')}
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-[var(--foreground)]">
                  {computedAvgDays}
                </span>
                <span className="text-xs text-[var(--outline)]">{t('common.days', 'days')}</span>
                <span className="text-xs font-mono text-[var(--severity-critical-muted)]">
                  +{Math.abs(computedAvgDays - selectedStage.targetDaysInStage).toFixed(1)}d vs target
                </span>
              </div>
            </div>

            {/* Benchmark Comparison Chip */}
            {selectedStage.benchmarkDropRate && (
              <div className="mt-3 p-2 rounded-lg bg-[var(--surface-container)] border border-[var(--outline-variant)]/40 text-[11px] font-mono">
                <div className="flex items-center justify-between text-[var(--outline)] text-[10px]">
                  <span>INDUSTRY BENCHMARK</span>
                  <span>{selectedStage.benchmarkDropRate}% DROP</span>
                </div>
                <div className="mt-1 flex items-center justify-between font-bold">
                  <span className="text-[var(--foreground)]">Our Stage Leakage:</span>
                  <span className={selectedStage.dropRate > selectedStage.benchmarkDropRate ? 'text-[var(--severity-warning)]' : 'text-[var(--severity-healthy)]'}>
                    {selectedStage.dropRate.toFixed(1)}% ({selectedStage.dropRate > selectedStage.benchmarkDropRate ? `+${(selectedStage.dropRate - selectedStage.benchmarkDropRate).toFixed(1)}% higher` : 'Optimal'})
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Drop-off Distribution */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--outline)] uppercase tracking-wider mb-2">
              <span>{t('funnel.drop_reasons_title', 'DROP-OFF DISTRIBUTION')}</span>
              <Layers className="w-3.5 h-3.5" />
            </div>

            {isLoadingDiagnostics ? (
              <div className="space-y-2 animate-pulse py-2">
                <div className="h-3 w-full bg-[var(--outline-variant)]/40 rounded"></div>
                <div className="h-3 w-3/4 bg-[var(--outline-variant)]/40 rounded"></div>
                <div className="h-3 w-1/2 bg-[var(--outline-variant)]/40 rounded"></div>
              </div>
            ) : stageDropReasons.length === 0 ? (
              <div className="p-3 rounded-xl bg-[var(--severity-healthy-container)]/40 border border-[var(--severity-healthy)]/30 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--severity-healthy)] shrink-0" />
                <p className="text-xs text-[var(--severity-healthy)] font-mono leading-tight">
                  {t('funnel.optimal_conversion', '100% tỷ lệ chuyển đổi — Không ghi nhận rò rỉ ứng viên')}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stageDropReasons.map((reason) => (
                  <div key={reason.code} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[var(--on-surface-variant)] truncate pr-1">
                        {t(reason.label, reason.label)}
                      </span>
                      <span className="text-[var(--foreground)] font-semibold shrink-0">
                        {reason.percentage}% ({reason.count})
                      </span>
                    </div>
                    <div className="w-full bg-[var(--background)] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          reason.percentage > 40
                            ? 'bg-[var(--severity-critical-muted)]'
                            : reason.percentage > 25
                            ? 'bg-[var(--severity-warning)]'
                            : 'bg-[var(--primary-container)]'
                        }`}
                        style={{ width: `${reason.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Leakage Log */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--outline)] uppercase tracking-wider mb-2">
              <span>{t('funnel.candidate_leakage_title', 'RECENT LEAKAGE LOG')}</span>
              {stageLeakages.length > 0 && (
                <button
                  onClick={() => {
                    const csvRows = [
                      ['Candidate Name', 'Company Origin', 'Reason Code', 'Reason Label', 'Date'],
                      ...stageLeakages.map((l) => [
                        l.candidateName,
                        l.companyOrigin || 'N/A',
                        l.reasonCode,
                        l.reasonLabel,
                        l.date,
                      ]),
                    ];
                    const csvContent =
                      'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute(
                      'download',
                      `leakage_log_${selectedStage?.name.toLowerCase().replace(/\s+/g, '_') || 'stage'}.csv`
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  }}
                  className="text-[10px] text-[var(--primary-container)] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export .csv</span>
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {stageLeakages.slice(0, 5).map((leak) => (
                <div
                  key={leak.id}
                  className="p-2 rounded bg-[var(--background)]/60 border border-[var(--outline-variant)]/30 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="font-semibold text-[var(--foreground)]">{leak.candidateName}</span>
                    <span className="text-[10px] text-[var(--outline)] block">
                      {leak.companyOrigin || 'Enterprise'} • {leak.daysInStage}d
                    </span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      leak.reasonCode.includes('SALARY')
                        ? 'bg-[var(--severity-warning-container)] text-[var(--severity-warning)]'
                        : leak.reasonCode.includes('TECH')
                        ? 'bg-[var(--severity-critical-container)] text-[var(--severity-critical-muted)]'
                        : 'bg-[var(--surface-container)] text-[var(--primary)]'
                    }`}
                  >
                    {t(leak.reasonLabel || leak.reasonCode, leak.reasonLabel || leak.reasonCode)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Quick Action */}
        <div className="p-4 border-t border-[var(--outline-variant)]/40 bg-[var(--background)]/40">
          <button
            onClick={() => handleOpenStageModal(selectedStage)}
            className="w-full py-2 px-3 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--primary-container)]/40 text-[var(--primary)] text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--severity-warning)]" />
            <span>{t('modal.stage_detail_title', 'Open Deep Root-Cause Analysis')}</span>
          </button>
        </div>
      </div>

      {/* Stage Detail Modal Drawer */}
      {isStageModalOpen && (
        <StageDetailModal
          stage={modalStage || selectedStage}
          dropReasons={stageDropReasons}
          onClose={() => setIsStageModalOpen(false)}
        />
      )}
    </div>
  );
}
