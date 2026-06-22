import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import type { Product } from "../mockProducts";

type ProductCatalogHeaderProps = {
  products: Product[];
  onAddProduct: () => void;
};

type StatCardProps = {
  label: string;
  value: number;
  backgroundColor: string;
  borderColor: string;
  valueColor?: string;
};

const StatCard = ({
  label,
  value,
  backgroundColor,
  borderColor,
  valueColor,
}: StatCardProps) => (
  <div
    style={{
      padding: "8px 16px",
      borderRadius: "8px",
      backgroundColor,
      border: `1px solid ${borderColor}`,
    }}
  >
    <div
      style={{
        fontSize: "12px",
        color: "var(--dt-colors-text-secondary-default)",
        marginBottom: "4px",
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: "20px", fontWeight: "600", color: valueColor }}>
      {value}
    </div>
  </div>
);

export const ProductCatalogHeader = ({
  products,
  onAddProduct,
}: ProductCatalogHeaderProps) => {
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available).length;
  const outOfStockProducts = products.filter((p) => !p.available).length;

  return (
    <Flex
      flexDirection="column"
      gap={16}
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column" gap={4}>
          <div style={{ fontSize: "24px", fontWeight: "600" }}>
            🛍️ Product Catalog
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "var(--dt-colors-text-secondary-default)",
            }}
          >
            Browse and manage your product inventory
          </div>
        </Flex>
        <Button onClick={onAddProduct}>＋ Add Product</Button>
      </Flex>

      <Flex gap={12}>
        <StatCard
          label="Total Products"
          value={totalProducts}
          backgroundColor="var(--dt-colors-background-neutral)"
          borderColor="var(--dt-colors-border-neutral-default)"
        />
        <StatCard
          label="Available"
          value={availableProducts}
          backgroundColor="rgba(44, 165, 44, 0.1)"
          borderColor="rgba(44, 165, 44, 0.3)"
          valueColor="rgba(44, 165, 44, 1)"
        />
        <StatCard
          label="Out of Stock"
          value={outOfStockProducts}
          backgroundColor="rgba(239, 83, 80, 0.1)"
          borderColor="rgba(239, 83, 80, 0.3)"
          valueColor="rgba(239, 83, 80, 1)"
        />
      </Flex>
    </Flex>
  );
};
