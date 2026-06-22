import React, { useState, useEffect } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import {
  TextInput,
  Select,
  Label,
  FormField,
} from "@dynatrace/strato-components-preview/forms";
import { Button } from "@dynatrace/strato-components/buttons";
import type { Product } from "../mockProducts";

interface ProductEditPanelProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const ProductEditPanel = ({
  product,
  onClose,
  onSave,
}: ProductEditPanelProps) => {
  // Add mode when product is null; Edit mode when product is provided
  const isAddMode = product === null;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<
    "Electronics" | "Apparel" | "Books" | "Home" | "Sports"
  >("Electronics");
  const [unitPrice, setUnitPrice] = useState("");
  const [stockCount, setStockCount] = useState("");
  const [available, setAvailable] = useState(true);

  const [errors, setErrors] = useState<{ name?: string; unitPrice?: string }>(
    {},
  );

  // Populate form fields when product changes (edit mode) or reset for add mode
  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      // Convert cents to dollars for display
      setUnitPrice((product.unitPrice / 100).toFixed(2));
      setStockCount(product.stockCount.toString());
      setAvailable(product.available);
    } else {
      // Reset to defaults for add mode
      setName("");
      setCategory("Electronics");
      setUnitPrice("");
      setStockCount("0");
      setAvailable(true);
    }
    setErrors({});
  }, [product]);

  /** Validates name and price fields; returns true if form is valid */
  const validate = (): boolean => {
    const newErrors: { name?: string; unitPrice?: string } = {};

    if (name.trim() === "") {
      newErrors.name = "Name is required";
    }

    const priceNum = parseFloat(unitPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      newErrors.unitPrice = "Price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const updatedProduct: Product = {
      // Preserve existing ID in edit mode; generate new ID for add mode
      productId: product?.productId || `PROD-${Date.now()}`,
      name: name.trim(),
      category,
      // Convert dollars back to cents for storage
      unitPrice: Math.round(parseFloat(unitPrice) * 100),
      stockCount: parseInt(stockCount, 10) || 0,
      available,
      // Preserve existing emoji in edit mode; use default package emoji for new products
      imageEmoji: product?.imageEmoji || "📦",
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "480px",
        backgroundColor: "var(--dt-colors-background-container-default)",
        borderLeft: "1px solid var(--dt-colors-border-neutral-default)",
        boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        padding={24}
        style={{
          borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
        }}
      >
        <Heading level={3}>
          {isAddMode ? "Add Product" : "Edit Product"}
        </Heading>
        <Button
          variant="default"
          onClick={onClose}
          style={{ fontSize: "20px", padding: "4px 12px" }}
        >
          ✕
        </Button>
      </Flex>

      {/* Form */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
        <Flex flexDirection="column" gap={20}>
          <FormField>
            <Label>Product Name</Label>
            <TextInput
              value={name}
              onChange={(value) => setName(value)}
              placeholder="Enter product name"
            />
            {errors.name && (
              <Text
                style={{
                  color: "var(--dt-colors-charts-categorical-sunrise-default)",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                {errors.name}
              </Text>
            )}
          </FormField>

          <FormField>
            <Label>Category</Label>
            <Select
              value={category}
              onChange={(value) =>
                setCategory(
                  value as
                    | "Electronics"
                    | "Apparel"
                    | "Books"
                    | "Home"
                    | "Sports",
                )
              }
            >
              <Select.Content>
                <Select.Option value="Electronics">Electronics</Select.Option>
                <Select.Option value="Apparel">Apparel</Select.Option>
                <Select.Option value="Books">Books</Select.Option>
                <Select.Option value="Home">Home</Select.Option>
                <Select.Option value="Sports">Sports</Select.Option>
              </Select.Content>
            </Select>
          </FormField>

          <FormField>
            <Label>Unit Price (USD)</Label>
            <TextInput
              value={unitPrice}
              onChange={(value) => setUnitPrice(value)}
              placeholder="0.00"
            />
            {errors.unitPrice && (
              <Text
                style={{
                  color: "var(--dt-colors-charts-categorical-sunrise-default)",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                {errors.unitPrice}
              </Text>
            )}
          </FormField>

          <FormField>
            <Label>Stock Count</Label>
            <TextInput
              value={stockCount}
              onChange={(value) => setStockCount(value)}
              placeholder="0"
            />
          </FormField>

          <FormField>
            <Label>Available</Label>
            <Flex gap={8}>
              <Button
                variant={available ? "accent" : "default"}
                onClick={() => setAvailable(true)}
                style={{ flex: 1 }}
              >
                ✅ Available
              </Button>
              <Button
                variant={!available ? "accent" : "default"}
                onClick={() => setAvailable(false)}
                style={{ flex: 1 }}
              >
                ❌ Unavailable
              </Button>
            </Flex>
          </FormField>
        </Flex>
      </div>

      {/* Footer */}
      <Flex
        gap={12}
        padding={24}
        style={{
          borderTop: "1px solid var(--dt-colors-border-neutral-default)",
        }}
      >
        <Button variant="accent" onClick={handleSave} style={{ flex: 1 }}>
          Save
        </Button>
        <Button variant="default" onClick={onClose} style={{ flex: 1 }}>
          Cancel
        </Button>
      </Flex>
    </div>
  );
};
