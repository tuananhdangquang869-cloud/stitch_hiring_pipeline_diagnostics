'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  Line,
  ComposedChart,
} from 'recharts';
import {
  AlertTriangle,
  TrendingDown,
  Activity,
  Layers,
  ArrowDownRight,
  Info,
} from 'lucide-react';
import { FunnelStage } from '@/lib/types';
import { DebouncedResponsiveContainer } from './DebouncedResponsiveContainer';
import { FunnelChartTooltip } from './FunnelChartTooltip';
import { ChartEmptyState } from '@/components/ui/ChartEmptyState';

interface DropOffWaterfallChartProps {
  stages: FunnelStage[];
  onSelectStage?: (stageId: string) => void;
  selectedStageId?: string;
  id?: string;
  onResetStages?: () => void;
}

export function DropOffWaterfallChart({
  stages,
  onSelectStage,
  selectedStageId,
  id = 'dropoff-waterfall-chart',
  onResetStages,
}: DropOffWaterfallChartProps) {
  if (!stages || stages.length === 0) {
    return (
      <ChartEmptyState
        title="No Pipeline Stages Configured"
        description="This job requisition currently has no stages or candidate activity registered in the pipeline."
        diagnosticTip="Verify that this requisition is ACTIVE and configured with standard hiring stages (Applied, Screening, Interview, Offer, Hired)."
        actionLabel="Reload Pipeline Stages"
        onAction={onResetStages}
        iconType="chart"
      />
    );
  }
  // Transform stages for Waterfall / Stacked Bar representation
  const chartData = stages.map((stage, idx) => {
    const isBottleneck = stage.isBottleneck || false;
    const prevVol = idx > 0 ? stages[idx - 1].volumePassed : stage.volumeIn;
    return {
      ...stage,
      stageName: stage.name,
      passed: stage.volumePassed,
      dropped: stage.volumeDropped,
      totalIn: stage.volumeIn,
      conversionPct: Number((100 - stage.dropRate).toFixed(1)),
      dropRatePct: Number(stage.dropRate.toFixed(1)),
      isBottleneck,
    };
  });

  const totalDropped = stages.reduce((acc, s) => acc + s.volumeDropped, 0);
  const initialVol = stages[0]?.volumeIn || 1;
  const finalHired = stages[stages.length - 1]?.volumePassed || 0;
  const netConversion = ((finalHired / initialVol) * 100).toFixed(1);
  const worstStage = [...stages].sort((a, b) => b.volumeDropped - a.volumeDropped)[0];

  return (
    <div className="w-full space-y-4" id={id}>
      {/* Waterfall Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[var(--surface-container)] rounded-lg p-3 border border-[var(--outline-variant)]/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[var(--outline)] uppercase tracking-wider block">
              Cumulative Dropouts
            </span>
            <span className="text-xl font-bold font-mono text-[var(--severity-critical-muted)] mt-0.5 block">
              {totalDropped.toLocaleString()} candidates
            </span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--severity-critical-container)]/50 text-[var(--severity-critical-muted)]">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[var(--surface-container)] rounded-lg p-3 border border-[var(--outline-variant)]/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[var(--outline)] uppercase tracking-wider block">
              Net Pipeline Conversion
            </span>
            <span className="text-xl font-bold font-mono text-[var(--primary-container)] mt-0.5 block">
              {netConversion}%
            </span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--primary-container)]/20 text-[var(--primary)]">
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[var(--surface-container)] rounded-lg p-3 border border-[var(--severity-warning)]/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[var(--severity-warning)] uppercase tracking-wider block">
              Primary Leak Stage
            </span>
            <span className="text-sm font-bold font-sans text-[var(--foreground)] truncate max-w-[150px] mt-0.5 block">
              {worstStage?.name} (-{worstStage?.volumeDropped})
            </span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--severity-warning-container)] text-[var(--severity-warning)]">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Waterfall Chart Canvas */}
      <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/60 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--primary-container)]" />
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--foreground)]">
              STAGE-BY-STAGE DROPOUT WATERFALL DISTRIBUTION
            </h4>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[var(--primary-container)]"></span>
              <span className="text-[var(--outline)]">Passed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[var(--severity-critical-muted)]"></span>
              <span className="text-[var(--outline)]">Dropped (Leakage)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-[var(--secondary)]"></span>
              <span className="text-[var(--outline)]">Conversion %</span>
            </div>
          </div>
        </div>

        <DebouncedResponsiveContainer height={340}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length && onSelectStage) {
                const clickedStage = state.activePayload[0].payload as FunnelStage;
                onSelectStage(clickedStage.id);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(62, 72, 79, 0.3)" vertical={false} />
            <XAxis
              dataKey="stageName"
              tick={{ fill: '#dae2fd', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#3e484f' }}
              axisLine={{ stroke: '#3e484f' }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#87929a', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#3e484f' }}
              axisLine={{ stroke: '#3e484f' }}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: '#ffb95f', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#3e484f' }}
              axisLine={{ stroke: '#3e484f' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<FunnelChartTooltip />} />
            {/* Item 19: Benchmark Overlay Line */}
            <ReferenceLine
              yAxisId="right"
              y={50}
              stroke="#ffb95f"
              strokeDasharray="4 4"
              strokeOpacity={0.8}
              label={{
                value: 'Expected Conversion Target (50%)',
                fill: '#ffb95f',
                fontSize: 9,
                position: 'insideTopRight',
              }}
            />
            {/* Item 20: Smooth Chart Entry Animation */}
            <Bar
              yAxisId="left"
              dataKey="passed"
              name="Passed Volume"
              stackId="volume"
              fill="#38bdf8"
              radius={[0, 0, 0, 0]}
              cursor="pointer"
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-passed-${entry.id}`}
                  fill={entry.id === selectedStageId ? '#8ed5ff' : '#38bdf8'}
                  opacity={entry.id === selectedStageId ? 1 : 0.85}
                />
              ))}
            </Bar>
            <Bar
              yAxisId="left"
              dataKey="dropped"
              name="Dropped Volume"
              stackId="volume"
              fill="#ff6b6b"
              radius={[4, 4, 0, 0]}
              cursor="pointer"
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-drop-${entry.id}`}
                  fill={entry.isBottleneck ? '#ff6b6b' : '#ffb4ab'}
                  opacity={entry.isBottleneck ? 1 : 0.7}
                />
              ))}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="conversionPct"
              name="Stage Conversion %"
              stroke="#ffb95f"
              strokeWidth={2.5}
              dot={{ fill: '#ffb95f', r: 4, strokeWidth: 2, stroke: '#0b1326' }}
              activeDot={{ r: 6, fill: '#ffb95f', stroke: '#ffffff' }}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </DebouncedResponsiveContainer>

        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[var(--outline)] border-t border-[var(--outline-variant)]/30 pt-2">
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3 text-[var(--outline)]" />
            <span>Click any bar to inspect root-cause drop reasons in the stage drawer</span>
          </div>
          <span>Stacked bars indicate candidate retention vs. attrition</span>
        </div>
      </div>
    </div>
  );
}
