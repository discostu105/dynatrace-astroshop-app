import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { ProgressCircle } from '@dynatrace/strato-components/content';
import type { OrderStatistics } from '../types/order.types';

interface OrderHeaderProps {
  statistics: OrderStatistics;
  isLoading: boolean;
}

const MetricCard = ({ 
  label, 
  value, 
  color = 'default',
  isLoading 
}: { 
  label: string; 
  value: string | number; 
  color?: 'default' | 'success' | 'critical';
  isLoading: boolean;
}) => {
  const colorMap = {
    default: 'var(--dt-colors-text-primary-default)',
    success: 'var(--dt-colors-charts-status-success-default)',
    critical: 'var(--dt-colors-charts-status-critical-default)',
  };

  return (
    <Surface style={{ padding: '12px 20px', minWidth: '120px', borderRadius: '8px' }}>
      <Flex flexDirection="column" gap={4} alignItems="center">
        <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </Text>
        {isLoading ? (
          <ProgressCircle size="small" />
        ) : (
          <Text style={{ fontSize: '28px', fontWeight: '600', color: colorMap[color] }}>
            {value}
          </Text>
        )}
      </Flex>
    </Surface>
  );
};

export const OrderHeader = ({ statistics, isLoading }: OrderHeaderProps) => {
  return (
    <Flex 
      gap={12} 
      padding={16} 
      paddingLeft={24}
      paddingRight={24}
      alignItems="center"
      style={{ 
        borderBottom: '1px solid var(--dt-colors-border-neutral-default)', 
        backgroundColor: 'var(--dt-colors-background-surface-default)',
        minHeight: '80px'
      }}
    >
      <Heading level={2} style={{ marginRight: '24px', whiteSpace: 'nowrap' }}>📦 Order Management</Heading>
      
      {/* Metrics in a horizontal row */}
      <Flex gap={12} style={{ flex: 1 }} alignItems="center" flexWrap="wrap">
        <MetricCard 
          label="📊 Total" 
          value={statistics.totalOrders} 
          isLoading={isLoading}
        />
        
        <MetricCard 
          label="📈 Success Rate" 
          value={`${statistics.successRate.toFixed(1)}%`}
          color={statistics.successRate >= 95 ? 'success' : statistics.successRate >= 80 ? 'default' : 'critical'}
          isLoading={isLoading}
        />
        
        <MetricCard 
          label="✅ Successful" 
          value={statistics.successfulOrders}
          color="success"
          isLoading={isLoading}
        />
        
        {statistics.failedOrders > 0 && (
          <MetricCard 
            label="❌ Failed" 
            value={statistics.failedOrders}
            color="critical"
            isLoading={isLoading}
          />
        )}
      </Flex>
    </Flex>
  );
};
