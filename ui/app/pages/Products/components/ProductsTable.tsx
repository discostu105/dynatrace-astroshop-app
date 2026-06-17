import React from 'react';
import { DataTable } from '@dynatrace/strato-components-preview/tables';
import { ProgressCircle } from '@dynatrace/strato-components/content';
import { Text } from '@dynatrace/strato-components/typography';
import type { Product } from '../data/mockProducts';
import { formatCurrency } from '../../OrderManagement/utils/formatCurrency';

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
}

export const ProductsTable = ({ products, isLoading }: ProductsTableProps) => {
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '64px',
        }}
      >
        <ProgressCircle />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '64px',
        }}
      >
        <Text style={{ color: 'var(--dt-colors-text-secondary)' }}>
          No products match your filters.
        </Text>
      </div>
    );
  }

  const columns = [
    {
      id: 'productName',
      header: 'Product Name',
      accessor: 'productName',
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Text style={{ fontWeight: 'bold' }}>{value}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: '2fr' as const,
      minWidth: 220,
    },
    {
      id: 'category',
      header: 'Category',
      accessor: 'category',
      columnType: 'default' as const,
      width: 160,
      minWidth: 120,
    },
    {
      id: 'totalQuantity',
      header: 'Units Sold',
      accessor: 'totalQuantity',
      alignment: 'right' as const,
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>{value.toLocaleString()}</DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 120,
      minWidth: 100,
    },
    {
      id: 'orderCount',
      header: 'Order Count',
      accessor: 'orderCount',
      alignment: 'right' as const,
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>{value.toLocaleString()}</DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 120,
      minWidth: 100,
    },
    {
      id: 'totalRevenue',
      header: 'Revenue',
      accessor: 'totalRevenue',
      alignment: 'right' as const,
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>{formatCurrency(value)}</DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 140,
      minWidth: 110,
    },
    {
      id: 'avgUnitPrice',
      header: 'Avg Unit Price',
      accessor: 'avgUnitPrice',
      alignment: 'right' as const,
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>{formatCurrency(value)}</DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 140,
      minWidth: 110,
    },
    {
      id: 'revenueChange',
      header: 'Trend',
      accessor: 'revenueChange',
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <TrendBadge value={value} />
        </DataTable.DefaultCell>
      ),
      columnType: 'default' as const,
      width: 120,
      minWidth: 100,
    },
  ];

  return <DataTable data={products} columns={columns} fullWidth />;
};

interface TrendBadgeProps {
  value: number;
}

const TrendBadge = ({ value }: TrendBadgeProps) => {
  let color: string;
  let symbol: string;

  if (value > 0) {
    color = 'var(--dt-colors-feedback-success)';
    symbol = '▲';
  } else if (value < 0) {
    color = 'var(--dt-colors-feedback-critical)';
    symbol = '▼';
  } else {
    color = 'var(--dt-colors-text-secondary)';
    symbol = '—';
  }

  const displayValue = value > 0 ? `+${value.toFixed(1)}%` : value < 0 ? `${value.toFixed(1)}%` : '0%';

  return (
    <span style={{ color, fontSize: '14px', fontWeight: '500' }}>
      {symbol} {displayValue}
    </span>
  );
};
