import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Button } from '@dynatrace/strato-components/buttons';

interface OrderActionsProps {
  traceId: string;
  sessionId: string;
  orderId: string;
  timestamp: string;
}

export const OrderActions = ({ traceId, sessionId, orderId }: OrderActionsProps) => {
  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
  };

  const copyTraceId = () => {
    navigator.clipboard.writeText(traceId);
  };

  return (
    <Flex gap={8} alignItems="center">
      <Button 
        variant="default" 
        onClick={copyOrderId}
      >
        📋 Copy Order ID
      </Button>
      <Button 
        variant="default" 
        onClick={copyTraceId}
      >
        📋 Copy Trace ID
      </Button>
    </Flex>
  );
};
