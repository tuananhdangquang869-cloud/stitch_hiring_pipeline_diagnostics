'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { JobRequisition, FunnelStage, Candidate } from '@/lib/types';
import {
  mockJobs,
  mockStagesByJob,
  mockCandidates,
} from '@/lib/mock-data';
import { Language, getTranslation, SUPPORTED_LANGUAGES } from '@/lib/translations';

export type ThemeMode = 'dark' | 'light' | 'high-contrast';

export interface AppSettings {
  orgName: string;
  adminEmail: string;
  targetSlaDays: number;
  warningSlaDays: number;
  bottleneckDropThreshold: number;
  activeTheme: 'pressure' | 'kinetic';
  language: Language;
}

export interface AppNotification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
}

interface AppContextType {
  // Theme
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;

  // Jobs & Active Requisition
  jobs: JobRequisition[];
  selectedJobId: string;
  selectedJob: JobRequisition;
  setSelectedJobId: (id: string) => void;
  addNewJob: (
    job: Omit<
      JobRequisition,
      | 'id'
      | 'reqCode'
      | 'totalApplicants'
      | 'conversionRate'
      | 'conversionTrend'
      | 'funnelHealth'
      | 'avgTimeToHireDays'
      | 'timeVsPrevTrend'
      | 'primaryBottleneck'
      | 'bottleneckDropRate'
    > & { stages?: string[] }
  ) => Promise<void>;

  // Stages & Diagnostics
  stagesByJob: Record<string, FunnelStage[]>;
  currentStages: FunnelStage[];
  selectedStageId: string;
  setSelectedStageId: (id: string) => void;
  isLoadingFunnel: boolean;

  // Candidates
  candidates: Candidate[];
  isLoadingCandidates: boolean;
  addCandidates: (newCandidates: Candidate[]) => void;
  refreshCandidates: () => Promise<void>;

  // Global Settings & Language
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;

  // User Profile
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;

  // Time Range & Modals
  timeRange: string;
  setTimeRange: (range: string) => void;
  isCsvModalOpen: boolean;
  setIsCsvModalOpen: (open: boolean) => void;
  isStageModalOpen: boolean;
  setIsStageModalOpen: (open: boolean) => void;
  isNewJobModalOpen: boolean;
  setIsNewJobModalOpen: (open: boolean) => void;

  // Re-fetch all live data
  refreshAllData: () => Promise<void>;
  resetAllData: () => void;
}

const defaultSettings: AppSettings = {
  orgName: 'Acme Corporation',
  adminEmail: 'admin@aplucke.hr',
  targetSlaDays: 30,
  warningSlaDays: 7,
  bottleneckDropThreshold: 45,
  activeTheme: 'pressure',
  language: 'vi',
};

const defaultNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'critical',
    title: 'Critical Bottleneck Alert',
    message: 'Tech Screen pass rate dropped to 12% (-8% WoW) for Sr. Backend Engineer.',
    time: '15m ago',
    read: false,
    link: '/dashboard',
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'SLA Exceeded Warning',
    message: 'Candidate Bob Wilson (BW-1022) has been in Final Interview for 18 days.',
    time: '2h ago',
    read: false,
    link: '/candidates',
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'CSV Ingestion Complete',
    message: '30 candidates were parsed and mapped to the active pipeline.',
    time: '1d ago',
    read: true,
    link: '/candidates',
  },
];

