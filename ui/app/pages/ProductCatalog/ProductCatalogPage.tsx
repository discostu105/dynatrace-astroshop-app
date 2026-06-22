import React, { useState, useMemo } from 'react';
import { Page } from '@dynatrace/strato-components-preview/layouts';
import { Flex } from '@dynatrace/strato-components/layouts';
import { ProductCatalogHeader } from './components/ProductCatalogHeader';
import { ProductFilters } from './components/ProductFilters';
import { ProductsTable } from './components/ProductsTable';
import { ProductEditPanel } from './components/ProductEditPanel';
import { mockProducts, type Product } from './mockProducts';

type ProductCatalogPageProps = {
  initialProducts?: Product[];
  initialEditTarget?: Product | null;
};

/**
 * Determines if a product matches all active filter criteria.
 * Empty filter values are treated as "show all" for that dimension.
 */
const matchesFilters = (product: Product, filters: { searchTerm: string; category: string; availability: string }): boolean => {
  // Search term filter (case-insensitive name match)
  if (filters.searchTerm !== '' && !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
    return false;
  }

  // Category filter
  if (filters.category !== '' && product.category !== filters.category) {
    return false;
  }

  // Availability filter
  if (filters.availability === 'available' && !product.available) {
    return false;
  } else if (filters.availability === 'outofstock' && product.available && product.stockCount > 0) {
    return false;
  }

  return true;
};

export const ProductCatalogPage = ({ 
  initialProducts, 
  initialEditTarget 
}: ProductCatalogPageProps = {}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');
  const [editTarget, setEditTarget] = useState<Product | null>(initialEditTarget || null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => matchesFilters(product, { searchTerm, category, availability }));
  }, [products, searchTerm, category, availability]);

  const handleAddProduct = () => {
    // Create a temporary product with 'NEW' ID to signal add mode in the edit panel
    const newProduct: Product = {
      productId: 'NEW',
      name: '',
      category: 'Electronics',
      unitPrice: 0,
      stockCount: 0,
      available: true,
      imageEmoji: '📦',
    };
    setEditTarget(newProduct);
  };

  const handleSave = (updated: Product) => {
    if (updated.productId === 'NEW') {
      // Add mode: generate next sequential ID (PROD-XXX format)
      const maxId = products.reduce((max, p) => {
        const num = parseInt(p.productId.replace('PROD-', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);
      const newId = `PROD-${String(maxId + 1).padStart(3, '0')}`;
      const newProduct = { ...updated, productId: newId };
      setProducts([...products, newProduct]);
    } else {
      // Edit mode: replace existing product in list
      setProducts(products.map((p) => (p.productId === updated.productId ? updated : p)));
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setAvailability('');
  };

  return (
    <Page>
      <Page.Main>
        <Flex 
          flexDirection="column" 
          style={{ 
            height: '100%', 
            backgroundColor: 'var(--dt-colors-background-container-default)' 
          }}
        >
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
            onClearFilters={handleClearFilters}
          />
          
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
            <ProductsTable
              products={filteredProducts}
              onEdit={setEditTarget}
              isLoading={false}
            />
          </div>
          
          {editTarget !== null && (
            <ProductEditPanel
              product={editTarget.productId === 'NEW' ? null : editTarget}
              onClose={() => setEditTarget(null)}
              onSave={handleSave}
            />
          )}
        </Flex>
      </Page.Main>
    </Page>
  );
};
