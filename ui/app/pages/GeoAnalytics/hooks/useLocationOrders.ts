import { useDql } from '@dynatrace-sdk/react-hooks';
import type { GeoFilters, LocationData, LocationOrder, DQLOrderResult } from '../types/geo.types';

/**
 * Build DQL query for orders from a specific location
 */
function buildLocationOrdersQuery(
  location: LocationData,
  filters: GeoFilters
): string {
  const { from, to } = filters.timeframe;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const fromTime = (from as any)?.value || 'now() - 7d';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const toTime = (to as any)?.value || 'now()';

  let filterConditions = `| filter event.type == "astroshop.web.checkout_success"
    | filter shippingAddress.country == "${location.country}"`;

  if (location.city) {
    filterConditions += `\n    | filter shippingAddress.city == "${location.city}"`;
  }

  return `
    fetch bizevents, from: ${fromTime}, to: ${toTime}
    ${filterConditions}
    | fields timestamp, orderId, sessionId, shippingCostTotal
    | sort timestamp desc
    | limit 100
  `;
}

/**
 * Hook for fetching orders from a selected location
 */
export function useLocationOrders(
  location: LocationData | null,
  filters: GeoFilters
) {
  const enabled = location !== null;
  const query = enabled ? buildLocationOrdersQuery(location, filters) : 'fetch logs | limit 0';

  const { data, isLoading, error } = useDql({ query });

  let orders: LocationOrder[] = [];

  if (enabled && data?.records && Array.isArray(data.records)) {
    try {
      orders = (data.records as unknown as DQLOrderResult[]).map((item) => ({
        orderId: item.orderId,
        timestamp: item.timestamp,
        shippingCostTotal: item.shippingCostTotal,
        sessionId: item.sessionId,
      }));
    } catch (err) {
      console.error('Error formatting location orders:', err);
    }
  }

  return {
    orders,
    isLoading: enabled && isLoading,
    error: enabled ? error : null,
  };
}
