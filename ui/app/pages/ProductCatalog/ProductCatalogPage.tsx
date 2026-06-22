import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { ProductHeader } from './components/ProductHeader';
import { ProductFilters } from './components/ProductFilters';
import { ProductsTable } from './components/ProductsTable';
import { useProductFilters } from './hooks/useProductFilters';
import { useProductStatistics } from './hooks/useProductStatistics';
import { mockProducts } from './data/mockProducts';

export const ProductCatalogPage = () => {
  const { 
    filters, 
    filteredProducts, 
    updateSearchTerm, 
    updateCategory, 
    updateStockFilter 
  } = useProductFilters(mockProducts);
  
  const statistics = useProductStatistics(mockProducts);

  // Placeholder handlers - to be implemented with product management features
  const handleAddProduct = () => {
    // TODO: Open modal/form to add a new product
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditProduct = (_productId: string) => {
    // TODO: Open modal/form to edit product with ID: _productId
  };

  return (
    <Flex 
      flexDirection="column" 
      style={{ 
        position: 'relative', 
        height: '100%', 
        backgroundColor: 'var(--dt-colors-background-container-default)' 
      }}
    >
      <ProductHeader 
        statistics={statistics} 
        onAddProduct={handleAddProduct}
      />
      
      <ProductFilters
        searchTerm={filters.searchTerm}
        category={filters.category}
        stockFilter={filters.stockFilter}
        onSearchChange={updateSearchTerm}
        onCategoryChange={updateCategory}
        onStockFilterChange={updateStockFilter}
      />
      
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
        <ProductsTable 
          products={filteredProducts}
          onEditProduct={handleEditProduct}
        />
      </div>
    </Flex>
  );
};
