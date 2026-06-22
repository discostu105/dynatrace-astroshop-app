import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { ProgressCircle } from '@dynatrace/strato-components/content';

interface ProductHeaderProps {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  isLoading?: boolean;
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
  isLoading?: boolean;
}) => {
  const colorMap = {
    default: 'var(--dt-colors-text-primary-default)',
    success: 'var(--dt-colors-charts-status-success-default)',
    critical: 'var(--dt-colors-text-primary-default)',
  };
  
  const bgColorMap = {
    default: 'var(--dt-colors-background-surface-default)',
    success: 'rgba(44, 165, 44, 0.08)',
    critical: 'var(--dt-colors-background-surface-default)',
  };

  return (
    <Surface style={{ 
      padding: '16px 24px', 
      minWidth: '140px', 
      borderRadius: '12px',
      backgroundColor: bgColorMap[color],
      border: '1px solid var(--dt-colors-border-neutral-default)',
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

export const ProductHeader = ({ 
  totalProducts, 
  availableProducts, 
  outOfStockProducts,
  isLoading = false 
}: ProductHeaderProps) => {
  return (
    <Flex gap={16} padding={24} flexWrap="wrap">
      <MetricCard 
        label="TOTAL PRODUCTS" 
        value={totalProducts} 
        icon="📦"
        color="default"
        isLoading={isLoading}
      />
      <MetricCard 
        label="AVAILABLE" 
        value={availableProducts} 
        icon="✅"
        color="success"
        isLoading={isLoading}
      />
      <MetricCard 
        label="OUT OF STOCK" 
        value={outOfStockProducts} 
        icon="❌"
        color="critical"
        isLoading={isLoading}
      />
    </Flex>
  );
};
