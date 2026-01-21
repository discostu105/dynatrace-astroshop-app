import { useDql } from '@dynatrace-sdk/react-hooks';
import { useMemo } from 'react';
import type { Order, OrderFilters } from '../types/order.types';

// Helper to convert timeframe values to DQL format
const formatTimeForDQL = (timeValue: any): string => {
  // Handle undefined or null
  if (!timeValue) {
    return 'now()';
  }
  
  // Handle Date objects
  if (timeValue instanceof Date) {
    return `"${timeValue.toISOString()}"`;
  }
  
  // Handle numbers (timestamps)
  if (typeof timeValue === 'number') {
    return `"${new Date(timeValue).toISOString()}"`;
  }
  
  // Handle objects (extract value property if present)
  if (typeof timeValue === 'object' && timeValue.value !== undefined) {
    return formatTimeForDQL(timeValue.value);
  }
  
  // Handle strings
  if (typeof timeValue !== 'string') {
    console.warn('Unexpected timeValue type:', typeof timeValue, timeValue);
    return 'now()';
  }
  
  // Remove any existing quotes
  const cleanValue = timeValue.replace(/^["']|["']$/g, '');
  
  // If it's 'now', convert to 'now()'
  if (cleanValue === 'now') {
    return 'now()';
  }
  // If it's a relative time string like 'now-2h', convert to 'now()-2h' (NO QUOTES)
  if (cleanValue.startsWith('now-') || cleanValue.startsWith('now+') || cleanValue.startsWith('now()')) {
    return cleanValue.replace(/^now(?!\()/, 'now()');
  }
  // Otherwise assume it's an ISO string and return with quotes for DQL
  return `"${cleanValue}"`;
};

export const useOrders = (filters: OrderFilters) => {
  const query = useMemo(() => {
    console.log('Filters received:', filters);
    console.log('Timeframe from:', filters.timeframe.from, typeof filters.timeframe.from);
    console.log('Timeframe to:', filters.timeframe.to, typeof filters.timeframe.to);
    
    const statusFilter = filters.status === 'all'
      ? '(event.type == "astroshop.web.checkout_success" or event.type == "astroshop.web.checkout_failure")'
      : `event.type == "astroshop.web.checkout_${filters.status}"`;
    
    const searchFilter = filters.searchTerm
      ? ` and matchesValue(orderId, "*${filters.searchTerm}*")`
      : '';
    
    const fromTime = formatTimeForDQL(filters.timeframe.from);
    const toTime = formatTimeForDQL(filters.timeframe.to);
    
    console.log('Formatted fromTime:', fromTime);
    console.log('Formatted toTime:', toTime);
    
    return `
      fetch bizevents, from: ${fromTime}, to: ${toTime}
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
