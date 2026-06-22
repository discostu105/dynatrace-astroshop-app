import { useMemo } from "react";
import type { Product, ProductStatistics } from "../types/product.types";

export const useProductStatistics = (
  products: Product[],
): ProductStatistics => {
  return useMemo(() => {
    const totalProducts = products.length;
    const available = products.filter((p) => p.status === "In Stock").length;
    const outOfStock = products.filter(
      (p) => p.status === "Out of Stock",
    ).length;

    return {
      totalProducts,
      available,
      outOfStock,
    };
  }, [products]);
};
