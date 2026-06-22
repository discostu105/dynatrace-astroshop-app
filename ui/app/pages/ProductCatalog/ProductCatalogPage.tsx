import React, { useState, useMemo } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { mockProducts, type Product } from "./mockProducts";
import { ProductCatalogHeader } from "./components/ProductCatalogHeader";
import { ProductFilters } from "./components/ProductFilters";
import { ProductsTable } from "./components/ProductsTable";
import { ProductEditPanel } from "./components/ProductEditPanel";

type ProductCatalogPageProps = {
  initialSearchTerm?: string;
  initialEditTarget?: Product | null;
};

/**
 * Applies all active filters to the product list.
 */
const applyFilters = (
  products: Product[],
  searchTerm: string,
  category: string,
  availability: string,
): Product[] => {
  return products.filter((product) => {
    // Text search filter
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (category !== "All" && product.category !== category) {
      return false;
    }

    // Availability filter
    if (availability === "Available Only" && !product.available) {
      return false;
    }
    if (availability === "Out of Stock" && product.available) {
      return false;
    }

    return true;
  });
};

export const ProductCatalogPage = ({
  initialSearchTerm = "",
  initialEditTarget,
}: ProductCatalogPageProps = {}) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  // undefined = panel closed, null = add mode, Product = edit mode
  const [editTarget, setEditTarget] = useState<Product | null | undefined>(
    initialEditTarget,
  );

  const filteredProducts = useMemo(
    () => applyFilters(products, searchTerm, category, availability),
    [products, searchTerm, category, availability],
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setAvailability("All");
  };

  const handleAddProduct = () => {
    setEditTarget(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditTarget(product);
  };

  const handleSaveProduct = (updated: Product) => {
    const existingIndex = products.findIndex(
      (p) => p.productId === updated.productId,
    );
    if (existingIndex >= 0) {
      // Update existing product
      const updatedProducts = [...products];
      updatedProducts[existingIndex] = updated;
      setProducts(updatedProducts);
    } else {
      // Add new product
      setProducts([...products, updated]);
    }
  };

  const handleClosePanel = () => {
    setEditTarget(undefined);
  };

  return (
    <Flex flexDirection="column" style={{ height: "100%" }}>
      <ProductCatalogHeader
        products={filteredProducts}
        onAddProduct={handleAddProduct}
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

      <div style={{ flex: 1, overflow: "auto" }}>
        <ProductsTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          isLoading={false}
        />
      </div>

      {editTarget !== undefined && (
        <ProductEditPanel
          product={editTarget}
          onClose={handleClosePanel}
          onSave={handleSaveProduct}
        />
      )}
    </Flex>
  );
};
