import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import type { Product } from '../mockProducts';

interface ProductCatalogHeaderProps {
  products: Product[];
  onAddProduct: () => void;
}

/**
 * A visual stat chip displaying an icon, label, and numeric value.
 * Used for summary metrics like total products, availability counts, etc.
 */
const StatChip = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
  <Surface style={{ 
    padding: '12px 20px', 
    borderRadius: '8px',
    border: '1px solid var(--dt-colors-border-neutral-default)',
    minWidth: '140px',
  }}>
    <Flex flexDirection="column" gap={4}>
      <Flex alignItems="center" gap={6}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
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
      <Text style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1' }}>
        {value}
      </Text>
    </Flex>
  </Surface>
);

/**
 * Counts products that are marked as available.
 */
const countAvailableProducts = (products: Product[]): number => {
  return products.filter(p => p.available).length;
};

/**
 * Counts products that are unavailable or have zero stock.
 * A product is considered out of stock if either the available flag is false OR stock count is zero.
 */
const countOutOfStockProducts = (products: Product[]): number => {
  return products.filter(p => !p.available || p.stockCount === 0).length;
};

export const ProductCatalogHeader = ({ products, onAddProduct }: ProductCatalogHeaderProps) => {
  const totalProducts = products.length;
  const availableProducts = countAvailableProducts(products);
  const outOfStockProducts = countOutOfStockProducts(products);

  return (
    <Flex 
      flexDirection="column" 
      gap={16}
      padding={16}
      paddingLeft={24}
      paddingRight={24}
      style={{ 
        backgroundColor: 'var(--dt-colors-background-container-default)',
        borderBottom: '1px solid var(--dt-colors-border-neutral-default)'
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column" gap={4}>
          <Heading level={2} style={{ fontSize: '24px', fontWeight: '700' }}>
            🛍️ Product Catalog
          </Heading>
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
        <StatChip icon="📦" label="Total Products" value={totalProducts} />
        <StatChip icon="✅" label="Available" value={availableProducts} />
        <StatChip icon="❌" label="Out of Stock" value={outOfStockProducts} />
      </Flex>
    </Flex>
  );
};
