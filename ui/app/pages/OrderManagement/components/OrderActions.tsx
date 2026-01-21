import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Button } from '@dynatrace/strato-components/buttons';
import { Heading } from '@dynatrace/strato-components/typography';

interface OrderActionsProps {
  traceId: string;
  sessionId: string;
  orderId: string;
}

export const OrderActions = ({ traceId, sessionId, orderId }: OrderActionsProps) => {
  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
  };

  const copyTraceId = () => {
    navigator.clipboard.writeText(traceId);
  };

  return (
    <Flex flexDirection="column" gap={12}>
      <Heading level={5} style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)' }}>
        Quick Actions
      </Heading>
      <Flex gap={8}>
        <Button 
          variant="default" 
          onClick={copyOrderId}
          style={{ flex: 1 }}
        >
          📋 Copy Order ID
        </Button>
        <Button 
          variant="default" 
          onClick={copyTraceId}
          style={{ flex: 1 }}
        >
          📋 Copy Trace ID
        </Button>
      </Flex>
    </Flex>
  );
};
