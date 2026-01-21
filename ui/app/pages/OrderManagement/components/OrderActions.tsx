import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Button } from '@dynatrace/strato-components/buttons';

interface OrderActionsProps {
  traceId: string;
  sessionId: string;
  orderId: string;
}

export const OrderActions = ({ traceId, sessionId, orderId }: OrderActionsProps) => {
  const openTrace = () => {
    const traceUrl = `/ui/diagnostictools/purepaths?gtf=-2h&gf=all&trace=${traceId}`;
    window.open(traceUrl, '_blank');
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
  };

  return (
    <Flex flexDirection="column" gap={8}>
      <Flex gap={8}>
        <Button onClick={openTrace}>View Trace</Button>
        <Button onClick={copyOrderId}>Copy Order ID</Button>
      </Flex>
    </Flex>
  );
};
