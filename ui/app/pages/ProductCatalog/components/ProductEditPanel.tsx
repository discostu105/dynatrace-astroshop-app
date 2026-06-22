import React, { useState, useEffect } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { TextInput } from "@dynatrace/strato-components-preview/forms";
import { Select } from "@dynatrace/strato-components-preview/forms";
import type { Product } from "../mockProducts";

type ProductEditPanelProps = {
  product: Product | null; // null = add mode
  onClose: () => void;
  onSave: (updated: Product) => void;
};

/**
 * Validates product form inputs and returns any validation errors.
 * Returns an empty object if all inputs are valid.
 */
const validateProductInputs = (
  name: string,
  priceInput: string,
  stockInput: string,
): { name?: string; price?: string; stock?: string } => {
  const validationErrors: { name?: string; price?: string; stock?: string } =
    {};

  if (name.trim() === "") {
    validationErrors.name = "Name is required";
  }

  const price = parseFloat(priceInput);
  if (isNaN(price) || price <= 0) {
    validationErrors.price = "Price must be a positive number";
  }

  const stock = parseInt(stockInput, 10);
  if (isNaN(stock) || stock < 0) {
    validationErrors.stock = "Stock must be a non-negative integer";
  }

  return validationErrors;
};

export const ProductEditPanel = ({
  product,
  onClose,
  onSave,
}: ProductEditPanelProps) => {
  const isAddMode = product === null;

  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState<string>(
    product?.category || "Electronics",
  );
  // Price is stored in cents but displayed in dollars for better UX
  const [priceInput, setPriceInput] = useState(
    product ? (product.unitPrice / 100).toFixed(2) : "",
  );
  const [stockInput, setStockInput] = useState(
    product?.stockCount.toString() || "0",
  );
  const [available, setAvailable] = useState(product?.available ?? true);
  const [imageEmoji, setImageEmoji] = useState(product?.imageEmoji || "📦");

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    stock?: string;
  }>({});

  // Reset form fields when the product prop changes (switching between add/edit or editing different products)
  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      // Convert from cents to dollars for display
      setPriceInput((product.unitPrice / 100).toFixed(2));
      setStockInput(product.stockCount.toString());
      setAvailable(product.available);
      setImageEmoji(product.imageEmoji);
    } else {
      // Reset to defaults for add mode
      setName("");
      setCategory("Electronics");
      setPriceInput("");
      setStockInput("0");
      setAvailable(true);
      setImageEmoji("📦");
    }
    setErrors({});
  }, [product]);

  const handleSave = () => {
    const validationErrors = validateProductInputs(
      name,
      priceInput,
      stockInput,
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const price = parseFloat(priceInput);
    const stock = parseInt(stockInput, 10);

    const updatedProduct: Product = {
      productId: product?.productId || "NEW",
      name: name.trim(),
      category: category as Product["category"],
      // Convert dollars back to cents for storage
      unitPrice: Math.round(price * 100),
      stockCount: stock,
      available,
      imageEmoji,
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <Flex
      flexDirection="column"
      gap={0}
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: "480px",
        backgroundColor: "var(--dt-colors-background-surface-raised)",
        borderLeft: "1px solid var(--dt-colors-border-neutral-default)",
        zIndex: 1000,
        boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        padding={24}
        style={{
          borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
          position: "sticky",
          top: 0,
          backgroundColor: "var(--dt-colors-background-surface-raised)",
          zIndex: 10,
        }}
      >
        <Flex alignItems="center" gap={12}>
          <span style={{ fontSize: "24px" }}>{isAddMode ? "➕" : "✏️"}</span>
          <Heading level={3}>
            {isAddMode ? "Add Product" : "Edit Product"}
          </Heading>
        </Flex>
        <Button
          variant="default"
          onClick={onClose}
          style={{ fontSize: "20px", padding: "8px 12px" }}
        >
          ✕
        </Button>
      </Flex>

      {/* Form Fields */}
      <Flex flexDirection="column" gap={24} padding={24}>
        {/* Product Name */}
        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontWeight: "600", fontSize: "13px" }}>
            Product Name *
          </Text>
          <TextInput
            value={name}
            onChange={(value) => {
              setName(value);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="Enter product name"
          />
          {errors.name && (
            <Text
              style={{
                color: "var(--dt-colors-charts-status-critical-default)",
                fontSize: "12px",
              }}
            >
              {errors.name}
            </Text>
          )}
        </Flex>

        {/* Category */}
        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontWeight: "600", fontSize: "13px" }}>Category</Text>
          <Select
            name="category"
            value={category}
            onChange={(value) => setCategory(value)}
          >
            <Select.Content>
              <Select.Option value="Electronics">Electronics</Select.Option>
              <Select.Option value="Apparel">Apparel</Select.Option>
              <Select.Option value="Books">Books</Select.Option>
              <Select.Option value="Home">Home</Select.Option>
              <Select.Option value="Sports">Sports</Select.Option>
            </Select.Content>
          </Select>
        </Flex>

        {/* Unit Price */}
        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontWeight: "600", fontSize: "13px" }}>
            Unit Price (USD) *
          </Text>
          <TextInput
            value={priceInput}
            onChange={(value) => {
              setPriceInput(value);
              if (errors.price) setErrors({ ...errors, price: undefined });
            }}
            placeholder="0.00"
          />
          {errors.price && (
            <Text
              style={{
                color: "var(--dt-colors-charts-status-critical-default)",
                fontSize: "12px",
              }}
            >
              {errors.price}
            </Text>
          )}
        </Flex>

        {/* Stock Count */}
        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontWeight: "600", fontSize: "13px" }}>
            Stock Count *
          </Text>
          <TextInput
            value={stockInput}
            onChange={(value) => {
              setStockInput(value);
              if (errors.stock) setErrors({ ...errors, stock: undefined });
            }}
            placeholder="0"
          />
          {errors.stock && (
            <Text
              style={{
                color: "var(--dt-colors-charts-status-critical-default)",
                fontSize: "12px",
              }}
            >
              {errors.stock}
            </Text>
          )}
        </Flex>

        {/* Image Emoji */}
        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontWeight: "600", fontSize: "13px" }}>
            Image Emoji
          </Text>
          <TextInput
            value={imageEmoji}
            onChange={(value) => setImageEmoji(value)}
            placeholder="📦"
          />
        </Flex>

        {/* Available */}
        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontWeight: "600", fontSize: "13px" }}>
            Availability
          </Text>
          <Flex gap={12}>
            <Button
              variant={available ? "accent" : "default"}
              onClick={() => setAvailable(true)}
            >
              ✅ Available
            </Button>
            <Button
              variant={!available ? "accent" : "default"}
              onClick={() => setAvailable(false)}
            >
              ❌ Unavailable
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/* Footer */}
      <Flex
        gap={12}
        padding={24}
        style={{
          borderTop: "1px solid var(--dt-colors-border-neutral-default)",
          position: "sticky",
          bottom: 0,
          backgroundColor: "var(--dt-colors-background-surface-raised)",
        }}
      >
        <Button variant="accent" onClick={handleSave} style={{ flex: 1 }}>
          Save
        </Button>
        <Button variant="default" onClick={onClose} style={{ flex: 1 }}>
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};
