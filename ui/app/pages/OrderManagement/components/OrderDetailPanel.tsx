import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Skeleton, SkeletonText } from '@dynatrace/strato-components/content';
import { OrderItems } from './OrderItems';
import { ShippingInfo } from './ShippingInfo';
import { OrderActions } from './OrderActions';
import type { Order, OrderItem } from '../types/order.types';
import { calculateOrderTotal, formatCurrency, formatTimestamp } from '../utils/formatCurrency';

interface OrderDetailPanelProps {
  order?: Order;
  items?: OrderItem[];
  onClose: () => void;
  isLoading: boolean;
}

const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Surface style={{ padding: '16px', borderRadius: '8px' }}>
    <Flex flexDirection="column" gap={12}>
      <Heading level={5} style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </Heading>
      {children}
    </Flex>
  </Surface>
);

const InfoRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
  <Flex justifyContent="space-between" alignItems="center">
    <Text style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '13px' }}>{label}</Text>
    <Text style={{ fontWeight: '500', fontSize: '13px', fontFamily: typeof value === 'string' && value.includes('-') ? 'monospace' : 'inherit' }}>
      {value}
    </Text>
  </Flex>
);

export const OrderDetailPanel = ({ order, items, onClose, isLoading }: OrderDetailPanelProps) => {
  const subtotal = items ? calculateOrderTotal(items) : 0;
  const total = subtotal + (order?.shippingCostTotal || 0);
  const isSuccess = order?.eventType.includes('success');
  
  return (
    <Flex 
      flexDirection="column" 
      gap={20} 
      padding={24}
      style={{ 
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '450px',
        backgroundColor: 'var(--dt-colors-background-surface-default)',
        borderLeft: '1px solid var(--dt-colors-border-neutral-default)',
        overflowY: 'auto',
        zIndex: 1000,
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={3}>Order Details</Heading>
        <Button 
          variant="default" 
          onClick={onClose}
          style={{ fontSize: '20px', padding: '8px 12px' }}
        >
          ×
        </Button>
      </Flex>
      
      {isLoading ? (
        <Flex flexDirection="column" gap={20}>
          <Surface style={{ padding: '16px', borderRadius: '8px' }}>
            <Flex flexDirection="column" gap={12}>
              <SkeletonText lines={1} style={{ width: '120px' }} />
              <Skeleton style={{ width: '100%', height: '60px', borderRadius: '6px' }} />
              <SkeletonText lines={4} />
            </Flex>
          </Surface>
          <Surface style={{ padding: '16px', borderRadius: '8px' }}>
            <SkeletonText lines={1} style={{ width: '100px' }} />
            <Skeleton style={{ width: '100%', height: '200px', borderRadius: '8px', marginTop: '12px' }} />
          </Surface>
          <Surface style={{ padding: '20px', borderRadius: '8px' }}>
            <SkeletonText lines={3} />
          </Surface>
        </Flex>
      ) : order && items ? (
        <>
          {/* Prominent View Trace Button at the Top */}
          <Button 
            variant="emphasized"
            onClick={() => {
              const traceUrl = `/ui/diagnostictools/purepaths?gtf=-2h&gf=all&trace=${order.traceId}`;
              window.open(traceUrl, '_blank');
            }}
            style={{ 
              width: '100%',
              fontSize: '16px',
              fontWeight: '600',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #1496ff 0%, #0f7ed6 100%)',
              boxShadow: '0 6px 16px rgba(20, 150, 255, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            🔍 View Distributed Trace
          </Button>
          
          <InfoSection title="Order Information">
            <Flex 
              style={{ 
                padding: '12px 16px', 
                borderRadius: '6px', 
                backgroundColor: isSuccess 
                  ? 'rgba(44, 165, 44, 0.08)' 
                  : 'rgba(239, 83, 80, 0.08)',
                border: `1px solid ${isSuccess 
                  ? 'rgba(44, 165, 44, 0.2)' 
                  : 'rgba(239, 83, 80, 0.2)'}`
              }}
              alignItems="center"
              gap={8}
            >
              <Text style={{ fontSize: '18px' }}>{isSuccess ? '✓' : '✗'}</Text>
              <Text style={{ fontWeight: '600' }}>{isSuccess ? 'Successful Order' : 'Failed Order'}</Text>
            </Flex>
            <InfoRow label="Order ID" value={order.orderId} />
            <InfoRow label="Created" value={formatTimestamp(order.timestamp)} />
            <InfoRow label="Session ID" value={order.sessionId} />
            {order.traceId && <InfoRow label="Trace ID" value={order.traceId} />}
          </InfoSection>
          
          <OrderItems items={items} />
          
          <Surface style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'var(--dt-colors-background-container-default)' }}>
            <Flex flexDirection="column" gap={12}>
              <Flex justifyContent="space-between">
                <Text style={{ color: 'var(--dt-colors-text-secondary-default)' }}>Subtotal</Text>
                <Text>{formatCurrency(subtotal)}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text style={{ color: 'var(--dt-colors-text-secondary-default)' }}>Shipping</Text>
                <Text>{formatCurrency(order.shippingCostTotal)}</Text>
              </Flex>
              <div style={{ height: '1px', backgroundColor: 'var(--dt-colors-border-neutral-default)', margin: '8px 0' }} />
              <Flex justifyContent="space-between" alignItems="center">
                <Text style={{ fontSize: '16px', fontWeight: '600' }}>Total</Text>
                <Text style={{ fontSize: '20px', fontWeight: '600' }}>{formatCurrency(total)}</Text>
              </Flex>
            </Flex>
          </Surface>
          
          <ShippingInfo 
            trackingId={order.shippingTrackingId}
            cost={order.shippingCostTotal}
          />
          
          <OrderActions 
            traceId={order.traceId}
            sessionId={order.sessionId}
            orderId={order.orderId}
          />
        </>
      ) : null}
    </Flex>
  );
};
