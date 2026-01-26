import type { Coordinates } from '../types/geo.types';

/**
 * Known city coordinates (city, country) -> lat/lng
 * Data from Dynatrace order events
 */
export const CITY_COORDINATES: Record<string, Coordinates> = {
  'London,United Kingdom': { lat: 51.5074, lng: -0.1278 },
  'Berlin,Germany': { lat: 52.52, lng: 13.405 },
  'Seattle,United States': { lat: 47.6062, lng: -122.3321 },
  'Menlo Park,United States': { lat: 37.4848, lng: -122.1477 },
  'San Francisco,United States': { lat: 37.7749, lng: -122.4194 },
  'Mountain View,United States': { lat: 37.3861, lng: -122.084 },
  'Springfield,United States': { lat: 39.7817, lng: -89.6501 },
  'Santa Clara,United States': { lat: 37.3382, lng: -121.8863 },
  'Cupertino,United States': { lat: 37.3229, lng: -122.0322 },
  'Redmond,United States': { lat: 47.6739, lng: -122.1215 },
  'New York,United States': { lat: 40.7128, lng: -74.006 },
  'Los Angeles,United States': { lat: 34.0522, lng: -118.2437 },
  'Chicago,United States': { lat: 41.8781, lng: -87.6298 },
  'Houston,United States': { lat: 29.7604, lng: -95.3698 },
  'Phoenix,United States': { lat: 33.4484, lng: -112.074 },
  'Philadelphia,United States': { lat: 39.9526, lng: -75.1652 },
  'San Antonio,United States': { lat: 29.4241, lng: -98.4936 },
  'San Diego,United States': { lat: 32.7157, lng: -117.1611 },
  'Dallas,United States': { lat: 32.7767, lng: -96.797 },
  'Austin,United States': { lat: 30.2672, lng: -97.7431 },
  'Paris,France': { lat: 48.8566, lng: 2.3522 },
  'Lyon,France': { lat: 45.7640, lng: 4.8357 },
  'Marseille,France': { lat: 43.2965, lng: 5.3698 },
  'Madrid,Spain': { lat: 40.4168, lng: -3.7038 },
  'Barcelona,Spain': { lat: 41.3851, lng: 2.1734 },
  'Amsterdam,Netherlands': { lat: 52.3676, lng: 4.9041 },
  'Rotterdam,Netherlands': { lat: 51.9225, lng: 4.4792 },
  'Milan,Italy': { lat: 45.4642, lng: 9.1900 },
  'Rome,Italy': { lat: 41.9028, lng: 12.4964 },
  'Vienna,Austria': { lat: 48.2082, lng: 16.3738 },
  'Zurich,Switzerland': { lat: 47.3769, lng: 8.5472 },
  'Geneva,Switzerland': { lat: 46.2017, lng: 6.1432 },
  'Stockholm,Sweden': { lat: 59.3293, lng: 18.0686 },
  'Copenhagen,Denmark': { lat: 55.6761, lng: 12.5683 },
  'Oslo,Norway': { lat: 59.9139, lng: 10.7522 },
  'Dublin,Ireland': { lat: 53.3498, lng: -6.2603 },
  'Toronto,Canada': { lat: 43.6532, lng: -79.3832 },
  'Vancouver,Canada': { lat: 49.2827, lng: -123.1207 },
  'Montreal,Canada': { lat: 45.5017, lng: -73.5673 },
  'Tokyo,Japan': { lat: 35.6762, lng: 139.6503 },
  'Osaka,Japan': { lat: 34.6937, lng: 135.5023 },
  'Shanghai,China': { lat: 31.2304, lng: 121.4737 },
  'Beijing,China': { lat: 39.9042, lng: 116.4074 },
  'Hong Kong,Hong Kong': { lat: 22.3193, lng: 114.1694 },
  'Singapore,Singapore': { lat: 1.3521, lng: 103.8198 },
  'Sydney,Australia': { lat: -33.8688, lng: 151.2093 },
  'Melbourne,Australia': { lat: -37.8136, lng: 144.9631 },
  'Bangkok,Thailand': { lat: 13.7563, lng: 100.5018 },
  'Mumbai,India': { lat: 19.0760, lng: 72.8777 },
  'Delhi,India': { lat: 28.7041, lng: 77.1025 },
};

/**
 * Country coordinates (country centroid for fallback)
 */
export const COUNTRY_COORDINATES: Record<string, Coordinates> = {
  'United States': { lat: 39.8283, lng: -98.5795 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'United Kingdom': { lat: 55.3781, lng: -3.4360 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Italy': { lat: 41.8719, lng: 12.5674 },
  'Netherlands': { lat: 52.1326, lng: 5.2913 },
  'Austria': { lat: 47.5162, lng: 14.5501 },
  'Switzerland': { lat: 46.8182, lng: 8.2275 },
  'Sweden': { lat: 60.1282, lng: 18.6435 },
  'Denmark': { lat: 56.2639, lng: 9.5018 },
  'Norway': { lat: 60.4720, lng: 8.4689 },
  'Ireland': { lat: 53.4129, lng: -8.2439 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'Hong Kong': { lat: 22.3193, lng: 114.1694 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'Thailand': { lat: 15.8700, lng: 100.9925 },
  'India': { lat: 20.5937, lng: 78.9629 },
};

/**
 * Get coordinates for a location
 * Falls back to country centroid if city not found
 */
export function getCoordinates(country: string, city?: string): Coordinates {
  if (city) {
    const cityKey = `${city},${country}`;
    if (cityKey in CITY_COORDINATES) {
      return CITY_COORDINATES[cityKey];
    }
  }
  
  // Fallback to country coordinates
  if (country in COUNTRY_COORDINATES) {
    return COUNTRY_COORDINATES[country];
  }
  
  // Last resort: world center
  console.warn(`No coordinates found for ${city || 'city'}, ${country}`);
  return { lat: 20, lng: 0 };
}
