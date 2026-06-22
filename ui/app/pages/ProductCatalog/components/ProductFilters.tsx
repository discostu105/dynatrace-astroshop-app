import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Button } from '@dynatrace/strato-components/buttons';
import { TextInput } from '@dynatrace/strato-components-preview/forms';
import { Select, SelectOption } from '@dynatrace/strato-components-preview';

type ProductFiltersProps = {
  searchTerm: string;
  category: string;
  availability: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onAvailabilityChange: (v: string) => void;
  onClearFilters: () => void;
};

export const ProductFilters = ({
  searchTerm,
  category,
  availability,
  onSearchChange,
  onCategoryChange,
  onAvailabilityChange,
  onClearFilters,
}: ProductFiltersProps) => {
  const hasActiveFilters = searchTerm !== '' || category !== 'All' || availability !== 'All';

  return (
    <Flex
      gap={12}
      alignItems="center"
      style={{
        padding: '16px 24px',
      }}
    >
      <TextInput
        placeholder="🔍 Search products…"
        value={searchTerm}
        onChange={onSearchChange}
        style={{ minWidth: '280px' }}
      />

      <Select value={category} onChange={onCategoryChange} style={{ minWidth: '180px' }}>
        <Select.Content>
          <SelectOption value="All">All Categories</SelectOption>
          <SelectOption value="Electronics">Electronics</SelectOption>
          <SelectOption value="Apparel">Apparel</SelectOption>
          <SelectOption value="Books">Books</SelectOption>
          <SelectOption value="Home">Home</SelectOption>
          <SelectOption value="Sports">Sports</SelectOption>
        </Select.Content>
      </Select>

      <Select value={availability} onChange={onAvailabilityChange} style={{ minWidth: '180px' }}>
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
