import React from "react";
import { Flex, Surface } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";

interface ProductHeaderProps {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
}

/**
 * Displays a key metric with icon, label, and value.
 * Hover effect provides visual feedback to draw attention to important stats.
 */
const MetricCard = ({ label, value, icon }: MetricCardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Surface
      style={{
        padding: "16px 24px",
        minWidth: "140px",
        borderRadius: "12px",
        backgroundColor: "var(--dt-colors-background-surface-default)",
        border: "1px solid var(--dt-colors-border-neutral-default)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
        // Subtle lift effect on hover for visual interest
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            color: "var(--dt-colors-text-primary-default)",
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
  return (
    <Flex
      flexDirection="column"
      gap={16}
      padding={24}
      style={{
        backgroundColor: "var(--dt-colors-background-container-default)",
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column" gap={4}>
          <Flex alignItems="center" gap={8}>
            <span style={{ fontSize: "32px" }}>🛍️</span>
            <Heading level={2}>Product Catalog</Heading>
          </Flex>
          <Text style={{ color: "var(--dt-colors-text-secondary-default)" }}>
            Browse and manage your product inventory
          </Text>
        </Flex>
        <Button
          variant="accent"
          onClick={() => {
            // TODO: Implement add product functionality
          }}
        >
          + Add Product
        </Button>
      </Flex>

      <Flex gap={16} flexWrap="wrap">
        <MetricCard label="TOTAL PRODUCTS" value={totalProducts} icon="📦" />
        <MetricCard label="AVAILABLE" value={availableProducts} icon="✅" />
        <MetricCard label="OUT OF STOCK" value={outOfStockProducts} icon="❌" />
      </Flex>
    </Flex>
  );
};
