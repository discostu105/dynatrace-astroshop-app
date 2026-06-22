import React, { useState, useMemo } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { ProductCatalogHeader } from './components/ProductCatalogHeader';
import { ProductFilters } from './components/ProductFilters';
import { ProductsTable } from './components/ProductsTable';
import { ProductEditPanel } from './components/ProductEditPanel';
import { mockProducts, type Product } from './mockProducts';

interface ProductCatalogPageProps {
  initialProducts?: Product[];
  initialEditTarget?: Product | null;
}

export const ProductCatalogPage = ({ 
  initialProducts = mockProducts,
  initialEditTarget = undefined,
}: ProductCatalogPageProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [editTarget, setEditTarget] = useState<Product | null | undefined>(initialEditTarget);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (category !== 'all' && product.category !== category) {
        return false;
      }
      
      // Availability filter
      if (availability === 'available' && !product.available) {
        return false;
      }
      if (availability === 'out-of-stock' && product.available) {
        return false;
      }
      
      return true;
    });
  }, [products, searchTerm, category, availability]);

  const handleAddProduct = () => {
    setEditTarget(null);
  };

  const handleEdit = (product: Product) => {
    setEditTarget(product);
  };

  const handleSave = (updatedProduct: Product) => {
    if (editTarget === null) {
      // Add mode
      setProducts([...products, updatedProduct]);
    } else {
      // Edit mode
      setProducts(products.map((p) => (p.productId === updatedProduct.productId ? updatedProduct : p)));
    }
    setEditTarget(undefined as any);
  };

  const handleClose = () => {
    setEditTarget(undefined as any);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setAvailability('all');
  };

  const isPanelOpen = editTarget !== undefined;

  return (
    <Flex flexDirection="column" style={{ height: '100%', overflow: 'hidden' }}>
      <ProductCatalogHeader 
        products={filteredProducts} 
        onAddProduct={handleAddProduct} 
      />
      
      <ProductFilters
        searchTerm={searchTerm}
        category={category}
        availability={availability}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
        onAvailabilityChange={setAvailability}
        onClear={handleClearFilters}
      />
      
      <Flex 
        style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: '16px 24px',
        }}
      >
        <ProductsTable 
          products={filteredProducts}
          onEdit={handleEdit}
          isLoading={false}
        />
      </Flex>

      {isPanelOpen && (
        <ProductEditPanel
          product={editTarget}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </Flex>
  );
};
