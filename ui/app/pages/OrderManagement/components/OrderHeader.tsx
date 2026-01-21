import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import type { OrderStatistics } from '../types/order.types';

interface OrderHeaderProps {
  statistics: OrderStatistics;
  isLoading: boolean;
}

export const OrderHeader = ({ statistics, isLoading }: OrderHeaderProps) => {
  if (isLoading) {
    return (
      <Flex flexDirection="column" gap={8} padding={16}>
        <Heading level={2}>Order Management</Heading>
        <Text>Loading statistics...</Text>
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" gap={8} padding={16}>
      <Heading level={2}>Order Management</Heading>
      <Flex gap={16}>
        <Text>
          <strong>{statistics.totalOrders}</strong> orders
        </Text>
        <Text>
          <strong>{statistics.successRate.toFixed(2)}%</strong> success rate
        </Text>
        <Text>
          <strong>{statistics.successfulOrders}</strong> successful
        </Text>
        {statistics.failedOrders > 0 && (
          <Text>
            <strong>{statistics.failedOrders}</strong> failed
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
