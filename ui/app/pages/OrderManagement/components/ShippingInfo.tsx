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
    <Surface style={{ 
      padding: '20px', 
      borderRadius: '12px',
      border: '1px solid var(--dt-colors-border-neutral-default)',
    }}>
      <Flex flexDirection="column" gap={16}>
        <Flex alignItems="center" gap={8}>
          <span style={{ fontSize: '18px' }}>🚚</span>
          <Heading level={5} style={{ 
            fontSize: '14px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            fontWeight: '600'
          }}>
            Shipping Details
          </Heading>
        </Flex>
        {trackingId && (
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" gap={6}>
              <span style={{ fontSize: '14px' }}>📍</span>
              <Text style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '13px' }}>Tracking ID</Text>
            </Flex>
            <Text style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: '500' }}>{trackingId}</Text>
          </Flex>
        )}
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" gap={6}>
            <span style={{ fontSize: '14px' }}>💰</span>
            <Text style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '13px' }}>Shipping Cost</Text>
          </Flex>
          <Text style={{ fontWeight: '600', fontSize: '14px' }}>{formatCurrency(cost)}</Text>
        </Flex>
      </Flex>
    </Surface>
  );
};
