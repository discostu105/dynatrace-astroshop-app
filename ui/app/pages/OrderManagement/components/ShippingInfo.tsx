import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { formatCurrency } from '../utils/formatCurrency';

interface ShippingInfoProps {
  trackingId: string | null;
  cost: number;
}

export const ShippingInfo = ({ trackingId, cost }: ShippingInfoProps) => {
  return (
    <Flex flexDirection="column" gap={8}>
      <Heading level={4}>Shipping</Heading>
      {trackingId && (
        <Text>Tracking: {trackingId}</Text>
      )}
      <Text>Cost: {formatCurrency(cost)}</Text>
    </Flex>
  );
};
