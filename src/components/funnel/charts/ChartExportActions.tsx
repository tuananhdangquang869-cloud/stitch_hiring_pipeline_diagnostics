'use client';

import React, { useState } from 'react';
import {
  Download,
  FileImage,
  FileCode,
  Printer,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  exportChartToPng,
  exportChartToSvg,
  exportChartToPdf,
} from '@/lib/chart-exporter';

interface ChartExportActionsProps {
  targetElementId: string;
  chartTitle?: string;
  className?: string;
}

export function ChartExportActions({
  targetElementId,
  chartTitle = 'Pipeline Analytics Chart',
  className = '',
}: ChartExportActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportingState, setExportingState] = useState<string | null>(null);

  const handleExportPng = async () => {
    setExportingState('PNG');
    setIsOpen(false);
    await exportChartToPng(targetElementId, {
      fileName: chartTitle.toLowerCase().replace(/\s+/g, '-'),
      scale: 2,
    });
    setTimeout(() => setExportingState(null), 1500);
  };

  const handleExportSvg = async () => {
    setExportingState('SVG');
    setIsOpen(false);
    await exportChartToSvg(targetElementId, {
      fileName: chartTitle.toLowerCase().replace(/\s+/g, '-'),
    });
    setTimeout(() => setExportingState(null), 1500);
  };

  const handleExportPdf = () => {
    setExportingState('PDF');
    setIsOpen(false);
    exportChartToPdf(targetElementId, chartTitle);
    setTimeout(() => setExportingState(null), 1500);
  };

  return (
    <div className={`relative inline-block text-left font-mono ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={Boolean(exportingState)}
        className="px-2.5 py-1 rounded bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] hover:text-[var(--foreground)] border border-[var(--outline-variant)] text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
      >
        {exportingState ? (
          <>
            <CheckCircle2 className="w-3 h-3 text-[var(--severity-healthy)] animate-pulse" />
            <span>Exporting {exportingState}...</span>
          </>
        ) : (
          <>
            <Download className="w-3 h-3 text-[var(--primary-container)]" />
            <span>Export Chart</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-[var(--surface-container-highest)] border border-[var(--outline-variant)] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
            <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-[var(--outline)] border-b border-[var(--outline-variant)]/40 mb-1">
              Export Graphic
            </div>

            <button
              onClick={handleExportPng}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[var(--primary-container)] hover:text-[var(--on-primary)] text-[var(--foreground)] transition-colors text-left cursor-pointer group"
            >
              <FileImage className="w-3.5 h-3.5 text-[var(--primary-container)] group-hover:text-[var(--on-primary)]" />
              <div>
                <span className="font-semibold block">Download PNG</span>
                <span className="text-[10px] text-[var(--outline)] group-hover:text-[var(--on-primary)]/80 block">
                  High-res (2x Retina)
                </span>
              </div>
            </button>

            <button
              onClick={handleExportSvg}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[var(--primary-container)] hover:text-[var(--on-primary)] text-[var(--foreground)] transition-colors text-left cursor-pointer group"
            >
              <FileCode className="w-3.5 h-3.5 text-[var(--tertiary)] group-hover:text-[var(--on-primary)]" />
              <div>
                <span className="font-semibold block">Download SVG</span>
                <span className="text-[10px] text-[var(--outline)] group-hover:text-[var(--on-primary)]/80 block">
                  Scalable vector format
                </span>
              </div>
            </button>

            <button
              onClick={handleExportPdf}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[var(--primary-container)] hover:text-[var(--on-primary)] text-[var(--foreground)] transition-colors text-left cursor-pointer group border-t border-[var(--outline-variant)]/30 mt-1 pt-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[var(--secondary)] group-hover:text-[var(--on-primary)]" />
              <div>
                <span className="font-semibold block">Print / PDF Report</span>
                <span className="text-[10px] text-[var(--outline)] group-hover:text-[var(--on-primary)]/80 block">
                  Executive briefing layout
                </span>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
