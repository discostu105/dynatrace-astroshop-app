import { useDql } from '@dynatrace-sdk/react-hooks';
import type { GeoFilters, LocationData, DQLLocationResult } from '../types/geo.types';
import { formatGeoData } from '../utils/geoCalculations';

/**
 * Build DQL query for orders by location
 */
function buildLocationQuery(filters: GeoFilters): string {
  const { from, to } = filters.timeframe;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const fromTime = (from as any)?.value || 'now() - 7d';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const toTime = (to as any)?.value || 'now()';
  
  const groupBy = filters.viewMode === 'city' 
    ? 'shippingAddress.country, shippingAddress.city'
    : 'shippingAddress.country';

  return `
    fetch bizevents, from: ${fromTime}, to: ${toTime}
    | filter event.type == "astroshop.web.checkout_success"
    | filter isNotNull(shippingAddress.country)
    | summarize {
        order_count = count(),
        total_revenue = sum(shippingCostTotal),
        avg_order_value = sum(shippingCostTotal) / count()
      },
      by: {${groupBy}}
    | sort order_count desc
    | limit 200
  `;
}

/**
 * Hook for fetching orders grouped by location
 */
export function useOrdersByLocation(filters: GeoFilters) {
  const query = buildLocationQuery(filters);
  
  const { data, isLoading, error } = useDql({ query });

  let locationData: LocationData[] = [];
  let hasData = false;

  if (data?.records && Array.isArray(data.records)) {
    try {
      const formatted = formatGeoData(data.records as unknown as DQLLocationResult[]);
      locationData = formatted;
      hasData = formatted.length > 0;
    } catch (err) {
      console.error('Error formatting location data:', err);
    }
  }

  return {
    locationData,
    isLoading,
    error,
    hasData,
  };
}
