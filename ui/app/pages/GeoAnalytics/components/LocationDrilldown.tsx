import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Surface } from '@dynatrace/strato-components/layouts';
import { Heading } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { DataTable } from '@dynatrace/strato-components-preview/tables';
import type { LocationData, LocationOrder } from '../types/geo.types';
import { formatLocationName, formatCurrency } from '../utils/geoCalculations';

interface LocationDrilldownProps {
  location: LocationData | null;
  orders: LocationOrder[];
  isLoading: boolean;
  onClose: () => void;
  onOrderClick?: (order: LocationOrder) => void;
}

export const LocationDrilldown: React.FC<LocationDrilldownProps> = ({
  location,
  orders,
  isLoading,
  onClose,
  onOrderClick,
}) => {
  if (!location) {
    return null;
  }

  const columns = [
    {
      id: 'orderId',
      header: 'Order ID',
      accessor: (row: LocationOrder) => (
        <code style={{ fontSize: '11px' }}>
          {row.orderId.substring(0, 8)}...
        </code>
      ),
    },
    {
      id: 'timestamp',
      header: 'Timestamp',
      accessor: (row: LocationOrder) => {
        const date = new Date(row.timestamp);
        return date.toLocaleString();
      },
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: (row: LocationOrder) => formatCurrency(row.shippingCostTotal),
    },
  ];

  return (
    <Surface>
      <Flex flexDirection="column" gap={16} padding={16}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={4}>
            Orders from {formatLocationName(location)}
          </Heading>
          <Button onClick={onClose}>
            Close
          </Button>
        </Flex>

        {isLoading ? (
          <div style={{ color: 'var(--dt-colors-text-secondary)' }}>
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ color: 'var(--dt-colors-text-secondary)' }}>
            No orders found for this location.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <DataTable
              data={orders}
              columns={columns}
            />
          </div>
        )}

        <div
          style={{
            fontSize: '12px',
            color: 'var(--dt-colors-text-secondary)',
            padding: '8px',
            backgroundColor: 'var(--dt-colors-background-neutral)',
            borderRadius: '4px',
          }}
        >
          Showing {orders.length} orders for {formatLocationName(location)}
        </div>
      </Flex>
    </Surface>
  );
};
