import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { TextInput } from "@dynatrace/strato-components-preview/forms";
import { Select } from "@dynatrace/strato-components-preview/forms";

interface ProductFiltersProps {
  searchTerm: string;
  category: string;
  stockFilter: "all" | "in-stock" | "out-of-stock";
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onStockFilterChange: (filter: "all" | "in-stock" | "out-of-stock") => void;
}

export const ProductFilters = ({
  searchTerm,
  category,
  stockFilter,
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
          value={category}
          onChange={(value) => onCategoryChange(value || 'all')}
        >
          <Select.Content>
            <Select.Option value="all">All Categories</Select.Option>
            <Select.Option value="Electronics">Electronics</Select.Option>
            <Select.Option value="Apparel">Apparel</Select.Option>
            <Select.Option value="Home & Garden">Home & Garden</Select.Option>
            <Select.Option value="Sports">Sports</Select.Option>
            <Select.Option value="Books">Books</Select.Option>
          </Select.Content>
        </Select>
      </div>

      <div style={{ minWidth: "180px" }}>
        <Select
          name="stockFilter"
          value={stockFilter}
          onChange={(value) =>
            onStockFilterChange(
              (value as "all" | "in-stock" | "out-of-stock") || "all"
            )
          }
        >
          <Select.Content>
            <Select.Option value="all">All Products</Select.Option>
            <Select.Option value="in-stock">In Stock</Select.Option>
            <Select.Option value="out-of-stock">Out of Stock</Select.Option>
          </Select.Content>
        </Select>
      </div>
    </Flex>
  );
};
