import { JobRequisition, FunnelStage, DropReason, CandidateLeakage, Candidate } from './types';

export const mockJobs: JobRequisition[] = [
  {
    id: 'req-142',
    reqCode: 'REQ-142',
    title: 'Sr. Backend Engineer',
    department: 'ENGINEERING',
    status: 'ACTIVE',
    hiringManager: 'Sarah Jenkins',
    targetDaysToFill: 30,
    totalApplicants: 845,
    conversionRate: 4.2,
    conversionTrend: '+4.2%',
    funnelHealth: 'Good',
    avgTimeToHireDays: 18,
    timeVsPrevTrend: -2.4,
    primaryBottleneck: 'Tech Interview',
    bottleneckDropRate: 42.0,
  },
  {
    id: 'req-89',
    reqCode: 'REQ-89',
    title: 'Product Manager',
    department: 'PRODUCT',
    status: 'ACTIVE',
    hiringManager: 'David Rossi',
    targetDaysToFill: 45,
    totalApplicants: 87,
    conversionRate: 3.1,
    conversionTrend: '-1.1%',
    funnelHealth: 'Needs Attention',
    avgTimeToHireDays: 32,
    timeVsPrevTrend: +5.2,
    primaryBottleneck: 'Initial Screen',
    bottleneckDropRate: 65.0,
  },
  {
    id: 'req-215',
    reqCode: 'REQ-215',
    title: 'UX Designer',
    department: 'DESIGN',
    status: 'ACTIVE',
    hiringManager: 'Elena Rostova',
    targetDaysToFill: 35,
    totalApplicants: 45,
    conversionRate: 5.8,
    conversionTrend: '0.0%',
    funnelHealth: 'Good',
    avgTimeToHireDays: 22,
    timeVsPrevTrend: -1.0,
    primaryBottleneck: 'Portfolio Review',
    bottleneckDropRate: 38.0,
  },
  {
    id: 'req-45',
    reqCode: 'REQ-45',
    title: 'DevOps Engineer',
    department: 'ENGINEERING',
    status: 'CLOSED',
    hiringManager: 'Sarah Jenkins',
    targetDaysToFill: 25,
    totalApplicants: 210,
    conversionRate: 6.4,
    conversionTrend: '+2.8%',
    funnelHealth: 'Good',
    avgTimeToHireDays: 16,
    timeVsPrevTrend: -3.5,
    primaryBottleneck: 'Offer Stage',
    bottleneckDropRate: 20.0,
  },
];

export const mockStagesByJob: Record<string, FunnelStage[]> = {
  'req-142': [
    {
      id: 'stage-1',
      name: 'Applied',
      stageOrder: 1,
      volumeIn: 845,
      volumePassed: 535,
      volumeDropped: 310,
      dropRate: 36.7,
      avgDaysInStage: 2.1,
      targetDaysInStage: 3.0,
      benchmarkDropRate: 40.0,
      benchmarkConversionRate: 60.0,
      benchmarkAvgDays: 3.5,
    },
    {
      id: 'stage-2',
      name: 'Screened',
      stageOrder: 2,
      volumeIn: 535,
      volumePassed: 224,
      volumeDropped: 311,
      dropRate: 58.1,
      avgDaysInStage: 4.5,
      targetDaysInStage: 4.0,
      benchmarkDropRate: 50.0,
      benchmarkConversionRate: 50.0,
      benchmarkAvgDays: 4.0,
    },
    {
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
    },
    {
      id: 'stage-4',
      name: 'Offer',
      stageOrder: 4,
      volumeIn: 64,
      volumePassed: 35,
      volumeDropped: 29,
      dropRate: 45.3,
      avgDaysInStage: 3.2,
      targetDaysInStage: 5.0,
      benchmarkDropRate: 35.0,
      benchmarkConversionRate: 65.0,
      benchmarkAvgDays: 4.0,
    },
    {
      id: 'stage-5',
      name: 'Hired',
      stageOrder: 5,
      volumeIn: 35,
      volumePassed: 35,
      volumeDropped: 0,
      dropRate: 0.0,
      avgDaysInStage: 1.0,
      targetDaysInStage: 2.0,
      benchmarkDropRate: 0.0,
      benchmarkConversionRate: 100.0,
      benchmarkAvgDays: 1.5,
    },
  ],
  'req-89': [
    {
      id: 'stage-89-1',
      name: 'Applied',
      stageOrder: 1,
      volumeIn: 87,
      volumePassed: 42,
      volumeDropped: 45,
      dropRate: 51.7,
      avgDaysInStage: 3.5,
      targetDaysInStage: 3.0,
      benchmarkDropRate: 45.0,
      benchmarkConversionRate: 55.0,
      benchmarkAvgDays: 3.0,
    },
    {
      id: 'stage-89-2',
      name: 'Initial Screen',
      stageOrder: 2,
      volumeIn: 42,
      volumePassed: 18,
      volumeDropped: 24,
      dropRate: 57.1,
      avgDaysInStage: 9.8,
      targetDaysInStage: 5.0,
      isBottleneck: true,
    },
    {
      id: 'stage-89-3',
      name: 'Case Study',
      stageOrder: 3,
      volumeIn: 18,
      volumePassed: 8,
      volumeDropped: 10,
      dropRate: 55.5,
      avgDaysInStage: 11.2,
      targetDaysInStage: 7.0,
    },
    {
      id: 'stage-89-4',
      name: 'Final Panel',
      stageOrder: 4,
      volumeIn: 8,
      volumePassed: 4,
      volumeDropped: 4,
      dropRate: 50.0,
      avgDaysInStage: 5.0,
      targetDaysInStage: 5.0,
    },
    {
      id: 'stage-89-5',
      name: 'Hired',
      stageOrder: 5,
      volumeIn: 4,
      volumePassed: 4,
      volumeDropped: 0,
      dropRate: 0.0,
      avgDaysInStage: 1.0,
      targetDaysInStage: 2.0,
    },
  ],
  'req-215': [
    {
      id: 'stage-215-1',
      name: 'Applied',
      stageOrder: 1,
      volumeIn: 45,
      volumePassed: 30,
      volumeDropped: 15,
      dropRate: 33.3,
      avgDaysInStage: 2.0,
      targetDaysInStage: 3.0,
    },
    {
      id: 'stage-215-2',
      name: 'Portfolio Review',
      stageOrder: 2,
      volumeIn: 30,
      volumePassed: 12,
      volumeDropped: 18,
      dropRate: 60.0,
      avgDaysInStage: 8.5,
      targetDaysInStage: 4.0,
      isBottleneck: true,
    },
    {
      id: 'stage-215-3',
      name: 'Design Challenge',
      stageOrder: 3,
      volumeIn: 12,
      volumePassed: 6,
      volumeDropped: 6,
      dropRate: 50.0,
      avgDaysInStage: 6.0,
      targetDaysInStage: 5.0,
    },
    {
      id: 'stage-215-4',
      name: 'Offer',
      stageOrder: 4,
      volumeIn: 6,
      volumePassed: 3,
      volumeDropped: 3,
      dropRate: 50.0,
      avgDaysInStage: 3.0,
      targetDaysInStage: 4.0,
    },
    {
      id: 'stage-215-5',
      name: 'Hired',
      stageOrder: 5,
      volumeIn: 3,
      volumePassed: 3,
      volumeDropped: 0,
      dropRate: 0.0,
      avgDaysInStage: 1.0,
      targetDaysInStage: 2.0,
    },
  ],
  'req-45': [
    {
      id: 'stage-45-1',
      name: 'Applied',
      stageOrder: 1,
      volumeIn: 210,
      volumePassed: 116,
      volumeDropped: 94,
      dropRate: 44.8,
      avgDaysInStage: 1.8,
      targetDaysInStage: 2.5,
    },
    {
      id: 'stage-45-2',
      name: 'Screening',
      stageOrder: 2,
      volumeIn: 116,
      volumePassed: 88,
      volumeDropped: 28,
      dropRate: 24.1,
      avgDaysInStage: 3.6,
      targetDaysInStage: 3.0,
    },
    {
      id: 'stage-45-3',
      name: 'Technical Assessment',
      stageOrder: 3,
      volumeIn: 88,
      volumePassed: 67,
      volumeDropped: 21,
      dropRate: 23.9,
      avgDaysInStage: 5.2,
      targetDaysInStage: 5.0,
    },
    {
      id: 'stage-45-4',
      name: 'Offer',
      stageOrder: 4,
      volumeIn: 67,
      volumePassed: 54,
      volumeDropped: 13,
      dropRate: 19.4,
      avgDaysInStage: 4.1,
      targetDaysInStage: 4.0,
      isBottleneck: true,
    },
    {
      id: 'stage-45-5',
      name: 'Hired',
      stageOrder: 5,
      volumeIn: 54,
      volumePassed: 54,
      volumeDropped: 0,
      dropRate: 0.0,
      avgDaysInStage: 1.0,
      targetDaysInStage: 2.0,
    },
  ],
};

