import React from 'react';
import { DataTable } from '@dynatrace/strato-components-preview/tables';
import { Button } from '@dynatrace/strato-components/buttons';
import { Text } from '@dynatrace/strato-components/typography';
import { Flex } from '@dynatrace/strato-components/layouts';
import type { Product } from '../mockProducts';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  isLoading: boolean;
}

const formatPrice = (priceInCents: number): string => {
  return `$${(priceInCents / 100).toFixed(2)}`;
};

const StatusBadge = ({ available }: { available: boolean }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      fontWeight: '500',
      color: available
        ? 'var(--dt-colors-charts-categorical-grass-default)'
        : 'var(--dt-colors-charts-categorical-sunrise-default)',
    }}
  >
    <span style={{ fontSize: '10px' }}>●</span>
    {available ? 'In Stock' : 'Out of Stock'}
  </div>
);

export const ProductsTable = ({ products, onEdit, isLoading }: ProductsTableProps) => {
  const columns = [
    {
      id: 'item',
      header: 'Item',
      accessor: (row: Product) => row,
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Flex alignItems="center" gap={12}>
            <span style={{ fontSize: '24px' }}>{value.imageEmoji}</span>
            <Text style={{ fontWeight: '600' }}>{value.name}</Text>
          </Flex>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 350,
      minWidth: 250,
    },
    {
      id: 'category',
      header: 'Category',
      accessor: 'category',
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Text>{value}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 140,
      minWidth: 120,
    },
    {
      id: 'price',
      header: 'Price',
      accessor: 'unitPrice',
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Text style={{ fontWeight: '500' }}>{formatPrice(value)}</Text>
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
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          {value === 0 ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 83, 80, 0.1)',
              color: 'var(--dt-colors-charts-categorical-sunrise-default)',
              fontSize: '13px',
              fontWeight: '600',
            }}>
              {value}
            </div>
          ) : (
            <Text>{value}</Text>
          )}
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 100,
      minWidth: 80,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'available',
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <StatusBadge available={value} />
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 130,
      minWidth: 120,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Product) => row,
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Button 
            variant="default"
            onClick={() => onEdit(value)}
          >
            Edit
          </Button>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 100,
      minWidth: 90,
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: '64px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <Text style={{ fontSize: '14px', color: 'var(--dt-colors-text-secondary-default)' }}>Loading products...</Text>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: '64px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
        <Text style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No products match your filters</Text>
        <Text style={{ fontSize: '14px', color: 'var(--dt-colors-text-secondary-default)' }}>Try clearing filters to see more products</Text>
      </div>
    );
  }

  return (
    <DataTable
      data={products}
      columns={columns}
    />
  );
};
