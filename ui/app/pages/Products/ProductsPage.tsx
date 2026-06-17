import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Tabs, Tab } from '@dynatrace/strato-components-preview/navigation';
import { TimeframeSelector } from '@dynatrace/strato-components-preview/filters';
import { Select, TextInput } from '@dynatrace/strato-components-preview/forms';
import type { Timeframe } from '@dynatrace/strato-components-preview/core';
import { ProductSummaryStrip } from './components/ProductSummaryStrip';
import { ProductsTable } from './components/ProductsTable';
import { RestockRequestForm } from './components/RestockRequestForm';
import { useProducts } from './hooks/useProducts';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    timeframe: {
      from: { value: 'now-2h' },
      to: { value: 'now' },
    } as Timeframe,
    category: 'all',
    searchTerm: '',
    sortBy: 'revenue',
  });

  const { products, isLoading } = useProducts({
    timeframe: filters.timeframe.from.value,
    category: filters.category,
    searchTerm: filters.searchTerm,
    sortBy: filters.sortBy,
  });

  const handleTabChange = (index: number) => {
    navigate(index === 2 ? '/products' : index === 1 ? '/geo' : '/');
  };

  const selectedIndex =
    location.pathname === '/geo' ? 1 : location.pathname === '/products' ? 2 : 0;

  return (
    <Flex
      flexDirection="column"
      style={{
        position: 'relative',
        height: '100%',
        backgroundColor: 'var(--dt-colors-background-container-default)',
      }}
    >
      <Tabs selectedIndex={selectedIndex} onChange={handleTabChange}>
        <Tab title="Orders">Orders</Tab>
        <Tab title="Geographic">Geographic</Tab>
        <Tab title="Products">Products</Tab>
      </Tabs>

      <Flex
        gap={16}
        alignItems="center"
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid var(--dt-colors-border-neutral)',
        }}
      >
        <div style={{ minWidth: '200px' }}>
          <TimeframeSelector
            value={filters.timeframe}
            onChange={(timeframe) =>
              setFilters({ ...filters, timeframe: timeframe as Timeframe })
            }
          />
        </div>

        <Select
          value={filters.category}
          onChange={(value) => setFilters({ ...filters, category: value as string })}
          style={{ minWidth: '150px' }}
        >
          <Select.Option value="all">All Categories</Select.Option>
          <Select.Option value="Electronics">Electronics</Select.Option>
          <Select.Option value="Apparel">Apparel</Select.Option>
          <Select.Option value="Home & Garden">Home & Garden</Select.Option>
          <Select.Option value="Books">Books</Select.Option>
          <Select.Option value="Other">Other</Select.Option>
        </Select>

        <Select
          value={filters.sortBy}
          onChange={(value) => setFilters({ ...filters, sortBy: value as string })}
          style={{ minWidth: '150px' }}
        >
          <Select.Option value="revenue">Sort by Revenue</Select.Option>
          <Select.Option value="units">Sort by Units</Select.Option>
          <Select.Option value="orders">Sort by Orders</Select.Option>
          <Select.Option value="name">Sort by Name</Select.Option>
        </Select>

        <TextInput
          value={filters.searchTerm}
          onChange={(value) => setFilters({ ...filters, searchTerm: value as string })}
          placeholder="Search by product name…"
          style={{ flex: 1, minWidth: '200px' }}
        />
      </Flex>

      <ProductSummaryStrip products={products} isLoading={isLoading} />

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
        <ProductsTable products={products} isLoading={isLoading} />
      </div>

      <div style={{ padding: '16px 24px' }}>
        <RestockRequestForm products={products} />
      </div>
    </Flex>
  );
};
