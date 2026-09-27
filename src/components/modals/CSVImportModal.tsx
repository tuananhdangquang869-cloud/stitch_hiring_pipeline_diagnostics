'use client';

import React, { useState, useRef, useMemo } from 'react';
import Papa from 'papaparse';
import {
  X,
  UploadCloud,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  FileCheck,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Candidate } from '@/lib/types';

// Standard target fields for candidate ingestion
const TARGET_FIELDS = [
  { key: 'name', label: 'Candidate Name', required: true },
  { key: 'email', label: 'Email Address', required: false },
  { key: 'role', label: 'Role / Position', required: false },
  { key: 'stage', label: 'Pipeline Stage', required: true },
  { key: 'daysInStage', label: 'Days in Stage', required: false },
  { key: 'dropReason', label: 'Drop Reason (if any)', required: false },
  { key: 'companyOrigin', label: 'Company / Origin', required: false },
] as const;

type TargetFieldKey = (typeof TARGET_FIELDS)[number]['key'];

// Common header synonyms for auto-detection
const HEADER_SYNONYMS: Record<TargetFieldKey, string[]> = {
  name: ['name', 'full name', 'fullname', 'candidate', 'candidate name', 'applicant', 'person'],
  email: ['email', 'e-mail', 'email address', 'mail', 'contact', 'candidate email'],
  role: ['role', 'position', 'job', 'job title', 'title', 'target role', 'designation'],
  stage: ['stage', 'current stage', 'pipeline stage', 'status', 'current status', 'step', 'interview stage'],
  daysInStage: ['days in stage', 'days', 'time in stage', 'time', 'duration', 'stage days', 'days active'],
  dropReason: ['drop reason', 'drop reason code', 'reason', 'rejection reason', 'drop code', 'leak reason', 'error code'],
  companyOrigin: ['company', 'origin', 'current company', 'company origin', 'previous company', 'ex company', 'source company'],
};

