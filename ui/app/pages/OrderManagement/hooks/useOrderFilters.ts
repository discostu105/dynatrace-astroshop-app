import { useState } from 'react';
import type { OrderFilters } from '../types/order.types';

export const useOrderFilters = () => {
  const [filters, setFilters] = useState<OrderFilters>({
    timeframe: {
      from: new Date(Date.now() - 2 * 60 * 60 * 1000), // Last 2 hours
      to: new Date(),
    },
    status: 'all',
    searchTerm: '',
  });

  const updateTimeframe = (from: Date, to: Date) => {
    setFilters(prev => ({ ...prev, timeframe: { from, to } }));
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
