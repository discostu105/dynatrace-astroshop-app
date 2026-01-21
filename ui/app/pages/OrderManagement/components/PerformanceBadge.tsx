import React from 'react';
import { Text } from '@dynatrace/strato-components/typography';
import type { PerformanceBadgeType } from '../types/traceInsights.types';

interface PerformanceBadgeProps {
  badge: PerformanceBadgeType | null;
  duration?: number; // in nanoseconds
}

const formatDuration = (nanoseconds: number): string => {
  const ms = nanoseconds / 1000000;
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

const getBadgeConfig = (badge: PerformanceBadgeType | null) => {
  switch (badge) {
    case 'fast':
      return {
        icon: '🟢',
        label: 'Fast',
        backgroundColor: 'rgba(44, 165, 44, 0.1)',
        borderColor: 'var(--dt-colors-charts-categorical-grass-default)',
        textColor: 'var(--dt-colors-charts-categorical-grass-default)',
      };
    case 'slow':
      return {
        icon: '🟡',
        label: 'Slow',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderColor: 'var(--dt-colors-charts-categorical-yellow-default)',
        textColor: 'var(--dt-colors-charts-categorical-yellow-default)',
      };
    case 'very-slow':
      return {
        icon: '🔴',
        label: 'Very Slow',
        backgroundColor: 'rgba(239, 83, 80, 0.1)',
        borderColor: 'var(--dt-colors-charts-categorical-sunrise-default)',
        textColor: 'var(--dt-colors-charts-categorical-sunrise-default)',
      };
    case 'error':
      return {
        icon: '❌',
        label: 'Error',
        backgroundColor: 'rgba(239, 83, 80, 0.1)',
        borderColor: 'var(--dt-colors-charts-categorical-sunrise-default)',
        textColor: 'var(--dt-colors-charts-categorical-sunrise-default)',
      };
    default:
      return {
        icon: '⚪',
        label: 'Unknown',
        backgroundColor: 'var(--dt-colors-background-container-default)',
        borderColor: 'var(--dt-colors-border-neutral-default)',
        textColor: 'var(--dt-colors-text-secondary-default)',
      };
  }
};

export const PerformanceBadge = ({ badge, duration }: PerformanceBadgeProps) => {
  const config = getBadgeConfig(badge);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '12px',
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      <span style={{ fontSize: '14px' }}>{config.icon}</span>
      <Text style={{ fontSize: '12px', fontWeight: '600', color: config.textColor }}>
        {config.label}
      </Text>
      {duration !== undefined && (
        <Text style={{ fontSize: '11px', fontWeight: '500', color: config.textColor, fontFamily: 'monospace' }}>
          ({formatDuration(duration)})
        </Text>
      )}
    </div>
  );
};
