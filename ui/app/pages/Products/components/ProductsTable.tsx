import React from "react";
import { DataTable } from "@dynatrace/strato-components-preview/tables";
import { Button } from "@dynatrace/strato-components/buttons";
import { Text } from "@dynatrace/strato-components/typography";
import type { Product } from "../types/product.types";

interface ProductsTableProps {
  products: Product[];
  onEditProduct: (productId: string, productName: string) => void;
}

// Shared badge styles for consistent appearance
const BADGE_BASE_STYLE = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  borderRadius: "12px",
} as const;

/**
 * Visual badge showing stock quantity.
 * Uses blue accent for in-stock items, neutral gray for out-of-stock.
 */
const StockBadge = ({
  stock,
  inStock,
}: {
  stock: number;
  inStock: boolean;
}) => {
  const style = inStock
    ? {
        ...BADGE_BASE_STYLE,
        backgroundColor: "rgba(100, 108, 255, 0.12)",
        color: "#646cff",
        padding: "2px 10px",
        fontSize: "13px",
        fontWeight: "600",
      }
    : {
        ...BADGE_BASE_STYLE,
        backgroundColor: "rgba(0,0,0,0.08)",
        color: "var(--dt-colors-text-secondary-default)",
        padding: "2px 10px",
        fontSize: "13px",
        fontWeight: "600",
      };

  return <div style={style}>{stock}</div>;
};

/**
 * Status badge indicating stock availability.
 * Uses green for in-stock, neutral gray for out-of-stock.
 */
const StatusBadge = ({ inStock }: { inStock: boolean }) => {
  const style = inStock
    ? {
        ...BADGE_BASE_STYLE,
        backgroundColor: "rgba(44, 165, 44, 0.12)",
        color: "#2ca52c",
        padding: "4px 12px",
        fontSize: "12px",
        fontWeight: "500",
      }
    : {
        ...BADGE_BASE_STYLE,
        backgroundColor: "rgba(0,0,0,0.08)",
        color: "var(--dt-colors-text-secondary-default)",
        padding: "4px 12px",
        fontSize: "12px",
        fontWeight: "500",
      };

  const label = inStock ? "• In Stock" : "• Out of Stock";

  return <div style={style}>{label}</div>;
};

export const ProductsTable = ({
  products,
  onEditProduct,
}: ProductsTableProps) => {
  // Column definitions for the DataTable component
  const columns = [
    {
      id: "item",
      header: "Item",
      accessor: (row: Product) => row,
      cell: ({ value }: { value: Product }) => (
        <DataTable.DefaultCell>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>{value.icon}</span>
            <Text style={{ fontWeight: "600", fontSize: "14px" }}>
              {value.name}
            </Text>
          </div>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 280,
      minWidth: 200,
    },
    {
      id: "category",
      header: "Category",
      accessor: "category",
      cell: ({ value }: { value: string }) => (
        <DataTable.DefaultCell>
          <Text style={{ fontSize: "13px" }}>{value}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 140,
      minWidth: 120,
    },
    {
      id: "price",
      header: "Price",
      accessor: "price",
      cell: ({ value }: { value: number }) => (
        <DataTable.DefaultCell>
          <Text style={{ fontWeight: "500", fontSize: "14px" }}>
            ${value.toFixed(2)}
          </Text>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 100,
      minWidth: 90,
    },
    {
      id: "stock",
      header: "Stock",
      accessor: (row: Product) => row,
      cell: ({ value }: { value: Product }) => (
        <DataTable.DefaultCell>
          <StockBadge stock={value.stock} inStock={value.inStock} />
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 100,
      minWidth: 80,
    },
    {
      id: "status",
      header: "Status",
      accessor: (row: Product) => row.inStock,
      cell: ({ value }: { value: boolean }) => (
        <DataTable.DefaultCell>
          <StatusBadge inStock={value} />
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 140,
      minWidth: 120,
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row: Product) => row,
      cell: ({ value }: { value: Product }) => (
        <DataTable.DefaultCell>
          <Button
            variant="default"
            onClick={() => onEditProduct(value.id, value.name)}
          >
            Edit
          </Button>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 100,
      minWidth: 90,
    },
  ];

  // Show empty state when no products match the current filters
  if (products.length === 0) {
    return (
      <div style={{ padding: "64px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
        <Text
          style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}
        >
          No products found
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: "var(--dt-colors-text-secondary-default)",
          }}
        >
          Try adjusting your filters or search query
        </Text>
      </div>
    );
  }

  return <DataTable data={products} columns={columns} />;
};
