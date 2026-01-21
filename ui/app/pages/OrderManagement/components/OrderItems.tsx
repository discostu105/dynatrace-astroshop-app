import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import type { OrderItem } from '../types/order.types';
import { formatCurrency } from '../utils/formatCurrency';

interface OrderItemsProps {
  items: OrderItem[];
}

export const OrderItems = ({ items }: OrderItemsProps) => {
  if (items.length === 0) {
    return <Text>No items available</Text>;
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Flex flexDirection="column" gap={12}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={5} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)' }}>
          Order Items
        </Heading>
        <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
          {items.length} {items.length === 1 ? 'product' : 'products'}, {totalQuantity} items
        </Text>
      </Flex>
      
      <Flex flexDirection="column" gap={12}>
        {items.map((item) => (
          <Surface key={item.productId} style={{ padding: '16px', borderRadius: '8px' }}>
            <Flex flexDirection="column" gap={8}>
              <Flex justifyContent="space-between" alignItems="start">
                <Text style={{ fontWeight: '500', fontSize: '14px', flex: 1 }}>{item.name}</Text>
                <div 
                  style={{ 
                    padding: '2px 10px', 
                    borderRadius: '12px', 
                    backgroundColor: 'var(--dt-colors-background-surface-default)',
                    fontSize: '12px',
                    fontWeight: '500',
                    marginLeft: '8px'
                  }}
                >
                  ×{item.quantity}
                </div>
              </Flex>
              <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)', fontFamily: 'monospace' }}>
                SKU: {item.productId}
              </Text>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginTop: '4px' }}>
                <Text style={{ fontSize: '13px', color: 'var(--dt-colors-text-secondary-default)' }}>
                  {formatCurrency(item.unitPrice)} each
                </Text>
                <Text style={{ fontWeight: '600', fontSize: '14px' }}>
                  {formatCurrency(item.lineTotal)}
                </Text>
              </Flex>
            </Flex>
          </Surface>
        ))}
      </Flex>
    </Flex>
  );
};
