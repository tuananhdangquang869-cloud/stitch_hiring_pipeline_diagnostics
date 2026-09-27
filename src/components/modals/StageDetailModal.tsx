'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  BarChart2,
  Download,
  FileText,
  TrendingDown,
  Sparkles,
  Filter,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { FunnelStage, DropReason } from '@/lib/types';
import { useApp } from '@/context/AppContext';

interface StageDetailModalProps {
  stage: FunnelStage;
  dropReasons?: DropReason[];
  onClose: () => void;
}

export function StageDetailModal({ stage, dropReasons: initialDropReasons, onClose }: StageDetailModalProps) {
  const { selectedJob, selectedJobId, t, language } = useApp();
  const [viewMode, setViewMode] = useState<'diagnostic' | 'full_report'>('diagnostic');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [searchCandidate, setSearchCandidate] = useState<string>('');

  const [liveDropReasons, setLiveDropReasons] = useState<DropReason[]>(initialDropReasons || []);
  const [liveCandidates, setLiveCandidates] = useState<any[]>([]);
  const [liveAvgDays, setLiveAvgDays] = useState<number>(stage.avgDaysInStage);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isZeroDropStage = stage.volumeDropped === 0 || stage.name.toLowerCase().includes('hired') || stage.name.toLowerCase().includes('tuyển dụng');

  // Fetch live aggregated stage diagnostics from API
  useEffect(() => {
    let isMounted = true;
    const fetchLiveDiagnostics = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/stage-diagnostics?stageId=${encodeURIComponent(stage.id)}&jobId=${encodeURIComponent(selectedJobId)}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setLiveDropReasons(json.data.dropReasons || []);
            if (json.data.leakages) {
              setLiveCandidates(
                json.data.leakages.map((l: any, i: number) => ({
                  id: l.id || `C-${89000 + i}`,
                  name: l.candidateName,
                  role: l.companyOrigin || selectedJob?.title || 'Engineer',
                  reasonCode: l.reasonCode,
                  reasonLabel: l.reasonLabel,
                  days: l.daysInStage || 10,
                  interviewer: 'Recruiting Ops',
                  note: l.note || `${l.reasonLabel} noted during stage assessment`,
                  date: l.date,
                }))
              );
            }
            if (typeof json.data.avgDaysInStage === 'number') {
              setLiveAvgDays(json.data.avgDaysInStage);
            }
          }
        }
      } catch (err) {
        console.error('Error in StageDetailModal diagnostics fetch:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLiveDiagnostics();
    return () => {
      isMounted = false;
    };
  }, [stage.id, selectedJobId, selectedJob?.title, stage.avgDaysInStage]);

  // Use live candidates or empty if zero drop
  const candidateList = liveCandidates;

  const filteredCandidates = candidateList.filter((c) => {
    const matchesReason = filterReason === 'all' || c.reasonCode === filterReason;
    const matchesSearch =
      c.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
      c.id.toLowerCase().includes(searchCandidate.toLowerCase()) ||
      (c.note && c.note.toLowerCase().includes(searchCandidate.toLowerCase()));
    return matchesReason && matchesSearch;
  });

  const handleExportCSV = () => {
    const csvRows = [
      ['Candidate ID', 'Name', 'Role', 'Reason Code', 'Days in Stage', 'Interviewer', 'Notes'],
      ...filteredCandidates.map((c) => [
        c.id,
        c.name,
        c.role,
        c.reasonCode,
        c.days,
        c.interviewer,
        `"${c.note}"`,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `stage_drop_report_${stage.name.toLowerCase().replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Generate customized recommendation text per stage and top reason
  const getRecommendation = () => {
    if (isZeroDropStage || liveDropReasons.length === 0) {
      return {
        isSuccess: true,
        text:
          language === 'vi'
            ? `Giai đoạn ${t(stage.name, stage.name)} đạt hiệu suất chuyển đổi tối đa (100%). Tiếp tục duy trì quy trình tiếp nhận và chuẩn bị chương trình onboarding 30-60-90 ngày chu đáo cho nhân viên mới.`
            : `The stage "${t(stage.name, stage.name)}" achieved a 100% conversion rate with zero candidate drop-offs. Maintain standard onboarding procedures and new hire ramp-up plans.`,
      };
    }

    const topReason = liveDropReasons[0];
    const code = topReason?.code || '';
    const label = t(topReason?.label || '', topReason?.label || '');
    const pct = topReason?.percentage || 0;

    let advice = '';
    if (code.includes('SALARY')) {
      advice =
        language === 'vi'
          ? 'Khuyến nghị HR sàng lọc khung lương (comp band) ngay từ vòng sơ vấn đầu tiên và rà soát lại dữ liệu mức lương thị trường.'
          : 'Recommend upfront compensation alignment during initial recruiter screen and benchmarking market salary bands.';
    } else if (code.includes('TECH') || code.includes('SYS') || code.includes('IAC')) {
      advice =
        language === 'vi'
          ? 'Khuyến nghị chuẩn hóa rubric chấm điểm, cung cấp tài liệu ôn tập trước vòng kỹ thuật và hiệu chuẩn thang đánh giá giữa các interviewer.'
          : 'Recommend standardizing technical evaluation rubrics, providing prep materials, and calibrating panel interviewers.';
    } else if (code.includes('COMPETITOR')) {
      advice =
        language === 'vi'
          ? 'Khuyến nghị rút ngắn thời gian gửi offer xuống dưới 48 giờ và tối ưu gói cổ phần (equity) hoặc thưởng nhận việc (sign-on bonus).'
          : 'Recommend accelerating offer turnaround to under 48 hours and optimizing equity/sign-on incentive structures.';
    } else if (code.includes('PORTFOLIO') || code.includes('RESUME') || code.includes('K8S')) {
      advice =
        language === 'vi'
          ? 'Khuyến nghị hiệu chuẩn lại bản mô tả công việc (JD) và tinh chỉnh bộ lọc từ khóa ứng viên đầu vào.'
          : 'Recommend calibrating Job Descriptions and refining initial sourcing filters to attract higher-fit applicants.';
    } else if (code.includes('DESIGN') || code.includes('FLOW') || code.includes('INTERACTION')) {
      advice =
        language === 'vi'
          ? 'Khuyến nghị cung cấp đề bài thiết kế rõ ràng và hướng dẫn cụ thể về tiêu chuẩn Design System.'
          : 'Recommend providing clearer challenge briefs and explicit guidelines on Design System standards.';
    } else if (code.includes('CASE') || code.includes('DATA')) {
      advice =
        language === 'vi'
          ? 'Khuyến nghị cung cấp bộ dữ liệu mẫu chuẩn và khung tiêu chí đánh giá chiến lược sản phẩm.'
          : 'Recommend sharing sample datasets and structured business strategy evaluation frameworks.';
    } else if (code.includes('GHOST') || code.includes('SLOW')) {
      advice =
        language === 'vi'
          ? 'Khuyến nghị tự động hóa lịch hẹn phỏng vấn và gửi thông báo nhắc lịch đa kênh trước 24 giờ.'
          : 'Recommend automating interview scheduling and sending multi-channel calendar reminders 24h prior.';
    } else {
      advice =
        language === 'vi'
          ? 'Khuyến nghị rà soát và tối ưu các tiêu chí đánh giá ứng viên tại giai đoạn này.'
          : 'Recommend reviewing and optimizing candidate evaluation criteria for this stage.';
    }

    const fullText =
      language === 'vi'
        ? `Điểm rò rỉ ứng viên lớn nhất tại giai đoạn ${t(stage.name, stage.name)} chủ yếu do ${label} (${pct}%). ${advice}`
        : `The primary leakage in ${t(stage.name, stage.name)} is driven by ${label} (${pct}%). ${advice}`;

    return {
      isSuccess: false,
      text: fullText,
    };
  };

  const rec = getRecommendation();

  return (
    <div className="fixed inset-0 z-50 bg-[var(--surface-container-lowest)]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 pb-20 lg:pb-6 overflow-y-auto">
      <div
        className={`w-full bg-[var(--background)] border border-[var(--outline-variant)] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 transition-all ${
          viewMode === 'full_report' ? 'max-w-4xl max-h-[88vh]' : 'max-w-2xl max-h-[82vh]'
        }`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--outline-variant)]/40 flex items-center justify-between bg-[var(--surface-container-low)]/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--surface-container)] border border-[var(--primary-container)]/50 flex items-center justify-center text-[var(--primary-container)] shadow-md shadow-[var(--primary-container)]/10 shrink-0">
              {viewMode === 'full_report' ? (
                <FileText className="w-5 h-5" />
              ) : (
                <BarChart2 className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)] truncate">
                  {viewMode === 'full_report'
                    ? `${t('modal.stage_detail_title', 'Full Report')}: ${t(stage.name, stage.name)}`
                    : `${t('modal.stage_detail_title', 'Stage Detail')}: ${t(stage.name, stage.name)}`}
                </h3>
                <span className="px-2 py-0.5 rounded bg-[var(--surface-container-high)] border border-[var(--primary-container)]/40 text-[var(--primary)] text-[10px] font-mono font-bold shrink-0">
                  {selectedJob?.reqCode || 'REQ-142'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[var(--outline)] font-mono mt-0.5 truncate">
                {viewMode === 'full_report'
                  ? t('modal.stage_detail_desc', 'Root-cause analysis & candidate drop records')
                  : t('modal.stage_detail_desc', 'Diagnostic summary computed from live candidate rows')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {viewMode === 'full_report' && candidateList.length > 0 && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[var(--primary)] text-xs font-mono transition-colors cursor-pointer"
                title="Download CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('common.export', 'Export .csv')}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-container)] text-[var(--outline)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-3 rounded-xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60">
              <span className="text-[10px] font-mono text-[var(--outline)] uppercase block">
                {t('funnel.volume_in', 'Volume In')}
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)]">
                {stage.volumeIn}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60">
              <span className="text-[10px] font-mono text-[var(--outline)] uppercase block">
                {t('funnel.volume_passed', 'Passed Through')}
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-[var(--severity-healthy)]">
                {stage.volumePassed}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60">
              <span className="text-[10px] font-mono text-[var(--outline)] uppercase block">
                {t('funnel.volume_dropped', 'Dropped / Leaked')}
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-[var(--severity-critical-muted)]">
                {stage.volumeDropped} ({Math.round(stage.dropRate)}%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60">
              <span className="text-[10px] font-mono text-[var(--outline)] uppercase block">
                {t('candidates.col_time_in_stage', 'Avg Time in Stage')}
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-[var(--foreground)]">
                {liveAvgDays} {t('common.days', 'd')}
              </span>
              <span className="text-[9px] font-mono text-[var(--severity-critical-muted)] block">
                {t('funnel.sla_target', 'Target:')} {stage.targetDaysInStage}{t('common.days', 'd')}
              </span>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between gap-3 border-b border-[var(--outline-variant)]/40 pb-3">
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60">
              <button
                onClick={() => setViewMode('diagnostic')}
                className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  viewMode === 'diagnostic'
                    ? 'bg-[var(--surface-container-high)] text-[var(--foreground)] font-bold shadow'
                    : 'text-[var(--outline)] hover:text-[var(--foreground)]'
                }`}
              >
                {t('modal.diagnostic_summary', 'Diagnostic Summary')}
              </button>
              <button
                onClick={() => setViewMode('full_report')}
                className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  viewMode === 'full_report'
                    ? 'bg-[var(--surface-container-high)] text-[var(--foreground)] font-bold shadow'
                    : 'text-[var(--outline)] hover:text-[var(--foreground)]'
                }`}
              >
                {t('modal.full_candidate_report', 'Full Candidate Report')} ({candidateList.length})
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: DIAGNOSTIC SUMMARY */}
          {viewMode === 'diagnostic' && (
            <div className="space-y-5">
              {/* Drop-off Reason Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--outline)] flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-[var(--severity-critical-muted)]" />
                    <span>{t('funnel.drop_reasons_title', 'Drop-off Reasons')}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--primary-container)]">
                    {liveDropReasons.length} {t('modal.factors_count', 'factors')}
                  </span>
                </div>

                {isZeroDropStage || liveDropReasons.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[var(--surface-container-low)]/60 border border-[var(--severity-healthy)]/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--severity-healthy-container)] border border-[var(--severity-healthy)]/40 flex items-center justify-center text-[var(--severity-healthy)] shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--severity-healthy)] font-mono">
                        {language === 'vi' ? 'Hiệu suất chuyển đổi hoàn hảo (100%)' : 'Optimal 100% Stage Conversion'}
                      </p>
                      <p className="text-[11px] text-[var(--outline)] mt-0.5">
                        {language === 'vi'
                          ? 'Không ghi nhận trường hợp rớt hay hao hụt ứng viên tại giai đoạn này.'
                          : 'No candidate drop-offs or leakages recorded in this stage.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {liveDropReasons.map((reason) => (
                      <div
                        key={reason.code}
                        className="p-3.5 rounded-xl bg-[var(--surface-container-low)]/60 border border-[var(--outline-variant)]/50 hover:border-[var(--primary-container)]/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                          <span className="font-semibold text-[var(--foreground)]">
                            {t(reason.label, reason.label)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--outline)]">
                              {reason.count} {t('common.candidates', 'candidates')}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[var(--surface-container)] border border-[var(--outline-variant)] text-[var(--severity-warning)] font-bold">
                              {reason.percentage}%
                            </span>
                          </div>
                        </div>

                        {/* Bar */}
                        <div className="w-full bg-[var(--background)] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
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

              {/* Recommended Action Card */}
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  rec.isSuccess
                    ? 'bg-[var(--surface-container-low)] border-[var(--severity-healthy)]/40 text-[var(--severity-healthy)]'
                    : 'bg-[var(--surface-container)] border-[var(--severity-warning)]/40 text-[var(--severity-warning)]'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold font-mono">
                  {rec.isSuccess ? <CheckCircle2 className="w-4 h-4 text-[var(--severity-healthy)]" /> : <Sparkles className="w-4 h-4 text-[var(--severity-warning)]" />}
                  <span>{t('modal.stage_detail_rec_title', 'Recommended Diagnostic Action')}</span>
                </div>
                <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                  {rec.text}
                </p>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: FULL CANDIDATE REPORT */}
          {viewMode === 'full_report' && (
            <div className="space-y-4">
              {/* Search and Reason Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative flex-1 w-full">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
                  <input
                    type="text"
                    placeholder={t('candidates.search_placeholder', 'Search candidate name, ID or notes...')}
                    value={searchCandidate}
                    onChange={(e) => setSearchCandidate(e.target.value)}
                    className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--outline)] focus:outline-none focus:border-[var(--primary-container)] font-mono"
                  />
                </div>

                {liveDropReasons.length > 0 && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-3.5 h-3.5 text-[var(--outline)]" />
                    <select
                      value={filterReason}
                      onChange={(e) => setFilterReason(e.target.value)}
                      className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded-lg px-2.5 py-1.5 text-xs text-[var(--foreground)] font-mono focus:border-[var(--primary-container)] outline-none w-full sm:w-auto"
                    >
                      <option value="all">{t('common.all', 'All Reasons')}</option>
                      {liveDropReasons.map((r) => (
                        <option key={r.code} value={r.code}>
                          {t(r.label, r.label)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Candidates Table */}
              {filteredCandidates.length === 0 ? (
                <div className="p-8 text-center border border-[var(--outline-variant)]/60 rounded-xl bg-[var(--surface-container-low)]/40">
                  <CheckCircle2 className="w-8 h-8 text-[var(--severity-healthy)] mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-mono text-[var(--foreground)] font-semibold">
                    {language === 'vi' ? 'Không có hồ sơ rớt hoặc rò rỉ tại giai đoạn này.' : 'No dropped candidate records for this stage.'}
                  </p>
                  <p className="text-[11px] text-[var(--outline)] font-mono mt-1">
                    {language === 'vi'
                      ? 'Tất cả ứng viên đều được chuyển tiếp hoặc đang trong trạng thái xử lý tích cực.'
                      : 'All candidates have passed through or are actively progressing.'}
                  </p>
                </div>
              ) : (
                <div className="border border-[var(--outline-variant)]/60 rounded-xl overflow-hidden bg-[var(--surface-container-low)]/40">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono min-w-[620px]">
                      <thead className="bg-[var(--surface-container)] border-b border-[var(--outline-variant)]/60 text-[11px] text-[var(--outline)]">
                        <tr>
                          <th className="p-3">{t('candidates.col_candidate', 'Candidate')}</th>
                          <th className="p-3">{t('funnel.drop_reasons_title', 'Drop Reason')}</th>
                          <th className="p-3">{t('candidates.col_time_in_stage', 'Days in Stage')}</th>
                          <th className="p-3">{t('candidates.col_recruiter', 'Interviewer / Notes')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--outline-variant)]/30">
                        {filteredCandidates.map((c) => (
                          <tr key={c.id} className="hover:bg-[var(--surface-container)]/40 transition-colors">
                            <td className="p-3">
                              <span className="font-semibold text-[var(--foreground)] block">{c.name}</span>
                              <span className="text-[10px] text-[var(--outline)]">
                                {c.id} • {c.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  c.reasonCode?.includes('SALARY')
                                    ? 'bg-[var(--severity-warning-container)] text-[var(--severity-warning)]'
                                    : c.reasonCode?.includes('TECH')
                                    ? 'bg-[var(--severity-critical-container)] text-[var(--severity-critical-muted)]'
                                    : 'bg-[var(--surface-container)] text-[var(--primary)]'
                                }`}
                              >
                                {t(c.reasonLabel || c.reasonCode, c.reasonLabel || c.reasonCode)}
                              </span>
                            </td>
                            <td className="p-3 text-[var(--foreground)] font-semibold">{c.days} {t('common.days', 'days')}</td>
                            <td className="p-3 text-[var(--on-surface-variant)] max-w-xs truncate" title={c.note}>
                              {c.note || 'Assessment debrief logged'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--outline-variant)]/40 bg-[var(--surface-container-low)]/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-[var(--outline)]">
            {t(stage.name, stage.name)} • {stage.volumeIn} {t('modal.total_evaluated', 'total candidates evaluated')}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[var(--primary-container)] text-[var(--on-primary)] text-xs font-bold font-mono hover:brightness-110 transition-all cursor-pointer"
          >
            {t('common.close', 'Close Diagnostics')}
          </button>
        </div>
      </div>
    </div>
  );
}
