import React, { useState, useMemo } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { mockProducts, type Product } from './mockProducts';
import { ProductCatalogHeader } from './components/ProductCatalogHeader';
import { ProductFilters } from './components/ProductFilters';
import { ProductsTable } from './components/ProductsTable';
import { ProductEditPanel } from './components/ProductEditPanel';

type ProductCatalogPageProps = {
  initialSearchTerm?: string;
  initialEditTarget?: Product | null;
};

export const ProductCatalogPage = ({
  initialSearchTerm = '',
  initialEditTarget,
}: ProductCatalogPageProps = {}) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('All');
  const [editTarget, setEditTarget] = useState<Product | null | undefined>(
    initialEditTarget
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (category !== 'All' && product.category !== category) {
        return false;
      }

      // Availability filter
      if (availability === 'Available Only' && !product.available) {
        return false;
      }
      if (availability === 'Out of Stock' && product.available) {
        return false;
      }

      return true;
    });
  }, [products, searchTerm, category, availability]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setAvailability('All');
  };

  const handleAddProduct = () => {
    setEditTarget(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditTarget(product);
  };

  const handleSaveProduct = (updated: Product) => {
    const existingIndex = products.findIndex((p) => p.productId === updated.productId);
    if (existingIndex >= 0) {
      // Update existing product
      const newProducts = [...products];
      newProducts[existingIndex] = updated;
      setProducts(newProducts);
    } else {
      // Add new product
      setProducts([...products, updated]);
    }
  };

  const handleClosePanel = () => {
    setEditTarget(undefined as any);
  };

  return (
    <Flex flexDirection="column" style={{ height: '100%' }}>
      <ProductCatalogHeader products={filteredProducts} onAddProduct={handleAddProduct} />

      <ProductFilters
        searchTerm={searchTerm}
        category={category}
        availability={availability}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
        onAvailabilityChange={setAvailability}
        onClearFilters={handleClearFilters}
      />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <ProductsTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          isLoading={false}
        />
      </div>

      {editTarget !== undefined && (
        <ProductEditPanel product={editTarget} onClose={handleClosePanel} onSave={handleSaveProduct} />
      )}
    </Flex>
  );
};
