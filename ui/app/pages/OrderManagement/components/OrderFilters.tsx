import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { TextInput } from '@dynatrace/strato-components-preview/forms';
import { Select } from '@dynatrace/strato-components-preview/forms';
import { TimeframeSelector } from '@dynatrace/strato-components-preview/filters';
import { Button } from '@dynatrace/strato-components/buttons';
import type { Timeframe } from '@dynatrace/strato-components-preview/core';

interface OrderFiltersProps {
  status: 'all' | 'success' | 'failure';
  searchTerm: string;
  timeframe: Timeframe;
  onStatusChange: (status: 'all' | 'success' | 'failure') => void;
  onSearchChange: (term: string) => void;
  onTimeframeChange: (timeframe: Timeframe) => void;
  onRefresh: () => void;
}

export const OrderFilters = ({
  status,
  searchTerm,
  timeframe,
  onStatusChange,
  onSearchChange,
  onTimeframeChange,
  onRefresh,
}: OrderFiltersProps) => {
  return (
    <Flex 
      gap={12} 
      padding={12}
      paddingLeft={24}
      paddingRight={24}
      alignItems="center"
      flexWrap="wrap"
      style={{ 
        backgroundColor: 'var(--dt-colors-background-container-default)',
        borderBottom: '1px solid var(--dt-colors-border-neutral-default)' 
      }}
    >
      <div style={{ minWidth: '200px' }}>
        <TimeframeSelector 
          value={timeframe}
          onChange={onTimeframeChange}
        />
      </div>
      
      <div style={{ minWidth: '180px' }}>
        <Select
          name="status"
          value={status}
          onChange={(value) => onStatusChange(value as 'all' | 'success' | 'failure')}
        >
          <Select.Content>
            <Select.Option value="all">All Orders</Select.Option>
            <Select.Option value="success">✅ Success Only</Select.Option>
            <Select.Option value="failure">❌ Failures Only</Select.Option>
          </Select.Content>
        </Select>
      </div>
      
      <div style={{ flex: 1, minWidth: '250px', maxWidth: '400px' }}>
        <TextInput
          placeholder="🔍 Search by Order ID..."
          value={searchTerm}
          onChange={(value) => onSearchChange(value)}
        />
      </div>
      
      <Button 
        variant="default"
        onClick={onRefresh}
      >
        🔄 Refresh
      </Button>
    </Flex>
  );
};
