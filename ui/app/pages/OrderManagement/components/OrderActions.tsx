import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Button, IntentButton } from '@dynatrace/strato-components/buttons';
import { Heading } from '@dynatrace/strato-components/typography';
import { IntentPayload } from '@dynatrace-sdk/navigation';

interface OrderActionsProps {
  traceId: string;
  sessionId: string;
  orderId: string;
  timestamp: string;
}

export const OrderActions = ({ traceId, sessionId, orderId, timestamp }: OrderActionsProps) => {
  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
  };

  const copyTraceId = () => {
    navigator.clipboard.writeText(traceId);
  };

  const traceIntent: IntentPayload = {
    'trace_id': traceId,
    'timestamp': timestamp,
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
      <IntentButton 
        payload={traceIntent}
        variant="emphasized"
        color="primary"
        appId="dynatrace.distributedtracing"
        intentId="view-trace-addon"
      >
        🔍 View Trace
      </IntentButton>
    </Flex>
  );
};
