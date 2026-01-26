import type { Timeframe } from '@dynatrace/strato-components-preview/core';

export interface GeoFilters {
  timeframe: Timeframe;
  viewMode: 'country' | 'city';
  metric: 'orders' | 'revenue';
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  country: string;
  city?: string;
  orderCount: number;
  totalRevenue: number;
  avgOrderValue: number;
  coordinates: Coordinates;
}

export interface GeoStatistics {
  totalOrders: number;
  totalRevenue: number;
  uniqueCountries: number;
  uniqueCities: number;
  avgOrderValue: number;
}

export interface LocationOrder {
  orderId: string;
  timestamp: string;
  shippingCostTotal: number;
  sessionId: string;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}

export interface DQLLocationResult {
  'shippingAddress.country': string;
  'shippingAddress.city'?: string;
  order_count: number;
  total_revenue: number;
  avg_order_value: number;
}

export interface DQLOrderResult {
  timestamp: string;
  orderId: string;
  sessionId: string;
  shippingCostTotal: number;
}
