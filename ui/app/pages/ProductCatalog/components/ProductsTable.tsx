import React from "react";
import { DataTable } from "@dynatrace/strato-components-preview/tables";
import { Button } from "@dynatrace/strato-components/buttons";
import { Text } from "@dynatrace/strato-components/typography";
import type { Product } from "../mockProducts";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  isLoading: boolean;
}

/** Converts price from cents to dollar string (e.g., 7999 → "$79.99") */
const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};

/** Centered empty/loading state container styles */
const EMPTY_STATE_CONTAINER_STYLE = {
  padding: "64px",
  textAlign: "center" as const,
};

const StockChip = ({ count }: { count: number }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: "12px",
      backgroundColor:
        count === 0
          ? "rgba(239, 83, 80, 0.1)"
          : "var(--dt-colors-background-surface-default)",
      border:
        count === 0
          ? "1px solid rgba(239, 83, 80, 0.3)"
          : "1px solid var(--dt-colors-border-neutral-default)",
      color:
        count === 0
          ? "var(--dt-colors-charts-categorical-sunrise-default)"
          : "var(--dt-colors-text-primary-default)",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    {count}
  </div>
);

const StatusBadge = ({ available }: { available: boolean }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 12px",
      borderRadius: "12px",
      backgroundColor: available
        ? "rgba(44, 165, 44, 0.1)"
        : "rgba(239, 83, 80, 0.1)",
      color: available
        ? "var(--dt-colors-charts-categorical-grass-default)"
        : "var(--dt-colors-charts-categorical-sunrise-default)",
      fontSize: "12px",
      fontWeight: "500",
    }}
  >
    <span style={{ fontSize: "10px" }}>{available ? "●" : "●"}</span>
    {available ? "In Stock" : "Out of Stock"}
  </div>
);

export const ProductsTable = ({
  products,
  onEdit,
  isLoading,
}: ProductsTableProps) => {
  const columns = [
    {
      id: "item",
      header: "Item",
      accessor: (row: Product) => ({ emoji: row.imageEmoji, name: row.name }),
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>{value.emoji}</span>
            <Text style={{ fontWeight: "600" }}>{value.name}</Text>
          </div>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 300,
      minWidth: 200,
    },
    {
      id: "category",
      header: "Category",
      accessor: "category",
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Text>{value}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 150,
      minWidth: 120,
    },
    {
      id: "price",
      header: "Price",
      accessor: "unitPrice",
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Text style={{ fontWeight: "500" }}>{formatPrice(value)}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 120,
      minWidth: 100,
    },
    {
      id: "stock",
      header: "Stock",
      accessor: "stockCount",
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <StockChip count={value} />
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 120,
      minWidth: 100,
    },
    {
      id: "status",
      header: "Status",
      accessor: "available",
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <StatusBadge available={value} />
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 150,
      minWidth: 120,
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row: Product) => row,
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Button variant="accent" onClick={() => onEdit(value)}>
            Edit
          </Button>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 120,
      minWidth: 100,
    },
  ];

  if (isLoading) {
    return (
      <div style={EMPTY_STATE_CONTAINER_STYLE}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
        <Text
          style={{
            fontSize: "14px",
            color: "var(--dt-colors-text-secondary-default)",
          }}
        >
          Loading products...
        </Text>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={EMPTY_STATE_CONTAINER_STYLE}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "8px",
            display: "block",
          }}
        >
          No products match your filters
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: "var(--dt-colors-text-secondary-default)",
          }}
        >
          Try adjusting your search or filter criteria
        </Text>
      </div>
    );
  }

  return <DataTable data={products} columns={columns} />;
};
