import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import type { ProductStatistics } from '../types/product.types';

interface ProductHeaderProps {
  statistics: ProductStatistics;
  onAddProduct?: () => void;
}

// Color mappings for metric card variants
const METRIC_CARD_COLORS = {
  default: 'var(--dt-colors-text-primary-default)',
  success: 'var(--dt-colors-charts-status-success-default)',
  critical: 'var(--dt-colors-charts-status-critical-default)',
};

const METRIC_CARD_BACKGROUNDS = {
  default: 'var(--dt-colors-background-surface-default)',
  success: 'rgba(44, 165, 44, 0.08)',
  critical: 'rgba(239, 83, 80, 0.08)',
};

const MetricCard = ({ 
  label, 
  value, 
  icon,
  color = 'default',
}: { 
  label: string; 
  value: string | number; 
  icon: string;
  color?: 'default' | 'success' | 'critical';
}) => {

  const borderColor = color === 'default' ? 'var(--dt-colors-border-neutral-default)' : 'transparent';

  return (
    <Surface 
      style={{ 
        padding: '16px 24px', 
        minWidth: '140px', 
        borderRadius: '12px',
        backgroundColor: METRIC_CARD_BACKGROUNDS[color],
        border: `1px solid ${borderColor}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      // Subtle hover lift effect to indicate interactivity without being clickable
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
        <Text style={{ fontSize: '32px', fontWeight: '700', color: METRIC_CARD_COLORS[color], lineHeight: '1' }}>
          {value}
        </Text>
      </Flex>
    </Surface>
  );
};

export const ProductHeader = ({ statistics, onAddProduct }: ProductHeaderProps) => {
  return (
    // Gradient background creates visual separation from the page body
    <Surface style={{
      padding: '32px 24px 24px',
      background: 'linear-gradient(to bottom, var(--dt-colors-background-surface-default), var(--dt-colors-background-container-default))',
      borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
      minHeight: '140px',
    }}>
      <Flex flexDirection="column" gap={20}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column" gap={8}>
            <Heading level={2} style={{ fontSize: '28px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>🛍️</span>
              <span>Product Catalog</span>
            </Heading>
            <Text style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '14px' }}>
              Browse and manage your product inventory
            </Text>
          </Flex>
          <Button
            variant="emphasized"
            onClick={onAddProduct}
            style={{
              backgroundColor: '#3d4463',
              color: '#ffffff',
              borderColor: 'transparent',
            }}
          >
            + Add Product
          </Button>
        </Flex>
        
        <Flex gap={12} flexWrap="wrap">
          <MetricCard
            icon="📦"
            label="TOTAL PRODUCTS"
            value={statistics.totalProducts}
            color="default"
          />
          <MetricCard
            icon="✅"
            label="AVAILABLE"
            value={statistics.available}
            color="default"
          />
          <MetricCard
            icon="❌"
            label="OUT OF STOCK"
            value={statistics.outOfStock}
            color="default"
          />
        </Flex>
      </Flex>
    </Surface>
  );
};
