import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import type { TraceError } from '../../types/traceInsights.types';

interface ErrorIndicatorsProps {
  errors: TraceError[];
}

export const ErrorIndicators = ({ errors }: ErrorIndicatorsProps) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <Surface
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid var(--dt-colors-charts-categorical-sunrise-default)',
        backgroundColor: 'rgba(239, 83, 80, 0.05)',
      }}
    >
      <Flex flexDirection="column" gap={16}>
        <Flex alignItems="center" gap={8}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <Heading
            level={5}
            style={{
              color: 'var(--dt-colors-charts-categorical-sunrise-default)',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
            }}
          >
            Issues Detected ({errors.length})
          </Heading>
        </Flex>

        <Flex flexDirection="column" gap={12}>
          {errors.map((error, index) => (
            <Surface
              key={index}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--dt-colors-border-neutral-default)',
                backgroundColor: 'var(--dt-colors-background-surface-default)',
              }}
            >
              <Flex flexDirection="column" gap={8}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex alignItems="center" gap={8}>
                    <span style={{ fontSize: '14px' }}>🔴</span>
                    <Text style={{ fontWeight: '600', fontSize: '13px' }}>
                      {error.serviceName}
                    </Text>
                  </Flex>
                  {error.statusCode && (
                    <div
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(239, 83, 80, 0.1)',
                        border: '1px solid var(--dt-colors-charts-categorical-sunrise-default)',
                      }}
                    >
                      <Text style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'monospace' }}>
                        {error.statusCode}
                      </Text>
                    </div>
                  )}
                </Flex>

                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--dt-colors-background-container-default)',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                >
                  <Flex flexDirection="column" gap={4}>
                    <Text style={{ color: 'var(--dt-colors-text-secondary-default)' }}>
                      Span: {error.spanName}
                    </Text>
                    <Text style={{ color: 'var(--dt-colors-charts-categorical-sunrise-default)', fontWeight: '600' }}>
                      {error.exceptionType}
                    </Text>
                    <Text style={{ color: 'var(--dt-colors-text-primary-default)', fontSize: '11px' }}>
                      {error.exceptionMessage}
                    </Text>
                  </Flex>
                </div>
              </Flex>
            </Surface>
          ))}
        </Flex>
      </Flex>
    </Surface>
  );
};
