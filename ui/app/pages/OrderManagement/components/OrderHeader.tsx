import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Surface } from '@dynatrace/strato-components/layouts';
import type { OrderStatistics } from '../types/order.types';

interface OrderHeaderProps {
  statistics: OrderStatistics;
  isLoading: boolean;
}

const MetricCard = ({ label, value, variant = 'default' }: { label: string; value: string | number; variant?: 'default' | 'success' | 'warning' }) => {
  const colorMap = {
    default: 'var(--dt-colors-text-primary-default)',
    success: 'var(--dt-colors-charts-categorical-grass-default)',
    warning: 'var(--dt-colors-charts-categorical-sunrise-default)',
  };

  return (
    <Surface style={{ padding: '16px 24px', minWidth: '150px', borderRadius: '8px' }}>
      <Flex flexDirection="column" gap={4}>
        <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>{label}</Text>
        <Text style={{ fontSize: '28px', fontWeight: '600', color: colorMap[variant] }}>
          {value}
        </Text>
      </Flex>
    </Surface>
  );
};

export const OrderHeader = ({ statistics, isLoading }: OrderHeaderProps) => {
  if (isLoading) {
    return (
      <Flex flexDirection="column" gap={16} padding={24} style={{ borderBottom: '1px solid var(--dt-colors-border-neutral-default)' }}>
        <Heading level={2}>Order Management</Heading>
        <Text>Loading statistics...</Text>
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" gap={20} padding={24} style={{ borderBottom: '1px solid var(--dt-colors-border-neutral-default)', backgroundColor: 'var(--dt-colors-background-surface-default)' }}>
      <Heading level={2}>Order Management</Heading>
      <Flex gap={16} flexWrap="wrap">
        <MetricCard label="Total Orders" value={statistics.totalOrders} />
        <MetricCard 
          label="Success Rate" 
          value={`${statistics.successRate.toFixed(1)}%`} 
          variant={statistics.successRate >= 95 ? 'success' : 'warning'}
        />
        <MetricCard label="Successful" value={statistics.successfulOrders} variant="success" />
        {statistics.failedOrders > 0 && (
          <MetricCard label="Failed" value={statistics.failedOrders} variant="warning" />
        )}
      </Flex>
    </Flex>
  );
};
