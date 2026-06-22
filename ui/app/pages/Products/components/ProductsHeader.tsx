import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import type { ProductStatistics } from '../types/product.types';

interface ProductsHeaderProps {
  statistics: ProductStatistics;
  onAddProduct: () => void;
}

// Color mappings for metric card variants
const METRIC_TEXT_COLORS = {
  default: 'var(--dt-colors-text-primary-default)',
  success: 'var(--dt-colors-charts-status-success-default)',
  critical: 'var(--dt-colors-charts-status-critical-default)',
} as const;

const METRIC_BG_COLORS = {
  default: 'var(--dt-colors-background-surface-default)',
  success: 'rgba(44, 165, 44, 0.08)',
  critical: 'rgba(239, 83, 80, 0.08)',
} as const;

/**
 * Metric card component with hover animation.
 * Uses semantic colors to indicate success (green), critical (red), or neutral status.
 */
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
  // Inline hover animation for card lift effect
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <Surface
      style={{
        padding: '16px 24px',
        minWidth: '160px',
        borderRadius: '12px',
        backgroundColor: METRIC_BG_COLORS[color],
        border: `1px solid ${color === 'default' ? 'var(--dt-colors-border-neutral-default)' : 'transparent'}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Flex flexDirection="column" gap={8}>
        <Flex alignItems="center" gap={8}>
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <Text
            style={{
              fontSize: '11px',
              color: 'var(--dt-colors-text-secondary-default)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
            }}
          >
            {label}
          </Text>
        </Flex>
        <Text style={{ fontSize: '32px', fontWeight: '700', color: METRIC_TEXT_COLORS[color], lineHeight: '1' }}>
          {value}
        </Text>
      </Flex>
    </Surface>
  );
};

export const ProductsHeader = ({ statistics, onAddProduct }: ProductsHeaderProps) => {
  return (
    <Flex flexDirection="column" gap={24}>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Flex flexDirection="column" gap={8}>
          <Heading level={2} style={{ fontSize: '28px' }}>
            🛍️ Product Catalog
          </Heading>
          <Text style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '14px' }}>
            Browse and manage your product inventory
          </Text>
        </Flex>
        <Button variant="emphasized" onClick={onAddProduct}>
          + Add Product
        </Button>
      </Flex>

      <Flex gap={16} flexWrap="wrap">
        <MetricCard label="TOTAL PRODUCTS" value={statistics.totalProducts} icon="📦" color="default" />
        <MetricCard label="AVAILABLE" value={statistics.availableProducts} icon="✅" color="success" />
        <MetricCard label="OUT OF STOCK" value={statistics.outOfStockProducts} icon="❌" color="critical" />
      </Flex>
    </Flex>
  );
};
