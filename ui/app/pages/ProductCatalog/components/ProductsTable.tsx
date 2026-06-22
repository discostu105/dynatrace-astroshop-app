import React from "react";
import { DataTable } from "@dynatrace/strato-components-preview/tables";
import type { Column } from "@dynatrace/strato-components-preview/tables";
import { Button } from "@dynatrace/strato-components/buttons";
import { Text } from "@dynatrace/strato-components/typography";
import { Flex } from "@dynatrace/strato-components/layouts";
import type { Product } from "../types/product.types";

interface ProductsTableProps {
  products: Product[];
}

// Shared badge styling for consistent visual treatment
const BADGE_STYLE = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "13px",
  fontWeight: "500",
} as const;

export const ProductsTable = ({ products }: ProductsTableProps) => {
  const columns: Column<Product>[] = [
    {
      id: "item",
      header: "Item",
      accessor: (row: Product) => ({ name: row.name, emoji: row.emoji }),
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Flex alignItems="center" gap={12}>
            <span style={{ fontSize: "20px" }}>{value.emoji}</span>
            <Text style={{ fontWeight: "600" }}>{value.name}</Text>
          </Flex>
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
      cell: ({ value }: any) => (
        <DataTable.DefaultCell>
          <Text>{value}</Text>
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 160,
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
      accessor: (row: Product) => ({ stock: row.stock, status: row.status }),
      cell: ({ value }: { value: { stock: number; status: string } }) => (
        <DataTable.DefaultCell>
          {value.status === "in-stock" ? (
            <Text
              style={{
                color: "var(--dt-colors-text-link-default)",
                fontWeight: "600",
              }}
            >
              {value.stock}
            </Text>
          ) : (
            <div
              style={{
                ...BADGE_STYLE,
                padding: "2px 10px",
                backgroundColor: "var(--dt-colors-background-base-default)",
                border: "1px solid var(--dt-colors-border-neutral-default)",
                color: "var(--dt-colors-text-secondary-default)",
              }}
            >
              0
            </div>
          )}
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 120,
      minWidth: 100,
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
      cell: ({ value }: { value: string }) => (
        <DataTable.DefaultCell>
          {value === "in-stock" ? (
            <div
              style={{
                ...BADGE_STYLE,
                gap: "6px",
                padding: "0",
                color: "var(--dt-colors-charts-categorical-grass-default)",
              }}
            >
              <span style={{ fontSize: "8px" }}>●</span>
              In Stock
            </div>
          ) : (
            <div
              style={{
                ...BADGE_STYLE,
                gap: "6px",
                backgroundColor: "var(--dt-colors-background-base-default)",
                border: "1px solid var(--dt-colors-border-neutral-default)",
                color: "var(--dt-colors-text-secondary-default)",
              }}
            >
              <span style={{ fontSize: "8px" }}>●</span>
              Out of Stock
            </div>
          )}
        </DataTable.DefaultCell>
      ),
      columnType: "default" as const,
      width: 160,
      minWidth: 140,
    },
    {
      id: "actions",
      header: "Actions",
      accessor: "id",
      cell: ({ value }: { value: string }) => (
        <DataTable.DefaultCell>
          <Button
            variant="default"
            onClick={() => {
              // Placeholder: would open edit dialog or navigate to product detail page
            }}
          >
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