export const mockDropReasonsByStage: Record<string, DropReason[]> = {
  // === REQ-142: Sr. Backend Engineer ===
  'stage-1': [
    { code: 'ERR_RESUME_MISMATCH', label: 'Lack of Distributed Systems Experience', count: 161, percentage: 52 },
    { code: 'ERR_EXP_SENIORITY', label: 'Seniority Level Mismatch (<5 YOE)', count: 74, percentage: 24 },
    { code: 'ERR_LOCATION', label: 'Office / Hybrid Policy Incompatible', count: 43, percentage: 14 },
    { code: 'ERR_INCOMPLETE_CV', label: 'Incomplete Project Portfolio / GitHub', count: 32, percentage: 10 },
  ],
  'stage-2': [
    { code: 'ERR_SALARY', label: 'Salary Expectation Mismatch', count: 130, percentage: 42 },
    { code: 'ERR_SLOW_PROCESS', label: 'Notice Period Exceeds 3 Months', count: 87, percentage: 28 },
    { code: 'ERR_COMPETITOR', label: 'Candidate Exploring Other Offers', count: 47, percentage: 15 },
    { code: 'ERR_GHOSTED', label: 'Ghosted / Unresponsive After Call', count: 47, percentage: 15 },
  ],
  'stage-3': [
    { code: 'ERR_TECH_GAP', label: 'Live Coding & Concurrency Benchmark', count: 72, percentage: 45 },
    { code: 'ERR_SYS_DESIGN', label: 'Distributed Systems & Database Scaling Gap', count: 45, percentage: 28 },
    { code: 'ERR_SALARY', label: 'Compensation Band Mismatch Post-Screen', count: 24, percentage: 15 },
    { code: 'ERR_COMM', label: 'Technical Communication & Articulation', count: 19, percentage: 12 },
  ],
  'stage-4': [
    { code: 'ERR_COMPETITOR', label: 'Accepted Competitor Counter-Offer', count: 14, percentage: 48 },
    { code: 'ERR_SALARY', label: 'Equity / Sign-on Package Below Target', count: 9, percentage: 31 },
    { code: 'ERR_REMOTE', label: 'Disagreement on Hybrid Schedule', count: 4, percentage: 14 },
    { code: 'ERR_PERSONAL', label: 'Personal & Relocation Reasons', count: 2, percentage: 7 },
  ],
  'stage-5': [],

  // === REQ-89: Product Manager ===
  'stage-89-1': [
    { code: 'ERR_B2B_DOMAIN', label: 'Lack of B2B SaaS / Fintech Domain Depth', count: 22, percentage: 49 },
    { code: 'ERR_METRICS_DATA', label: 'Weak Business Impact & Metrics Track Record', count: 12, percentage: 27 },
    { code: 'ERR_LEADERSHIP', label: 'Insufficient Multi-Squad Product Ownership', count: 7, percentage: 15 },
    { code: 'ERR_LOCATION', label: 'Timezone Incompatibility for Squad Sync', count: 4, percentage: 9 },
  ],
  'stage-89-2': [
    { code: 'ERR_SALARY', label: 'Salary Expectation Exceeds PM Band (>30%)', count: 11, percentage: 46 },
    { code: 'ERR_PRODUCT_SENSE', label: 'Product Sense & Discovery Framework Gap', count: 6, percentage: 25 },
    { code: 'ERR_CULTURE', label: 'Culture Fit for Rapid Iteration Environment', count: 4, percentage: 17 },
    { code: 'ERR_SLOW_PROCESS', label: 'Process Timeline Slower Than Candidate Target', count: 3, percentage: 12 },
  ],
  'stage-89-3': [
    { code: 'ERR_CASE_STRATEGY', label: 'Case Study Roadmap & Monetization Feasibility', count: 4, percentage: 40 },
    { code: 'ERR_DATA_ANALYSIS', label: 'Superficial Financial & User Metrics Modeling', count: 3, percentage: 30 },
    { code: 'ERR_DEADLINE', label: 'Late Submission of Case Study Deliverable', count: 2, percentage: 20 },
    { code: 'ERR_USER_RESEARCH', label: 'Customer Discovery & Validation Gaps', count: 1, percentage: 10 },
  ],
  'stage-89-4': [
    { code: 'ERR_STAKEHOLDER_ALIGN', label: 'Executive Stakeholder Persuasion & Alignment', count: 2, percentage: 50 },
    { code: 'ERR_COMPETITOR', label: 'Accepted Offer from Tier-1 Tech Firm', count: 1, percentage: 25 },
    { code: 'ERR_SALARY', label: 'Executive Compensation Tier Discrepancy', count: 1, percentage: 25 },
  ],
  'stage-89-5': [],

  // === REQ-215: UX Designer ===
  'stage-215-1': [
    { code: 'ERR_PORTFOLIO_MISSING', label: 'Portfolio Missing End-to-End UX Case Studies', count: 8, percentage: 53 },
    { code: 'ERR_VISUAL_BALANCE', label: 'Graphic Heavy / Weak Digital Product UX Basis', count: 4, percentage: 27 },
    { code: 'ERR_TOOL_STACK', label: 'Figma & Design Tokens Proficiency Gap', count: 2, percentage: 13 },
    { code: 'ERR_SENIORITY', label: 'Design Craftsmanship Level Below Senior Bar', count: 1, percentage: 7 },
  ],
  'stage-215-2': [
    { code: 'ERR_DESIGN_SYSTEM', label: 'Design System Architecture & Scalability Gap', count: 8, percentage: 44 },
    { code: 'ERR_USER_FLOW', label: 'User Flow Edge Cases & Error States Incomplete', count: 5, percentage: 28 },
    { code: 'ERR_USABILITY', label: 'Lack of Quantitative Usability Testing Data', count: 3, percentage: 17 },
    { code: 'ERR_COMM', label: 'Design Rationale & Defense Articulation', count: 2, percentage: 11 },
  ],
  'stage-215-3': [
    { code: 'ERR_INTERACTION_DETAIL', label: 'Interactive Prototype Complexity & Polish Gap', count: 3, percentage: 50 },
    { code: 'ERR_DEADLINE', label: 'Design Challenge Time-box Exceeded', count: 2, percentage: 33 },
    { code: 'ERR_ACCESSIBILITY', label: 'WCAG Accessibility Standards Overlooked', count: 1, percentage: 17 },
  ],
  'stage-215-4': [
    { code: 'ERR_COMPETITOR', label: 'Accepted Global Creative Agency Offer', count: 2, percentage: 67 },
    { code: 'ERR_SALARY', label: 'Base Salary Expectation Gap', count: 1, percentage: 33 },
  ],
  'stage-215-5': [],

  // === REQ-45: DevOps Engineer ===
  'stage-45-1': [
    { code: 'ERR_K8S_IAC', label: 'Missing Production Kubernetes & Terraform Experience', count: 48, percentage: 51 },
    { code: 'ERR_CLOUD_ARCH', label: 'Lack of Enterprise Multi-Cloud AWS/GCP Hands-on', count: 25, percentage: 27 },
    { code: 'ERR_CI_CD', label: 'Traditional SysAdmin Background without GitOps', count: 21, percentage: 22 },
  ],
  'stage-45-2': [
    { code: 'ERR_ONCALL_REFUSAL', label: 'Unwilling to Participate in 24/7 On-Call Rotation', count: 12, percentage: 43 },
    { code: 'ERR_SALARY', label: 'DevOps Market Rate Compensation Gap', count: 9, percentage: 32 },
    { code: 'ERR_SLOW_PROCESS', label: 'Candidate Accepted Earlier Interview Process', count: 7, percentage: 25 },
  ],
  'stage-45-3': [
    { code: 'ERR_IAC_LAB', label: 'Failed Terraform & Helm Automation Practical Lab', count: 10, percentage: 48 },
    { code: 'ERR_TROUBLESHOOT', label: 'Inability to Diagnose Kubernetes Network Latency', count: 6, percentage: 29 },
    { code: 'ERR_SEC_COMPLIANCE', label: 'IAM & Secret Encryption Security Oversight', count: 5, percentage: 23 },
  ],
  'stage-45-4': [
    { code: 'ERR_SRE_CULTURE', label: 'Incident Post-mortem & SRE Philosophy Mismatch', count: 5, percentage: 50 },
    { code: 'ERR_COMPETITOR', label: 'Accepted Senior Cloud Architect Competitor Offer', count: 3, percentage: 30 },
    { code: 'ERR_SALARY', label: 'On-call Allowance & Bonus Discrepancy', count: 2, percentage: 20 },
  ],
  'stage-45-5': [],
};

