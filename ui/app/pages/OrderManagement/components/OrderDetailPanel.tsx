import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Divider } from '@dynatrace/strato-components/layouts';
import { OrderItems } from './OrderItems';
import { ShippingInfo } from './ShippingInfo';
import { OrderActions } from './OrderActions';
import type { Order, OrderItem } from '../types/order.types';
import { calculateOrderTotal, formatCurrency, formatTimestamp } from '../utils/formatCurrency';

interface OrderDetailPanelProps {
  order: Order;
  items: OrderItem[];
  onClose: () => void;
}

export const OrderDetailPanel = ({ order, items, onClose }: OrderDetailPanelProps) => {
  const subtotal = calculateOrderTotal(items);
  const total = subtotal + order.shippingCostTotal;
  
  return (
    <Flex 
      flexDirection="column" 
      gap={16} 
      padding={16}
      style={{ 
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '40%',
        backgroundColor: 'var(--dt-colors-background-container-default)',
        borderLeft: '1px solid var(--dt-colors-border-neutral-default)',
        overflowY: 'auto',
        zIndex: 1000,
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={3}>Order Details</Heading>
        <Button variant="default" onClick={onClose}>×</Button>
      </Flex>
      
      <Divider />
      
      <Flex flexDirection="column" gap={8}>
        <Text><strong>Order ID:</strong> {order.orderId}</Text>
        <Text>
          <strong>Status:</strong> {order.eventType.includes('success') ? '✅ Success' : '❌ Failure'}
        </Text>
        <Text><strong>Created:</strong> {formatTimestamp(order.timestamp)}</Text>
        <Text><strong>Session:</strong> {order.sessionId}</Text>
        {order.traceId && <Text><strong>Trace:</strong> {order.traceId}</Text>}
      </Flex>
      
      <Divider />
      
      <OrderItems items={items} />
      
      <Divider />
      
      <Flex flexDirection="column" gap={4}>
        <Text>Subtotal: {formatCurrency(subtotal)}</Text>
        <Text>Shipping: {formatCurrency(order.shippingCostTotal)}</Text>
        <Text><strong>Total: {formatCurrency(total)}</strong></Text>
      </Flex>
      
      <Divider />
      
      <ShippingInfo 
        trackingId={order.shippingTrackingId}
        cost={order.shippingCostTotal}
      />
      
      <Divider />
      
      <OrderActions 
        traceId={order.traceId}
        sessionId={order.sessionId}
        orderId={order.orderId}
      />
    </Flex>
  );
};
