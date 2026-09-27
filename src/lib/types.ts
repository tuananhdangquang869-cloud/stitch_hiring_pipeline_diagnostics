export interface JobRequisition {
  id: string;
  reqCode: string;
  title: string;
  department: string;
  status: 'ACTIVE' | 'PAUSED' | 'CLOSED';
  hiringManager: string;
  targetDaysToFill: number;
  totalApplicants: number;
  conversionRate: number;
  conversionTrend: string;
  funnelHealth: 'Good' | 'Needs Attention' | 'Critical';
  avgTimeToHireDays: number;
  timeVsPrevTrend: number;
  primaryBottleneck: string;
  bottleneckDropRate: number;
}

export interface FunnelStage {
  id: string;
  name: string;
  stageOrder: number;
  volumeIn: number;
  volumePassed: number;
  volumeDropped: number;
  dropRate: number;
  avgDaysInStage: number;
  targetDaysInStage: number;
  isBottleneck?: boolean;
  benchmarkDropRate?: number;
  benchmarkConversionRate?: number;
  benchmarkAvgDays?: number;
}

export interface DropReason {
  code: string;
  label: string;
  count: number;
  percentage: number;
}

export interface CandidateLeakage {
  id: string;
  candidateName: string;
  companyOrigin?: string;
  reasonCode: string;
  reasonLabel: string;
  daysInStage: number;
  date: string;
}

export interface Candidate {
  id: string;
  candidateId: string;
  name: string;
  email: string;
  role: string;
  jobId: string;
  currentStage: string;
  timeInStageDays: number;
  healthIndex: number; // 0-100
  assignedRecruiter: string;
  status: 'ACTIVE' | 'DROPPED' | 'HIRED';
  dropReasonCode?: string;
  dropReasonDetail?: string;
  companyOrigin?: string;
  avatarUrl?: string;
}

export type TimeRangePreset = '7D' | '30D' | '90D' | 'YTD' | 'ALL';

export interface TimelineDataPoint {
  date: string;
  displayDate: string;
  applied: number;
  screened: number;
  techInterview: number;
  offer: number;
  hired: number;
  dropped: number;
  avgDays: number;
}

export interface CohortCell {
  week: string;
  channel: string;
  applicants: number;
  passThroughRate: number; // percentage
  hiredCount: number;
  avgVelocityDays: number;
  status: 'optimal' | 'moderate' | 'lagging' | 'critical';
}

export interface CohortChannelRow {
  channelId: string;
  channelName: string;
  iconName: string;
  totalCandidates: number;
  avgConversion: number;
  avgVelocityDays: number;
  weeks: CohortCell[];
}