export const mockLeakageLogs: Record<string, CandidateLeakage[]> = {
  // === REQ-142 ===
  'stage-1': [
    { id: 'leak-142-1-1', candidateName: 'Alex Thorne', companyOrigin: 'TechSys Corp', reasonCode: 'ERR_RESUME_MISMATCH', reasonLabel: 'Lack of Distributed Systems Experience', daysInStage: 2, date: '2026-08-29' },
    { id: 'leak-142-1-2', candidateName: 'Karen White', companyOrigin: 'Legacy Software', reasonCode: 'ERR_EXP_SENIORITY', reasonLabel: 'Seniority Level Mismatch (<5 YOE)', daysInStage: 3, date: '2026-08-28' },
    { id: 'leak-142-1-3', candidateName: 'Dmitri Volkov', companyOrigin: 'RemoteHub', reasonCode: 'ERR_LOCATION', reasonLabel: 'Office / Hybrid Policy Incompatible', daysInStage: 1, date: '2026-08-27' },
  ],
  'stage-2': [
    { id: 'leak-142-2-1', candidateName: 'Rachel Green', companyOrigin: 'Retail Solutions', reasonCode: 'ERR_SALARY', reasonLabel: 'Salary Expectation Mismatch', daysInStage: 5, date: '2026-08-28' },
    { id: 'leak-142-2-2', candidateName: 'Ross Geller', companyOrigin: 'MuseumTech', reasonCode: 'ERR_SLOW_PROCESS', reasonLabel: 'Notice Period Exceeds 3 Months', daysInStage: 7, date: '2026-08-26' },
    { id: 'leak-142-2-3', candidateName: 'Chandler Bing', companyOrigin: 'DataProc Inc', reasonCode: 'ERR_GHOSTED', reasonLabel: 'Ghosted / Unresponsive After Call', daysInStage: 6, date: '2026-08-25' },
  ],
  'stage-3': [
    { id: 'leak-142-3-1', candidateName: 'David Lee', companyOrigin: 'ex-Stripe', reasonCode: 'ERR_TECH_GAP', reasonLabel: 'Live Coding & Concurrency Benchmark', daysInStage: 14, date: '2026-08-28' },
    { id: 'leak-142-3-2', candidateName: 'Sarah Connor', companyOrigin: 'Fintech Core', reasonCode: 'ERR_SYS_DESIGN', reasonLabel: 'Distributed Systems & Database Scaling Gap', daysInStage: 8, date: '2026-08-27' },
    { id: 'leak-142-3-3', candidateName: 'Michael Chang', companyOrigin: 'CloudScale', reasonCode: 'ERR_SALARY', reasonLabel: 'Compensation Band Mismatch Post-Screen', daysInStage: 18, date: '2026-08-25' },
    { id: 'leak-142-3-4', candidateName: 'Alice Morgan', companyOrigin: 'Fullstack Co', reasonCode: 'ERR_COMM', reasonLabel: 'Technical Communication & Articulation', daysInStage: 11, date: '2026-08-24' },
  ],
  'stage-4': [
    { id: 'leak-142-4-1', candidateName: 'Gabriel Wright', companyOrigin: 'AI Frontier', reasonCode: 'ERR_COMPETITOR', reasonLabel: 'Accepted Competitor Counter-Offer', daysInStage: 4, date: '2026-08-29' },
    { id: 'leak-142-4-2', candidateName: 'Hannah Reed', companyOrigin: 'DataPipeline', reasonCode: 'ERR_SALARY', reasonLabel: 'Equity / Sign-on Package Below Target', daysInStage: 3, date: '2026-08-28' },
  ],
  'stage-5': [],

  // === REQ-89 ===
  'stage-89-1': [
    { id: 'leak-89-1-1', candidateName: 'Chloe Huang', companyOrigin: 'E-commerce Group', reasonCode: 'ERR_B2B_DOMAIN', reasonLabel: 'Lack of B2B SaaS / Fintech Domain Depth', daysInStage: 4, date: '2026-08-28' },
    { id: 'leak-89-1-2', candidateName: 'Arthur Vance', companyOrigin: 'AdAgency', reasonCode: 'ERR_METRICS_DATA', reasonLabel: 'Weak Business Impact & Metrics Track Record', daysInStage: 3, date: '2026-08-27' },
  ],
  'stage-89-2': [
    { id: 'leak-89-2-1', candidateName: 'Faisal Ahmed', companyOrigin: 'Payments Co', reasonCode: 'ERR_SALARY', reasonLabel: 'Salary Expectation Exceeds PM Band (>30%)', daysInStage: 12, date: '2026-08-28' },
    { id: 'leak-89-2-2', candidateName: 'Elena Rostova', companyOrigin: 'Fintech Prime', reasonCode: 'ERR_PRODUCT_SENSE', reasonLabel: 'Product Sense & Discovery Framework Gap', daysInStage: 9, date: '2026-08-26' },
  ],
  'stage-89-3': [
    { id: 'leak-89-3-1', candidateName: 'Liam O’Connor', companyOrigin: 'SaaS Platform', reasonCode: 'ERR_CASE_STRATEGY', reasonLabel: 'Case Study Roadmap & Monetization Feasibility', daysInStage: 11, date: '2026-08-27' },
    { id: 'leak-89-3-2', candidateName: 'Maya Patel', companyOrigin: 'Marketplace Hub', reasonCode: 'ERR_DATA_ANALYSIS', reasonLabel: 'Superficial Financial & User Metrics Modeling', daysInStage: 10, date: '2026-08-25' },
  ],
  'stage-89-4': [
    { id: 'leak-89-4-1', candidateName: 'Victor Ramos', companyOrigin: 'HyperGrowth Corp', reasonCode: 'ERR_STAKEHOLDER_ALIGN', reasonLabel: 'Executive Stakeholder Persuasion & Alignment', daysInStage: 5, date: '2026-08-28' },
  ],
  'stage-89-5': [],

  // === REQ-215 ===
  'stage-215-1': [
    { id: 'leak-215-1-1', candidateName: 'Zoe Larson', companyOrigin: 'Design Agency', reasonCode: 'ERR_PORTFOLIO_MISSING', reasonLabel: 'Portfolio Missing End-to-End UX Case Studies', daysInStage: 2, date: '2026-08-29' },
    { id: 'leak-215-1-2', candidateName: 'Kenji Sato', companyOrigin: 'Creative Studio', reasonCode: 'ERR_VISUAL_BALANCE', reasonLabel: 'Graphic Heavy / Weak Digital Product UX Basis', daysInStage: 3, date: '2026-08-27' },
  ],
  'stage-215-2': [
    { id: 'leak-215-2-1', candidateName: 'Clara Dubois', companyOrigin: 'AppCraft Lab', reasonCode: 'ERR_DESIGN_SYSTEM', reasonLabel: 'Design System Architecture & Scalability Gap', daysInStage: 9, date: '2026-08-28' },
    { id: 'leak-215-2-2', candidateName: 'Tuan Nguyen', companyOrigin: 'Digital Ventures', reasonCode: 'ERR_USER_FLOW', reasonLabel: 'User Flow Edge Cases & Error States Incomplete', daysInStage: 8, date: '2026-08-26' },
  ],
  'stage-215-3': [
    { id: 'leak-215-3-1', candidateName: 'Siddharth Rao', companyOrigin: 'Product Studio', reasonCode: 'ERR_INTERACTION_DETAIL', reasonLabel: 'Interactive Prototype Complexity & Polish Gap', daysInStage: 6, date: '2026-08-27' },
  ],
  'stage-215-4': [
    { id: 'leak-215-4-1', candidateName: 'Camila Silva', companyOrigin: 'Global Design Collective', reasonCode: 'ERR_COMPETITOR', reasonLabel: 'Accepted Global Creative Agency Offer', daysInStage: 3, date: '2026-08-28' },
  ],
  'stage-215-5': [],

  // === REQ-45 ===
  'stage-45-1': [
    { id: 'leak-45-1-1', candidateName: 'Igor Sokolov', companyOrigin: 'Hosting Pro', reasonCode: 'ERR_K8S_IAC', reasonLabel: 'Missing Production Kubernetes & Terraform Experience', daysInStage: 2, date: '2026-08-29' },
  ],
  'stage-45-2': [
    { id: 'leak-45-2-1', candidateName: 'Priya Sharma', companyOrigin: 'CloudOps Ltd', reasonCode: 'ERR_ONCALL_REFUSAL', reasonLabel: 'Unwilling to Participate in 24/7 On-Call Rotation', daysInStage: 4, date: '2026-08-28' },
  ],
  'stage-45-3': [
    { id: 'leak-45-3-1', candidateName: 'Nathan Cole', companyOrigin: 'InfraScale', reasonCode: 'ERR_IAC_LAB', reasonLabel: 'Failed Terraform & Helm Automation Practical Lab', daysInStage: 5, date: '2026-08-27' },
  ],
  'stage-45-4': [
    { id: 'leak-45-4-1', candidateName: 'Grace Hopper-Fan', companyOrigin: 'Reliability Inc', reasonCode: 'ERR_SRE_CULTURE', reasonLabel: 'Incident Post-mortem & SRE Philosophy Mismatch', daysInStage: 4, date: '2026-08-28' },
  ],
  'stage-45-5': [],
};

