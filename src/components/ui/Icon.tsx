import React from 'react';
import { LucideIcon } from 'lucide-react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  'aria-label'?: string;
}

/**
 * Centralized icon wrapper for consistent sizing across the application.
 *
 * Sizes:
 * - xs (12px): Inline badges, tiny indicators
 * - sm (14px): Small controls, compact buttons
 * - md (16px): Default buttons, nav items
 * - lg (20px): Headers, modal titles
 * - xl (24px): Upload zones, hero sections
 */
export function Icon({ icon: LucideComponent, size = 'md', className = '', ...props }: IconProps) {
  return (
    <LucideComponent
      className={`${sizeMap[size]} ${className}`.trim()}
      aria-hidden={!props['aria-label']}
      {...props}
    />
  );
}
