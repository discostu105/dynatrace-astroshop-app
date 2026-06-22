import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { TextInput } from "@dynatrace/strato-components-preview/forms";
import { Select } from "@dynatrace/strato-components-preview/forms";

interface ProductFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedStockFilter: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onStockFilterChange: (filter: string) => void;
}

// Filter controls for searching and filtering products by category and stock status
export const ProductFilters = ({
  searchTerm,
  selectedCategory,
  selectedStockFilter,
  onSearchChange,
  onCategoryChange,
  onStockFilterChange,
}: ProductFiltersProps) => {
  return (
    <Flex
      gap={12}
      padding={12}
      paddingLeft={24}
      paddingRight={24}
      alignItems="center"
      flexWrap="wrap"
      style={{
        backgroundColor: "var(--dt-colors-background-container-default)",
        borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
      }}
    >
      <div style={{ flex: 1, minWidth: "250px", maxWidth: "400px" }}>
        <TextInput
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(value) => onSearchChange(value)}
        />
      </div>

      <div style={{ minWidth: "180px" }}>
        <Select
          name="category"
          value={selectedCategory}
          onChange={(value) => onCategoryChange(value)}
        >
          <Select.Content>
            <Select.Option value="all">All Categories</Select.Option>
            <Select.Option value="Electronics">Electronics</Select.Option>
            <Select.Option value="Apparel">Apparel</Select.Option>
            <Select.Option value="Home & Garden">Home & Garden</Select.Option>
          </Select.Content>
        </Select>
      </div>

      <div style={{ minWidth: "180px" }}>
        <Select
          name="stockFilter"
          value={selectedStockFilter}
          onChange={(value) => onStockFilterChange(value)}
        >
          <Select.Content>
            <Select.Option value="all">All Products</Select.Option>
            <Select.Option value="inStock">In Stock Only</Select.Option>
            <Select.Option value="outOfStock">Out of Stock Only</Select.Option>
          </Select.Content>
        </Select>
      </div>
    </Flex>
  );
};
