import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { ProgressCircle } from '@dynatrace/strato-components/content';
import type { OrderStatistics } from '../types/order.types';

interface OrderHeaderProps {
  statistics: OrderStatistics;
  isLoading: boolean;
}

const MetricCard = ({ 
  label, 
  value, 
  icon,
  color = 'default',
  isLoading 
}: { 
  label: string; 
  value: string | number; 
  icon: string;
  color?: 'default' | 'success' | 'critical';
  isLoading: boolean;
}) => {
  const colorMap = {
    default: 'var(--dt-colors-text-primary-default)',
    success: 'var(--dt-colors-charts-status-success-default)',
    critical: 'var(--dt-colors-charts-status-critical-default)',
  };
  
  const bgColorMap = {
    default: 'var(--dt-colors-background-surface-default)',
    success: 'rgba(44, 165, 44, 0.08)',
    critical: 'rgba(239, 83, 80, 0.08)',
  };

  return (
    <Surface style={{ 
      padding: '16px 24px', 
      minWidth: '140px', 
      borderRadius: '12px',
      backgroundColor: bgColorMap[color],
      border: `1px solid ${color === 'default' ? 'var(--dt-colors-border-neutral-default)' : 'transparent'}`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <Flex flexDirection="column" gap={8}>
        <Flex alignItems="center" gap={8}>
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <Text style={{ 
            fontSize: '11px', 
            color: 'var(--dt-colors-text-secondary-default)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            fontWeight: '600'
          }}>
            {label}
          </Text>
        </Flex>
        {isLoading ? (
          <ProgressCircle size="small" />
        ) : (
          <Text style={{ fontSize: '32px', fontWeight: '700', color: colorMap[color], lineHeight: '1' }}>
            {value}
          </Text>
        )}
      </Flex>
    </Surface>
  );
};

const SuccessRateVisual = ({ rate, isLoading }: { rate: number; isLoading: boolean }) => {
  if (isLoading) {
    return <ProgressCircle size="small" />;
  }
  
  const getColor = () => {
    if (rate >= 95) return 'var(--dt-colors-charts-status-success-default)';
    if (rate >= 80) return 'var(--dt-colors-charts-status-warning-default)';
    return 'var(--dt-colors-charts-status-critical-default)';
  };
  
  return (
    <Flex flexDirection="column" gap={8} alignItems="center" style={{ minWidth: '180px' }}>
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--dt-colors-border-neutral-default)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeDasharray={`${(rate / 100) * 251.2} 251.2`}
            strokeLinecap="round"
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <Text style={{ fontSize: '24px', fontWeight: '700', color: getColor() }}>
            {rate.toFixed(0)}%
          </Text>
        </div>
      </div>
      <Text style={{ 
        fontSize: '11px', 
        color: 'var(--dt-colors-text-secondary-default)', 
        textTransform: 'uppercase', 
        letterSpacing: '0.5px',
        fontWeight: '600'
      }}>
        📈 Success Rate
      </Text>
    </Flex>
  );
};

export const OrderHeader = ({ statistics, isLoading }: OrderHeaderProps) => {
  return (
    <Flex 
      gap={20} 
      padding={24} 
      paddingLeft={32}
      paddingRight={32}
      alignItems="center"
      style={{ 
        borderBottom: '1px solid var(--dt-colors-border-neutral-default)', 
        backgroundColor: 'var(--dt-colors-background-surface-default)',
        minHeight: '140px',
        background: 'linear-gradient(135deg, var(--dt-colors-background-surface-default) 0%, var(--dt-colors-background-container-default) 100%)'
      }}
    >
      <Flex flexDirection="column" gap={4}>
        <Heading level={2} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>📦</span>
          Order Management
        </Heading>
        <Text style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '13px' }}>
          Monitor and analyze your e-commerce orders
        </Text>
      </Flex>
      
      {/* Visual Success Rate Infographic */}
      <SuccessRateVisual rate={statistics.successRate} isLoading={isLoading} />
      
      {/* Metrics in a horizontal row */}
      <Flex gap={16} style={{ flex: 1 }} alignItems="center" flexWrap="wrap">
        <MetricCard 
          label="Total Orders" 
          value={statistics.totalOrders}
          icon="📊"
          isLoading={isLoading}
        />
        
        <MetricCard 
          label="Successful" 
          value={statistics.successfulOrders}
          icon="✅"
          color="success"
          isLoading={isLoading}
        />
        
        {statistics.failedOrders > 0 && (
          <MetricCard 
            label="Failed" 
            value={statistics.failedOrders}
            icon="❌"
            color="critical"
            isLoading={isLoading}
          />
        )}
      </Flex>
    </Flex>
  );
};
