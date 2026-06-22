import React, { useState, useMemo } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { ProductCatalogHeader } from "./components/ProductCatalogHeader";
import { ProductFilters } from "./components/ProductFilters";
import { ProductsTable } from "./components/ProductsTable";
import { ProductEditPanel } from "./components/ProductEditPanel";
import { mockProducts, type Product } from "./mockProducts";

type Category = "All" | "Electronics" | "Apparel" | "Books" | "Home" | "Sports";
type Availability = "All" | "Available" | "OutOfStock";

export const ProductCatalogPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [availability, setAvailability] = useState<Availability>("All");

  // Three-state edit panel: undefined = panel closed; null = add mode; Product = edit mode
  const [editTarget, setEditTarget] = useState<Product | null | undefined>(
    undefined,
  );

  // Filter products by search term, category, and availability status
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesAvailability =
        availability === "All" ||
        (availability === "Available" && product.available) ||
        (availability === "OutOfStock" && !product.available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, searchTerm, category, availability]);

  const totalProducts = filteredProducts.length;
  const availableProducts = filteredProducts.filter((p) => p.available).length;
  const outOfStockProducts = filteredProducts.filter(
    (p) => !p.available,
  ).length;

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setAvailability("All");
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.productId === updatedProduct.productId,
      );
      if (existingIndex >= 0) {
        // Update existing product
        const updated = [...prev];
        updated[existingIndex] = updatedProduct;
        return updated;
      } else {
        // Add new product
        return [...prev, updatedProduct];
      }
    });
  };

  return (
    <Flex
      flexDirection="column"
      style={{
        position: "relative",
        height: "100%",
        backgroundColor: "var(--dt-colors-background-container-default)",
      }}
    >
      <ProductCatalogHeader
        totalProducts={totalProducts}
        availableProducts={availableProducts}
        outOfStockProducts={outOfStockProducts}
        onAddProduct={() => setEditTarget(null)}
      />

      <ProductFilters
        searchTerm={searchTerm}
        category={category}
        availability={availability}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
        onAvailabilityChange={setAvailability}
        onClearFilters={handleClearFilters}
      />

      <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
        <ProductsTable
          products={filteredProducts}
          onEdit={setEditTarget}
          isLoading={false}
        />
      </div>

      {editTarget !== undefined && (
        <ProductEditPanel
          product={editTarget ?? null}
          onClose={() => setEditTarget(undefined)}
          onSave={handleSaveProduct}
        />
      )}
    </Flex>
  );
};
