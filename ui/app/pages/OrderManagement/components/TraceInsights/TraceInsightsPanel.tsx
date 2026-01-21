import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Skeleton, SkeletonText } from '@dynatrace/strato-components/content';
import { IntentButton } from '@dynatrace/strato-components/buttons';
import { IntentPayload } from '@dynatrace-sdk/navigation';
import { useTraceInsights } from '../../hooks/useTraceInsights';
import { PerformanceOverviewCard } from './PerformanceOverviewCard';
import { ServiceBreakdownChart } from './ServiceBreakdownChart';
import { ErrorIndicators } from './ErrorIndicators';

interface TraceInsightsPanelProps {
  traceId: string | null;
  timestamp: string;
}

export const TraceInsightsPanel = ({ traceId, timestamp }: TraceInsightsPanelProps) => {
  const { insights, isLoading } = useTraceInsights(traceId, timestamp);

  // Don't render if no traceId
  if (!traceId) {
    return null;
  }

  // Loading state
  if (isLoading) {
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
            <span style={{ fontSize: '20px' }}>🔍</span>
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
              Performance Insights
            </Heading>
          </Flex>
          <SkeletonText lines={1} style={{ width: '100%' }} />
          <Skeleton style={{ width: '100%', height: '80px', borderRadius: '8px' }} />
          <Skeleton style={{ width: '100%', height: '150px', borderRadius: '8px' }} />
        </Flex>
      </Surface>
    );
  }

  // No insights available
  if (!insights) {
    return (
      <Surface
        style={{
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--dt-colors-border-neutral-default)',
          backgroundColor: 'var(--dt-colors-background-surface-default)',
        }}
      >
        <Flex flexDirection="column" gap={12} alignItems="center">
          <span style={{ fontSize: '32px' }}>📊</span>
          <Text style={{ color: 'var(--dt-colors-text-secondary-default)', textAlign: 'center' }}>
            No trace data available for this order
          </Text>
        </Flex>
      </Surface>
    );
  }

  const traceIntent: IntentPayload = {
    'trace_id': traceId,
    'timestamp': timestamp,
  };

  return (
    <Flex flexDirection="column" gap={16}>
      <Surface
        style={{
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid var(--dt-colors-border-neutral-default)',
          backgroundColor: 'var(--dt-colors-background-container-default)',
        }}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" gap={8}>
            <span style={{ fontSize: '20px' }}>🔍</span>
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
              Performance Insights
            </Heading>
          </Flex>
          <IntentButton
            payload={traceIntent}
            variant="emphasized"
            color="primary"
            appId="dynatrace.distributedtracing"
            intentId="view-trace-addon"
          >
            🔍 View Trace
          </IntentButton>
        </Flex>
      </Surface>

      <PerformanceOverviewCard insights={insights} />

      {insights.serviceBreakdown.length > 0 && (
        <ServiceBreakdownChart
          services={insights.serviceBreakdown}
          totalDuration={insights.totalDuration}
        />
      )}

      <ErrorIndicators errors={insights.errors} />
    </Flex>
  );
};