/**
 * Intelligent helper that generates distinct and realistic diagnostics for ANY stage of ANY job.
 */
export function generateDynamicStageDiagnostics(
  stageId: string,
  stageName: string = 'Stage',
  stageOrder: number = 2,
  jobId: string = 'req-custom',
  jobTitle: string = 'Candidate Role',
  volumeDropped: number = 10
) {
  // If explicitly registered in mock data, return it
  if (mockDropReasonsByStage[stageId]) {
    return {
      dropReasons: mockDropReasonsByStage[stageId],
      leakages: mockLeakageLogs[stageId] || [],
    };
  }

  // If stage is completion/hired or 0 dropped
  if (
    volumeDropped === 0 ||
    stageOrder >= 5 ||
    stageName.toLowerCase().includes('hired') ||
    stageName.toLowerCase().includes('tuyển dụng')
  ) {
    return {
      dropReasons: [],
      leakages: [],
    };
  }

  // Stage 1: Sourcing & Resume Application
  if (stageOrder === 1 || stageName.toLowerCase().includes('applied') || stageName.toLowerCase().includes('nộp')) {
    const reasons: DropReason[] = [
      { code: 'ERR_RESUME_MISMATCH', label: `Core Skill Set Gap for ${jobTitle}`, count: Math.max(8, Math.round(volumeDropped * 0.52)), percentage: 52 },
      { code: 'ERR_EXP_SENIORITY', label: 'Seniority Level Mismatch for Role Scope', count: Math.max(4, Math.round(volumeDropped * 0.24)), percentage: 24 },
      { code: 'ERR_LOCATION', label: 'Office / Location Policy Incompatibility', count: Math.max(2, Math.round(volumeDropped * 0.14)), percentage: 14 },
      { code: 'ERR_INCOMPLETE_CV', label: 'Incomplete Portfolio / Application Details', count: Math.max(1, Math.round(volumeDropped * 0.10)), percentage: 10 },
    ];
    const leakages: CandidateLeakage[] = [
      { id: `leak-gen-${stageId}-1`, candidateName: 'Jordan Taylor', companyOrigin: 'Tech Solutions', reasonCode: 'ERR_RESUME_MISMATCH', reasonLabel: `Core Skill Set Gap for ${jobTitle}`, daysInStage: 2, date: '2026-08-29' },
      { id: `leak-gen-${stageId}-2`, candidateName: 'Morgan Bailey', companyOrigin: 'Apex Group', reasonCode: 'ERR_EXP_SENIORITY', reasonLabel: 'Seniority Level Mismatch for Role Scope', daysInStage: 3, date: '2026-08-28' },
    ];
    return { dropReasons: reasons, leakages };
  }

  // Stage 2: Initial Screen
  if (stageOrder === 2 || stageName.toLowerCase().includes('screen') || stageName.toLowerCase().includes('sàng lọc')) {
    const reasons: DropReason[] = [
      { code: 'ERR_SALARY', label: `Salary Expectation Exceeds Budget for ${jobTitle}`, count: Math.max(6, Math.round(volumeDropped * 0.44)), percentage: 44 },
      { code: 'ERR_SLOW_PROCESS', label: 'Notice Period Too Long (>2 Months)', count: Math.max(4, Math.round(volumeDropped * 0.26)), percentage: 26 },
      { code: 'ERR_COMPETITOR', label: 'Candidate Prioritizing Competing Active Funnels', count: Math.max(2, Math.round(volumeDropped * 0.16)), percentage: 16 },
      { code: 'ERR_GHOSTED', label: 'Unresponsive / Ghosted After Initial Reachout', count: Math.max(2, Math.round(volumeDropped * 0.14)), percentage: 14 },
    ];
    const leakages: CandidateLeakage[] = [
      { id: `leak-gen-${stageId}-1`, candidateName: 'Casey Harper', companyOrigin: 'Global Tech', reasonCode: 'ERR_SALARY', reasonLabel: `Salary Expectation Exceeds Budget for ${jobTitle}`, daysInStage: 5, date: '2026-08-28' },
      { id: `leak-gen-${stageId}-2`, candidateName: 'Quinn Adams', companyOrigin: 'Venture Labs', reasonCode: 'ERR_SLOW_PROCESS', reasonLabel: 'Notice Period Too Long (>2 Months)', daysInStage: 7, date: '2026-08-27' },
    ];
    return { dropReasons: reasons, leakages };
  }

  // Stage 3: Technical Assessment / Challenge / Case Study
  if (stageOrder === 3 || stageName.toLowerCase().includes('tech') || stageName.toLowerCase().includes('challenge') || stageName.toLowerCase().includes('case')) {
    const reasons: DropReason[] = [
      { code: 'ERR_TECH_GAP', label: `Domain Benchmark & Technical Assessment Gap (${jobTitle})`, count: Math.max(6, Math.round(volumeDropped * 0.48)), percentage: 48 },
      { code: 'ERR_SYS_DESIGN', label: 'System Complexity & Problem Solving Depth', count: Math.max(3, Math.round(volumeDropped * 0.28)), percentage: 28 },
      { code: 'ERR_COMM', label: 'Collaboration & Communication Articulation', count: Math.max(2, Math.round(volumeDropped * 0.14)), percentage: 14 },
      { code: 'ERR_SALARY', label: 'Mid-funnel Compensation Realignment Request', count: Math.max(1, Math.round(volumeDropped * 0.10)), percentage: 10 },
    ];
    const leakages: CandidateLeakage[] = [
      { id: `leak-gen-${stageId}-1`, candidateName: 'Samira Khan', companyOrigin: 'ScaleCorp', reasonCode: 'ERR_TECH_GAP', reasonLabel: `Domain Benchmark & Technical Assessment Gap (${jobTitle})`, daysInStage: 12, date: '2026-08-28' },
      { id: `leak-gen-${stageId}-2`, candidateName: 'Lucas Bernard', companyOrigin: 'InnovateX', reasonCode: 'ERR_SYS_DESIGN', reasonLabel: 'System Complexity & Problem Solving Depth', daysInStage: 10, date: '2026-08-26' },
    ];
    return { dropReasons: reasons, leakages };
  }

  // Stage 4: Offer / Final Panel
  const reasons: DropReason[] = [
    { code: 'ERR_COMPETITOR', label: 'Accepted Competitor Counter-Offer / Equity Package', count: Math.max(3, Math.round(volumeDropped * 0.50)), percentage: 50 },
    { code: 'ERR_SALARY', label: 'Compensation & Sign-on Bonus Discrepancy', count: Math.max(2, Math.round(volumeDropped * 0.30)), percentage: 30 },
    { code: 'ERR_REMOTE', label: 'Work Schedule / Commute Inflexibility', count: Math.max(1, Math.round(volumeDropped * 0.20)), percentage: 20 },
  ];
  const leakages: CandidateLeakage[] = [
    { id: `leak-gen-${stageId}-1`, candidateName: 'Avery Mitchell', companyOrigin: 'NextGen Inc', reasonCode: 'ERR_COMPETITOR', reasonLabel: 'Accepted Competitor Counter-Offer / Equity Package', daysInStage: 4, date: '2026-08-29' },
  ];
  return { dropReasons: reasons, leakages };
}

