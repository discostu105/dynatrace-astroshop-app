import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import { DataTable } from "@dynatrace/strato-components-preview/tables";
import type { Product } from "../mockProducts";

type ProductsTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  isLoading: boolean;
};

type CellContext = {
  value: unknown;
  rowData: Product;
};

// Color constants for stock status indicators
const COLORS = {
  success: "rgba(44, 165, 44, 1)",
  successLight: "rgba(44, 165, 44, 0.1)",
  error: "rgba(239, 83, 80, 1)",
  errorLight: "rgba(239, 83, 80, 0.1)",
} as const;

export const ProductsTable = ({
  products,
  onEdit,
  isLoading,
}: ProductsTableProps) => {
  if (isLoading) {
    return (
      <Flex flexDirection="column" gap={16} style={{ padding: "24px" }}>
        <div
          style={{
            height: "60px",
            backgroundColor: "var(--dt-colors-background-neutral)",
            borderRadius: "8px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: "60px",
            backgroundColor: "var(--dt-colors-background-neutral)",
            borderRadius: "8px",
            animation: "pulse 1.5s ease-in-out infinite",
            animationDelay: "0.2s",
          }}
        />
        <div
          style={{
            height: "60px",
            backgroundColor: "var(--dt-colors-background-neutral)",
            borderRadius: "8px",
            animation: "pulse 1.5s ease-in-out infinite",
            animationDelay: "0.4s",
          }}
        />
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
      </Flex>
    );
  }

  // Empty state when no products match filters
  if (products.length === 0) {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={16}
        style={{ padding: "64px", textAlign: "center" }}
      >
        <div style={{ fontSize: "64px" }}>📭</div>
        <div style={{ fontSize: "20px", fontWeight: "600" }}>
          No products match your filters
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "var(--dt-colors-text-secondary-default)",
          }}
        >
          Try clearing your filters to see all products
        </div>
      </Flex>
    );
  }

  const columns = [
    {
      id: "item",
      header: "Item",
      accessor: "name",
      columnType: "default" as const,
      minWidth: 300,
      cell: ({ rowData }: CellContext) => (
        <DataTable.DefaultCell>
          <Flex alignItems="center" gap={12}>
            <span style={{ fontSize: "24px" }}>{rowData.imageEmoji}</span>
            <span style={{ fontWeight: "600" }}>{rowData.name}</span>
          </Flex>
        </DataTable.DefaultCell>
      ),
    },
    {
      id: "category",
      header: "Category",
      accessor: "category",
      columnType: "default" as const,
      width: 150,
      cell: ({ value }: CellContext) => (
        <DataTable.DefaultCell>
          <span>{value}</span>
        </DataTable.DefaultCell>
      ),
    },
    {
      id: "price",
      header: "Price",
      accessor: "unitPrice",
      columnType: "default" as const,
      width: 120,
      cell: ({ value }: CellContext) => (
        <DataTable.DefaultCell>
          <span>${((value as number) / 100).toFixed(2)}</span>
        </DataTable.DefaultCell>
      ),
    },
    {
      id: "stock",
      header: "Stock",
      accessor: "stockCount",
      columnType: "default" as const,
      width: 120,
      cell: ({ value }: CellContext) => {
        const stockCount = value as number;
        return (
          <DataTable.DefaultCell>
            {stockCount === 0 ? (
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: COLORS.errorLight,
                  color: COLORS.error,
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {stockCount}
              </span>
            ) : (
              <span>{stockCount}</span>
            )}
          </DataTable.DefaultCell>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessor: "available",
      columnType: "default" as const,
      width: 150,
      cell: ({ value }: CellContext) => {
        const isAvailable = value as boolean;
        const statusColor = isAvailable ? COLORS.success : COLORS.error;
        const statusText = isAvailable ? "In Stock" : "Out of Stock";
        return (
          <DataTable.DefaultCell>
            <Flex alignItems="center" gap={6}>
              <span style={{ color: statusColor, fontSize: "16px" }}>●</span>
              <span style={{ color: statusColor, fontWeight: "600" }}>
                {statusText}
              </span>
            </Flex>
          </DataTable.DefaultCell>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      accessor: "productId",
      columnType: "default" as const,
      width: 120,
      cell: ({ rowData }: CellContext) => (
        <DataTable.DefaultCell>
          <Button variant="default" onClick={() => onEdit(rowData)}>
            Edit
          </Button>
        </DataTable.DefaultCell>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px 24px" }}>
      <DataTable data={products} columns={columns} />
    </div>
  );
};
