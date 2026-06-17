import React, { useState } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Surface } from '@dynatrace/strato-components/layouts';
import { Button } from '@dynatrace/strato-components/buttons';
import { Select, TextInput } from '@dynatrace/strato-components-preview/forms';
import { Text, Heading } from '@dynatrace/strato-components/typography';
import type { Product } from '../data/mockProducts';

interface RestockRequestFormProps {
  products: Product[];
}

export const RestockRequestForm = ({ products }: RestockRequestFormProps) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [priority, setPriority] = useState<string>('Medium');
  const [notes, setNotes] = useState<string>('');
  const [quantityError, setQuantityError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateQuantity = (value: string): boolean => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) {
      setQuantityError('Quantity must be greater than 0');
      return false;
    }
    if (num > 10000) {
      setQuantityError('Quantity must be 10,000 or less');
      return false;
    }
    setQuantityError('');
    return true;
  };

  const handleQuantityBlur = () => {
    if (quantity.trim()) {
      validateQuantity(quantity);
    }
  };

  const handleReset = () => {
    setSelectedProduct('');
    setQuantity('');
    setPriority('Medium');
    setNotes('');
    setQuantityError('');
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (selectedProduct && quantity && validateQuantity(quantity) && priority) {
      setSubmitted(true);
    }
  };

  const isFormValid =
    selectedProduct.trim() !== '' &&
    quantity.trim() !== '' &&
    quantityError === '' &&
    priority.trim() !== '';

  const selectedProductName =
    products.find((p) => p.productId === selectedProduct)?.productName || selectedProduct;

  return (
    <Surface style={{ padding: '24px', borderRadius: '4px' }}>
      <Flex flexDirection="column" gap={16}>
        {submitted && (
          <Surface
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--dt-colors-feedback-success)',
              color: 'white',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white' }}>
              ✅ Restock request submitted for {selectedProductName}.
            </Text>
            <Button
              variant="default"
              onClick={() => setSubmitted(false)}
              style={{
                minWidth: 'auto',
                padding: '4px 8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid white',
                color: 'white',
              }}
            >
              Dismiss
            </Button>
          </Surface>
        )}

        <Heading level={4}>Restock Request Form</Heading>

        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Product *</Text>
          <Select
            value={selectedProduct}
            onChange={(value) => setSelectedProduct(value as string)}
            placeholder="Select a product"
          >
            {products.map((product) => (
              <Select.Option key={product.productId} value={product.productId}>
                {product.productName}
              </Select.Option>
            ))}
          </Select>
        </Flex>

        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Requested Quantity *</Text>
          <TextInput
            value={quantity}
            onChange={(value) => setQuantity(value as string)}
            onBlur={handleQuantityBlur}
            placeholder="Enter quantity (1-10000)"
            type="number"
          />
          {quantityError && (
            <Text style={{ fontSize: '12px', color: 'var(--dt-colors-feedback-critical)' }}>
              {quantityError}
            </Text>
          )}
        </Flex>

        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Priority *</Text>
          <Select value={priority} onChange={(value) => setPriority(value as string)}>
            <Select.Option value="Low">Low</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="High">High</Select.Option>
          </Select>
        </Flex>

        <Flex flexDirection="column" gap={8}>
          <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Notes</Text>
          <TextInput
            value={notes}
            onChange={(value) => {
              const newValue = value as string;
              if (newValue.length <= 200) {
                setNotes(newValue);
              }
            }}
            placeholder="Optional notes (max 200 characters)"
          />
          <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary)' }}>
            {notes.length} / 200
          </Text>
        </Flex>

        <Flex gap={12} justifyContent="flex-end">
          <Button variant="default" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="emphasized" onClick={handleSubmit} disabled={!isFormValid}>
            Submit Request
          </Button>
        </Flex>
      </Flex>
    </Surface>
  );
};
