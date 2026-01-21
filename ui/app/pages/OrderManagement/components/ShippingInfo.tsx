import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { formatCurrency } from '../utils/formatCurrency';

interface ShippingInfoProps {
  trackingId: string | null;
  cost: number;
}

export const ShippingInfo = ({ trackingId, cost }: ShippingInfoProps) => {
  return (
    <Surface style={{ padding: '16px', borderRadius: '8px' }}>
      <Flex flexDirection="column" gap={12}>
        <Heading level={5} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)' }}>
          Shipping Details
        </Heading>
        {trackingId && (
          <Flex justifyContent="space-between" alignItems="center">
            <Text style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '13px' }}>Tracking ID</Text>
            <Text style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: '500' }}>{trackingId}</Text>
          </Flex>
        )}
        <Flex justifyContent="space-between" alignItems="center">
          <Text style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '13px' }}>Shipping Cost</Text>
          <Text style={{ fontWeight: '500', fontSize: '13px' }}>{formatCurrency(cost)}</Text>
        </Flex>
      </Flex>
    </Surface>
  );
};
