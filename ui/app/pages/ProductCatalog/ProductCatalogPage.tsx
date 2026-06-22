import React, { useState, useMemo } from "react";
import { Page } from "@dynatrace/strato-components-preview/layouts";
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
  initialProducts,
  initialEditTarget,
}: ProductCatalogPageProps = {}) => {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  // editTarget: undefined = panel closed, null = add mode, Product = edit mode
  const [editTarget, setEditTarget] = useState<Product | null | undefined>(
    initialEditTarget !== undefined ? initialEditTarget : undefined,
  );
  const [products, setProducts] = useState<Product[]>(
    initialProducts || mockProducts,
  );

  // Derived: filtered products based on active search and filter criteria
  const filteredProducts = useMemo(() => {
    const matchesSearchTerm = (product: Product) =>
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategoryFilter = (product: Product) =>
      category === "All" || product.category === category;

    const matchesAvailabilityFilter = (product: Product) => {
      if (availability === "All") return true;
      if (availability === "Available") return product.available;
      // OutOfStock: includes both explicitly unavailable and zero-stock items
      if (availability === "OutOfStock")
        return !product.available || product.stockCount === 0;
      return true;
    };

    return products.filter(
      (product) =>
        matchesSearchTerm(product) &&
        matchesCategoryFilter(product) &&
        matchesAvailabilityFilter(product),
    );
  }, [products, searchTerm, category, availability]);

  // Derived: has active filters
  const hasActiveFilters =
    searchTerm !== "" || category !== "All" || availability !== "All";

  // Handlers
  const handleClearFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setAvailability("All");
  };

  const handleAddProduct = () => {
    setEditTarget(null);
  };

  const handleSave = (updatedProduct: Product) => {
    const existingIndex = products.findIndex(
      (p) => p.productId === updatedProduct.productId,
    );

    if (existingIndex >= 0) {
      // Update: replace existing product in-place
      const updatedProducts = [...products];
      updatedProducts[existingIndex] = updatedProduct;
      setProducts(updatedProducts);
    } else {
      // Add: append new product to end of list
      setProducts([...products, updatedProduct]);
    }
  };

  return (
    <Page>
      <Page.Header>
        <ProductCatalogHeader
          filteredProducts={filteredProducts}
          onAddProduct={handleAddProduct}
        />
      </Page.Header>
      <Page.Main>
        <Flex flexDirection="column" style={{ height: "100%" }}>
          {/* Filter bar */}
          <div>
            <ProductFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              category={category}
              onCategoryChange={setCategory}
              availability={availability}
              onAvailabilityChange={setAvailability}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Table */}
          <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
            <ProductsTable
              products={filteredProducts}
              onEdit={setEditTarget}
              isLoading={false}
            />
          </div>
        </Flex>

        {/* Edit panel - rendered when editTarget is not undefined */}
        {editTarget !== undefined && (
          <ProductEditPanel
            product={editTarget}
            onClose={() => setEditTarget(undefined)}
            onSave={handleSave}
          />
        )}
      </Page.Main>
    </Page>
  );
};
