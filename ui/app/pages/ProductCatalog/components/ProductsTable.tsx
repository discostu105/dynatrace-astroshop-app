import React from 'react';
import { DataTable } from '@dynatrace/strato-components-preview/tables';
import { Button } from '@dynatrace/strato-components/buttons';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Skeleton } from '@dynatrace/strato-components/content';
import type { Product } from '../mockProducts';

type ProductsTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  isLoading: boolean;
};

/**
 * Badge component displaying stock count with visual emphasis when out of stock.
 * Zero stock triggers a red background and bolder text to draw attention.
 */
const StockBadge = ({ count }: { count: number }) => {
  const isOutOfStock = count === 0;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '12px',
        backgroundColor: isOutOfStock
          ? 'rgba(239, 83, 80, 0.1)'
          : 'transparent',
        color: isOutOfStock
          ? 'var(--dt-colors-charts-categorical-sunrise-default)'
          : 'var(--dt-colors-text-primary-default)',
        fontSize: '13px',
        fontWeight: isOutOfStock ? '600' : '500',
      }}
    >
      {count}
    </div>
  );
};

/**
 * Badge showing product availability status.
 * A product is "In Stock" only if available flag is true AND stock count > 0.
 */
const StatusBadge = ({ available, stockCount }: { available: boolean; stockCount: number }) => {
  const isInStock = available && stockCount > 0;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '12px',
        backgroundColor: isInStock
          ? 'rgba(44, 165, 44, 0.1)'
          : 'rgba(239, 83, 80, 0.1)',
        color: isInStock
          ? 'var(--dt-colors-charts-categorical-grass-default)'
          : 'var(--dt-colors-charts-categorical-sunrise-default)',
        fontSize: '12px',
        fontWeight: '500',
      }}
    >
      <span>{isInStock ? '●' : '●'}</span>
      {isInStock ? 'In Stock' : 'Out of Stock'}
    </div>
  );
};

const EmptyState = () => (
  <Flex 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    gap={16}
    style={{ padding: '80px 24px', textAlign: 'center' }}
  >
    <span style={{ fontSize: '64px' }}>📭</span>
    <Heading level={4}>No products match your filters</Heading>
    <Text style={{ color: 'var(--dt-colors-text-secondary-default)' }}>
      Try adjusting your search or clearing filters
    </Text>
  </Flex>
);

export const ProductsTable = ({ products, onEdit, isLoading }: ProductsTableProps) => {
  // Show skeleton loading state while data is being fetched
  if (isLoading) {
    return (
      <Flex flexDirection="column" gap={12}>
        <Skeleton width="100%" height="60px" />
        <Skeleton width="100%" height="60px" />
        <Skeleton width="100%" height="60px" />
      </Flex>
    );
  }

  // Show empty state when no products match the current filters
  if (products.length === 0) {
    return <EmptyState />;
  }

  const columns = [
    {
      id: 'item',
      header: 'Item',
      accessor: (row: Product) => ({ emoji: row.imageEmoji, name: row.name }),
      cell: ({ value }: { value: { emoji: string; name: string } }) => (
        <DataTable.DefaultCell>
          <Flex alignItems="center" gap={12}>
            <span style={{ fontSize: '24px' }}>{value.emoji}</span>
            <Text style={{ fontWeight: '600' }}>{value.name}</Text>
          </Flex>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 300,
      minWidth: 250,
    },
    {
      id: 'category',
      header: 'Category',
      accessor: 'category',
      cell: ({ value }: { value: string }) => (
        <DataTable.DefaultCell>
          <Text>{value}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 150,
      minWidth: 120,
    },
    {
      id: 'price',
      header: 'Price',
      accessor: 'unitPrice',
      cell: ({ value }: { value: number }) => (
        <DataTable.DefaultCell>
          <Text style={{ fontWeight: '500' }}>
            ${(value / 100).toFixed(2)}
          </Text>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 120,
      minWidth: 100,
    },
    {
      id: 'stock',
      header: 'Stock',
      accessor: 'stockCount',
      cell: ({ value }: { value: number }) => (
        <DataTable.DefaultCell>
          <StockBadge count={value} />
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 100,
      minWidth: 80,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: Product) => ({ available: row.available, stockCount: row.stockCount }),
      cell: ({ value }: { value: { available: boolean; stockCount: number } }) => (
        <DataTable.DefaultCell>
          <StatusBadge available={value.available} stockCount={value.stockCount} />
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 150,
      minWidth: 130,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Product) => row,
      cell: ({ value }: { value: Product }) => (
        <DataTable.DefaultCell>
          <Button 
            variant="default" 
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onEdit(value);
            }}
          >
            Edit
          </Button>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 120,
      minWidth: 100,
    },
  ];

  return <DataTable data={products} columns={columns} />;
};
