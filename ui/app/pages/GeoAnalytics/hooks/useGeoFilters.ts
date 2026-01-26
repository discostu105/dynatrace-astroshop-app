import { useState } from 'react';
import type { GeoFilters } from '../types/geo.types';

/**
 * Hook for managing geographic filter state
 */
export function useGeoFilters() {
  const [filters, setFilters] = useState<GeoFilters>({
    timeframe: {
      from: { type: 'expression' as const, value: 'now() - 7d', absoluteDate: '' },
      to: { type: 'expression' as const, value: 'now()', absoluteDate: '' },
    },
    viewMode: 'city',
    metric: 'orders',
  });

  const updateTimeframe = (timeframe: GeoFilters['timeframe']) => {
    setFilters((prev) => ({ ...prev, timeframe }));
  };

  const updateViewMode = (viewMode: 'country' | 'city') => {
    setFilters((prev) => ({ ...prev, viewMode }));
  };

  const updateMetric = (metric: 'orders' | 'revenue') => {
    setFilters((prev) => ({ ...prev, metric }));
  };

  return {
    filters,
    updateTimeframe,
    updateViewMode,
    updateMetric,
  };
}
