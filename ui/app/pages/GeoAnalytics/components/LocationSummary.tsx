import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Surface } from '@dynatrace/strato-components/layouts';
import { Heading } from '@dynatrace/strato-components/typography';
import type { LocationData, GeoFilters } from '../types/geo.types';
import { getTopLocations, formatLocationName, formatCurrency } from '../utils/geoCalculations';

interface LocationSummaryProps {
  locations: LocationData[];
  filters: GeoFilters;
  onLocationSelect: (location: LocationData) => void;
  isLoading: boolean;
}

export const LocationSummary: React.FC<LocationSummaryProps> = ({
  locations,
  filters,
  onLocationSelect,
  isLoading,
}) => {
  const topLocations = getTopLocations(locations, filters.metric, 10);

  return (
    <Surface>
      <Flex flexDirection="column" gap={16} padding={16}>
        <Heading level={4}>📊 Top Locations</Heading>

        {isLoading ? (
          <div style={{ color: 'var(--dt-colors-text-secondary)' }}>Loading...</div>
        ) : topLocations.length === 0 ? (
          <div style={{ color: 'var(--dt-colors-text-secondary)' }}>
            No order data available for the selected timeframe.
          </div>
        ) : (
          <Flex flexDirection="column" gap={8}>
            {topLocations.map((location, index) => (
              <div
                key={`${location.country}:${location.city || ''}`}
                onClick={() => onLocationSelect(location)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'var(--dt-colors-background-neutral)',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'var(--dt-colors-background-neutral-hover)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'var(--dt-colors-background-neutral)';
                }}
              >
                <Flex gap={16} alignItems="center">
                  <span
                    style={{
                      fontWeight: 'bold',
                      minWidth: '20px',
                      color: 'var(--dt-colors-text-secondary)',
                    }}
                  >
                    {index + 1}.
                  </span>
                  <span>{formatLocationName(location)}</span>
                </Flex>
                <span style={{ fontWeight: '600' }}>
                  {filters.metric === 'orders'
                    ? location.orderCount
                    : formatCurrency(location.totalRevenue)}
                </span>
              </div>
            ))}
          </Flex>
        )}
      </Flex>
    </Surface>
  );
};
