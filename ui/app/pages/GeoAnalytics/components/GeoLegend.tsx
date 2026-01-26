import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Surface } from '@dynatrace/strato-components/layouts';
import { Heading } from '@dynatrace/strato-components/typography';
import type { GeoFilters } from '../types/geo.types';

interface GeoLegendProps {
  metric: GeoFilters['metric'];
}

export const GeoLegend: React.FC<GeoLegendProps> = ({ metric }) => {
  return (
    <Surface>
      <Flex flexDirection="column" gap={16} padding={16}>
        <Heading level={4}>Legend</Heading>

        <Flex flexDirection="column" gap={8}>
          <Flex gap={8} alignItems="center">
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'var(--dt-colors-charts-categorical-blue)',
              }}
            />
            <span style={{ fontSize: '12px' }}>
              {metric === 'orders' ? 'Higher order count' : 'Higher revenue'}
            </span>
          </Flex>

          <Flex gap={8} alignItems="center">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--dt-colors-charts-categorical-blue)',
                opacity: 0.5,
              }}
            />
            <span style={{ fontSize: '12px' }}>
              {metric === 'orders' ? 'Lower order count' : 'Lower revenue'}
            </span>
          </Flex>

          <div
            style={{
              fontSize: '12px',
              marginTop: '8px',
              padding: '8px',
              backgroundColor: 'var(--dt-colors-background-neutral)',
              borderRadius: '4px',
              color: 'var(--dt-colors-text-secondary)',
              lineHeight: '1.4',
            }}
          >
            • Bubble size represents the order count
            <br />• Bubble color intensity represents revenue
            <br />• Click a bubble to see orders from that location
          </div>
        </Flex>
      </Flex>
    </Surface>
  );
};
