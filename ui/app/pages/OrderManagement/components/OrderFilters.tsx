import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { TextInput } from '@dynatrace/strato-components-preview/forms';
import { Select } from '@dynatrace/strato-components-preview/forms';

interface OrderFiltersProps {
  status: 'all' | 'success' | 'failure';
  searchTerm: string;
  onStatusChange: (status: 'all' | 'success' | 'failure') => void;
  onSearchChange: (term: string) => void;
}

export const OrderFilters = ({
  status,
  searchTerm,
  onStatusChange,
  onSearchChange,
}: OrderFiltersProps) => {
  return (
    <Flex gap={16} padding={16} alignItems="center">
      <Select
        name="status"
        value={status}
        onChange={(value) => onStatusChange(value as 'all' | 'success' | 'failure')}
      >
        <Select.Option value="all">All Orders</Select.Option>
        <Select.Option value="success">Success Only</Select.Option>
        <Select.Option value="failure">Failures Only</Select.Option>
      </Select>
      
      <TextInput
        placeholder="Search by Order ID..."
        value={searchTerm}
        onChange={(value) => onSearchChange(value)}
      />
    </Flex>
  );
};
