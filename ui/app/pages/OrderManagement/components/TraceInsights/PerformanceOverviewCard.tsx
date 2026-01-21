import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import type { TraceInsights } from '../../types/traceInsights.types';

interface PerformanceOverviewCardProps {
  insights: TraceInsights;
}

const formatDuration = (nanoseconds: number): string => {
  const ms = nanoseconds / 1000000;
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

const getPerformanceStatus = (badge: string) => {
  switch (badge) {
    case 'fast':
      return { icon: '🟢', label: 'Good', color: 'var(--dt-colors-charts-categorical-grass-default)' };
    case 'slow':
      return { icon: '🟡', label: 'Slow', color: 'var(--dt-colors-charts-categorical-yellow-default)' };
    case 'very-slow':
      return { icon: '🔴', label: 'Very Slow', color: 'var(--dt-colors-charts-categorical-sunrise-default)' };
    case 'error':
      return { icon: '❌', label: 'Error', color: 'var(--dt-colors-charts-categorical-sunrise-default)' };
    default:
      return { icon: '⚪', label: 'Unknown', color: 'var(--dt-colors-text-secondary-default)' };
  }
};

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
  <Flex flexDirection="column" gap={4}>
    <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </Text>
    <Text style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'monospace' }}>
      {value}
    </Text>
  </Flex>
);

export const PerformanceOverviewCard = ({ insights }: PerformanceOverviewCardProps) => {
  const status = getPerformanceStatus(insights.performanceBadge);
  const dbDurationMs = insights.databaseOperations.totalDuration / 1000000;

  return (
    <Surface
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--dt-colors-border-neutral-default)',
        backgroundColor: 'var(--dt-colors-background-surface-default)',
      }}
    >
      <Flex flexDirection="column" gap={16}>
        <Flex alignItems="center" gap={8}>
          <span style={{ fontSize: '20px' }}>🚀</span>
          <Heading
            level={5}
            style={{
              color: 'var(--dt-colors-text-primary-default)',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
            }}
          >
            Performance Overview
          </Heading>
        </Flex>

        <Flex
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--dt-colors-background-container-default)',
            border: '1px solid var(--dt-colors-border-neutral-default)',
          }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex alignItems="center" gap={8}>
            <span style={{ fontSize: '20px' }}>{status.icon}</span>
            <Text style={{ fontSize: '14px', fontWeight: '600' }}>Status</Text>
          </Flex>
          <Text style={{ fontSize: '14px', fontWeight: '700', color: status.color }}>
            {status.label}
          </Text>
        </Flex>

        <Flex gap={16} style={{ marginTop: '8px' }}>
          <StatItem label="Total Duration" value={formatDuration(insights.totalDuration)} />
          <StatItem label="Service Calls" value={`${insights.spanCount} spans`} />
        </Flex>

        <Flex gap={16}>
          <StatItem 
            label="Database Ops" 
            value={insights.databaseOperations.totalCalls > 0 
              ? `${insights.databaseOperations.totalCalls} (${dbDurationMs.toFixed(1)}ms)` 
              : '0'
            } 
          />
          <StatItem label="Errors" value={insights.errors.length} />
        </Flex>
      </Flex>
    </Surface>
  );
};
