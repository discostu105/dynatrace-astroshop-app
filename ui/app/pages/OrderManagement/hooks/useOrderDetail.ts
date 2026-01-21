import { useDql } from '@dynatrace-sdk/react-hooks';
import { useMemo } from 'react';
import { parseOrderItems } from '../utils/parseOrderItems';
import type { Order, OrderItem } from '../types/order.types';
import type { Timeframe, TimeValue } from '@dynatrace/strato-components-preview/core';

// Helper to convert timeframe values to DQL format
const formatTimeForDQL = (timeValue: TimeValue): string => {
  const value = timeValue.value;
  
  if (value === 'now') {
    return 'now()';
  }
  if (value.startsWith('now-') || value.startsWith('now+') || value.startsWith('now()')) {
    return value.replace(/^now(?!\()/, 'now()');
  }
  return `"${timeValue.absoluteDate}"`;
};

export const useOrderDetail = (orderId: string | null, timeframe?: Timeframe) => {
  // Check if this is a session-based identifier (for failed orders without orderId)
  const isSessionBased = orderId?.startsWith('session:');
  const sessionId = isSessionBased ? orderId.replace('session:', '') : null;
  
  // Build time range for query
  const fromTime = timeframe ? formatTimeForDQL(timeframe.from) : 'now()-24h';
  const toTime = timeframe ? formatTimeForDQL(timeframe.to) : 'now()';
  
  const query = orderId
    ? isSessionBased
      ? `fetch bizevents, from: ${fromTime}, to: ${toTime}
         | filter (event.type == "astroshop.web.checkout_success" or event.type == "astroshop.web.checkout_failure")
           and sessionId == "${sessionId}"
         | fields timestamp, orderId, sessionId, shippingCostTotal, 
                  shippingTrackingId, items, trace_id, event.type
         | sort timestamp desc
         | limit 1`
      : `fetch bizevents, from: ${fromTime}, to: ${toTime}
         | filter (event.type == "astroshop.web.checkout_success" or event.type == "astroshop.web.checkout_failure")
           and orderId == "${orderId}"
         | fields timestamp, orderId, sessionId, shippingCostTotal, 
                  shippingTrackingId, items, trace_id, event.type
         | limit 1`
    : 'fetch bizevents | limit 0';

  const { data, isLoading, error } = useDql({
    query,
  });

  const orderWithItems = useMemo(() => {
    if (!orderId || !data?.records?.[0]) return null;
    
    const record: any = data.records[0];
    const parsedItems = parseOrderItems(record.items);
    // Use orderId if available, otherwise use session-based identifier
    const identifier = record.orderId || `session:${record.sessionId}`;
    
    return {
      order: {
        timestamp: record.timestamp,
        orderId: identifier,
        sessionId: record.sessionId,
        shippingCostTotal: record.shippingCostTotal || 0,
        shippingTrackingId: record.shippingTrackingId,
        items: record.items,
        traceId: record.trace_id,
        eventType: record['event.type'],
      } as Order,
      items: parsedItems,
    };
  }, [data, orderId]);

  return { orderWithItems, isLoading, error };
};
