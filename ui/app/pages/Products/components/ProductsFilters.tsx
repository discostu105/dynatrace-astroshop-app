import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { TextInput } from '@dynatrace/strato-components-preview/forms';
import { Select, SelectOption } from '@dynatrace/strato-components-preview/forms';
import type { ProductCategory, ProductStatusFilter } from '../types/product.types';

interface ProductsFiltersProps {
  searchQuery: string;
  categoryFilter: ProductCategory;
  statusFilter: ProductStatusFilter;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: ProductCategory) => void;
  onStatusChange: (status: ProductStatusFilter) => void;
}

export const ProductsFilters = ({
  searchQuery,
  categoryFilter,
  statusFilter,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: ProductsFiltersProps) => {
  return (
    <Flex gap={16} flexWrap="wrap" alignItems="flex-end">
      {/* Filter controls for searching and filtering the product catalog */}
      <div style={{ flex: '1', minWidth: '200px', maxWidth: '400px' }}>
        <TextInput
          value={searchQuery}
          onChange={(value: string) => onSearchChange(value)}
          placeholder="🔍 Search products..."
        >
          Search
        </TextInput>
      </div>

      <div style={{ minWidth: '180px' }}>
        <Select value={categoryFilter} onChange={(value: string) => onCategoryChange(value as ProductCategory)}>
          <Select.Content>
            <SelectOption value="All Categories">All Categories</SelectOption>
            <SelectOption value="Electronics">Electronics</SelectOption>
            <SelectOption value="Apparel">Apparel</SelectOption>
            <SelectOption value="Sports">Sports</SelectOption>
            <SelectOption value="Kitchen">Kitchen</SelectOption>
            <SelectOption value="Office">Office</SelectOption>
            <SelectOption value="Home">Home</SelectOption>
          </Select.Content>
        </Select>
      </div>

      <div style={{ minWidth: '160px' }}>
        <Select value={statusFilter} onChange={(value: string) => onStatusChange(value as ProductStatusFilter)}>
          <Select.Content>
            <SelectOption value="All Products">All Products</SelectOption>
            <SelectOption value="In Stock">In Stock</SelectOption>
            <SelectOption value="Out of Stock">Out of Stock</SelectOption>
          </Select.Content>
        </Select>
      </div>
    </Flex>
  );
};
