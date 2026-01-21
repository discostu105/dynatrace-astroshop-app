import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import type { ServiceTiming } from '../../types/traceInsights.types';

interface ServiceBreakdownChartProps {
  services: ServiceTiming[];
  totalDuration: number;
}

const formatDuration = (nanoseconds: number): string => {
  const ms = nanoseconds / 1000000;
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

const getServiceColor = (durationMs: number): string => {
  if (durationMs < 50) {
    return 'var(--dt-colors-charts-categorical-grass-default)'; // Green
  } else if (durationMs < 200) {
    return 'var(--dt-colors-charts-categorical-yellow-default)'; // Yellow
  } else {
    return 'var(--dt-colors-charts-categorical-sunrise-default)'; // Red
  }
};

export const ServiceBreakdownChart = ({ services, totalDuration }: ServiceBreakdownChartProps) => {
  // Show top 5 services by duration
  const topServices = services.slice(0, 5);
  const maxDuration = topServices.length > 0 ? topServices[0].totalTime : 1;

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
          <span style={{ fontSize: '20px' }}>📊</span>
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
            Service Breakdown
          </Heading>
        </Flex>

        {topServices.length > 0 ? (
          <Flex flexDirection="column" gap={12}>
            {topServices.map((service, index) => {
              const widthPercentage = (service.totalTime / maxDuration) * 100;
              const durationMs = service.totalTime / 1000000;
              const color = getServiceColor(durationMs);

              return (
                <Flex key={index} flexDirection="column" gap={4}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Flex alignItems="center" gap={8}>
                      <Text style={{ fontSize: '13px', fontWeight: '600', fontFamily: 'monospace' }}>
                        {service.serviceName}
                      </Text>
                      <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)' }}>
                        ({service.spanCount} spans)
                      </Text>
                    </Flex>
                    <Text style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' }}>
                      {formatDuration(service.totalTime)}
                    </Text>
                  </Flex>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'var(--dt-colors-background-container-default)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${widthPercentage}%`,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)' }}>
                    {service.percentage.toFixed(1)}% of total trace time
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        ) : (
          <Text style={{ color: 'var(--dt-colors-text-secondary-default)', textAlign: 'center', padding: '16px' }}>
            No service data available
          </Text>
        )}

        {services.length > 5 && (
          <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)', textAlign: 'center' }}>
            + {services.length - 5} more services
          </Text>
        )}
      </Flex>
    </Surface>
  );
};
