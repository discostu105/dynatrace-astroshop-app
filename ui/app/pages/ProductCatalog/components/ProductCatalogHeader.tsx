import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";

interface ProductCatalogHeaderProps {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  onAddProduct: () => void;
}

/**
 * Displays a single KPI metric with value and label.
 */
const KpiChip = ({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) => (
  <div>
    <Text
      style={{
        fontSize: "24px",
        fontWeight: "700",
        color,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontSize: "12px",
        color: "var(--dt-colors-text-secondary-default)",
        marginTop: "4px",
      }}
    >
      {label}
    </Text>
  </div>
);

export const ProductCatalogHeader = ({
  totalProducts,
  availableProducts,
  outOfStockProducts,
  onAddProduct,
}: ProductCatalogHeaderProps) => {
  return (
    <Flex
      flexDirection="column"
      gap={16}
      padding={24}
      style={{
        backgroundColor: "var(--dt-colors-background-container-default)",
        borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <div>
          <Heading level={2} style={{ marginBottom: "4px" }}>
            🛍️ Product Catalog
          </Heading>
          <Text style={{ color: "var(--dt-colors-text-secondary-default)" }}>
            Browse and manage your product inventory
          </Text>
        </div>
        <Button variant="accent" onClick={onAddProduct}>
          ＋ Add Product
        </Button>
      </Flex>

      <Flex gap={48} alignItems="center">
        <KpiChip
          value={totalProducts}
          label="Total Products"
          color="var(--dt-colors-text-primary-default)"
        />
        <KpiChip
          value={availableProducts}
          label="Available"
          color="var(--dt-colors-charts-categorical-grass-default)"
        />
        <KpiChip
          value={outOfStockProducts}
          label="Out of Stock"
          color="var(--dt-colors-charts-categorical-sunrise-default)"
        />
      </Flex>
    </Flex>
  );
};
