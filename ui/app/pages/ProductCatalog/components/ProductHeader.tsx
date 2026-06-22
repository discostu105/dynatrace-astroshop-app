import React from "react";
import { Flex, Surface } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";

interface ProductHeaderProps {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
}

const MetricCard = ({
  label,
  value,
  icon,
  color = "default",
}: {
  label: string;
  value: string | number;
  icon: string;
  color?: "default" | "success" | "critical";
}) => {
  // Map metric types to their corresponding semantic colors
  const colorMap = {
    default: "var(--dt-colors-text-primary-default)",
    success: "var(--dt-colors-charts-status-success-default)",
    critical: "var(--dt-colors-charts-status-critical-default)",
  };

  // All cards use the same neutral background regardless of color variant
  const bgColorMap = {
    default: "var(--dt-colors-background-surface-default)",
    success: "var(--dt-colors-background-surface-default)",
    critical: "var(--dt-colors-background-surface-default)",
  };

  return (
    <Surface
      style={{
        padding: "16px 24px",
        minWidth: "140px",
        borderRadius: "12px",
        backgroundColor: bgColorMap[color],
        border: "1px solid var(--dt-colors-border-neutral-default)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
      }}
      // Subtle lift effect on hover to indicate interactivity (though cards are display-only)
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Flex flexDirection="column" gap={8}>
        <Flex alignItems="center" gap={8}>
          <span style={{ fontSize: "20px" }}>{icon}</span>
          <Text
            style={{
              fontSize: "11px",
              color: "var(--dt-colors-text-secondary-default)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: "600",
            }}
          >
            {label}
          </Text>
        </Flex>
        <Text
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: colorMap[color],
            lineHeight: "1",
          }}
        >
          {value}
        </Text>
      </Flex>
    </Surface>
  );
};

export const ProductHeader = ({
  totalProducts,
  availableProducts,
  outOfStockProducts,
}: ProductHeaderProps) => {
  // Placeholder for add product action — would open a modal or navigate to create page
  const handleAddProduct = () => {
    // TODO: Implement add product functionality
  };

  return (
    <Flex
      flexDirection="column"
      gap={16}
      padding={16}
      paddingLeft={24}
      paddingRight={24}
    >
      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={16}
      >
        <Flex flexDirection="column" gap={4}>
          <Heading
            level={1}
            style={{ fontSize: "32px", fontWeight: "700", margin: 0 }}
          >
            🛍️ Product Catalog
          </Heading>
          <Text
            style={{
              color: "var(--dt-colors-text-secondary-default)",
              fontSize: "14px",
            }}
          >
            Browse and manage your product inventory
          </Text>
        </Flex>
        <Button variant="accent" onClick={handleAddProduct}>
          + Add Product
        </Button>
      </Flex>

      <Flex gap={16} flexWrap="wrap">
        <MetricCard
          label="TOTAL PRODUCTS"
          value={totalProducts}
          icon="📦"
          color="default"
        />
        <MetricCard
          label="AVAILABLE"
          value={availableProducts}
          icon="✅"
          color="success"
        />
        <MetricCard
          label="OUT OF STOCK"
          value={outOfStockProducts}
          icon="❌"
          color="critical"
        />
      </Flex>

      <div
        style={{
          height: "1px",
          backgroundColor: "var(--dt-colors-border-neutral-default)",
        }}
      />
    </Flex>
  );
};
