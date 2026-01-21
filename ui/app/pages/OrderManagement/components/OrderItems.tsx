import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Divider } from '@dynatrace/strato-components/layouts';
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
    <Flex flexDirection="column" gap={8}>
      <Heading level={4}>
        Order Items ({items.length} products, {totalQuantity} items)
      </Heading>
      
      {items.map((item, index) => (
        <React.Fragment key={item.productId}>
          <Flex flexDirection="column" gap={4} padding={8}>
            <Flex justifyContent="space-between">
              <Text>{item.name}</Text>
              <Text>×{item.quantity}</Text>
            </Flex>
            <Text>SKU: {item.productId}</Text>
            <Flex justifyContent="space-between">
              <Text>Unit: {formatCurrency(item.unitPrice)}</Text>
              <Text><strong>Total: {formatCurrency(item.lineTotal)}</strong></Text>
            </Flex>
          </Flex>
          {index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Flex>
  );
};
