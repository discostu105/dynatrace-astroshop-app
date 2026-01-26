import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading } from '@dynatrace/strato-components/typography';
import { Surface } from '@dynatrace/strato-components/layouts';
import type { GeoStatistics } from '../types/geo.types';
import { formatCurrency, formatNumber } from '../utils/geoCalculations';

interface GeoHeaderProps {
  statistics: GeoStatistics;
  isLoading: boolean;
}

export const GeoHeader: React.FC<GeoHeaderProps> = ({ statistics, isLoading }) => {
  return (
    <Surface>
      <Flex gap={32} alignItems="center" justifyContent="space-between" padding={16}>
        <Flex gap={8} flexDirection="column">
          <Heading level={2}>Geographic Order Analytics</Heading>
          <p style={{ margin: 0, color: 'var(--dt-colors-text-secondary)' }}>
            Visualize order distribution across regions and countries
          </p>
        </Flex>

        {!isLoading && (
          <Flex gap={48}>
            <Flex gap={8} flexDirection="column" alignItems="center">
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatNumber(statistics.totalOrders)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary)' }}>
                Total Orders
              </div>
            </Flex>

            <Flex gap={8} flexDirection="column" alignItems="center">
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatNumber(statistics.uniqueCountries)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary)' }}>
                Countries
              </div>
            </Flex>

            <Flex gap={8} flexDirection="column" alignItems="center">
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatCurrency(statistics.totalRevenue)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary)' }}>
                Total Revenue
              </div>
            </Flex>

            <Flex gap={8} flexDirection="column" alignItems="center">
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {formatCurrency(statistics.avgOrderValue)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary)' }}>
                Avg Order Value
              </div>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Surface>
  );
};
