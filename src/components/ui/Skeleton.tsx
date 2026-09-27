'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton-shimmer ${className}`} />;
}

// Structured Funnel Dashboard Skeleton Loader
export function FunnelDashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--background)] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-[var(--outline-variant)]/40 pb-5">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-[var(--outline-variant)]/50 bg-[var(--surface-container-low)] space-y-3"
          >
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
        ))}
      </div>

      {/* Funnel Visualization & Inspector Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Horizontal Funnel Bars Skeleton */}
        <div className="xl:col-span-7 p-5 rounded-2xl border border-[var(--outline-variant)]/50 bg-[var(--surface-container-low)] space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--outline-variant)]/30">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Stage Diagnostic Inspector Skeleton */}
        <div className="xl:col-span-5 p-5 rounded-2xl border border-[var(--outline-variant)]/50 bg-[var(--surface-container-low)] space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--outline-variant)]/30">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-3 pt-2">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Structured Candidate Explorer Table Skeleton Loader
export function CandidateExplorerSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--background)] p-3 sm:p-6 pb-20 lg:pb-6 space-y-4">
      {/* Top Banner */}
      <div className="flex justify-between items-center border-b border-[var(--outline-variant)]/40 pb-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-3 w-80 rounded" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>

      {/* Filter Tabs & Search Bar Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      {/* Candidate Rows Skeleton */}
      <div className="border border-[var(--outline-variant)]/50 rounded-xl bg-[var(--surface-container-low)] overflow-hidden">
        <div className="p-3 border-b border-[var(--outline-variant)]/40 flex justify-between">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="divide-y divide-[var(--outline-variant)]/20 p-2 space-y-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="py-3 px-2 flex justify-between items-center">
              <div className="space-y-1.5 w-1/4">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
