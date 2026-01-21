import { useDql } from '@dynatrace-sdk/react-hooks';
import { useMemo } from 'react';
import { parseOrderItems } from '../utils/parseOrderItems';
import type { Order, OrderItem } from '../types/order.types';

export const useOrderDetail = (orderId: string | null) => {
  const query = orderId
    ? `fetch bizevents
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
    
    return {
      order: {
        timestamp: record.timestamp,
        orderId: record.orderId,
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
