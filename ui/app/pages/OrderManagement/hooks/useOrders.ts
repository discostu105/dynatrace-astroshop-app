import { useDql } from '@dynatrace-sdk/react-hooks';
import { useMemo } from 'react';
import type { TimeValue } from '@dynatrace/strato-components-preview/core';
import type { Order, OrderFilters } from '../types/order.types';

// Helper to convert timeframe values to DQL format
const formatTimeForDQL = (timeValue: TimeValue): string => {
  const value = timeValue.value;
  
  // If it's 'now', convert to 'now()'
  if (value === 'now') {
    return 'now()';
  }
  // If it's a relative time string like 'now-2h', convert to 'now()-2h' (NO QUOTES)
  if (value.startsWith('now-') || value.startsWith('now+') || value.startsWith('now()')) {
    return value.replace(/^now(?!\()/, 'now()');
  }
  // Otherwise use the absoluteDate ISO string with quotes for DQL
  return `"${timeValue.absoluteDate}"`;
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
      | summarize by:{orderId}, latest=takeLast(timestamp), sessionId=takeLast(sessionId), 
                  shippingCostTotal=takeLast(shippingCostTotal), shippingTrackingId=takeLast(shippingTrackingId),
                  items=takeLast(items), trace_id=takeLast(trace_id), event.type=takeLast(event.type)
      | fieldsRename timestamp=latest
      | sort timestamp desc
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
