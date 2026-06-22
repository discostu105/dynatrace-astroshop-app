import React from "react";
import { DataTable } from "@dynatrace/strato-components-preview/tables";
import { Button } from "@dynatrace/strato-components/buttons";
import { Text } from "@dynatrace/strato-components/typography";
import { Skeleton } from "@dynatrace/strato-components/content";
import type { Product } from "../mockProducts";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  isLoading: boolean;
}

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
    <span>{available ? "●" : "●"}</span>
    {available ? "In Stock" : "Out of Stock"}
  </div>
);

const StockChip = ({ count }: { count: number }) => {
  if (count === 0) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 12px",
          borderRadius: "12px",
          backgroundColor: "rgba(239, 83, 80, 0.15)",
          color: "var(--dt-colors-charts-categorical-sunrise-default)",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {count}
      </div>
    );
  }

  return <Text style={{ fontWeight: "500" }}>{count}</Text>;
};

export const ProductsTable = ({
  products,
  onEdit,
  isLoading,
}: ProductsTableProps) => {
  const columns = [
    {
      id: "item",
      header: "Item",
      accessor: (row: Product) => row,
      cell: ({ value }: { value: Product }) => (
        <DataTable.DefaultCell>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "28px" }}>{value.imageEmoji}</span>
            <Text style={{ fontWeight: "600" }}>{value.name}</Text>
          </div>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      minWidth: 300,
    },
    {
      id: "category",
      header: "Category",
      accessor: "category",
      cell: ({ value }: { value: string }) => (
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
      cell: ({ value }: { value: number }) => (
        <DataTable.DefaultCell>
          <Text style={{ fontWeight: "500" }}>${(value / 100).toFixed(2)}</Text>
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
      cell: ({ value }: { value: number }) => (
        <DataTable.DefaultCell>
          <StockChip count={value} />
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 100,
      minWidth: 80,
    },
    {
      id: "status",
      header: "Status",
      accessor: "available",
      cell: ({ value }: { value: boolean }) => (
        <DataTable.DefaultCell>
          <StatusBadge available={value} />
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 150,
      minWidth: 130,
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row: Product) => row,
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Button variant="default" onClick={() => onEdit(value)}>
            Edit
          </Button>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 100,
      minWidth: 90,
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: "24px" }}>
        <Skeleton
          style={{ height: "60px", marginBottom: "12px", borderRadius: "8px" }}
        />
        <Skeleton
          style={{ height: "60px", marginBottom: "12px", borderRadius: "8px" }}
        />
        <Skeleton style={{ height: "60px", borderRadius: "8px" }} />
      </div>
    );
  }

  // Empty state: shown when filters yield no results (not when initially loading)
  if (products.length === 0) {
    return (
      <div style={{ padding: "64px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
        <Text
          style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}
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
