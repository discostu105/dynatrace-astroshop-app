import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { TextInput, Select } from "@dynatrace/strato-components-preview/forms";
import type { ProductCategory, ProductStatus } from "../types/product.types";

interface ProductFiltersProps {
  searchTerm: string;
  categoryFilter: ProductCategory | "all";
  statusFilter: ProductStatus | "all";
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: ProductCategory | "all") => void;
  onStatusChange: (status: ProductStatus | "all") => void;
}

// Available product categories - must match ProductCategory type
const PRODUCT_CATEGORIES: { value: ProductCategory | "all"; label: string }[] =
  [
    { value: "all", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Apparel", label: "Apparel" },
    { value: "Home & Garden", label: "Home & Garden" },
    { value: "Sports", label: "Sports" },
    { value: "Books", label: "Books" },
  ];

const STATUS_OPTIONS: { value: ProductStatus | "all"; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "in-stock", label: "In Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
];

export const ProductFilters = ({
  searchTerm,
  categoryFilter,
  statusFilter,
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
          value={categoryFilter}
          onChange={(value) =>
            onCategoryChange(value as ProductCategory | "all")
          }
        >
          <Select.Content>
            {PRODUCT_CATEGORIES.map(({ value, label }) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
      </div>

      <div style={{ minWidth: "180px" }}>
        <Select
          name="status"
          value={statusFilter}
          onChange={(value) => onStatusChange(value as ProductStatus | "all")}
        >
          <Select.Content>
            {STATUS_OPTIONS.map(({ value, label }) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
      </div>
    </Flex>
  );
};
