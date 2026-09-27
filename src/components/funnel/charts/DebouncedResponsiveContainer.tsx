'use client';

import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { ResponsiveContainer } from 'recharts';

interface DebouncedResponsiveContainerProps {
  children: ReactElement;
  width?: string | number;
  height?: string | number;
  minHeight?: number;
  debounceMs?: number;
  className?: string;
  id?: string;
}

export function DebouncedResponsiveContainer({
  children,
  width = '100%',
  height = 320,
  minHeight = 220,
  debounceMs = 150,
  className = '',
  id,
}: DebouncedResponsiveContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
    const element = containerRef.current;
    if (!element) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const { width: newWidth, height: newHeight } = entry.contentRect;

      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (newWidth > 0) {
          setContainerDimensions({
            width: Math.floor(newWidth),
            height: Math.floor(newHeight > 0 ? newHeight : (typeof height === 'number' ? height : 320)),
          });
        }
      }, debounceMs);
    });

    observer.observe(element);

    // Initial bounding rect check
    const initialRect = element.getBoundingClientRect();
    if (initialRect.width > 0) {
      setContainerDimensions({
        width: Math.floor(initialRect.width),
        height: Math.floor(initialRect.height > 0 ? initialRect.height : (typeof height === 'number' ? height : 320)),
      });
    }

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [debounceMs, height]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={`w-full relative transition-all duration-150 ${className}`}
      style={{
        minHeight: `${minHeight}px`,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {mounted && containerDimensions.width > 0 ? (
        <ResponsiveContainer
          width="100%"
          height="100%"
          debounce={debounceMs}
        >
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center min-h-[200px]">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--outline)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[var(--primary-container)]"></span>
            <span>Initializing canvas matrix...</span>
          </div>
        </div>
      )}
    </div>
  );
}
