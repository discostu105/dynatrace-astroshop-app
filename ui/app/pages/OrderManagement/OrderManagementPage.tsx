import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Tabs, Tab } from '@dynatrace/strato-components-preview/navigation';
import type { Timeframe } from '@dynatrace/strato-components-preview/core';
import { OrderHeader } from './components/OrderHeader';
import { OrderFilters } from './components/OrderFilters';
import { OrdersTable } from './components/OrdersTable';
import { OrderDetailPanel } from './components/OrderDetailPanel';
import { useOrderFilters } from './hooks/useOrderFilters';
import { useOrders } from './hooks/useOrders';
import { useOrderDetail } from './hooks/useOrderDetail';
import { useOrderStatistics } from './hooks/useOrderStatistics';

export const OrderManagementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { filters, updateStatus, updateSearchTerm, updateTimeframe } = useOrderFilters();
  const { orders, isLoading, error } = useOrders(filters);
  const { statistics, isLoading: isStatsLoading } = useOrderStatistics(filters);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { orderWithItems, isLoading: isDetailLoading } = useOrderDetail(selectedOrderId, filters.timeframe);

  if (error) {
    return (
      <div style={{ padding: '16px' }}>
        <p>Error loading orders: {error.message}</p>
      </div>
    );
  }

  return (
    <Flex flexDirection="column" style={{ position: 'relative', height: '100%', backgroundColor: 'var(--dt-colors-background-container-default)' }}>
      <Tabs selectedIndex={location.pathname === '/geo' ? 1 : 0} onChange={(index) => navigate(index === 1 ? '/geo' : '/')}>
        <Tab title="Orders">Orders</Tab>
        <Tab title="Geographic">Geographic</Tab>
      </Tabs>
      <OrderHeader statistics={statistics} isLoading={isStatsLoading} />
      
      <OrderFilters
        status={filters.status}
        searchTerm={filters.searchTerm}
        timeframe={filters.timeframe}
        onStatusChange={updateStatus}
        onSearchChange={updateSearchTerm}
        onTimeframeChange={updateTimeframe}
        onRefresh={() => {}}
      />
      
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
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
