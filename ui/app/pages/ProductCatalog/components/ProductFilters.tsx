import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { TextInput } from "@dynatrace/strato-components-preview/forms";
import { Select } from "@dynatrace/strato-components-preview/forms";
import { Button } from "@dynatrace/strato-components/buttons";

interface ProductFiltersProps {
  searchTerm: string;
  category: string;
  availability: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onAvailabilityChange: (availability: string) => void;
  onClear: () => void;
}

export const ProductFilters = ({
  searchTerm,
  category,
  availability,
  onSearchChange,
  onCategoryChange,
  onAvailabilityChange,
  onClear,
}: ProductFiltersProps) => {
  // Show clear button only when at least one filter is active
  const hasActiveFilters =
    searchTerm !== "" || category !== "all" || availability !== "all";

  return (
    <Flex
      gap={12}
      padding={16}
      paddingLeft={24}
      paddingRight={24}
      alignItems="center"
      flexWrap="wrap"
      style={{
        backgroundColor: "var(--dt-colors-background-container-default)",
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
          onChange={(value) => onCategoryChange(value)}
        >
          <Select.Content>
            <Select.Option value="all">All Categories</Select.Option>
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
          onChange={(value) => onAvailabilityChange(value)}
        >
          <Select.Content>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="available">Available Only</Select.Option>
            <Select.Option value="out-of-stock">Out of Stock</Select.Option>
          </Select.Content>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="default" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </Flex>
  );
};
