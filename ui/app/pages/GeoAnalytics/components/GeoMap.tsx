import React, { useMemo } from 'react';
import { MapView, BubbleLayer } from '@dynatrace/strato-geo';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Surface } from '@dynatrace/strato-components/layouts';
import type { LocationData, GeoFilters } from '../types/geo.types';
import { formatLocationName, formatCurrency } from '../utils/geoCalculations';

interface GeoMapProps {
  data: LocationData[];
  filters: GeoFilters;
  onLocationClick: (location: LocationData) => void;
  isLoading: boolean;
}

interface BubbleDataPoint {
  latitude: number;
  longitude: number;
  orderCount: number;
  totalRevenue: number;
  avgOrderValue: number;
  locationName: string;
  location: LocationData;
}

export const GeoMap: React.FC<GeoMapProps> = ({
  data,
  filters,
  onLocationClick,
  isLoading,
}) => {
  // Transform location data to bubble layer format
  const bubbleData: BubbleDataPoint[] = useMemo(() => {
    return data.map((location) => ({
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
      orderCount: location.orderCount,
      totalRevenue: location.totalRevenue,
      avgOrderValue: location.avgOrderValue,
      locationName: formatLocationName(location),
      location,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Surface>
        <Flex
          padding={32}
          justifyContent="center"
          alignItems="center"
          style={{ height: '600px' }}
        >
          <div style={{ color: 'var(--dt-colors-text-secondary)' }}>
            Loading geographic data...
          </div>
        </Flex>
      </Surface>
    );
  }

  if (bubbleData.length === 0) {
    return (
      <Surface>
        <Flex
          padding={32}
          justifyContent="center"
          alignItems="center"
          style={{ height: '600px' }}
        >
          <div style={{ color: 'var(--dt-colors-text-secondary)' }}>
            No order data available for the selected filters.
          </div>
        </Flex>
      </Surface>
    );
  }

  return (
    <Surface>
      <MapView height={600}>
        <BubbleLayer
          data={bubbleData}
          radius={(d: BubbleDataPoint) =>
            filters.metric === 'orders' ? d.orderCount : d.totalRevenue
          }
          scale="linear"
          radiusRange={[5, 40]}
          color="var(--dt-colors-charts-categorical-blue)"
        >
          <BubbleLayer.Tooltip>
            {(closestDot) => {
              const point = closestDot.data as BubbleDataPoint;
              return (
                <div style={{ padding: '8px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {point.locationName}
                  </div>
                  <div style={{ color: 'var(--dt-colors-text-secondary)', fontSize: '12px' }}>
                    Orders: {point.orderCount.toLocaleString()}
                  </div>
                  <div style={{ color: 'var(--dt-colors-text-secondary)', fontSize: '12px' }}>
                    Revenue: {formatCurrency(point.totalRevenue)}
                  </div>
                  <div style={{ color: 'var(--dt-colors-text-secondary)', fontSize: '12px' }}>
                    Avg: {formatCurrency(point.avgOrderValue)}
                  </div>
                  <div 
                    style={{ 
                      marginTop: '8px', 
                      fontSize: '11px', 
                      color: 'var(--dt-colors-text-tertiary)',
                      fontStyle: 'italic'
                    }}
                  >
                    Click to view orders
                  </div>
                </div>
              );
            }}
          </BubbleLayer.Tooltip>
        </BubbleLayer>
      </MapView>
      <div
        style={{
          padding: '12px',
          fontSize: '12px',
          color: 'var(--dt-colors-text-secondary)',
          backgroundColor: 'var(--dt-colors-background-neutral)',
          borderTop: '1px solid var(--dt-colors-border-container-default)',
        }}
      >
        {bubbleData.length} locations shown • Click on a bubble to view details
      </div>
    </Surface>
  );
};
