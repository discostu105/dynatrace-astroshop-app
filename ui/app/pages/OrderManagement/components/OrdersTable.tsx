import React from 'react';
import { DataTable } from '@dynatrace/strato-components-preview/tables';
import { Button } from '@dynatrace/strato-components/buttons';
import { Text } from '@dynatrace/strato-components/typography';
import type { Order } from '../types/order.types';
import { formatCurrency, formatRelativeTime } from '../utils/formatCurrency';

interface OrdersTableProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
  isLoading: boolean;
}

export const OrdersTable = ({ orders, onSelectOrder, isLoading }: OrdersTableProps) => {
  const columns = [
    {
      id: 'status',
      header: 'Status',
      accessor: (row: Order) => 
        row.eventType.includes('success') ? '✅' : '❌',
    },
    {
      id: 'orderId',
      header: 'Order ID',
      accessor: 'orderId',
      cell: ({ value }: any) => (
        <Text 
          style={{ cursor: 'pointer' }}
          onClick={(e: any) => {
            e.stopPropagation();
            navigator.clipboard.writeText(value);
          }}
        >
          {value.substring(0, 12)}...
        </Text>
      ),
    },
    {
      id: 'timestamp',
      header: 'Timestamp',
      accessor: 'timestamp',
      cell: ({ value }: any) => (
        <Text>{formatRelativeTime(value)}</Text>
      ),
    },
    {
      id: 'sessionId',
      header: 'Session ID',
      accessor: 'sessionId',
      cell: ({ value }: any) => (
        <Text>{value.substring(0, 12)}...</Text>
      ),
    },
    {
      id: 'shippingCost',
      header: 'Shipping Cost',
      accessor: 'shippingCostTotal',
      cell: ({ value }: any) => (
        <Text>{formatCurrency(value)}</Text>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Order) => row.orderId,
      cell: ({ rowData }: any) => (
        <Button 
          variant="default"
          onClick={() => onSelectOrder(rowData.orderId)}
        >
          View
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <Text>Loading orders...</Text>;
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <Text>No orders found. Try adjusting your filters.</Text>
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
