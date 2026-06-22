import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import {
  TextInput,
  Select,
  SelectOption,
} from "@dynatrace/strato-components-preview/forms";

type ProductFiltersProps = {
  searchTerm: string;
  category: string;
  availability: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onAvailabilityChange: (v: string) => void;
  onClearFilters: () => void;
};

const CATEGORY_OPTIONS = [
  "Electronics",
  "Apparel",
  "Books",
  "Home",
  "Sports",
] as const;

export const ProductFilters = ({
  searchTerm,
  category,
  availability,
  onSearchChange,
  onCategoryChange,
  onAvailabilityChange,
  onClearFilters,
}: ProductFiltersProps) => {
  const hasActiveFilters =
    searchTerm !== "" || category !== "All" || availability !== "All";

  return (
    <Flex
      gap={12}
      alignItems="center"
      style={{
        padding: "16px 24px",
      }}
    >
      <TextInput
        placeholder="🔍 Search products…"
        value={searchTerm}
        onChange={onSearchChange}
        style={{ minWidth: "280px" }}
      />

      <Select
        value={category}
        onChange={onCategoryChange}
        style={{ minWidth: "180px" }}
      >
        <Select.Content>
          <SelectOption value="All">All Categories</SelectOption>
          {CATEGORY_OPTIONS.map((cat) => (
            <SelectOption key={cat} value={cat}>
              {cat}
            </SelectOption>
          ))}
        </Select.Content>
      </Select>

      <Select
        value={availability}
        onChange={onAvailabilityChange}
        style={{ minWidth: "180px" }}
      >
        <Select.Content>
          <SelectOption value="All">All Availability</SelectOption>
          <SelectOption value="Available Only">Available Only</SelectOption>
          <SelectOption value="Out of Stock">Out of Stock</SelectOption>
        </Select.Content>
      </Select>

      {hasActiveFilters && (
        <Button variant="default" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </Flex>
  );
};
