import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { TextInput } from "@dynatrace/strato-components-preview/forms";
import { Select } from "@dynatrace/strato-components-preview/forms";
import { Button } from "@dynatrace/strato-components/buttons";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  availability: string;
  onAvailabilityChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const ProductFilters = ({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  availability,
  onAvailabilityChange,
  onClearFilters,
  hasActiveFilters,
}: ProductFiltersProps) => {
  return (
    <Flex
      gap={12}
      alignItems="center"
      flexWrap="wrap"
      style={{
        padding: "16px 24px",
        backgroundColor: "var(--dt-colors-background-container-default)",
        borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
      }}
    >
      <div style={{ flex: 1, minWidth: "250px", maxWidth: "400px" }}>
        <TextInput
          placeholder="🔍 Search products…"
          value={searchTerm}
          onChange={(value) => onSearchChange(value)}
        />
      </div>

      <div style={{ minWidth: "180px" }}>
        <Select
          name="category"
          value={category}
          onChange={(value) => onCategoryChange(value || "All")}
        >
          <Select.Content>
            <Select.Option value="All">All Categories</Select.Option>
            <Select.Option value="Electronics">Electronics</Select.Option>
            <Select.Option value="Apparel">Apparel</Select.Option>
            <Select.Option value="Books">Books</Select.Option>
            <Select.Option value="Home">Home</Select.Option>
            <Select.Option value="Sports">Sports</Select.Option>
          </Select.Content>
        </Select>
      </div>

      <div style={{ minWidth: "180px" }}>
        <Select
          name="availability"
          value={availability}
          onChange={(value) => onAvailabilityChange(value || "All")}
        >
          <Select.Content>
            <Select.Option value="All">All Products</Select.Option>
            <Select.Option value="Available">Available Only</Select.Option>
            <Select.Option value="OutOfStock">Out of Stock</Select.Option>
          </Select.Content>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="default" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </Flex>
  );
};
