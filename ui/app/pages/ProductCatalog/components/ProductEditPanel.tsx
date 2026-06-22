import React, { useState, useEffect } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { TextInput } from '@dynatrace/strato-components-preview/forms';
import { Select } from '@dynatrace/strato-components-preview/forms';
import type { Product } from '../mockProducts';

interface ProductEditPanelProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const ProductEditPanel = ({ product, onClose, onSave }: ProductEditPanelProps) => {
  const isAddMode = !product;
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Electronics' | 'Apparel' | 'Books' | 'Home' | 'Sports'>('Electronics');
  const [unitPrice, setUnitPrice] = useState('');
  const [stockCount, setStockCount] = useState('');
  const [available, setAvailable] = useState(true);
  
  const [errors, setErrors] = useState<{ name?: string; unitPrice?: string; stockCount?: string }>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setUnitPrice((product.unitPrice / 100).toFixed(2));
      setStockCount(product.stockCount.toString());
      setAvailable(product.available);
    } else {
      setName('');
      setCategory('Electronics');
      setUnitPrice('');
      setStockCount('0');
      setAvailable(true);
    }
    setErrors({});
  }, [product]);

  const handleSave = () => {
    const newErrors: { name?: string; unitPrice?: string; stockCount?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    const priceValue = parseFloat(unitPrice);
    if (isNaN(priceValue) || priceValue < 0) {
      newErrors.unitPrice = 'Price must be a positive number';
    }
    
    const stockValue = parseInt(stockCount, 10);
    if (isNaN(stockValue) || stockValue < 0) {
      newErrors.stockCount = 'Stock must be a positive number';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedProduct: Product = {
      productId: product?.productId || `PROD-${Date.now()}`,
      name: name.trim(),
      category,
      unitPrice: Math.round(priceValue * 100),
      stockCount: stockValue,
      available,
      imageEmoji: product?.imageEmoji || getDefaultEmoji(category),
    };

    onSave(updatedProduct);
  };

  const getDefaultEmoji = (cat: string): string => {
    const emojiMap: Record<string, string> = {
      Electronics: '📱',
      Apparel: '👕',
      Books: '📚',
      Home: '🏠',
      Sports: '⚽',
    };
    return emojiMap[cat] || '📦';
  };

  return (
    <Flex 
      flexDirection="column" 
      gap={0} 
      style={{ 
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '480px',
        backgroundColor: 'var(--dt-colors-background-surface-default)',
        borderLeft: '1px solid var(--dt-colors-border-neutral-default)',
        zIndex: 1000,
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <Flex 
        justifyContent="space-between" 
        alignItems="center" 
        padding={24}
        style={{ 
          borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
        }}
      >
        <Flex alignItems="center" gap={12}>
          <span style={{ fontSize: '24px' }}>{isAddMode ? '➕' : '✏️'}</span>
          <Heading level={3}>{isAddMode ? 'Add Product' : 'Edit Product'}</Heading>
        </Flex>
        <Button 
          variant="default" 
          onClick={onClose}
          style={{ fontSize: '20px', padding: '8px 12px' }}
        >
          ✕
        </Button>
      </Flex>
      
      {/* Form */}
      <Flex 
        flexDirection="column" 
        gap={24} 
        padding={24}
        style={{ overflowY: 'auto', flex: 1 }}
      >
        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontSize: '13px', fontWeight: '600', color: 'var(--dt-colors-text-primary-default)' }}>
            Product Name *
          </Text>
          <TextInput
            placeholder="Enter product name"
            value={name}
            onChange={(value) => setName(value)}
          />
          {errors.name && (
            <Text style={{ fontSize: '12px', color: 'var(--dt-colors-charts-categorical-sunrise-default)' }}>
              {errors.name}
            </Text>
          )}
        </Flex>

        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontSize: '13px', fontWeight: '600', color: 'var(--dt-colors-text-primary-default)' }}>
            Category
          </Text>
          <Select
            name="category"
            value={category}
            onChange={(value) => setCategory(value as 'Electronics' | 'Apparel' | 'Books' | 'Home' | 'Sports')}
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

        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontSize: '13px', fontWeight: '600', color: 'var(--dt-colors-text-primary-default)' }}>
            Unit Price (USD) *
          </Text>
          <TextInput
            placeholder="0.00"
            value={unitPrice}
            onChange={(value) => setUnitPrice(value)}
          />
          {errors.unitPrice && (
            <Text style={{ fontSize: '12px', color: 'var(--dt-colors-charts-categorical-sunrise-default)' }}>
              {errors.unitPrice}
            </Text>
          )}
        </Flex>

        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontSize: '13px', fontWeight: '600', color: 'var(--dt-colors-text-primary-default)' }}>
            Stock Count *
          </Text>
          <TextInput
            placeholder="0"
            value={stockCount}
            onChange={(value) => setStockCount(value)}
          />
          {errors.stockCount && (
            <Text style={{ fontSize: '12px', color: 'var(--dt-colors-charts-categorical-sunrise-default)' }}>
              {errors.stockCount}
            </Text>
          )}
        </Flex>

        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontSize: '13px', fontWeight: '600', color: 'var(--dt-colors-text-primary-default)' }}>
            Available
          </Text>
          <Flex gap={12}>
            <Button
              variant={available ? 'accent' : 'default'}
              onClick={() => setAvailable(true)}
              style={{ flex: 1 }}
            >
              ✅ Available
            </Button>
            <Button
              variant={!available ? 'accent' : 'default'}
              onClick={() => setAvailable(false)}
              style={{ flex: 1 }}
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
          borderTop: '1px solid var(--dt-colors-border-neutral-default)',
        }}
      >
        <Button 
          variant="default"
          onClick={onClose}
          style={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button 
          variant="accent"
          onClick={handleSave}
          style={{ flex: 1 }}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  );
};
