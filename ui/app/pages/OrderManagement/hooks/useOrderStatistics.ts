import { useDql } from '@dynatrace-sdk/react-hooks';
import { useMemo } from 'react';
import type { TimeValue } from '@dynatrace/strato-components-preview/core';
import type { OrderFilters, OrderStatistics } from '../types/order.types';

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

export const useOrderStatistics = (filters: OrderFilters) => {
  const query = useMemo(() => {
    const fromTime = formatTimeForDQL(filters.timeframe.from);
    const toTime = formatTimeForDQL(filters.timeframe.to);
    
    // Query that counts distinct orders by orderId to match the orders table deduplication
    return `
      fetch bizevents, from: ${fromTime}, to: ${toTime}
      | filter event.type == "astroshop.web.checkout_success" or event.type == "astroshop.web.checkout_failure"
      | summarize by:{orderId}, eventType=takeLast(event.type)
      | summarize successCount = countIf(eventType == "astroshop.web.checkout_success"),
                failureCount = countIf(eventType == "astroshop.web.checkout_failure")
    `.trim();
  }, [filters.timeframe]);

  const { data, isLoading, error } = useDql({
    query,
  });

  const statistics: OrderStatistics = useMemo(() => {
    if (!data?.records || data.records.length === 0) {
      return {
        totalOrders: 0,
        successfulOrders: 0,
        failedOrders: 0,
        successRate: 0,
      };
    }

    const record = data.records[0] as Record<string, unknown>;
    const successfulOrders = Number(record.successCount) || 0;
    const failedOrders = Number(record.failureCount) || 0;
    const totalOrders = successfulOrders + failedOrders;
    const successRate = totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;

    return {
      totalOrders,
      successfulOrders,
      failedOrders,
      successRate,
    };
  }, [data]);

  return { statistics, isLoading, error };
};
