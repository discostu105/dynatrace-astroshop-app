import React from 'react';
import { ProductCatalogPage } from './ProductCatalogPage';
import { mockProducts } from './mockProducts';

export default {
  title: 'Pages/ProductCatalogPage',
  component: ProductCatalogPage,
};

export const Default = () => <ProductCatalogPage />;

export const EmptyState = () => <ProductCatalogPage initialProducts={[]} />;

export const EditPanelOpen = () => (
  <ProductCatalogPage initialEditTarget={mockProducts[0]} />
);
