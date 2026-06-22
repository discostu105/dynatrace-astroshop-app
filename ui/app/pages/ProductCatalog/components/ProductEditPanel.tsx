import React, { useState, useEffect } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import {
  TextInput,
  Select,
  SelectOption,
} from "@dynatrace/strato-components-preview/forms";
import type { Product } from "../mockProducts";

type ProductEditPanelProps = {
  product: Product | null;
  onClose: () => void;
  onSave: (updated: Product) => void;
};

const CATEGORY_OPTIONS = [
  "Electronics",
  "Apparel",
  "Books",
  "Home",
  "Sports",
] as const;

type ValidationErrors = Record<string, string>;

/**
 * Validates product form data and returns errors.
 */
const validateProduct = (
  name: string,
  price: string,
  stock: string,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  }

  const priceFloat = parseFloat(price);
  if (isNaN(priceFloat) || priceFloat <= 0) {
    errors.price = "Price must be a positive number";
  }

  const stockInt = parseInt(stock, 10);
  if (isNaN(stockInt) || stockInt < 0) {
    errors.stock = "Stock must be a non-negative number";
  }

  return errors;
};

export const ProductEditPanel = ({
  product,
  onClose,
  onSave,
}: ProductEditPanelProps) => {
  // product === null means "add new product" mode
  const isAddMode = product === null;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Product["category"]>("Electronics");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [available, setAvailable] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice((product.unitPrice / 100).toFixed(2)); // Convert cents to dollars for display
      setStock(product.stockCount.toString());
      setAvailable(product.available);
    } else {
      // Reset to defaults for add mode
      setName("");
      setCategory("Electronics");
      setPrice("");
      setStock("");
      setAvailable(true);
    }
    setErrors({});
  }, [product]);

  const validateAndSave = () => {
    const validationErrors = validateProduct(name, price, stock);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const priceFloat = parseFloat(price);
    const stockInt = parseInt(stock, 10);

    const updatedProduct: Product = {
      productId: product?.productId || `PROD-${Date.now()}`,
      name: name.trim(),
      category,
      unitPrice: Math.round(priceFloat * 100), // Convert dollars to cents
      stockCount: stockInt,
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
        height: "100vh",
        width: "480px",
        zIndex: 1000,
        borderLeft: "1px solid var(--dt-colors-border-neutral-default)",
        backgroundColor: "var(--dt-colors-background-container-default)",
        overflow: "auto",
        boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Flex flexDirection="column" style={{ height: "100%" }}>
        {/* Header */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: "600" }}>
            {isAddMode ? "Add Product" : "Edit Product"}
          </div>
          <Button variant="default" onClick={onClose}>
            ✕
          </Button>
        </Flex>

        {/* Form Fields */}
        <Flex
          flexDirection="column"
          gap={20}
          style={{ padding: "24px", flex: 1 }}
        >
          <Flex flexDirection="column" gap={8}>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>
              Product Name *
            </label>
            <TextInput
              value={name}
              onChange={setName}
              placeholder="Enter product name"
            />
            {errors.name && (
              <div style={{ fontSize: "12px", color: "rgba(239, 83, 80, 1)" }}>
                {errors.name}
              </div>
            )}
          </Flex>

          <Flex flexDirection="column" gap={8}>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>
              Category
            </label>
            <Select
              value={category}
              onChange={(val) => setCategory(val as Product["category"])}
            >
              <Select.Content>
                {CATEGORY_OPTIONS.map((cat) => (
                  <SelectOption key={cat} value={cat}>
                    {cat}
                  </SelectOption>
                ))}
              </Select.Content>
            </Select>
          </Flex>

          <Flex flexDirection="column" gap={8}>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>
              Unit Price (USD) *
            </label>
            <TextInput value={price} onChange={setPrice} placeholder="0.00" />
            {errors.price && (
              <div style={{ fontSize: "12px", color: "rgba(239, 83, 80, 1)" }}>
                {errors.price}
              </div>
            )}
          </Flex>

          <Flex flexDirection="column" gap={8}>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>
              Stock Count *
            </label>
            <TextInput value={stock} onChange={setStock} placeholder="0" />
            {errors.stock && (
              <div style={{ fontSize: "12px", color: "rgba(239, 83, 80, 1)" }}>
                {errors.stock}
              </div>
            )}
          </Flex>

          <Flex flexDirection="column" gap={8}>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>
              Availability
            </label>
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
          </Flex>
        </Flex>

        {/* Footer */}
        <Flex
          gap={12}
          style={{
            padding: "20px 24px",
            borderTop: "1px solid var(--dt-colors-border-neutral-default)",
          }}
        >
          <Button
            variant="emphasized"
            onClick={validateAndSave}
            style={{ flex: 1 }}
          >
            Save
          </Button>
          <Button variant="default" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};
