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
    <Flex flexDirection="column" gap={16}>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={8}>
          <span style={{ fontSize: '18px' }}>🛒</span>
          <Heading level={5} style={{ 
            fontSize: '14px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px', 
            fontWeight: '600'
          }}>
            Order Items
          </Heading>
        </Flex>
        <div style={{
          padding: '6px 12px',
          borderRadius: '12px',
          backgroundColor: 'var(--dt-colors-background-surface-default)',
          border: '1px solid var(--dt-colors-border-neutral-default)',
        }}>
          <Text style={{ fontSize: '12px', fontWeight: '600' }}>
            📦 {items.length} {items.length === 1 ? 'product' : 'products'} • {totalQuantity} items
          </Text>
        </div>
      </Flex>
      
      <Flex flexDirection="column" gap={12}>
        {items.map((item) => (
          <Surface key={item.productId} style={{ 
            padding: '16px', 
            borderRadius: '10px',
            border: '1px solid var(--dt-colors-border-neutral-default)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <Flex flexDirection="column" gap={8}>
              <Flex justifyContent="space-between" alignItems="start">
                <Flex alignItems="start" gap={8} style={{ flex: 1 }}>
                  <span style={{ fontSize: '16px', marginTop: '2px' }}>📦</span>
                  <Text style={{ fontWeight: '600', fontSize: '14px', flex: 1, lineHeight: '1.4' }}>{item.name}</Text>
                </Flex>
                <div 
                  style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(44, 165, 44, 0.1)',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginLeft: '8px',
                    color: 'var(--dt-colors-charts-categorical-grass-default)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ×{item.quantity}
                </div>
              </Flex>
              <Flex alignItems="center" gap={6}>
                <span style={{ fontSize: '11px' }}>🏷️</span>
                <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', fontFamily: 'monospace' }}>
                  {item.productId}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" style={{ marginTop: '4px' }}>
                <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
                  💵 {formatCurrency(item.unitPrice)} each
                </Text>
                <Text style={{ fontWeight: '700', fontSize: '15px', color: 'var(--dt-colors-charts-categorical-grass-default)' }}>
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
