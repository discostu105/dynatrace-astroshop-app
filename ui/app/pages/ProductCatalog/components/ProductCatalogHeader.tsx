import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import type { Product } from '../mockProducts';

interface ProductCatalogHeaderProps {
  products: Product[];
  onAddProduct: () => void;
}

export const ProductCatalogHeader = ({ products, onAddProduct }: ProductCatalogHeaderProps) => {
  const totalProducts = products.length;
  const availableCount = products.filter((p) => p.available).length;
  const outOfStockCount = products.filter((p) => !p.available).length;

  return (
    <Flex 
      flexDirection="column" 
      gap={20} 
      padding={24}
      paddingBottom={20}
      style={{ 
        borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column" gap={6}>
          <Flex alignItems="center" gap={8}>
            <span style={{ fontSize: '28px' }}>🛍️</span>
            <Heading level={2}>Product Catalog</Heading>
          </Flex>
          <Text style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '14px' }}>
            Browse and manage your product inventory
          </Text>
        </Flex>
        <Button 
          variant="accent"
          onClick={onAddProduct}
        >
          ＋ Add Product
        </Button>
      </Flex>

      <Flex gap={12} alignItems="center">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '12px',
          backgroundColor: 'var(--dt-colors-background-surface-default)',
          border: '1px solid var(--dt-colors-border-neutral-default)',
        }}>
          <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)' }}>
            Total Products
          </Text>
          <Text style={{ fontSize: '18px', fontWeight: '700', color: 'var(--dt-colors-text-primary-default)' }}>
            {totalProducts}
          </Text>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(44, 165, 44, 0.1)',
          border: '1px solid rgba(44, 165, 44, 0.3)',
        }}>
          <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-charts-categorical-grass-default)' }}>
            Available
          </Text>
          <Text style={{ fontSize: '18px', fontWeight: '700', color: 'var(--dt-colors-charts-categorical-grass-default)' }}>
            {availableCount}
          </Text>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 83, 80, 0.1)',
          border: '1px solid rgba(239, 83, 80, 0.3)',
        }}>
          <Text style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-charts-categorical-sunrise-default)' }}>
            Out of Stock
          </Text>
          <Text style={{ fontSize: '18px', fontWeight: '700', color: 'var(--dt-colors-charts-categorical-sunrise-default)' }}>
            {outOfStockCount}
          </Text>
        </div>
      </Flex>
    </Flex>
  );
};
