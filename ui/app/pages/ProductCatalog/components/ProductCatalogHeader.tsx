import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Button } from '@dynatrace/strato-components/buttons';
import type { Product } from '../mockProducts';

type ProductCatalogHeaderProps = {
  products: Product[];
  onAddProduct: () => void;
};

export const ProductCatalogHeader = ({ products, onAddProduct }: ProductCatalogHeaderProps) => {
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available).length;
  const outOfStockProducts = products.filter((p) => !p.available).length;

  return (
    <Flex
      flexDirection="column"
      gap={16}
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column" gap={4}>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>🛍️ Product Catalog</div>
          <div
            style={{
              fontSize: '14px',
              color: 'var(--dt-colors-text-secondary-default)',
            }}
          >
            Browse and manage your product inventory
          </div>
        </Flex>
        <Button onClick={onAddProduct}>＋ Add Product</Button>
      </Flex>

      <Flex gap={12}>
        <div
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--dt-colors-background-neutral)',
            border: '1px solid var(--dt-colors-border-neutral-default)',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'var(--dt-colors-text-secondary-default)',
              marginBottom: '4px',
            }}
          >
            Total Products
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600' }}>{totalProducts}</div>
        </div>

        <div
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(44, 165, 44, 0.1)',
            border: '1px solid rgba(44, 165, 44, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'var(--dt-colors-text-secondary-default)',
              marginBottom: '4px',
            }}
          >
            Available
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: 'rgba(44, 165, 44, 1)' }}>
            {availableProducts}
          </div>
        </div>

        <div
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 83, 80, 0.1)',
            border: '1px solid rgba(239, 83, 80, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'var(--dt-colors-text-secondary-default)',
              marginBottom: '4px',
            }}
          >
            Out of Stock
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: 'rgba(239, 83, 80, 1)' }}>
            {outOfStockProducts}
          </div>
        </div>
      </Flex>
    </Flex>
  );
};
