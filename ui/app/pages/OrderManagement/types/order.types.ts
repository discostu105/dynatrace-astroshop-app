export interface Order {
  timestamp: string;
  orderId: string;
  sessionId: string;
  shippingCostTotal: number;
  shippingTrackingId: string | null;
  items: string; // JSON string
  traceId: string;
  eventType: 'astroshop.web.checkout_success' | 'astroshop.web.checkout_failure';
}

export interface OrderItem {
  productId: string;
  name: string;
  description: string;
  picture: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  currency: string;
  categories: string[];
}

export interface OrderFilters {
  timeframe: { from: Date; to: Date };
  status: 'all' | 'success' | 'failure';
  searchTerm: string; // Order ID
}

export interface OrderStatistics {
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  successRate: number;
}
