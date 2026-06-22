import React from 'react';
import { DataTable } from '@dynatrace/strato-components-preview/tables';
import { Button } from '@dynatrace/strato-components/buttons';
import { Text } from '@dynatrace/strato-components/typography';
import type { Product } from '../types/product.types';

interface ProductsTableProps {
  products: Product[];
  onEditProduct?: (productId: string) => void;
}

// Helper to determine if product is in stock
const isInStock = (status: string) => status === 'In Stock';

// Type for DataTable cell context
type CellContext<T = unknown> = {
  value: T;
  rowData: Product;
};

export const ProductsTable = ({ products, onEditProduct }: ProductsTableProps) => {
  const columns = [
    {
      id: 'item',
      header: 'Item',
      accessor: (row: Product) => ({ emoji: row.emoji, name: row.name }),
      cell: ({ value }: CellContext<{ emoji: string; name: string }>) => (
        <DataTable.DefaultCell>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>{value.emoji}</span>
            <Text style={{ fontWeight: '600' }}>{value.name}</Text>
          </div>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 250,
      minWidth: 200,
    },
    {
      id: 'category',
      header: 'Category',
      accessor: 'category',
      cell: ({ value }: CellContext<string>) => (
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
      accessor: 'price',
      cell: ({ value }: CellContext<number>) => (
        <DataTable.DefaultCell>
          <Text style={{ fontWeight: '500' }}>${value.toFixed(2)}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 100,
      minWidth: 80,
    },
    {
      id: 'stock',
      header: 'Stock',
      accessor: 'stock',
      cell: ({ value }: CellContext<number>) => (
        <DataTable.DefaultCell>
          {/* Zero stock gets a neutral badge to draw attention, non-zero shows as a blue number */}
          {value === 0 ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--dt-colors-background-neutral-emphasis-default)',
                color: 'var(--dt-colors-text-secondary-default)',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {value}
            </div>
          ) : (
            <Text style={{ 
              color: 'var(--dt-colors-text-link-default)', 
              fontWeight: '600',
              fontSize: '14px',
            }}>
              {value}
            </Text>
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
      accessor: 'status',
      cell: ({ value }: CellContext<string>) => {
        const inStock = isInStock(value);
        const dotColor = inStock 
          ? 'var(--dt-colors-charts-status-success-default)' 
          : 'var(--dt-colors-text-secondary-default)';
        const textColor = inStock 
          ? 'var(--dt-colors-text-primary-default)' 
          : 'var(--dt-colors-text-secondary-default)';

        return (
          <DataTable.DefaultCell>
            {/* Visual indicator: green dot for in-stock, gray for out-of-stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: dotColor }}>●</span>
              <Text style={{ color: textColor, fontSize: '13px' }}>
                {value}
              </Text>
            </div>
          </DataTable.DefaultCell>
        );
      },
      columnType: 'default' as const,
      width: 130,
      minWidth: 120,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'id',
      cell: ({ value }: CellContext<string>) => (
        <DataTable.DefaultCell>
          <Button 
            variant="default" 
            onClick={() => onEditProduct?.(value)}
            style={{ fontSize: '13px', padding: '4px 12px' }}
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

  return (
    <DataTable 
      data={products} 
      columns={columns}
      style={{ 
        backgroundColor: 'var(--dt-colors-background-surface-default)',
        border: '1px solid var(--dt-colors-border-neutral-default)',
        borderRadius: '8px',
      }}
    />
  );
};