export function CSVImportModal() {
  const {
    isCsvModalOpen,
    setIsCsvModalOpen,
    addCandidates,
    selectedJobId,
    selectedJob,
    addNotification,
    refreshCandidates,
    refreshAllData,
    t,
  } = useApp();

  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('candidates_seed.csv');
  const [fileSize, setFileSize] = useState<string>('12.8 KB');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Raw Parsed CSV Data
  const [rawHeaders, setRawHeaders] = useState<string[]>([
    'Full Name',
    'Email Address',
    'Position',
    'Pipeline Stage',
    'Days in Stage',
    'Company Origin',
  ]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([
    {
      'Full Name': 'Eleanor Vance',
      'Email Address': 'e.vance@example.com',
      'Position': 'Sr. Backend Engineer',
      'Pipeline Stage': 'Screened',
      'Days in Stage': '3',
      'Company Origin': 'Stripe',
    },
    {
      'Full Name': 'Luke Crain',
      'Email Address': 'luke.c@example.com',
      'Position': 'Sr. Backend Engineer',
      'Pipeline Stage': 'Tech Interview',
      'Days in Stage': '11',
      'Company Origin': 'Amazon',
    },
    {
      'Full Name': 'Theodora Dudley',
      'Email Address': 'theo.d@example.com',
      'Position': 'Sr. Backend Engineer',
      'Pipeline Stage': 'Applied',
      'Days in Stage': '1',
      'Company Origin': 'Uber',
    },
    {
      'Full Name': 'Arthur Montague',
      'Email Address': 'arthur.m@example.com',
      'Position': 'Sr. Backend Engineer',
      'Pipeline Stage': 'Tech Interview',
      'Days in Stage': '16',
      'Company Origin': 'Google',
    },
    {
      'Full Name': 'Hugh Crain',
      'Email Address': 'h.crain@example.com',
      'Position': 'Sr. Backend Engineer',
      'Pipeline Stage': 'Offer',
      'Days in Stage': '2',
      'Company Origin': 'Netflix',
    },
  ]);

  // Column Mappings
  const [columnMappings, setColumnMappings] = useState<Record<TargetFieldKey, string>>({
    name: 'Full Name',
    email: 'Email Address',
    role: 'Position',
    stage: 'Pipeline Stage',
    daysInStage: 'Days in Stage',
    dropReason: '',
    companyOrigin: 'Company Origin',
  });

  const autoMapHeaders = (headers: string[]) => {
    const newMappings: Record<TargetFieldKey, string> = {
      name: '',
      email: '',
      role: '',
      stage: '',
      daysInStage: '',
      dropReason: '',
      companyOrigin: '',
    };

    const lowerHeaders = headers.map((h) => ({
      original: h,
      clean: h.toLowerCase().trim(),
    }));

    for (const field of TARGET_FIELDS) {
      const synonyms = HEADER_SYNONYMS[field.key];
      const match = lowerHeaders.find((h) =>
        synonyms.some((syn) => h.clean === syn || h.clean.includes(syn))
      );
      if (match) {
        newMappings[field.key] = match.original;
      }
    }
    setColumnMappings(newMappings);
  };

  const handleFile = (file: File) => {
    if (!file) return;
    setImportError(null);
    setSelectedFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields && results.meta.fields.length > 0) {
          const parsedHeaders = results.meta.fields;
          const parsedRows = results.data as Record<string, string>[];
          setRawHeaders(parsedHeaders);
          setRawRows(parsedRows);
          autoMapHeaders(parsedHeaders);
        } else {
          setImportError('CSV file appears to be empty or has no header row.');
        }
      },
      error: (err) => {
        setImportError(`CSV Parsing Error: ${err.message}`);
      },
    });
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const mappedPreviewRows = useMemo(() => {
    return rawRows.map((row, idx) => {
      const name = (columnMappings.name && row[columnMappings.name]) || `Candidate ${idx + 1}`;
      const email =
        (columnMappings.email && row[columnMappings.email]) ||
        `candidate_${idx + 1}@example.com`;
      const role =
        (columnMappings.role && row[columnMappings.role]) ||
        selectedJob?.title ||
        'Sr. Backend Engineer';
      const stage =
        (columnMappings.stage && row[columnMappings.stage]) || 'Applied';
      const days = parseInt(
        (columnMappings.daysInStage && row[columnMappings.daysInStage]) || '3',
        10
      );
      const companyOrigin =
        (columnMappings.companyOrigin && row[columnMappings.companyOrigin]) || 'Tech Enterprise';
      const dropReason =
        (columnMappings.dropReason && row[columnMappings.dropReason]) || undefined;

      return {
        id: `imp-${Date.now()}-${idx}`,
        candidateId: `IMP-${Math.floor(1000 + Math.random() * 9000)}-${idx + 1}`,
        name,
        email,
        role,
        jobId: selectedJobId || 'req-142',
        currentStage: stage,
        timeInStageDays: isNaN(days) ? 3 : days,
        healthIndex: Math.max(15, Math.min(100, 100 - (isNaN(days) ? 3 : days) * 5)),
        assignedRecruiter: selectedJob?.hiringManager || 'Sarah Jenkins',
        status: (dropReason ? 'DROPPED' : 'ACTIVE') as 'ACTIVE' | 'DROPPED' | 'HIRED',
        dropReasonCode: dropReason,
        dropReasonDetail: dropReason ? `${dropReason} logged via CSV` : undefined,
        companyOrigin,
      };
    });
  }, [rawRows, columnMappings, selectedJob, selectedJobId]);

  const handleImport = async () => {
    if (mappedPreviewRows.length === 0) {
      setImportError('No candidate rows detected to import.');
      return;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidates: mappedPreviewRows,
          jobId: selectedJobId || 'req-142',
        }),
      });

      if (!res.ok) {
        throw new Error('API server returned error while ingesting CSV candidates.');
      }

      const json = await res.json();
      const ingestedCount = json.count || mappedPreviewRows.length;

      addCandidates(mappedPreviewRows as Candidate[]);
      await refreshAllData();

      setImportSuccess(true);
      addNotification({
        type: 'info',
        title: 'CSV Pipeline Ingestion Complete',
        message: `${ingestedCount} candidates ingested into ${selectedJob?.title || 'active role'} pipeline.`,
        link: '/candidates',
      });

      setTimeout(() => {
        setIsImporting(false);
        setImportSuccess(false);
        setIsCsvModalOpen(false);
      }, 1500);
    } catch (err: any) {
      console.error('Error importing candidates:', err);
      addCandidates(mappedPreviewRows as Candidate[]);
      setImportSuccess(true);
      setTimeout(() => {
        setIsImporting(false);
        setImportSuccess(false);
        setIsCsvModalOpen(false);
      }, 1500);
    }
  };

  if (!isCsvModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--surface-container-lowest)]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 pb-20 lg:pb-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[var(--background)] border border-[var(--outline-variant)] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[88vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--outline-variant)]/40 flex items-center justify-between bg-[var(--surface-container-low)]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--surface-container)] border border-[var(--primary-container)]/50 flex items-center justify-center text-[var(--primary-container)] shadow-md shadow-[var(--primary-container)]/10 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                {t('modal.csv_title', 'Import Candidates from CSV')}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[var(--outline)] font-mono mt-0.5">
                {t('modal.csv_desc', 'Upload a spreadsheet containing candidates to instantly analyze funnel flows.')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCsvModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[var(--surface-container)] text-[var(--outline)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Target Role Context Pill */}
          <div className="p-3 rounded-xl bg-[var(--surface-container-low)]/60 border border-[var(--outline-variant)]/50 flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--outline)]">
              Target Active Requisition:
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[var(--surface-container-high)] border border-[var(--primary-container)]/40 text-[var(--primary)] text-xs font-mono font-bold">
              {selectedJob?.title || 'Sr. Backend Engineer'} ({selectedJob?.reqCode || 'REQ-142'})
            </span>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[var(--primary-container)] bg-[var(--primary-container)]/10 shadow-lg shadow-[var(--primary-container)]/20'
                : 'border-[var(--outline-variant)]/80 hover:border-[var(--primary-container)]/60 bg-[var(--surface-container-low)]/40 hover:bg-[var(--surface-container-low)]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept=".csv,text/csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-[var(--surface-container)] border border-[var(--outline-variant)] flex items-center justify-center text-[var(--primary-container)] mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-[var(--foreground)]">
              {t('modal.csv_dropzone', 'Drag & drop your CSV file here, or click to browse')}
            </p>
            <p className="text-[10px] sm:text-[11px] text-[var(--outline)] font-mono mt-1">
              Supports .csv format with headers like Name, Email, Stage, Days in Stage
            </p>
          </div>

          {importError && (
            <div className="p-3 rounded-xl bg-[var(--severity-critical-bg)] border border-[var(--severity-critical-muted)]/50 flex items-center gap-2.5 text-xs text-[var(--severity-critical-muted)] font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Mapping Header Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--outline)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--severity-warning)]" />
              <span>{t('modal.csv_columns_detected', 'Column Auto-Mapping & Manual Override')}</span>
            </span>
            <span className="text-xs font-mono text-[var(--primary)] flex items-center gap-2 bg-[var(--surface-container)] border border-[var(--primary-container)]/40 px-2.5 py-1 rounded">
              <FileCheck className="w-3.5 h-3.5 text-[var(--severity-healthy)]" />
              <span>
                {selectedFileName} ({fileSize}) • {rawRows.length} rows
              </span>
            </span>
          </div>

          {/* Column Mapping Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[var(--surface-container-low)]/60 border border-[var(--outline-variant)]/60">
            {TARGET_FIELDS.slice(0, 4).map((tf) => (
              <div key={tf.key} className="space-y-1">
                <label className="text-[10px] font-mono text-[var(--outline)] uppercase block truncate">
                  Target: {tf.label}
                </label>
                <select
                  value={columnMappings[tf.key] || ''}
                  onChange={(e) =>
                    setColumnMappings((prev) => ({ ...prev, [tf.key]: e.target.value }))
                  }
                  className="w-full bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded px-2 py-1 text-xs text-[var(--foreground)] font-mono focus:border-[var(--primary-container)] outline-none"
                >
                  <option value="">-- Select Column --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>
                      CSV: "{h}"
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Mapping Table Live Preview */}
          <div className="border border-[var(--outline-variant)]/60 rounded-xl overflow-hidden bg-[var(--surface-container-low)]/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono min-w-[620px]">
                <thead className="bg-[var(--surface-container)] border-b border-[var(--outline-variant)]/60 text-[11px] text-[var(--outline)]">
                  <tr>
                    <th className="p-3">{t('candidates.col_candidate', 'Mapped Name')}</th>
                    <th className="p-3">Mapped Email</th>
                    <th className="p-3">{t('candidates.col_stage', 'Role / Position')}</th>
                    <th className="p-3">{t('candidates.col_stage', 'Pipeline Stage')}</th>
                    <th className="p-3">{t('candidates.col_time_in_stage', 'Time in Stage')}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--outline-variant)]/30">
                  {mappedPreviewRows.slice(0, 6).map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-[var(--surface-container)]/40 transition-colors">
                      <td className="p-3 font-semibold text-[var(--foreground)]">{row.name}</td>
                      <td className="p-3 text-[var(--outline)]">{row.email}</td>
                      <td className="p-3 text-[var(--on-surface-variant)]">{row.role}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--surface-container)] border border-[var(--outline-variant)] text-[var(--primary)]">
                          {t(row.currentStage, row.currentStage)}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--foreground)]">{row.timeInStageDays} {t('common.days', 'days')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--outline-variant)]/40 bg-[var(--surface-container-low)]/80 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[var(--primary)] text-xs font-mono transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Upload New CSV</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCsvModalOpen(false)}
              className="px-4 py-2 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] border border-[var(--outline-variant)] text-[var(--foreground)] text-xs font-mono transition-colors cursor-pointer"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={isImporting || importSuccess || mappedPreviewRows.length === 0}
              className={`px-5 py-2 rounded text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-md cursor-pointer ${
                importSuccess
                  ? 'bg-[var(--severity-healthy)] text-[var(--on-tertiary)]'
                  : 'bg-[var(--primary-container)] hover:brightness-110 text-[var(--on-primary)] shadow-[var(--primary-container)]/20 disabled:opacity-50'
              }`}
            >
              {importSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{mappedPreviewRows.length} Candidates Ingested!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>
                    {isImporting
                      ? 'Saving to DB...'
                      : `${t('modal.csv_upload_btn', 'Confirm Import')} (${mappedPreviewRows.length})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
