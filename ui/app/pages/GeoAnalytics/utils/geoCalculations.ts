import type { LocationData, DQLLocationResult } from '../types/geo.types';
import { getCoordinates } from './coordinates';

/**
 * Transform DQL query results into LocationData format
 */
export function formatGeoData(results: DQLLocationResult[]): LocationData[] {
  return results.map((result) => {
    const country = result['shippingAddress.country'];
    const city = result['shippingAddress.city'];
    
    return {
      country,
      city,
      orderCount: Number(result.order_count) || 0,
      totalRevenue: Number(result.total_revenue) || 0,
      avgOrderValue: Number(result.avg_order_value) || 0,
      coordinates: getCoordinates(country, city),
    };
  });
}

/**
 * Calculate bubble size based on order count
 * min: 10px, max: 50px
 */
export function calculateBubbleSize(
  orderCount: number,
  minCount: number,
  maxCount: number,
  minSize: number = 10,
  maxSize: number = 50
): number {
  if (maxCount === minCount) {
    return minSize;
  }
  
  const normalized = (orderCount - minCount) / (maxCount - minCount);
  return minSize + normalized * (maxSize - minSize);
}

/**
 * Calculate bubble color opacity based on revenue
 * Maps revenue to opacity between 0.4 and 1.0
 */
export function calculateBubbleOpacity(
  revenue: number,
  minRevenue: number,
  maxRevenue: number,
  minOpacity: number = 0.4,
  maxOpacity: number = 1.0
): number {
  if (maxRevenue === minRevenue) {
    return maxOpacity;
  }
  
  const normalized = (revenue - minRevenue) / (maxRevenue - minRevenue);
  return minOpacity + normalized * (maxOpacity - minOpacity);
}

/**
 * Get color for bubble based on metric
 */
export function getBubbleColor(metric: 'orders' | 'revenue'): string {
  // Use Dynatrace design token colors
  return metric === 'orders'
    ? 'var(--dt-colors-charts-categorical-blue)'
    : 'var(--dt-colors-charts-categorical-turquoise)';
}

/**
 * Format currency values
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + 'K';
  }
  return value.toFixed(0);
}

/**
 * Calculate statistics from location data
 */
export function calculateStatistics(locations: LocationData[]) {
  const totalOrders = locations.reduce((sum, loc) => sum + Number(loc.orderCount || 0), 0);
  const totalRevenue = locations.reduce((sum, loc) => sum + Number(loc.totalRevenue || 0), 0);
  const uniqueCountries = new Set(locations.map((loc) => loc.country)).size;
  const uniqueCities = new Set(locations.map((loc) => loc.city).filter(Boolean)).size;
  
  return {
    totalOrders,
    totalRevenue,
    uniqueCountries,
    uniqueCities,
    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  };
}

/**
 * Get top N locations by specified metric
 */
export function getTopLocations(
  locations: LocationData[],
  metric: 'orders' | 'revenue',
  limit: number = 10
): LocationData[] {
  const sorted = [...locations].sort((a, b) => {
    if (metric === 'orders') {
      return b.orderCount - a.orderCount;
    }
    return b.totalRevenue - a.totalRevenue;
  });
  
  return sorted.slice(0, limit);
}

/**
 * Format location name for display
 */
export function formatLocationName(location: LocationData): string {
  if (location.city) {
    return `${location.city}, ${location.country}`;
  }
  return location.country;
}
