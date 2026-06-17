import { useState, useEffect, useMemo } from 'react';
import { mockProducts, type Product } from '../data/mockProducts';

interface UseProductsParams {
  timeframe: string;
  category: string;
  searchTerm: string;
  sortBy: string;
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
}

export const useProducts = ({
  timeframe,
  category,
  searchTerm,
  sortBy,
}: UseProductsParams): UseProductsReturn => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [timeframe, category, searchTerm, sortBy]);

  const products = useMemo(() => {
    if (isLoading) return [];

    let filtered = [...mockProducts];

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((p) => p.productName.toLowerCase().includes(search));
    }

    // Sort
    switch (sortBy) {
      case 'revenue':
        filtered.sort((a, b) => b.totalRevenue - a.totalRevenue);
        break;
      case 'units':
        filtered.sort((a, b) => b.totalQuantity - a.totalQuantity);
        break;
      case 'orders':
        filtered.sort((a, b) => b.orderCount - a.orderCount);
        break;
      case 'name':
        filtered.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      default:
        break;
    }

    return filtered;
  }, [isLoading, category, searchTerm, sortBy]);

  return { products, isLoading };
};
