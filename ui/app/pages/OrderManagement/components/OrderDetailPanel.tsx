import React, { useState } from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Skeleton, SkeletonText } from '@dynatrace/strato-components/content';
import { Tabs, Tab } from '@dynatrace/strato-components-preview/navigation';
import { OrderItems } from './OrderItems';
import { ShippingInfo } from './ShippingInfo';
import { OrderActions } from './OrderActions';
import { TraceInsightsPanel } from './TraceInsights/TraceInsightsPanel';
import type { Order, OrderItem } from '../types/order.types';
import { calculateOrderTotal, formatCurrency, formatTimestamp } from '../utils/formatCurrency';

interface OrderDetailPanelProps {
  order?: Order;
  items?: OrderItem[];
  onClose: () => void;
  isLoading: boolean;
}

const InfoSection = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <Surface style={{ 
    padding: '20px', 
    borderRadius: '12px',
    border: '1px solid var(--dt-colors-border-neutral-default)',
    transition: 'box-shadow 0.2s ease',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = 'none';
  }}
  >
    <Flex flexDirection="column" gap={16}>
      <Flex alignItems="center" gap={8}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <Heading level={5} style={{ 
          color: 'var(--dt-colors-text-primary-default)', 
          fontSize: '14px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px',
          fontWeight: '600'
        }}>
          {title}
        </Heading>
      </Flex>
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const subtotal = items ? calculateOrderTotal(items) : 0;
  const total = subtotal + (order?.shippingCostTotal || 0);
  const isSuccess = order?.eventType.includes('success');
  
  return (
    <Flex 
      flexDirection="column" 
      gap={0} 
      style={{ 
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '650px',
        backgroundColor: 'var(--dt-colors-background-surface-default)',
        borderLeft: '1px solid var(--dt-colors-border-neutral-default)',
        zIndex: 1000,
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <Flex 
        justifyContent="space-between" 
        alignItems="center" 
        padding={24}
        style={{ 
          borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
        }}
      >
        <Flex alignItems="center" gap={12}>
          <span style={{ fontSize: '24px' }}>📋</span>
          <Heading level={3}>Order Details</Heading>
        </Flex>
        <Button 
          variant="default" 
          onClick={onClose}
          style={{ fontSize: '20px', padding: '8px 12px' }}
        >
          ✕
        </Button>
      </Flex>
      
      {isLoading ? (
        <Flex flexDirection="column" gap={20} padding={24}>
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
      ) : order ? (
        <>
          {/* Actions Bar */}
          <Flex 
            padding={16}
            paddingX={24}
            style={{ 
              borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
              backgroundColor: 'var(--dt-colors-background-container-default)',
            }}
          >
            <OrderActions 
              traceId={order.traceId}
              sessionId={order.sessionId}
              orderId={order.orderId}
              timestamp={order.timestamp}
            />
          </Flex>

          {/* Tabs */}
          <Tabs selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            {/* Overview Tab */}
            <Tab title="📦 Overview">
              <Flex 
                flexDirection="column" 
                gap={20} 
                padding={24}
                style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}
              >
                <InfoSection title="Order Information" icon="📦">
                  <Flex 
                    style={{ 
                      padding: '16px 20px', 
                      borderRadius: '8px', 
                      backgroundColor: isSuccess 
                        ? 'rgba(44, 165, 44, 0.1)' 
                        : 'rgba(239, 83, 80, 0.1)',
                      border: `2px solid ${isSuccess 
                        ? 'rgba(44, 165, 44, 0.3)' 
                        : 'rgba(239, 83, 80, 0.3)'}`
                    }}
                    alignItems="center"
                    gap={12}
                  >
                    <Text style={{ fontSize: '24px' }}>{isSuccess ? '✅' : '❌'}</Text>
                    <Text style={{ fontWeight: '700', fontSize: '15px' }}>{isSuccess ? 'Successful Order' : 'Failed Order'}</Text>
                  </Flex>
                  <InfoRow label="🆔 Order ID" value={order.orderId} />
                  <InfoRow label="🕐 Created" value={formatTimestamp(order.timestamp)} />
                  <InfoRow label="🔗 Session ID" value={order.sessionId} />
                  {order.traceId && <InfoRow label="🔍 Trace ID" value={order.traceId} />}
                </InfoSection>
                
                {items && items.length > 0 ? (
                  <>
                    <OrderItems items={items} />
                    
                    <Surface style={{ 
                      padding: '24px', 
                      borderRadius: '12px', 
                      backgroundColor: 'var(--dt-colors-background-container-default)',
                      border: '2px solid var(--dt-colors-border-neutral-default)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}>
                      <Flex flexDirection="column" gap={16}>
                        <Flex alignItems="center" gap={8}>
                          <span style={{ fontSize: '20px' }}>💰</span>
                          <Heading level={5} style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Order Total
                          </Heading>
                        </Flex>
                        <Flex justifyContent="space-between">
                          <Flex alignItems="center" gap={6}>
                            <span style={{ fontSize: '14px' }}>🛒</span>
                            <Text style={{ color: 'var(--dt-colors-text-secondary-default)' }}>Subtotal</Text>
                          </Flex>
                          <Text style={{ fontWeight: '500' }}>{formatCurrency(subtotal)}</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                          <Flex alignItems="center" gap={6}>
                            <span style={{ fontSize: '14px' }}>🚚</span>
                            <Text style={{ color: 'var(--dt-colors-text-secondary-default)' }}>Shipping</Text>
                          </Flex>
                          <Text style={{ fontWeight: '500' }}>{formatCurrency(order.shippingCostTotal)}</Text>
                        </Flex>
                        <div style={{ height: '2px', backgroundColor: 'var(--dt-colors-border-neutral-default)', margin: '8px 0' }} />
                        <Flex justifyContent="space-between" alignItems="center">
                          <Flex alignItems="center" gap={8}>
                            <span style={{ fontSize: '18px' }}>💵</span>
                            <Text style={{ fontSize: '16px', fontWeight: '700' }}>Total</Text>
                          </Flex>
                          <Text style={{ fontSize: '24px', fontWeight: '700', color: 'var(--dt-colors-charts-categorical-grass-default)' }}>
                            {formatCurrency(total)}
                          </Text>
                        </Flex>
                      </Flex>
                    </Surface>
                  </>
                ) : (
                  <Surface style={{ padding: '20px', borderRadius: '8px' }}>
                    <Text style={{ color: 'var(--dt-colors-text-secondary-default)', textAlign: 'center' }}>
                      No items available for this order
                    </Text>
                  </Surface>
                )}
                
                {order.shippingTrackingId && (
                  <ShippingInfo 
                    trackingId={order.shippingTrackingId}
                    cost={order.shippingCostTotal}
                  />
                )}
              </Flex>
            </Tab>

            {/* Performance Tab */}
            <Tab title="🚀 Performance">
              <Flex 
                flexDirection="column" 
                gap={20} 
                padding={24}
                style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}
              >
                <TraceInsightsPanel
                  traceId={order.traceId}
                  timestamp={order.timestamp}
                />
              </Flex>
            </Tab>
          </Tabs>
        </>
      ) : null}
    </Flex>
  );
};
