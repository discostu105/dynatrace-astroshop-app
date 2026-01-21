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

const SERVICE_COLORS = [
  '#7c3aed', // purple
  '#2563eb', // blue
  '#0891b2', // cyan
  '#059669', // emerald
  '#d97706', // amber
  '#dc2626', // red
  '#db2777', // pink
  '#4f46e5', // indigo
];

export const ServiceBreakdownChart = ({ services, totalDuration }: ServiceBreakdownChartProps) => {
  const maxDuration = services.length > 0 ? Math.max(...services.map(s => s.totalTime)) : 1;

  return (
    <Surface
      style={{
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid var(--dt-colors-border-neutral-default)',
        backgroundColor: 'var(--dt-colors-background-surface-default)',
      }}
    >
      <Flex flexDirection="column" gap={12}>
        <Flex alignItems="center" gap={8}>
          <span style={{ fontSize: '16px' }}>📊</span>
          <Heading
            level={5}
            style={{
              color: 'var(--dt-colors-text-primary-default)',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
              margin: 0,
            }}
          >
            Service Breakdown
          </Heading>
          <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', marginLeft: 'auto' }}>
            {services.length} services
          </Text>
        </Flex>

        {services.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {services.map((service, index) => {
              const barWidth = Math.max((service.totalTime / maxDuration) * 100, 2);
              const color = SERVICE_COLORS[index % SERVICE_COLORS.length];

              return (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 1fr 55px',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {/* Service info */}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dt-colors-text-primary-default)' }}>
                      {service.serviceName}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--dt-colors-text-secondary-default)' }}>
                      {service.spanCount} spans
                    </div>
                  </div>

                  {/* Bar chart */}
                  <div
                    style={{
                      height: '24px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      overflow: 'visible',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${barWidth}%`,
                        borderRadius: '4px',
                        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                        boxShadow: `0 0 12px ${color}44`,
                        position: 'relative',
                      }}
                    />
                  </div>

                  {/* Duration */}
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      textAlign: 'right',
                      color: 'var(--dt-colors-text-primary-default)',
                    }}
                  >
                    {formatDuration(service.totalTime)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Text style={{ color: 'var(--dt-colors-text-secondary-default)', textAlign: 'center', padding: '12px' }}>
            No service data available
          </Text>
        )}
      </Flex>
    </Surface>
  );
};
