import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Surface } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { ProgressCircle } from '@dynatrace/strato-components/content';
import type { Product } from '../data/mockProducts';
import { formatCurrency } from '../../OrderManagement/utils/formatCurrency';

interface ProductSummaryStripProps {
  products: Product[];
  isLoading: boolean;
}

export const ProductSummaryStrip = ({ products, isLoading }: ProductSummaryStripProps) => {
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.totalQuantity, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.totalRevenue, 0);
  const avgRevenuePerProduct = totalProducts > 0 ? totalRevenue / totalProducts : 0;

  return (
    <Flex gap={16} flexWrap="wrap" style={{ padding: '16px 24px' }}>
      <MetricCard
        label="Total Products"
        value={totalProducts.toString()}
        isLoading={isLoading}
      />
      <MetricCard
        label="Total Units Sold"
        value={totalUnits.toLocaleString()}
        isLoading={isLoading}
      />
      <MetricCard
        label="Total Revenue"
        value={formatCurrency(totalRevenue)}
        isLoading={isLoading}
      />
      <MetricCard
        label="Avg Revenue / Product"
        value={formatCurrency(avgRevenuePerProduct)}
        isLoading={isLoading}
      />
    </Flex>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  isLoading: boolean;
}

const MetricCard = ({ label, value, isLoading }: MetricCardProps) => {
  return (
    <Surface
      style={{
        flex: '1 1 200px',
        minWidth: '200px',
        padding: '16px',
        borderRadius: '4px',
        transition: 'box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Flex flexDirection="column" gap={8}>
        <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary)' }}>
          {label}
        </Text>
        {isLoading ? (
          <ProgressCircle size="small" />
        ) : (
          <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</Text>
        )}
      </Flex>
    </Surface>
  );
};