export const mockCandidates: Candidate[] = [
  {
    id: 'c-1',
    candidateId: 'JD-8932',
    name: 'John Doe',
    email: 'john.doe@enterprise.com',
    role: 'Sr. Backend Engineer',
    jobId: 'req-142',
    currentStage: 'Technical Interview',
    timeInStageDays: 2,
    healthIndex: 92,
    assignedRecruiter: 'S. Miller',
    status: 'ACTIVE',
  },
  {
    id: 'c-2',
    candidateId: 'AS-4419',
    name: 'Alice Smith',
    email: 'alice.smith@devmail.io',
    role: 'Sr. Backend Engineer',
    jobId: 'req-142',
    currentStage: 'Take-home Assignment',
    timeInStageDays: 9,
    healthIndex: 65,
    assignedRecruiter: 'R. Chen',
    status: 'ACTIVE',
  },
  {
    id: 'c-3',
    candidateId: 'BW-1022',
    name: 'Bob Wilson',
    email: 'bob.wilson@arch.org',
    role: 'Sr. Backend Engineer',
    jobId: 'req-142',
    currentStage: 'Final Interview',
    timeInStageDays: 18,
    healthIndex: 28,
    assignedRecruiter: 'L. Davis',
    status: 'ACTIVE',
  },
  {
    id: 'c-4',
    candidateId: 'EM-7741',
    name: 'Elena Martinez',
    email: 'elena.m@cloudscale.net',
    role: 'Sr. Backend Engineer',
    jobId: 'req-142',
    currentStage: 'Offer Extended',
    timeInStageDays: 1,
    healthIndex: 98,
    assignedRecruiter: 'S. Miller',
    status: 'ACTIVE',
  },
  {
    id: 'c-5',
    candidateId: 'MK-5521',
    name: 'Michael King',
    email: 'm.king@datasystems.co',
    role: 'Sr. Backend Engineer',
    jobId: 'req-142',
    currentStage: 'Screening',
    timeInStageDays: 4,
    healthIndex: 88,
    assignedRecruiter: 'R. Chen',
    status: 'ACTIVE',
  },
  {
    id: 'c-6',
    candidateId: 'TC-3382',
    name: 'Tanya Cruz',
    email: 'tcruz@quantum.ai',
    role: 'Sr. Backend Engineer',
    jobId: 'req-142',
    currentStage: 'Technical Interview',
    timeInStageDays: 14,
    healthIndex: 45,
    assignedRecruiter: 'L. Davis',
    status: 'ACTIVE',
  },
  {
    id: 'c-7',
    candidateId: 'DL-9011',
    name: 'David Lee',
    email: 'david.l@fintech.io',
    role: 'Product Manager',
    jobId: 'req-89',
    currentStage: 'Case Study',
    timeInStageDays: 6,
    healthIndex: 78,
    assignedRecruiter: 'S. Miller',
    status: 'ACTIVE',
  },
  {
    id: 'c-8',
    candidateId: 'SP-6612',
    name: 'Sophia Park',
    email: 's.park@designhub.com',
    role: 'UX Designer',
    jobId: 'req-215',
    currentStage: 'Portfolio Review',
    timeInStageDays: 3,
    healthIndex: 94,
    assignedRecruiter: 'R. Chen',
    status: 'ACTIVE',
  },
];

