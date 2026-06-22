import React, { useState, useMemo } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { ProductCatalogHeader } from "./components/ProductCatalogHeader";
import { ProductFilters } from "./components/ProductFilters";
import { ProductsTable } from "./components/ProductsTable";
import { ProductEditPanel } from "./components/ProductEditPanel";
import { mockProducts, type Product } from "./mockProducts";

interface ProductCatalogPageProps {
  initialProducts?: Product[];
  initialEditTarget?: Product | null;
}

export const ProductCatalogPage = ({
  initialProducts = mockProducts,
  initialEditTarget = undefined,
}: ProductCatalogPageProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [editTarget, setEditTarget] = useState<Product | null | undefined>(
    initialEditTarget,
  );

  // Filter products based on search term, category, and availability
  // Filters are combined with AND logic - product must match all active filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        category === "all" || product.category === category;
      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && product.available) ||
        (availability === "out-of-stock" && !product.available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, searchTerm, category, availability]);

  const handleAddProduct = () => {
    setEditTarget(null);
  };

  const handleEdit = (product: Product) => {
    setEditTarget(product);
  };

  const handleSave = (updatedProduct: Product) => {
    if (editTarget === null) {
      // Add mode: append new product to the list
      setProducts([...products, updatedProduct]);
    } else {
      // Edit mode: replace the existing product by matching productId
      setProducts(
        products.map((p) =>
          p.productId === updatedProduct.productId ? updatedProduct : p,
        ),
      );
    }
    setEditTarget(undefined);
  };

  const handleClose = () => {
    setEditTarget(undefined);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setAvailability("all");
  };

  // Panel is open when editTarget is defined (either null for add mode, or a Product for edit mode)
  const isPanelOpen = editTarget !== undefined;

  return (
    <Flex flexDirection="column" style={{ height: "100%", overflow: "hidden" }}>
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
        onClear={handleClearFilters}
      />

      <Flex
        style={{
          flex: 1,
          overflow: "auto",
          padding: "16px 24px",
        }}
      >
        <ProductsTable
          products={filteredProducts}
          onEdit={handleEdit}
          isLoading={false}
        />
      </Flex>

      {isPanelOpen && (
        <ProductEditPanel
          product={editTarget}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </Flex>
  );
};
