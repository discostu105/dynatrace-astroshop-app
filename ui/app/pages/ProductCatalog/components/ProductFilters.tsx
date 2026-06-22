import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { TextInput, Select } from "@dynatrace/strato-components-preview/forms";
import { Button } from "@dynatrace/strato-components/buttons";

type Category = "All" | "Electronics" | "Apparel" | "Books" | "Home" | "Sports";
type Availability = "All" | "Available" | "OutOfStock";

interface ProductFiltersProps {
  searchTerm: string;
  category: Category;
  availability: Availability;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: Category) => void;
  onAvailabilityChange: (value: Availability) => void;
  onClearFilters: () => void;
}

export const ProductFilters = ({
  searchTerm,
  category,
  availability,
  onSearchChange,
  onCategoryChange,
  onAvailabilityChange,
  onClearFilters,
}: ProductFiltersProps) => {
  // Show "Clear filters" button when any filter is active (non-default state)
  const hasActiveFilters =
    searchTerm !== "" || category !== "All" || availability !== "All";

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
          onChange={(value) => onCategoryChange(value as Category)}
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
          onChange={(value) => onAvailabilityChange(value as Availability)}
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
