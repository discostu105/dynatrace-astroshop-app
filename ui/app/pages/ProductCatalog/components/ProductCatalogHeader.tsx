import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import type { Product } from "../mockProducts";

interface ProductCatalogHeaderProps {
  filteredProducts: Product[];
  onAddProduct: () => void;
}

const StatChip = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "12px",
      backgroundColor: "var(--dt-colors-background-container-default)",
      border: "1px solid var(--dt-colors-border-neutral-default)",
    }}
  >
    <span style={{ fontSize: "18px" }}>{icon}</span>
    <Flex flexDirection="column" gap={2}>
      <Text
        style={{
          fontSize: "13px",
          color: "var(--dt-colors-text-secondary-default)",
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: "20px", fontWeight: "700", lineHeight: "1" }}>
        {value}
      </Text>
    </Flex>
  </div>
);

export const ProductCatalogHeader = ({
  filteredProducts,
  onAddProduct,
}: ProductCatalogHeaderProps) => {
  // KPI calculations based on filtered products (updates when filters change)
  const totalProducts = filteredProducts.length;
  const availableProducts = filteredProducts.filter((p) => p.available).length;
  const outOfStockProducts = filteredProducts.filter(
    (p) => !p.available || p.stockCount === 0,
  ).length;

  return (
    <Flex
      flexDirection="column"
      gap={16}
      padding={24}
      paddingLeft={32}
      paddingRight={32}
      style={{
        borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
        backgroundColor: "var(--dt-colors-background-surface-default)",
      }}
    >
      {/* Title row */}
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column" gap={4}>
          <Heading
            level={2}
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <span style={{ fontSize: "32px" }}>🛍️</span>
            Product Catalog
          </Heading>
          <Text
            style={{
              color: "var(--dt-colors-text-secondary-default)",
              fontSize: "13px",
            }}
          >
            Browse and manage your product inventory
          </Text>
        </Flex>
        <Button variant="accent" onClick={onAddProduct}>
          ＋ Add Product
        </Button>
      </Flex>

      {/* KPI stats strip */}
      <Flex gap={12} alignItems="center">
        <StatChip label="Total Products" value={totalProducts} icon="📦" />
        <StatChip label="Available" value={availableProducts} icon="✅" />
        <StatChip label="Out of Stock" value={outOfStockProducts} icon="❌" />
      </Flex>
    </Flex>
  );
};