const defaultProfile: UserProfile = {
  name: 'System Admin',
  email: 'admin@aplucke.hr',
  role: 'Single-Admin MVP',
  avatarInitials: 'SA',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // 1. Initial states
  const [jobs, setJobs] = useState<JobRequisition[]>(mockJobs);
  const [selectedJobId, setSelectedJobIdState] = useState<string>('req-142');
  const [stagesByJob, setStagesByJob] = useState<Record<string, FunnelStage[]>>(mockStagesByJob);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [notifications, setNotifications] = useState<AppNotification[]>(defaultNotifications);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  // Loading & Modals UI States
  const [isLoadingFunnel, setIsLoadingFunnel] = useState<boolean>(false);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<string>('30D');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState<boolean>(false);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState<boolean>(false);
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-3');

  // Theme: apply data-theme attribute to HTML + persist
  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('aplucke_theme', mode);
    }
  }, []);

  // Hydrate theme on mount (before paint to avoid flash)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('aplucke_theme') as ThemeMode | null;
    if (saved && ['dark', 'light', 'high-contrast'].includes(saved)) {
      setTheme(saved);
    } else {
      // Auto-detect from OS preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const prefersContrast = window.matchMedia('(prefers-contrast: more)').matches;
      if (prefersContrast) {
        setTheme('high-contrast');
      } else if (!prefersDark) {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    }
  }, [setTheme]);

  // Fetch Funnel Data for Job
  const fetchFunnelData = useCallback(async (jobId: string) => {
    setIsLoadingFunnel(true);
    try {
      const res = await fetch(`/api/funnel?jobId=${jobId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const { job, stages } = json.data;
          if (stages && stages.length > 0) {
            setStagesByJob((prev) => ({ ...prev, [jobId]: stages }));
            const bottleneck = stages.find((s: FunnelStage) => s.isBottleneck) || stages[0];
            setSelectedStageId((prev) => {
              const exists = stages.some((s: FunnelStage) => s.id === prev);
              return exists ? prev : bottleneck.id;
            });
          }
          if (job) {
            setJobs((prev) => {
              const idx = prev.findIndex((j) => j.id === job.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], ...job };
                return next;
              }
              return [...prev, job];
            });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching funnel data:', err);
    } finally {
      // Small delay for smooth skeleton transition
      setTimeout(() => {
        setIsLoadingFunnel(false);
      }, 350);
    }
  }, []);

  // Fetch Candidates from API
  const refreshCandidates = useCallback(async () => {
    setIsLoadingCandidates(true);
    try {
      const res = await fetch('/api/candidates');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCandidates(json.data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('aplucke_candidates', JSON.stringify(json.data));
          }
        }
      }
    } catch (err) {
      console.error('Error refreshing candidates:', err);
    } finally {
      setIsLoadingCandidates(false);
    }
  }, []);

  // Fetch All Jobs
  const refreshJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setJobs(json.data);
        }
      }
    } catch (err) {
      console.error('Error refreshing jobs:', err);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    await Promise.all([refreshJobs(), refreshCandidates(), fetchFunnelData(selectedJobId)]);
  }, [refreshJobs, refreshCandidates, fetchFunnelData, selectedJobId]);

  // Hydrate on mount
  useEffect(() => {
    const init = async () => {
      try {
        const savedJobId = localStorage.getItem('aplucke_selectedJobId');
        const activeId = savedJobId || 'req-142';
        if (savedJobId) setSelectedJobIdState(savedJobId);

        const savedSettings = localStorage.getItem('aplucke_settings');
        const savedLang = localStorage.getItem('aplucke_language') as Language | null;
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (savedLang) parsed.language = savedLang;
          setSettings(parsed);
        } else if (savedLang) {
          setSettings((prev) => ({ ...prev, language: savedLang }));
        }

        const savedNotifs = localStorage.getItem('aplucke_notifications');
        if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

        const savedProfile = localStorage.getItem('aplucke_profile');
        if (savedProfile) setProfile(JSON.parse(savedProfile));

        await refreshJobs();
        await refreshCandidates();
        await fetchFunnelData(activeId);
      } catch (err) {
        console.error('Error in initial hydration:', err);
      }
    };
    init();
  }, [fetchFunnelData, refreshCandidates, refreshJobs]);

  // Setter for selectedJobId with live fetch
  const setSelectedJobId = (id: string) => {
    setSelectedJobIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aplucke_selectedJobId', id);
    }
    fetchFunnelData(id);
  };

  // Add New Job with API POST
  const addNewJob = async (newJobData: any) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJobData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const createdJob = json.data;
          setJobs((prev) => [createdJob, ...prev]);
          if (createdJob.stages) {
            setStagesByJob((prev) => ({ ...prev, [createdJob.id]: createdJob.stages }));
          }
          setSelectedJobId(createdJob.id);
          return;
        }
      }
    } catch (err) {
      console.error('Error posting new job to API, using client fallback:', err);
    }

    // Fallback if API unavailable
    const reqCode = `REQ-${Math.floor(100 + Math.random() * 900)}`;
    const newId = `req-${Date.now()}`;
    const createdJob: JobRequisition = {
      id: newId,
      reqCode,
      title: newJobData.title || 'New Position',
      department: newJobData.department || 'ENGINEERING',
      status: 'ACTIVE',
      hiringManager: newJobData.hiringManager || 'Sarah Jenkins',
      targetDaysToFill: Number(newJobData.targetDaysToFill) || 30,
      totalApplicants: 40,
      conversionRate: 8.3,
      conversionTrend: '+8.3%',
      funnelHealth: 'Good',
      avgTimeToHireDays: 14,
      timeVsPrevTrend: -1.5,
      primaryBottleneck: newJobData.stages?.[1] || 'Screening',
      bottleneckDropRate: 35.0,
    };

    const stageNames: string[] =
      newJobData.stages && newJobData.stages.length > 0
        ? newJobData.stages
        : ['Applied', 'Screened', 'Interview', 'Offer', 'Hired'];

    let currentVol = 40;
    const customStages: FunnelStage[] = stageNames.map((name, idx) => {
      const isLast = idx === stageNames.length - 1;
      const dropCount = isLast ? 0 : Math.round(currentVol * (0.35 + idx * 0.08));
      const passedCount = Math.max(1, currentVol - dropCount);
      const dropPct = isLast ? 0 : Math.round((dropCount / currentVol) * 100);
      const isBottleneck = idx === 1 || (idx === 2 && stageNames.length > 3);

      return {
        id: `${newId}-${idx + 1}`,
        name,
        stageOrder: idx + 1,
        volumeIn: currentVol,
        volumePassed: passedCount,
        volumeDropped: dropCount,
        dropRate: dropPct,
        avgDaysInStage: 2 + idx * 1.5,
        targetDaysInStage: 3.0,
        isBottleneck,
      };
    });

    setStagesByJob((prev) => ({ ...prev, [newId]: customStages }));
    setJobs((prev) => [createdJob, ...prev]);
    setSelectedJobId(newId);
  };

  // Add Candidates (CSV / API)
  const addCandidates = (newCandidates: Candidate[]) => {
    setCandidates((prev) => {
      const updated = [...newCandidates, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('aplucke_candidates', JSON.stringify(updated));
      }
      return updated;
    });
    // Also re-fetch live funnel counts
    fetchFunnelData(selectedJobId);
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('aplucke_settings', JSON.stringify(updated));
        if (newSettings.language) {
          localStorage.setItem('aplucke_language', newSettings.language);
        }
      }
      return updated;
    });
  };

  // Language switcher
  const setLanguage = useCallback((newLang: Language) => {
    setSettings((prev) => {
      const updated: AppSettings = { ...prev, language: newLang };
      if (typeof window !== 'undefined') {
        localStorage.setItem('aplucke_settings', JSON.stringify(updated));
        localStorage.setItem('aplucke_language', newLang);
      }
      return updated;
    });
  }, []);

  // Translation helper
  const t = useCallback(
    (key: string, fallback?: string) => {
      return getTranslation(settings.language || 'vi', key, fallback);
    },
    [settings.language]
  );

  // Notification Handlers
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      if (typeof window !== 'undefined') {
        localStorage.setItem('aplucke_notifications', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      if (typeof window !== 'undefined') {
        localStorage.setItem('aplucke_notifications', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('aplucke_notifications', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Profile
  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...newProfile };
      if (typeof window !== 'undefined') {
        localStorage.setItem('aplucke_profile', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Reset Data
  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aplucke_jobs');
      localStorage.removeItem('aplucke_stages_by_job');
      localStorage.removeItem('aplucke_selectedJobId');
      localStorage.removeItem('aplucke_candidates');
      localStorage.removeItem('aplucke_settings');
      localStorage.removeItem('aplucke_language');
      localStorage.removeItem('aplucke_notifications');
      localStorage.removeItem('aplucke_profile');
      localStorage.removeItem('aplucke_theme');
    }
    setJobs(mockJobs);
    setSelectedJobIdState('req-142');
    setStagesByJob(mockStagesByJob);
    setCandidates(mockCandidates);
    setSettings(defaultSettings);
    setNotifications(defaultNotifications);
    setProfile(defaultProfile);
    setTheme('dark');
    fetchFunnelData('req-142');
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0] || mockJobs[0];
  const currentStages = stagesByJob[selectedJobId] || stagesByJob['req-142'] || [];

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        jobs,
        selectedJobId,
        selectedJob,
        setSelectedJobId,
        addNewJob,
        stagesByJob,
        currentStages,
        selectedStageId,
        setSelectedStageId,
        isLoadingFunnel,
        candidates,
        isLoadingCandidates,
        addCandidates,
        refreshCandidates,
        settings,
        updateSettings,
        language: settings.language || 'vi',
        setLanguage,
        t,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        profile,
        updateProfile,
        timeRange,
        setTimeRange,
        isCsvModalOpen,
        setIsCsvModalOpen,
        isStageModalOpen,
        setIsStageModalOpen,
        isNewJobModalOpen,
        setIsNewJobModalOpen,
        refreshAllData,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
