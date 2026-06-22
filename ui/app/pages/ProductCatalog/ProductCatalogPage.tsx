import React, { useState, useMemo } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { ProductHeader } from './components/ProductHeader';
import { ProductFilters } from './components/ProductFilters';
import { ProductsTable } from './components/ProductsTable';
import { mockProducts } from './utils/mockProducts';
import type { ProductCategory, ProductStatus } from './types/product.types';

export const ProductCatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  // Calculate statistics
  const totalProducts = mockProducts.length;
  const availableProducts = mockProducts.filter((p) => p.status === 'in-stock').length;
  const outOfStockProducts = mockProducts.filter((p) => p.status === 'out-of-stock').length;

  return (
    <Flex 
      flexDirection="column" 
      style={{ 
        height: '100%', 
        backgroundColor: 'var(--dt-colors-background-container-default)' 
      }}
    >
      {/* Header with title and Add Product button */}
      <Flex 
        justifyContent="space-between" 
        alignItems="center" 
        padding={24}
        paddingBottom={0}
      >
        <Flex flexDirection="column" gap={4}>
          <Heading level={1} style={{ fontWeight: '700' }}>🛍️ Product Catalog</Heading>
          <Text style={{ color: 'var(--dt-colors-text-secondary-default)' }}>
            Browse and manage your product inventory
          </Text>
        </Flex>
        <Button 
          variant="emphasized"
          onClick={() => {
            // Add product functionality placeholder
            console.log('Add product clicked');
          }}
        >
          + Add Product
        </Button>
      </Flex>

      {/* Stat cards */}
      <ProductHeader 
        totalProducts={totalProducts}
        availableProducts={availableProducts}
        outOfStockProducts={outOfStockProducts}
      />

      {/* Divider */}
      <div style={{ 
        height: '1px', 
        backgroundColor: 'var(--dt-colors-border-neutral-default)',
        marginLeft: '24px',
        marginRight: '24px',
      }} />

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
        <ProductsTable products={filteredProducts} />
      </div>
    </Flex>
  );
};
