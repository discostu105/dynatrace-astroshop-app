import React, { useState, useEffect } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Button } from '@dynatrace/strato-components/buttons';
import { TextInput } from '@dynatrace/strato-components-preview/forms';
import { Select, SelectOption } from '@dynatrace/strato-components-preview';
import type { Product } from '../mockProducts';

type ProductEditPanelProps = {
  product: Product | null;
  onClose: () => void;
  onSave: (updated: Product) => void;
};

export const ProductEditPanel = ({ product, onClose, onSave }: ProductEditPanelProps) => {
  const isAddMode = product === null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [available, setAvailable] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice((product.unitPrice / 100).toFixed(2));
      setStock(product.stockCount.toString());
      setAvailable(product.available);
    } else {
      setName('');
      setCategory('Electronics');
      setPrice('');
      setStock('');
      setAvailable(true);
    }
    setErrors({});
  }, [product]);

  const validateAndSave = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    const priceFloat = parseFloat(price);
    if (isNaN(priceFloat) || priceFloat <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    const stockInt = parseInt(stock, 10);
    if (isNaN(stockInt) || stockInt < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedProduct: Product = {
      productId: product?.productId || `PROD-${Date.now()}`,
      name: name.trim(),
      category,
      unitPrice: Math.round(priceFloat * 100),
      stockCount: stockInt,
      available,
      imageEmoji: product?.imageEmoji || '📦',
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: '480px',
        zIndex: 1000,
        borderLeft: '1px solid var(--dt-colors-border-neutral-default)',
        backgroundColor: 'var(--dt-colors-background-container-default)',
        overflow: 'auto',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Flex flexDirection="column" style={{ height: '100%' }}>
        {/* Header */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
          }}
        >
          <div style={{ fontSize: '20px', fontWeight: '600' }}>
            {isAddMode ? 'Add Product' : 'Edit Product'}
          </div>
          <Button variant="default" onClick={onClose}>
            ✕
          </Button>
        </Flex>

        {/* Form Fields */}
        <Flex flexDirection="column" gap={20} style={{ padding: '24px', flex: 1 }}>
          <Flex flexDirection="column" gap={8}>
            <label style={{ fontSize: '14px', fontWeight: '600' }}>Product Name *</label>
            <TextInput value={name} onChange={setName} placeholder="Enter product name" />
            {errors.name && (
              <div style={{ fontSize: '12px', color: 'rgba(239, 83, 80, 1)' }}>{errors.name}</div>
            )}
          </Flex>

          <Flex flexDirection="column" gap={8}>
            <label style={{ fontSize: '14px', fontWeight: '600' }}>Category</label>
            <Select
              value={category}
              onChange={(val) => setCategory(val as Product['category'])}
            >
              <Select.Content>
                <SelectOption value="Electronics">Electronics</SelectOption>
                <SelectOption value="Apparel">Apparel</SelectOption>
                <SelectOption value="Books">Books</SelectOption>
                <SelectOption value="Home">Home</SelectOption>
                <SelectOption value="Sports">Sports</SelectOption>
              </Select.Content>
            </Select>
          </Flex>

          <Flex flexDirection="column" gap={8}>
            <label style={{ fontSize: '14px', fontWeight: '600' }}>Unit Price (USD) *</label>
            <TextInput value={price} onChange={setPrice} placeholder="0.00" />
            {errors.price && (
              <div style={{ fontSize: '12px', color: 'rgba(239, 83, 80, 1)' }}>{errors.price}</div>
            )}
          </Flex>

          <Flex flexDirection="column" gap={8}>
            <label style={{ fontSize: '14px', fontWeight: '600' }}>Stock Count *</label>
            <TextInput value={stock} onChange={setStock} placeholder="0" />
            {errors.stock && (
              <div style={{ fontSize: '12px', color: 'rgba(239, 83, 80, 1)' }}>{errors.stock}</div>
            )}
          </Flex>

          <Flex flexDirection="column" gap={8}>
            <label style={{ fontSize: '14px', fontWeight: '600' }}>Availability</label>
            <Flex gap={12}>
              <Button
                variant={available ? 'emphasized' : 'default'}
                onClick={() => setAvailable(true)}
              >
                ✅ Available
              </Button>
              <Button
                variant={!available ? 'emphasized' : 'default'}
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
            padding: '20px 24px',
            borderTop: '1px solid var(--dt-colors-border-neutral-default)',
          }}
        >
          <Button variant="emphasized" onClick={validateAndSave} style={{ flex: 1 }}>
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