export const mockExecutiveSummary = {
  activeReqs: 142,
  activeReqsTrend: '+5%',
  timeToFill: 45,
  timeToFillTrend: '+2d',
  offerAcceptanceRate: 88.5,
  criticalBottleneck: {
    title: 'CRITICAL BOTTLENECK',
    message: 'Tech Screen pass rate dropped to 12% (-8% WoW) for Senior Engineering roles.',
    stage: 'Tech Interview',
  },
  capacityWarning: {
    title: 'CAPACITY WARNING',
    message: 'Recruiter load exceeds optimal threshold by 15%.',
    impact: 'High',
  },
  ytdFunnel: [
    { stage: 'Sourced', count: 10450, dropRate: 0, conversionRate: 100 },
    { stage: 'Screened', count: 6200, dropRate: 40, conversionRate: 60 },
    { stage: 'Interview', count: 2600, dropRate: 58, conversionRate: 42 },
    { stage: 'Offer', count: 850, dropRate: 67, conversionRate: 33 },
    { stage: 'Hired', count: 752, dropRate: 11, conversionRate: 89 },
  ],
};

import { TimelineDataPoint, CohortChannelRow } from './types';

export const mockJobTimelines: Record<string, TimelineDataPoint[]> = {
  'req-142': [
    { date: '2026-06-08', displayDate: 'Jun 08', applied: 52, screened: 34, techInterview: 14, offer: 4, hired: 3, dropped: 28, avgDays: 14.2 },
    { date: '2026-06-15', displayDate: 'Jun 15', applied: 68, screened: 45, techInterview: 18, offer: 5, hired: 4, dropped: 36, avgDays: 13.8 },
    { date: '2026-06-22', displayDate: 'Jun 22', applied: 74, screened: 49, techInterview: 19, offer: 6, hired: 4, dropped: 41, avgDays: 13.1 },
    { date: '2026-06-29', displayDate: 'Jun 29', applied: 82, screened: 53, techInterview: 22, offer: 7, hired: 5, dropped: 46, avgDays: 12.9 },
    { date: '2026-07-06', displayDate: 'Jul 06', applied: 95, screened: 60, techInterview: 24, offer: 8, hired: 6, dropped: 54, avgDays: 12.6 },
    { date: '2026-07-13', displayDate: 'Jul 13', applied: 88, screened: 56, techInterview: 21, offer: 6, hired: 5, dropped: 51, avgDays: 12.8 },
    { date: '2026-07-20', displayDate: 'Jul 20', applied: 104, screened: 66, techInterview: 26, offer: 9, hired: 7, dropped: 61, avgDays: 12.5 },
    { date: '2026-07-27', displayDate: 'Jul 27', applied: 112, screened: 71, techInterview: 29, offer: 10, hired: 8, dropped: 65, avgDays: 12.2 },
    { date: '2026-08-03', displayDate: 'Aug 03', applied: 98, screened: 62, techInterview: 25, offer: 8, hired: 6, dropped: 57, avgDays: 12.4 },
    { date: '2026-08-10', displayDate: 'Aug 10', applied: 86, screened: 54, techInterview: 22, offer: 7, hired: 5, dropped: 49, avgDays: 12.1 },
    { date: '2026-08-17', displayDate: 'Aug 17', applied: 79, screened: 50, techInterview: 20, offer: 6, hired: 4, dropped: 44, avgDays: 11.9 },
    { date: '2026-08-24', displayDate: 'Aug 24', applied: 65, screened: 41, techInterview: 16, offer: 5, hired: 3, dropped: 38, avgDays: 11.7 },
  ],
  'req-89': [
    { date: '2026-06-08', displayDate: 'Jun 08', applied: 6, screened: 3, techInterview: 1, offer: 0, hired: 0, dropped: 4, avgDays: 18.0 },
    { date: '2026-06-15', displayDate: 'Jun 15', applied: 8, screened: 4, techInterview: 2, offer: 1, hired: 0, dropped: 5, avgDays: 17.5 },
    { date: '2026-06-22', displayDate: 'Jun 22', applied: 11, screened: 5, techInterview: 2, offer: 1, hired: 1, dropped: 6, avgDays: 16.8 },
    { date: '2026-06-29', displayDate: 'Jun 29', applied: 9, screened: 4, techInterview: 2, offer: 0, hired: 0, dropped: 5, avgDays: 16.2 },
    { date: '2026-07-06', displayDate: 'Jul 06', applied: 14, screened: 7, techInterview: 3, offer: 1, hired: 1, dropped: 8, avgDays: 15.9 },
    { date: '2026-07-13', displayDate: 'Jul 13', applied: 12, screened: 6, techInterview: 2, offer: 1, hired: 1, dropped: 7, avgDays: 15.5 },
    { date: '2026-07-20', displayDate: 'Jul 20', applied: 15, screened: 8, techInterview: 3, offer: 1, hired: 1, dropped: 9, avgDays: 15.2 },
    { date: '2026-07-27', displayDate: 'Jul 27', applied: 12, screened: 5, techInterview: 3, offer: 1, hired: 0, dropped: 7, avgDays: 15.0 },
  ],
};

