'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Briefcase,
  Layers,
  Trash2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface StageConfig {
  id: string;
  name: string;
  targetDays: number;
}

export function NewRequisitionModal() {
  const { isNewJobModalOpen, setIsNewJobModalOpen, addNewJob, t } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'info' | 'pipeline' | 'sla'>('info');

  // Form State: Basic Info
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('ENGINEERING');
  const [seniority, setSeniority] = useState('Senior');
  const [hiringManager, setHiringManager] = useState('');
  const [headcount, setHeadcount] = useState('1');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'NORMAL'>('HIGH');

  // Form State: Pipeline Stages Customizer
  const [stages, setStages] = useState<StageConfig[]>([
    { id: 'stg-1', name: 'Applied / Sourced', targetDays: 2 },
    { id: 'stg-2', name: 'Resume Screening', targetDays: 3 },
    { id: 'stg-3', name: 'Technical Assessment', targetDays: 5 },
    { id: 'stg-4', name: 'Panel Interview', targetDays: 4 },
    { id: 'stg-5', name: 'Offer & Close', targetDays: 3 },
  ]);
  const [newStageName, setNewStageName] = useState('');

  // Form State: SLA & Telemetry
  const [targetDaysToFill, setTargetDaysToFill] = useState('30');
  const [bottleneckDropThreshold, setBottleneckDropThreshold] = useState('45');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isNewJobModalOpen) return null;

  // Preset Template loader
  const loadPresetTemplate = (type: 'tech' | 'product' | 'sales' | 'exec') => {
    if (type === 'tech') {
      setStages([
        { id: 'stg-1', name: 'Applied', targetDays: 2 },
        { id: 'stg-2', name: 'Technical Screen', targetDays: 3 },
        { id: 'stg-3', name: 'Coding Challenge', targetDays: 5 },
        { id: 'stg-4', name: 'System Design Panel', targetDays: 4 },
        { id: 'stg-5', name: 'Offer', targetDays: 3 },
      ]);
    } else if (type === 'product') {
      setStages([
        { id: 'stg-1', name: 'Applied', targetDays: 2 },
        { id: 'stg-2', name: 'Portfolio Review', targetDays: 3 },
        { id: 'stg-3', name: 'Product Case Study', targetDays: 6 },
        { id: 'stg-4', name: 'Leadership Fit', targetDays: 4 },
        { id: 'stg-5', name: 'Offer', targetDays: 3 },
      ]);
    } else if (type === 'sales') {
      setStages([
        { id: 'stg-1', name: 'Inbound / Sourced', targetDays: 1 },
        { id: 'stg-2', name: 'HR Screening', targetDays: 2 },
        { id: 'stg-3', name: 'Sales Pitch Roleplay', targetDays: 4 },
        { id: 'stg-4', name: 'VP Sales Interview', targetDays: 3 },
        { id: 'stg-5', name: 'Offer', targetDays: 2 },
      ]);
    } else {
      setStages([
        { id: 'stg-1', name: 'Executive Search', targetDays: 5 },
        { id: 'stg-2', name: 'Confidential Screen', targetDays: 4 },
        { id: 'stg-3', name: 'Board of Directors', targetDays: 7 },
        { id: 'stg-4', name: 'Offer Negotiation', targetDays: 5 },
      ]);
    }
  };

  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    setStages((prev) => [
      ...prev,
      {
        id: `stg-${Date.now()}`,
        name: newStageName.trim(),
        targetDays: 3,
      },
    ]);
    setNewStageName('');
  };

  const handleRemoveStage = (id: string) => {
    if (stages.length <= 2) {
      alert('A pipeline must have at least 2 stages.');
      return;
    }
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateStageDays = (id: string, days: number) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, targetDays: Math.max(1, days) } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setActiveTab('info');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addNewJob({
        title: title.trim(),
        department,
        hiringManager: hiringManager.trim() || 'Alex Rivera',
        targetDaysToFill: Number(targetDaysToFill) || 30,
        status: 'ACTIVE',
        stages: stages.map((s) => s.name),
      });

      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsNewJobModalOpen(false);
        setTitle('');
        setHiringManager('');
        setActiveTab('info');
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--surface-container-lowest)]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[var(--background)] border border-[var(--outline-variant)] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[var(--outline-variant)]/40 flex items-center justify-between bg-[var(--surface-container-low)]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-container)] border border-[var(--primary-container)]/50 flex items-center justify-center text-[var(--primary-container)] shadow-md shadow-[var(--primary-container)]/10">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  {t('modal.new_job_title', 'Create New Requisition')}
                </h3>
                <span className="px-2 py-0.5 rounded bg-[var(--surface-container-high)] border border-[var(--primary-container)]/40 text-[var(--primary)] text-[10px] font-mono font-bold">
                  SLA PIPELINE
                </span>
              </div>
              <p className="text-[11px] text-[var(--outline)] font-mono mt-0.5">
                {t('modal.new_job_desc', 'Define hiring parameters, custom funnel stages & diagnostic thresholds')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewJobModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[var(--surface-container)] text-[var(--outline)] hover:text-[var(--foreground)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex items-center border-b border-[var(--outline-variant)]/40 bg-[var(--background)] px-5 pt-2 shrink-0">
          {[
            { id: 'info', label: `1. ${t('jobs.details_tab', 'Basic Info & Role')}`, icon: Briefcase },
            { id: 'pipeline', label: `2. ${t('modal.job_stages_input', 'Custom Pipeline Stages')}`, icon: Layers },
            { id: 'sla', label: `3. ${t('settings.section_thresholds', 'SLA & Diagnostics')}`, icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[var(--primary-container)] text-[var(--primary-container)] bg-[var(--surface-container)]/40'
                    : 'border-transparent text-[var(--outline)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-mono text-[var(--foreground)] font-semibold mb-1.5">
                  {t('modal.job_title_input', 'JOB TITLE')} <span className="text-[var(--severity-critical-muted)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staff AI Systems Architect, Senior Product Designer..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/70 rounded-lg px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder-[var(--outline)] focus:outline-none focus:border-[var(--primary-container)] font-sans"
                />
              </div>

              {/* Department & Seniority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--foreground)] font-semibold mb-1.5">
                    {t('modal.job_dept_input', 'DEPARTMENT')}
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/70 rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary-container)] font-mono"
                  >
                    <option value="ENGINEERING">{t('ENGINEERING', 'ENGINEERING')}</option>
                    <option value="PRODUCT">{t('PRODUCT', 'PRODUCT')}</option>
                    <option value="DESIGN">{t('DESIGN', 'DESIGN')}</option>
                    <option value="SALES">{t('SALES', 'SALES')}</option>
                    <option value="MARKETING">MARKETING</option>
                    <option value="OPERATIONS">OPERATIONS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--foreground)] font-semibold mb-1.5">
                    SENIORITY LEVEL
                  </label>
                  <select
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value)}
                    className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/70 rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary-container)] font-mono"
                  >
                    <option value="Junior">Junior (0-2 YOE)</option>
                    <option value="Mid-Level">Mid-Level (2-5 YOE)</option>
                    <option value="Senior">Senior (5-8 YOE)</option>
                    <option value="Lead / Staff">Lead / Staff (8+ YOE)</option>
                    <option value="Executive">Executive / Director</option>
                  </select>
                </div>
              </div>

              {/* Hiring Manager & Headcount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--foreground)] font-semibold mb-1.5">
                    {t('modal.job_manager_input', 'HIRING MANAGER')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera, VP Engineering"
                    value={hiringManager}
                    onChange={(e) => setHiringManager(e.target.value)}
                    className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/70 rounded-lg px-3.5 py-2 text-xs text-[var(--foreground)] placeholder-[var(--outline)] focus:outline-none focus:border-[var(--primary-container)] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--foreground)] font-semibold mb-1.5">
                    TARGET HEADCOUNT (OPENINGS)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={headcount}
                    onChange={(e) => setHeadcount(e.target.value)}
                    className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/70 rounded-lg px-3.5 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary-container)] font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PIPELINE STAGES */}
          {activeTab === 'pipeline' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Presets */}
              <div>
                <span className="text-[11px] font-mono text-[var(--outline)] uppercase block mb-2">
                  Load Template:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => loadPresetTemplate('tech')}
                    className="p-2 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[11px] font-mono text-[var(--foreground)] transition-colors"
                  >
                    Tech / Engineering
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPresetTemplate('product')}
                    className="p-2 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[11px] font-mono text-[var(--foreground)] transition-colors"
                  >
                    Product & Design
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPresetTemplate('sales')}
                    className="p-2 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[11px] font-mono text-[var(--foreground)] transition-colors"
                  >
                    Sales & GTM
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPresetTemplate('exec')}
                    className="p-2 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[11px] font-mono text-[var(--foreground)] transition-colors"
                  >
                    Executive Search
                  </button>
                </div>
              </div>

              {/* Stages List */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[var(--outline)] uppercase block">
                  Pipeline Stage Order & Target SLAs:
                </span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {stages.map((stg, index) => (
                    <div
                      key={stg.id}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 text-xs font-mono"
                    >
                      <span className="w-5 h-5 rounded bg-[var(--surface-container)] border border-[var(--outline-variant)] flex items-center justify-center font-bold text-[var(--primary-container)] text-[10px]">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={stg.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStages((prev) =>
                            prev.map((s) => (s.id === stg.id ? { ...s, name: val } : s))
                          );
                        }}
                        className="flex-1 bg-transparent text-[var(--foreground)] border-b border-transparent focus:border-[var(--primary-container)] outline-none font-sans"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[var(--outline)]">SLA:</span>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={stg.targetDays}
                          onChange={(e) => handleUpdateStageDays(stg.id, Number(e.target.value))}
                          className="w-12 bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded px-1.5 py-0.5 text-center text-xs text-[var(--foreground)]"
                        />
                        <span className="text-[10px] text-[var(--outline)]">d</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStage(stg.id)}
                        className="p-1 hover:text-[var(--severity-critical-muted)] text-[var(--outline)] transition-colors"
                        title="Remove stage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Stage Row */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="New stage name..."
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStage();
                    }
                  }}
                  className="flex-1 bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--outline)] font-sans"
                />
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="px-3 py-1.5 rounded-lg bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[var(--primary)] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stage</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SLA & DIAGNOSTICS */}
          {activeTab === 'sla' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--surface-container-low)]/60 border border-[var(--outline-variant)]/60 space-y-2">
                  <label className="block text-xs font-mono text-[var(--foreground)] font-semibold">
                    {t('settings.target_sla', 'TARGET TIME TO FILL')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="10"
                      max="180"
                      value={targetDaysToFill}
                      onChange={(e) => setTargetDaysToFill(e.target.value)}
                      className="w-24 bg-[var(--background)] border border-[var(--outline-variant)] rounded-lg px-3 py-2 text-sm font-mono text-[var(--foreground)] focus:border-[var(--primary-container)] outline-none"
                    />
                    <span className="text-xs text-[var(--outline)] font-mono">{t('common.days', 'calendar days')}</span>
                  </div>
                  <p className="text-[10px] text-[var(--outline)] font-mono">
                    {t('settings.target_sla_hint', 'Target SLA for entire pipeline from open to signed offer.')}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-container-low)]/60 border border-[var(--outline-variant)]/60 space-y-2">
                  <label className="block text-xs font-mono text-[var(--foreground)] font-semibold">
                    {t('settings.bottleneck_trigger', 'BOTTLENECK TRIGGER THRESHOLD')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="10"
                      max="90"
                      value={bottleneckDropThreshold}
                      onChange={(e) => setBottleneckDropThreshold(e.target.value)}
                      className="w-24 bg-[var(--background)] border border-[var(--outline-variant)] rounded-lg px-3 py-2 text-sm font-mono text-[var(--foreground)] focus:border-[var(--primary-container)] outline-none"
                    />
                    <span className="text-xs text-[var(--outline)] font-mono">% drop-off</span>
                  </div>
                  <p className="text-[10px] text-[var(--outline)] font-mono">
                    {t('settings.bottleneck_trigger_hint', 'Trigger critical alarm when a stage drop rate exceeds this.')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[var(--outline-variant)]/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewJobModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[var(--foreground)] text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="px-5 py-2 rounded-lg bg-[var(--primary-container)] hover:brightness-110 text-[var(--on-primary)] text-xs font-mono font-bold transition-all shadow-md shadow-[var(--primary-container)]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating...</span>
              ) : success ? (
                <span>Requisition Created!</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('modal.job_create_btn', 'Create Requisition')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
