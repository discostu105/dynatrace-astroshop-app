import React, { useState, useMemo } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import type { Timeframe } from '@dynatrace/strato-components-preview/core';
import { OrderHeader } from './components/OrderHeader';
import { OrderFilters } from './components/OrderFilters';
import { OrdersTable } from './components/OrdersTable';
import { OrderDetailPanel } from './components/OrderDetailPanel';
import { useOrderFilters } from './hooks/useOrderFilters';
import { useOrders } from './hooks/useOrders';
import { useOrderDetail } from './hooks/useOrderDetail';
import type { OrderStatistics } from './types/order.types';

export const OrderManagementPage = () => {
  const { filters, updateStatus, updateSearchTerm, updateTimeframe } = useOrderFilters();
  const { orders, isLoading, error, refetch } = useOrders(filters);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { orderWithItems, isLoading: isDetailLoading } = useOrderDetail(selectedOrderId);

  const handleTimeframeChange = (timeframe: Timeframe) => {
    if (timeframe) {
      const from = timeframe.from === 'now' ? new Date() : new Date(timeframe.from);
      const to = timeframe.to === 'now' ? new Date() : new Date(timeframe.to);
      updateTimeframe(from, to);
    }
  };

  const handleRefresh = () => {
    if (refetch) {
      refetch();
    }
  };

  const statistics: OrderStatistics = useMemo(() => {
    const totalOrders = orders.length;
    const successfulOrders = orders.filter(o => o.eventType.includes('success')).length;
    const failedOrders = totalOrders - successfulOrders;
    const successRate = totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;

    return {
      totalOrders,
      successfulOrders,
      failedOrders,
      successRate,
    };
  }, [orders]);

  if (error) {
    return (
      <div style={{ padding: '16px' }}>
        <p>Error loading orders: {error.message}</p>
      </div>
    );
  }

  return (
    <Flex flexDirection="column" style={{ position: 'relative', height: '100%', backgroundColor: 'var(--dt-colors-background-container-default)' }}>
      <OrderHeader statistics={statistics} isLoading={isLoading} />
      
      <OrderFilters
        status={filters.status}
        searchTerm={filters.searchTerm}
        timeframe={{
          from: filters.timeframe.from.toISOString(),
          to: filters.timeframe.to.toISOString(),
        }}
        onStatusChange={updateStatus}
        onSearchChange={updateSearchTerm}
        onTimeframeChange={handleTimeframeChange}
        onRefresh={handleRefresh}
      />
      
      <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        <OrdersTable
          orders={orders}
          onSelectOrder={setSelectedOrderId}
          isLoading={isLoading}
        />
      </div>
      
      {selectedOrderId && (
        <OrderDetailPanel
          order={orderWithItems?.order}
          items={orderWithItems?.items}
          onClose={() => setSelectedOrderId(null)}
          isLoading={isDetailLoading}
        />
      )}
    </Flex>
  );
};
