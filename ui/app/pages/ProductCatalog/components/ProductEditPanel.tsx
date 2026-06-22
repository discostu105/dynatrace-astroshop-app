import React, { useState, useEffect } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { TextInput } from "@dynatrace/strato-components-preview/forms";
import { Select } from "@dynatrace/strato-components-preview/forms";
import type { Product } from "../mockProducts";

interface ProductEditPanelProps {
  product: Product | null;
  onClose: () => void;
  onSave: (updated: Product) => void;
}

export const ProductEditPanel = ({
  product,
  onClose,
  onSave,
}: ProductEditPanelProps) => {
  const isAddMode = product === null;

  // Form state
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState<Product["category"]>(
    product?.category || "Electronics",
  );
  const [price, setPrice] = useState(
    product ? String(product.unitPrice / 100) : "",
  );
  const [stock, setStock] = useState(product ? String(product.stockCount) : "");
  const [available, setAvailable] = useState(product?.available ?? true);

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when product changes (edit different product or switch add/edit mode)
  useEffect(() => {
    if (product) {
      // Edit mode: populate with existing product data
      setName(product.name);
      setCategory(product.category);
      setPrice(String(product.unitPrice / 100));
      setStock(String(product.stockCount));
      setAvailable(product.available);
    } else {
      // Add mode: reset to defaults
      setName("");
      setCategory("Electronics");
      setPrice("");
      setStock("");
      setAvailable(true);
    }
    setErrors({});
  }, [product]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    const stockNum = parseInt(stock, 10);
    if (!stock || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = "Stock must be a non-negative integer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const updatedProduct: Product = {
      // Use existing productId for edits, generate timestamp-based ID for new products
      productId: product?.productId || `PROD-${Date.now()}`,
      name: name.trim(),
      category,
      // Convert dollars to cents for storage
      unitPrice: Math.round(parseFloat(price) * 100),
      stockCount: parseInt(stock, 10),
      available,
      imageEmoji: product?.imageEmoji || "📦",
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: "480px",
        backgroundColor: "var(--dt-colors-background-surface-default)",
        borderLeft: "1px solid var(--dt-colors-border-neutral-default)",
        zIndex: 1000,
        boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.1)",
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
          style={{ fontSize: "20px", padding: "8px 12px" }}
        >
          ✕
        </Button>
      </Flex>

      {/* Form content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
        }}
      >
        <Flex flexDirection="column" gap={24}>
          {/* Product Name */}
          <div>
            <Text
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Product Name
            </Text>
            <TextInput
              value={name}
              onChange={(value) => setName(value)}
              placeholder="Enter product name"
            />
            {errors.name && (
              <Text
                style={{
                  fontSize: "12px",
                  color: "var(--dt-colors-charts-status-critical-default)",
                  marginTop: "4px",
                }}
              >
                {errors.name}
              </Text>
            )}
          </div>

          {/* Category */}
          <div>
            <Text
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Category
            </Text>
            <Select
              name="category"
              value={category}
              onChange={(value) => setCategory(value as Product["category"])}
            >
              <Select.Content>
                <Select.Option value="Electronics">Electronics</Select.Option>
                <Select.Option value="Apparel">Apparel</Select.Option>
                <Select.Option value="Books">Books</Select.Option>
                <Select.Option value="Home">Home</Select.Option>
                <Select.Option value="Sports">Sports</Select.Option>
              </Select.Content>
            </Select>
          </div>

          {/* Unit Price */}
          <div>
            <Text
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Unit Price (USD)
            </Text>
            <TextInput
              value={price}
              onChange={(value) => setPrice(value)}
              placeholder="0.00"
            />
            {errors.price && (
              <Text
                style={{
                  fontSize: "12px",
                  color: "var(--dt-colors-charts-status-critical-default)",
                  marginTop: "4px",
                }}
              >
                {errors.price}
              </Text>
            )}
          </div>

          {/* Stock Count */}
          <div>
            <Text
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Stock Count
            </Text>
            <TextInput
              value={stock}
              onChange={(value) => setStock(value)}
              placeholder="0"
            />
            {errors.stock && (
              <Text
                style={{
                  fontSize: "12px",
                  color: "var(--dt-colors-charts-status-critical-default)",
                  marginTop: "4px",
                }}
              >
                {errors.stock}
              </Text>
            )}
          </div>

          {/* Available */}
          <div>
            <Text
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Availability
            </Text>
            <Flex gap={12}>
              <Button
                variant={available ? "emphasized" : "default"}
                onClick={() => setAvailable(true)}
              >
                ✅ Available
              </Button>
              <Button
                variant={!available ? "emphasized" : "default"}
                onClick={() => setAvailable(false)}
              >
                ❌ Unavailable
              </Button>
            </Flex>
          </div>
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
        <Button variant="emphasized" onClick={handleSave} style={{ flex: 1 }}>
          Save
        </Button>
        <Button variant="default" onClick={onClose} style={{ flex: 1 }}>
          Cancel
        </Button>
      </Flex>
    </div>
  );
};
