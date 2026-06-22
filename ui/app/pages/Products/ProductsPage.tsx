import React, { useState, useMemo } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { ProductsHeader } from './components/ProductsHeader';
import { ProductsFilters } from './components/ProductsFilters';
import { ProductsTable } from './components/ProductsTable';
import { mockProducts } from './data/mockProducts';
import type { Product, ProductCategory, ProductStatusFilter } from './types/product.types';

/**
 * Checks if a product matches the given search query.
 * Searches across product name and category.
 */
const matchesSearchQuery = (product: Product, query: string): boolean => {
  if (query === '') return true;
  const lowerQuery = query.toLowerCase();
  return (
    product.name.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Checks if a product matches the given category filter.
 */
const matchesCategoryFilter = (product: Product, category: ProductCategory): boolean => {
  return category === 'All Categories' || product.category === category;
};

/**
 * Checks if a product matches the given stock status filter.
 */
const matchesStatusFilter = (product: Product, status: ProductStatusFilter): boolean => {
  if (status === 'All Products') return true;
  return status === 'In Stock' ? product.inStock : !product.inStock;
};

export const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory>('All Categories');
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>('All Products');

  // Apply all active filters to the product list
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      return (
        matchesSearchQuery(product, searchQuery) &&
        matchesCategoryFilter(product, categoryFilter) &&
        matchesStatusFilter(product, statusFilter)
      );
    });
  }, [searchQuery, categoryFilter, statusFilter]);

  // Compute statistics from the full product list (not filtered)
  const statistics = useMemo(() => {
    const totalProducts = mockProducts.length;
    const availableProducts = mockProducts.filter((p) => p.inStock).length;
    const outOfStockProducts = mockProducts.filter((p) => !p.inStock).length;

    return {
      totalProducts,
      availableProducts,
      outOfStockProducts,
    };
  }, []);

  // Placeholder handler for adding products
  const handleAddProduct = () => {
    alert('Add product feature coming soon!');
  };

  // Placeholder handler for editing products
  const handleEditProduct = (productId: string, productName: string) => {
    alert(`Edit: ${productName}`);
  };

  return (
    <Flex flexDirection="column" gap={24} padding={32}>
      <ProductsHeader statistics={statistics} onAddProduct={handleAddProduct} />

      <hr style={{ border: 'none', borderTop: '1px solid var(--dt-colors-border-neutral-default)', margin: '0' }} />

      <ProductsFilters
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategoryFilter}
        onStatusChange={setStatusFilter}
      />

      <ProductsTable products={filteredProducts} onEditProduct={handleEditProduct} />
    </Flex>
  );
};
