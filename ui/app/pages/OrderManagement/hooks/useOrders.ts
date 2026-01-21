import { useDql } from '@dynatrace-sdk/react-hooks';
import { useMemo } from 'react';
import type { Order, OrderFilters } from '../types/order.types';

export const useOrders = (filters: OrderFilters) => {
  const query = useMemo(() => {
    const statusFilter = filters.status === 'all'
      ? '(event.type == "astroshop.web.checkout_success" or event.type == "astroshop.web.checkout_failure")'
      : `event.type == "astroshop.web.checkout_${filters.status}"`;
    
    const searchFilter = filters.searchTerm
      ? ` and matchesValue(orderId, "*${filters.searchTerm}*")`
      : '';
    
    const fromTime = filters.timeframe.from.toISOString();
    const toTime = filters.timeframe.to.toISOString();
    
    return `
      fetch bizevents, from: "${fromTime}", to: "${toTime}"
      | filter ${statusFilter}${searchFilter}
      | fields timestamp, orderId, sessionId, shippingCostTotal, 
               shippingTrackingId, items, trace_id, event.type
      | sort timestamp desc
      | limit 100
    `.trim();
  }, [filters]);

  const { data, isLoading, error } = useDql({
    query,
  });

  const orders: Order[] = useMemo(() => {
    if (!data?.records) return [];
    return data.records.map((record: any) => ({
      timestamp: record.timestamp,
      orderId: record.orderId,
      sessionId: record.sessionId,
      shippingCostTotal: record.shippingCostTotal || 0,
      shippingTrackingId: record.shippingTrackingId,
      items: record.items,
      traceId: record.trace_id,
      eventType: record['event.type'],
    }));
  }, [data]);

  return { orders, isLoading, error };
};
