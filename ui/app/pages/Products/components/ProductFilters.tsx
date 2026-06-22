import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { TextInput, Select } from "@dynatrace/strato-components-preview/forms";

// Product categories available for filtering - matches the categories in MOCK_PRODUCTS
const PRODUCT_CATEGORIES = [
  "Electronics",
  "Apparel",
  "Home & Garden",
  "Sports",
  "Books",
] as const;

interface ProductFiltersProps {
  searchTerm: string;
  category: string;
  status: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
}

export const ProductFilters = ({
  searchTerm,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
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
          onChange={(value) => onCategoryChange(value)}
        >
          <Select.Content>
            <Select.Option value="all">All Categories</Select.Option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <Select.Option key={cat} value={cat}>
                {cat}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
      </div>

      <div style={{ minWidth: "180px" }}>
        <Select
          name="status"
          value={status}
          onChange={(value) => onStatusChange(value)}
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
