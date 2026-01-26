import { useState } from 'react';
import type { Timeframe } from '@dynatrace/strato-components-preview/core';
import type { OrderFilters } from '../types/order.types';

export const useOrderFilters = () => {
  const [filters, setFilters] = useState<OrderFilters>({
    timeframe: {
      from: {
        absoluteDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        value: 'now() - 2h',
        type: 'expression',
      },
      to: {
        absoluteDate: new Date().toISOString(),
        value: 'now()',
        type: 'expression',
      },
    },
    status: 'all',
    searchTerm: '',
  });

  const updateTimeframe = (timeframe: Timeframe) => {
    if (timeframe) {
      setFilters(prev => ({ ...prev, timeframe }));
    }
  };

  const updateStatus = (status: 'all' | 'success' | 'failure') => {
    setFilters(prev => ({ ...prev, status }));
  };

  const updateSearchTerm = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  return {
    filters,
    updateTimeframe,
    updateStatus,
    updateSearchTerm,
  };
};
