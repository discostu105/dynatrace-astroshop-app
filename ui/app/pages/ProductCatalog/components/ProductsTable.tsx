import React from "react";
import { DataTable } from "@dynatrace/strato-components-preview/tables";
import { Button } from "@dynatrace/strato-components/buttons";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Text } from "@dynatrace/strato-components/typography";
import type { Product } from "../data/products";

interface ProductsTableProps {
  products: Product[];
  onEditProduct: (productId: string) => void;
}

// Display stock quantity with visual emphasis: out-of-stock items get a muted badge
const StockBadge = ({ stock }: { stock: number }) => {
  // Zero stock items get a subdued badge to de-emphasize unavailable products
  if (stock === 0) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 12px",
          borderRadius: "12px",
          backgroundColor:
            "var(--dt-colors-background-container-neutral-default)",
          color: "var(--dt-colors-text-neutral-subdued)",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        {stock}
      </div>
    );
  }

  return (
    <Text
      style={{
        color: "var(--dt-colors-text-primary-default)",
        fontWeight: "600",
        fontSize: "14px",
      }}
    >
      {stock}
    </Text>
  );
};

// Display availability status with color coding: green dot for in-stock, muted for out-of-stock
const StatusBadge = ({ stock }: { stock: number }) => {
  const inStock = stock > 0;

  if (!inStock) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          borderRadius: "12px",
          backgroundColor:
            "var(--dt-colors-background-container-neutral-default)",
          color: "var(--dt-colors-text-neutral-subdued)",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        Out of Stock
      </div>
    );
  }

  return (
    <Flex alignItems="center" gap={6}>
      <span
        style={{
          color: "var(--dt-colors-charts-categorical-color-09-default)",
          fontSize: "16px",
        }}
      >
        ●
      </span>
      <Text style={{ fontSize: "12px", fontWeight: "500" }}>In Stock</Text>
    </Flex>
  );
};

export const ProductsTable = ({
  products,
  onEditProduct,
}: ProductsTableProps) => {
  // Define table columns with custom cell renderers for icons, badges, and actions
  const columns = [
    {
      id: "item",
      header: "Item",
      accessor: (row: Product) => row,
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Flex alignItems="center" gap={12}>
            <span style={{ fontSize: "24px" }}>{value.icon}</span>
            <Text style={{ fontWeight: "600", fontSize: "14px" }}>
              {value.name}
            </Text>
          </Flex>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 300,
      minWidth: 250,
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
      accessor: "price",
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Text style={{ fontWeight: "500" }}>${value.toFixed(2)}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 120,
      minWidth: 100,
    },
    {
      id: "stock",
      header: "Stock",
      accessor: "stock",
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <StockBadge stock={value} />
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 100,
      minWidth: 80,
    },
    {
      id: "status",
      header: "Status",
      accessor: "stock",
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <StatusBadge stock={value} />
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
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Button variant="default" onClick={() => onEditProduct(value)}>
            Edit
          </Button>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 120,
      minWidth: 100,
    },
  ];

  return <DataTable data={products} columns={columns} />;
};
