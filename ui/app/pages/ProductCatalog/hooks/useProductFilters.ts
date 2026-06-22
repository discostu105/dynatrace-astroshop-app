import { useState, useMemo } from 'react';
import type { Product, ProductFilters } from '../types/product.types';

export const useProductFilters = (products: Product[]) => {
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: '',
    category: 'all',
    stockFilter: 'all',
  });

  const updateSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  const updateCategory = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const updateStockFilter = (stockFilter: 'all' | 'in-stock' | 'out-of-stock') => {
    setFilters((prev) => ({ ...prev, stockFilter }));
  };

  // Memoized filtering - recalculates only when products or filters change
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Case-insensitive search on product name
      const matchesSearch = filters.searchTerm
        ? product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
        : true;

      // Category filter - 'all' matches everything
      const matchesCategory = filters.category === 'all' || product.category === filters.category;

      // Stock filter - maps to product status
      const matchesStock =
        filters.stockFilter === 'all' ||
        (filters.stockFilter === 'in-stock' && product.status === 'In Stock') ||
        (filters.stockFilter === 'out-of-stock' && product.status === 'Out of Stock');

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, filters]);

  return {
    filters,
    filteredProducts,
    updateSearchTerm,
    updateCategory,
    updateStockFilter,
  };
};
