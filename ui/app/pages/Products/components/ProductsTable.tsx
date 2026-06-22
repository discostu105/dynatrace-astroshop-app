import React from "react";
import { DataTable } from "@dynatrace/strato-components-preview/tables";
import { Button } from "@dynatrace/strato-components/buttons";
import { Text } from "@dynatrace/strato-components/typography";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
}

interface ProductsTableProps {
  products: Product[];
}

/**
 * Status indicator badge showing whether a product is in stock or out of stock.
 * Uses semantic colors: green for in-stock, neutral gray for out-of-stock.
 */
const StatusBadge = ({ inStock }: { inStock: boolean }) => {
  if (inStock) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "var(--dt-colors-charts-status-success-default)",
          }}
        ></span>
        <Text
          style={{
            color: "var(--dt-colors-charts-status-success-default)",
            fontWeight: "500",
          }}
        >
          In Stock
        </Text>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "12px",
        backgroundColor: "var(--dt-colors-background-neutral)",
        border: "1px solid var(--dt-colors-border-neutral-default)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "var(--dt-colors-text-secondary-default)",
        }}
      ></span>
      <Text
        style={{
          fontSize: "12px",
          color: "var(--dt-colors-text-secondary-default)",
        }}
      >
        Out of Stock
      </Text>
    </div>
  );
};

export const ProductsTable = ({ products }: ProductsTableProps) => {
  const columns = [
    {
      id: "item",
      header: "Item",
      accessor: (row: Product) => row.name,
      cell: ({ rowData }: { rowData: Product }) => (
        <DataTable.DefaultCell>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>{rowData.icon}</span>
            <Text style={{ fontWeight: "600" }}>{rowData.name}</Text>
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
      accessor: "price",
      cell: ({ value }: { value: number }) => (
        <DataTable.DefaultCell>
          <Text style={{ fontWeight: "500" }}>${value.toFixed(2)}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 100,
      minWidth: 80,
    },
    {
      id: "stock",
      header: "Stock",
      accessor: "stock",
      // Display stock count with special styling for out-of-stock items
      cell: ({ value }: { value: number }) => (
        <DataTable.DefaultCell>
          {value > 0 ? (
            <Text
              style={{
                color: "var(--dt-colors-text-link-default)",
                fontWeight: "600",
              }}
            >
              {value}
            </Text>
          ) : (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 12px",
                borderRadius: "12px",
                backgroundColor: "var(--dt-colors-background-neutral)",
                border: "1px solid var(--dt-colors-border-neutral-default)",
              }}
            >
              <Text
                style={{
                  fontSize: "12px",
                  color: "var(--dt-colors-text-secondary-default)",
                }}
              >
                0
              </Text>
            </div>
          )}
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 100,
      minWidth: 80,
    },
    {
      id: "status",
      header: "Status",
      accessor: (row: Product) => row.stock > 0,
      cell: ({ value }: { value: boolean }) => (
        <DataTable.DefaultCell>
          <StatusBadge inStock={value} />
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 150,
      minWidth: 120,
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row: Product) => row.id,
      cell: ({ value }: { value: string }) => (
        <DataTable.DefaultCell>
          <Button
            variant="default"
            onClick={() => {
              // TODO: Implement product edit functionality
            }}
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
          Try adjusting your filters
        </Text>
      </div>
    );
  }

  return <DataTable data={products} columns={columns} />;
};
