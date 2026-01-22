import React from 'react';
import { DataTable } from '@dynatrace/strato-components-preview/tables';
import { Button } from '@dynatrace/strato-components/buttons';
import { Text } from '@dynatrace/strato-components/typography';
import type { Order } from '../types/order.types';
import { formatCurrency, formatRelativeTime } from '../utils/formatCurrency';
import { parseOrderItems } from '../utils/parseOrderItems';

interface OrdersTableProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
  isLoading: boolean;
}

const StatusBadge = ({ isSuccess }: { isSuccess: boolean }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '12px',
      backgroundColor: isSuccess
        ? 'rgba(44, 165, 44, 0.1)'
        : 'rgba(239, 83, 80, 0.1)',
      color: isSuccess
        ? 'var(--dt-colors-charts-categorical-grass-default)'
        : 'var(--dt-colors-charts-categorical-sunrise-default)',
      fontSize: '12px',
      fontWeight: '500',
    }}
  >
    <span style={{ fontSize: '14px' }}>{isSuccess ? '✅' : '❌'}</span>
    {isSuccess ? 'Success' : 'Failure'}
  </div>
);

export const OrdersTable = ({ orders, onSelectOrder, isLoading }: OrdersTableProps) => {
  const columns = [
    {
      id: 'status',
      header: 'Status',
      accessor: (row: Order) => row.eventType.includes('success'),
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <StatusBadge isSuccess={value} />
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 120,
      minWidth: 120,
    },
    {
      id: 'orderId',
      header: 'Order ID',
      accessor: 'orderId',
      cell: ({ value, rowData }: any) => (
        <DataTable.DefaultCell>
          <Text 
            style={{ 
              cursor: 'pointer', 
              fontFamily: 'monospace',
              fontSize: '12px',
              color: 'var(--dt-colors-text-link-default)',
            }}
            onClick={(e: any) => {
              e.stopPropagation();
              navigator.clipboard.writeText(value || rowData.orderId);
            }}
          >
            {value || rowData.orderId || 'N/A'}
          </Text>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 280,
      minWidth: 280,
    },
    {
      id: 'timestamp',
      header: 'Timestamp',
      accessor: 'timestamp',
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Text style={{ color: 'var(--dt-colors-text-secondary-default)' }}>{formatRelativeTime(value)}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 120,
      minWidth: 100,
    },
    {
      id: 'sessionId',
      header: 'Session ID',
      accessor: 'sessionId',
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Text style={{ fontFamily: 'monospace', fontSize: '12px' }}>{value}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 280,
      minWidth: 280,
    },
    {
      id: 'shippingCost',
      header: '🚚 Shipping',
      accessor: 'shippingCostTotal',
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Text style={{ fontWeight: '500' }}>{formatCurrency(value)}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 130,
      minWidth: 100,
    },
    {
      id: 'itemCount',
      header: '🛒 Items',
      accessor: (row: Order) => {
        try {
          const items = parseOrderItems(row.items);
          return items.length;
        } catch {
          return 0;
        }
      },
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '12px',
            backgroundColor: 'var(--dt-colors-background-surface-default)',
            border: '1px solid var(--dt-colors-border-neutral-default)',
          }}>
            <Text style={{ fontWeight: '600', fontSize: '14px' }}>{value}</Text>
            <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)' }}>items</Text>
          </div>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 110,
      minWidth: 90,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Order) => row.orderId,
      cell: ({ rowData }: any) => (
        <DataTable.DefaultCell>
          <Button 
            variant="accent"
            onClick={() => onSelectOrder(rowData.orderId)}
          >
            View
          </Button>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 100,
      minWidth: 90,
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: '64px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <Text style={{ fontSize: '14px', color: 'var(--dt-colors-text-secondary-default)' }}>Loading orders...</Text>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: '64px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
        <Text style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No orders found</Text>
        <Text style={{ fontSize: '14px', color: 'var(--dt-colors-text-secondary-default)' }}>Try adjusting your filters or time range</Text>
      </div>
    );
  }

  return (
    <DataTable
      data={orders}
      columns={columns}
    />
  );
};
