import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Container } from '@dynatrace/strato-components/layouts';
import { Tabs, Tab } from '@dynatrace/strato-components-preview/navigation';
import type { LocationData } from './types/geo.types';
import { GeoHeader } from './components/GeoHeader';
import { GeoFilters } from './components/GeoFilters';
import { GeoMap } from './components/GeoMap';
import { LocationSummary } from './components/LocationSummary';
import { GeoLegend } from './components/GeoLegend';
import { LocationDrilldown } from './components/LocationDrilldown';
import { useGeoFilters } from './hooks/useGeoFilters';
import { useOrdersByLocation } from './hooks/useOrdersByLocation';
import { useLocationOrders } from './hooks/useLocationOrders';
import { calculateStatistics } from './utils/geoCalculations';

export const GeoAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { filters, updateTimeframe, updateViewMode, updateMetric } = useGeoFilters();
  const { locationData, isLoading: isLoadingLocations, error: locationsError } =
    useOrdersByLocation(filters);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const { orders: selectedLocationOrders, isLoading: isLoadingOrders } =
    useLocationOrders(selectedLocation, filters);

  const statistics = calculateStatistics(locationData);

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const handleCloseDrilldown = () => {
    setSelectedLocation(null);
  };

  return (
    <Container>
      <Flex flexDirection="column" gap={32} padding={32}>
        <Tabs selectedIndex={location.pathname === '/geo' ? 1 : 0} onChange={(index) => navigate(index === 1 ? '/geo' : '/')}>
          <Tab title="Orders">Orders</Tab>
          <Tab title="Geographic">Geographic</Tab>
        </Tabs>
        {/* Header with summary statistics */}
        <GeoHeader statistics={statistics} isLoading={isLoadingLocations} />

        {/* Filter controls */}
        <GeoFilters
          filters={filters}
          onTimeframeChange={updateTimeframe}
          onViewModeChange={updateViewMode}
          onMetricChange={updateMetric}
        />

        {/* Error message */}
        {locationsError && (
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--dt-colors-feedback-warning)',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            Error loading geographic data. Please try again.
          </div>
        )}

        {/* Main content: Map and sidebar */}
        <Flex gap={32} flexWrap="wrap">
          {/* Map - takes most of the space */}
          <Flex flexDirection="column" flex="1" style={{ minWidth: '600px' }}>
            <GeoMap
              data={locationData}
              filters={filters}
              onLocationClick={handleLocationSelect}
              isLoading={isLoadingLocations}
            />
          </Flex>

          {/* Sidebar: Summary and Legend */}
          <Flex
            flexDirection="column"
            gap={32}
            style={{ minWidth: '280px', maxWidth: '350px' }}
          >
            <LocationSummary
              locations={locationData}
              filters={filters}
              onLocationSelect={handleLocationSelect}
              isLoading={isLoadingLocations}
            />
            <GeoLegend metric={filters.metric} />
          </Flex>
        </Flex>

        {/* Drill-down panel - appears below when location is selected */}
        {selectedLocation && (
          <LocationDrilldown
            location={selectedLocation}
            orders={selectedLocationOrders}
            isLoading={isLoadingOrders}
            onClose={handleCloseDrilldown}
            onOrderClick={(order) => {
              // Could navigate to order detail here
              console.log('Order clicked:', order);
            }}
          />
        )}
      </Flex>
    </Container>
  );
};
