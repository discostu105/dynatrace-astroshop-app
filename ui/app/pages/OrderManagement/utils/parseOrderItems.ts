import type { OrderItem } from '../types/order.types';

interface ItemEntry {
  cost: {
    currencyCode: string;
    units: number;
    nanos: number;
  };
  item: {
    productId: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      description: string;
      picture: string;
      priceUsd: {
        currencyCode: string;
        units: number;
        nanos: number;
      };
      categories: string[];
    };
  };
}

export const parseOrderItems = (itemsJson: string): OrderItem[] => {
  if (!itemsJson) return [];
  
  try {
    const entries: ItemEntry[] = JSON.parse(itemsJson);
    if (!Array.isArray(entries)) {
      console.warn('Items is not an array:', entries);
      return [];
    }
    
    return entries.map(entry => {
      const unitPrice = 
        entry.item.product.priceUsd.units + 
        (entry.item.product.priceUsd.nanos / 1_000_000_000);
      
      const lineTotal = 
        entry.cost.units + 
        (entry.cost.nanos / 1_000_000_000);
      
      return {
        productId: entry.item.productId,
        name: entry.item.product.name,
        description: entry.item.product.description,
        picture: entry.item.product.picture,
        quantity: entry.item.quantity,
        unitPrice,
        lineTotal,
        currency: entry.cost.currencyCode,
        categories: entry.item.product.categories,
      };
    });
  } catch (error) {
    console.error('Failed to parse order items:', error);
    return [];
  }
};