export const mockCohortData: Record<string, CohortChannelRow[]> = {
  'req-142': [
    {
      channelId: 'referral',
      channelName: 'Employee Referral',
      iconName: 'Users',
      totalCandidates: 142,
      avgConversion: 24.6,
      avgVelocityDays: 9.4,
      weeks: [
        { week: 'W1', channel: 'Referral', applicants: 18, passThroughRate: 33.3, hiredCount: 6, avgVelocityDays: 8.2, status: 'optimal' },
        { week: 'W2', channel: 'Referral', applicants: 15, passThroughRate: 26.7, hiredCount: 4, avgVelocityDays: 9.0, status: 'optimal' },
        { week: 'W3', channel: 'Referral', applicants: 22, passThroughRate: 31.8, hiredCount: 7, avgVelocityDays: 8.5, status: 'optimal' },
        { week: 'W4', channel: 'Referral', applicants: 19, passThroughRate: 21.1, hiredCount: 4, avgVelocityDays: 10.2, status: 'moderate' },
        { week: 'W5', channel: 'Referral', applicants: 24, passThroughRate: 29.2, hiredCount: 7, avgVelocityDays: 9.1, status: 'optimal' },
        { week: 'W6', channel: 'Referral', applicants: 16, passThroughRate: 25.0, hiredCount: 4, avgVelocityDays: 9.8, status: 'optimal' },
        { week: 'W7', channel: 'Referral', applicants: 14, passThroughRate: 28.6, hiredCount: 4, avgVelocityDays: 9.5, status: 'optimal' },
        { week: 'W8', channel: 'Referral', applicants: 14, passThroughRate: 21.4, hiredCount: 3, avgVelocityDays: 10.8, status: 'moderate' },
      ],
    },
    {
      channelId: 'linkedin',
      channelName: 'LinkedIn Outbound',
      iconName: 'Globe',
      totalCandidates: 360,
      avgConversion: 12.8,
      avgVelocityDays: 13.6,
      weeks: [
        { week: 'W1', channel: 'LinkedIn', applicants: 48, passThroughRate: 14.6, hiredCount: 7, avgVelocityDays: 13.0, status: 'moderate' },
        { week: 'W2', channel: 'LinkedIn', applicants: 42, passThroughRate: 11.9, hiredCount: 5, avgVelocityDays: 14.1, status: 'moderate' },
        { week: 'W3', channel: 'LinkedIn', applicants: 52, passThroughRate: 13.5, hiredCount: 7, avgVelocityDays: 13.8, status: 'moderate' },
        { week: 'W4', channel: 'LinkedIn', applicants: 46, passThroughRate: 8.7, hiredCount: 4, avgVelocityDays: 15.2, status: 'lagging' },
        { week: 'W5', channel: 'LinkedIn', applicants: 50, passThroughRate: 16.0, hiredCount: 8, avgVelocityDays: 12.9, status: 'moderate' },
        { week: 'W6', channel: 'LinkedIn', applicants: 44, passThroughRate: 11.4, hiredCount: 5, avgVelocityDays: 14.0, status: 'moderate' },
        { week: 'W7', channel: 'LinkedIn', applicants: 40, passThroughRate: 12.5, hiredCount: 5, avgVelocityDays: 13.4, status: 'moderate' },
        { week: 'W8', channel: 'LinkedIn', applicants: 38, passThroughRate: 10.5, hiredCount: 4, avgVelocityDays: 14.5, status: 'lagging' },
      ],
    },
    {
      channelId: 'inbound',
      channelName: 'Direct Career Page',
      iconName: 'Briefcase',
      totalCandidates: 280,
      avgConversion: 4.8,
      avgVelocityDays: 18.2,
      weeks: [
        { week: 'W1', channel: 'Inbound', applicants: 36, passThroughRate: 5.6, hiredCount: 2, avgVelocityDays: 17.5, status: 'lagging' },
        { week: 'W2', channel: 'Inbound', applicants: 32, passThroughRate: 6.3, hiredCount: 2, avgVelocityDays: 18.0, status: 'lagging' },
        { week: 'W3', channel: 'Inbound', applicants: 40, passThroughRate: 2.5, hiredCount: 1, avgVelocityDays: 19.5, status: 'critical' },
        { week: 'W4', channel: 'Inbound', applicants: 38, passThroughRate: 5.3, hiredCount: 2, avgVelocityDays: 18.2, status: 'lagging' },
        { week: 'W5', channel: 'Inbound', applicants: 42, passThroughRate: 4.8, hiredCount: 2, avgVelocityDays: 18.0, status: 'lagging' },
        { week: 'W6', channel: 'Inbound', applicants: 30, passThroughRate: 3.3, hiredCount: 1, avgVelocityDays: 19.0, status: 'critical' },
        { week: 'W7', channel: 'Inbound', applicants: 34, passThroughRate: 5.9, hiredCount: 2, avgVelocityDays: 17.8, status: 'lagging' },
        { week: 'W8', channel: 'Inbound', applicants: 28, passThroughRate: 7.1, hiredCount: 2, avgVelocityDays: 17.2, status: 'lagging' },
      ],
    },
    {
      channelId: 'agency',
      channelName: 'Executive Search / Agency',
      iconName: 'Sparkles',
      totalCandidates: 63,
      avgConversion: 19.0,
      avgVelocityDays: 11.2,
      weeks: [
        { week: 'W1', channel: 'Agency', applicants: 8, passThroughRate: 25.0, hiredCount: 2, avgVelocityDays: 10.5, status: 'optimal' },
        { week: 'W2', channel: 'Agency', applicants: 6, passThroughRate: 16.7, hiredCount: 1, avgVelocityDays: 11.8, status: 'moderate' },
        { week: 'W3', channel: 'Agency', applicants: 10, passThroughRate: 20.0, hiredCount: 2, avgVelocityDays: 10.9, status: 'optimal' },
        { week: 'W4', channel: 'Agency', applicants: 7, passThroughRate: 14.3, hiredCount: 1, avgVelocityDays: 12.0, status: 'moderate' },
        { week: 'W5', channel: 'Agency', applicants: 12, passThroughRate: 25.0, hiredCount: 3, avgVelocityDays: 10.4, status: 'optimal' },
        { week: 'W6', channel: 'Agency', applicants: 7, passThroughRate: 14.3, hiredCount: 1, avgVelocityDays: 11.5, status: 'moderate' },
        { week: 'W7', channel: 'Agency', applicants: 8, passThroughRate: 12.5, hiredCount: 1, avgVelocityDays: 12.2, status: 'moderate' },
        { week: 'W8', channel: 'Agency', applicants: 5, passThroughRate: 20.0, hiredCount: 1, avgVelocityDays: 11.0, status: 'optimal' },
      ],
    },
  ],
};

