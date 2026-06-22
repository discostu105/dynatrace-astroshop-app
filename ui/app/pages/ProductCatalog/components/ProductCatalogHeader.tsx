import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';

interface ProductCatalogHeaderProps {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  onAddProduct: () => void;
}

export const ProductCatalogHeader = ({
  totalProducts,
  availableProducts,
  outOfStockProducts,
  onAddProduct,
}: ProductCatalogHeaderProps) => {
  return (
    <Flex
      flexDirection="column"
      gap={16}
      padding={24}
      style={{
        backgroundColor: 'var(--dt-colors-background-container-default)',
        borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <div>
          <Heading level={2} style={{ marginBottom: '4px' }}>
            🛍️ Product Catalog
          </Heading>
          <Text style={{ color: 'var(--dt-colors-text-secondary-default)' }}>
            Browse and manage your product inventory
          </Text>
        </div>
        <Button variant="accent" onClick={onAddProduct}>
          ＋ Add Product
        </Button>
      </Flex>

      <Flex gap={48} alignItems="center">
        <div>
          <Text
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--dt-colors-text-primary-default)',
            }}
          >
            {totalProducts}
          </Text>
          <Text
            style={{
              fontSize: '12px',
              color: 'var(--dt-colors-text-secondary-default)',
              marginTop: '4px',
            }}
          >
            Total Products
          </Text>
        </div>

        <div>
          <Text
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--dt-colors-charts-categorical-grass-default)',
            }}
          >
            {availableProducts}
          </Text>
          <Text
            style={{
              fontSize: '12px',
              color: 'var(--dt-colors-text-secondary-default)',
              marginTop: '4px',
            }}
          >
            Available
          </Text>
        </div>

        <div>
          <Text
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--dt-colors-charts-categorical-sunrise-default)',
            }}
          >
            {outOfStockProducts}
          </Text>
          <Text
            style={{
              fontSize: '12px',
              color: 'var(--dt-colors-text-secondary-default)',
              marginTop: '4px',
            }}
          >
            Out of Stock
          </Text>
        </div>
      </Flex>
    </Flex>
  );
};
