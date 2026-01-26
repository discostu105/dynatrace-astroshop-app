# Geographic Order Analytics - Design & Implementation Plan

**Feature Name**: Geographic Order Analytics (Worldmap)  
**Version**: 1.0  
**Status**: 📝 Design Complete  
**Created**: January 26, 2026  
**Author**: Engineering Team

---

## 1. Feature Overview

### 1.1 Description

A new page in the Astroshop Orders app that visualizes order distribution on an interactive worldmap. Users can see where orders are being shipped to, with bubble markers representing order volume and revenue by location.

### 1.2 User Stories

1. **As a business analyst**, I want to see order distribution by country and city on a map so I can identify key markets.
2. **As a sales manager**, I want to understand which regions generate the most revenue so I can prioritize sales efforts.
3. **As an operations manager**, I want to identify shipping patterns so I can optimize logistics.
4. **As a support team lead**, I want to see regional success/failure rates so I can identify areas needing attention.

### 1.3 Success Metrics

- Users can visualize order distribution within 3 seconds
- Map supports zoom and pan interactions
- Drill-down from region to order list works smoothly
- Feature integrates with existing timeframe filters

---

## 2. Data Architecture

### 2.1 Data Source

**Primary**: Business Events (`fetch bizevents`)  
**Event Types**: 
- `astroshop.web.checkout_success` - Contains shipping address
- `astroshop.web.checkout_failure` - No shipping address (null)

### 2.2 Available Fields

```
shippingAddress.country      → "Germany", "United States", "United Kingdom"
shippingAddress.city         → "Berlin", "Seattle", "London"
shippingAddress.state        → "WA", "CA", "N/A"
shippingAddress.zipCode      → "10115", "98109"
shippingAddress.streetAddress → "12 Hauptstraße"
shippingCostTotal            → 1662.98 (USD equivalent)
orderId                      → UUID
sessionId                    → UUID
timestamp                    → ISO timestamp
```

### 2.3 DQL Queries

#### Query 1: Orders by Country (Overview)

```dql
fetch bizevents, from: $from, to: $to
| filter event.type == "astroshop.web.checkout_success"
| summarize {
    order_count = count(),
    total_revenue = sum(shippingCostTotal),
    avg_order_value = sum(shippingCostTotal) / count()
  },
  by: {shippingAddress.country}
| sort total_revenue desc
```

#### Query 2: Orders by City (Detail View)

```dql
fetch bizevents, from: $from, to: $to
| filter event.type == "astroshop.web.checkout_success"
| summarize {
    order_count = count(),
    total_revenue = sum(shippingCostTotal),
    avg_order_value = sum(shippingCostTotal) / count()
  },
  by: {shippingAddress.country, shippingAddress.city}
| sort order_count desc
| limit 100
```

#### Query 3: Orders for Selected Location (Drill-down)

```dql
fetch bizevents, from: $from, to: $to
| filter event.type == "astroshop.web.checkout_success"
| filter shippingAddress.country == "$country"
| filter shippingAddress.city == "$city"
| fields timestamp, orderId, sessionId, shippingCostTotal, shippingTrackingId
| sort timestamp desc
| limit 50
```

#### Query 4: Time-Series by Top Countries

```dql
fetch bizevents, from: $from, to: $to
| filter event.type == "astroshop.web.checkout_success"
| makeTimeseries order_count = count(), by: {shippingAddress.country}, interval: 1h
```

### 2.4 Geocoding Strategy

**Problem**: DQL returns city/country names, but the map component needs latitude/longitude coordinates.

**Solution**: Static coordinate lookup table

```typescript
// Static mapping of known cities to coordinates
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Berlin,Germany': { lat: 52.52, lng: 13.405 },
  'London,United Kingdom': { lat: 51.5074, lng: -0.1278 },
  'Seattle,United States': { lat: 47.6062, lng: -122.3321 },
  'San Francisco,United States': { lat: 37.7749, lng: -122.4194 },
  // ... extend as needed
};
```

**Fallback**: Country centroid coordinates for unknown cities

```typescript
const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'United States': { lat: 39.8283, lng: -98.5795 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'United Kingdom': { lat: 55.3781, lng: -3.4360 },
  // ...
};
```

---

## 3. UI/UX Design

### 3.1 Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header] Orders | 🗺️ Geographic Analytics                        │
├─────────────────────────────────────────────────────────────────┤
│ [Filters Bar]                                                   │
│ [TimeframeSelector] [View: Country ▾ / City] [Metric: Orders ▾] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │                    WORLD MAP                             │   │
│  │                                                          │   │
│  │     ● Berlin (405)                                       │   │
│  │           ● London (426)                                 │   │
│  │                          ● Seattle (169)                 │   │
│  │                          ● San Francisco (143)           │   │
│  │                                                          │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────┐ ┌────────────────────────────────┐  │
│  │ 📊 Top Locations       │ │ 📈 Summary                     │  │
│  │ 1. London      426     │ │ Total Orders: 1,851            │  │
│  │ 2. Berlin      405     │ │ Total Revenue: $2.3M           │  │
│  │ 3. Seattle     169     │ │ Countries: 3                   │  │
│  │ 4. Menlo Park  151     │ │ Cities: 10                     │  │
│  │ 5. San Fran.   143     │ │ Avg Order: $1,121              │  │
│  └────────────────────────┘ └────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│ [Drill-down Panel - appears when location clicked]              │
│ Orders from London, United Kingdom                              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Order ID         │ Time     │ Amount  │ Actions             │ │
│ │ cd9653e2-fae6... │ 2m ago   │ $1,662  │ [View]              │ │
│ │ d2d45c7c-fae6... │ 5m ago   │ $1,824  │ [View]              │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Map Interactions

| Interaction | Behavior |
|-------------|----------|
| Hover bubble | Show tooltip with city name, order count, revenue |
| Click bubble | Open drill-down panel with orders from that location |
| Zoom in/out | Standard map zoom controls |
| Pan | Drag to move map |
| Double-click | Zoom into region |

### 3.3 Visual Encoding

| Visual Property | Data Mapping |
|-----------------|--------------|
| Bubble size | Order count (min: 10px, max: 50px) |
| Bubble color | Revenue intensity (light → dark blue) |
| Bubble opacity | 0.7 (allows overlap visibility) |

### 3.4 Color Palette (Strato Design Tokens)

```typescript
// From @dynatrace/strato-design-tokens
const COLORS = {
  bubbleDefault: 'var(--dt-colors-charts-categorical-default-1)',
  bubbleHighlight: 'var(--dt-colors-charts-categorical-default-2)',
  tooltipBg: 'var(--dt-colors-background-surface-default)',
  tooltipBorder: 'var(--dt-colors-border-container-default)',
};
```

---

## 4. Component Architecture

### 4.1 File Structure

```
ui/app/pages/GeoAnalytics/
├── GeoAnalyticsPage.tsx           # Main page component
├── components/
│   ├── GeoHeader.tsx              # Page header with summary stats
│   ├── GeoFilters.tsx             # Filter bar (timeframe, view mode, metric)
│   ├── GeoMap.tsx                 # Worldmap visualization wrapper
│   ├── GeoMapMarker.tsx           # Custom bubble marker component
│   ├── GeoMapTooltip.tsx          # Hover tooltip component
│   ├── LocationSummary.tsx        # Top locations list
│   ├── LocationDrilldown.tsx      # Orders from selected location
│   └── GeoLegend.tsx              # Map legend component
├── hooks/
│   ├── useGeoFilters.ts           # Filter state management
│   ├── useOrdersByLocation.ts     # DQL query for aggregated data
│   └── useLocationOrders.ts       # DQL query for drill-down orders
├── utils/
│   ├── coordinates.ts             # City/country → lat/lng mapping
│   ├── geoCalculations.ts         # Bubble sizing, color scaling
│   └── formatGeoData.ts           # Transform DQL results → map data
└── types/
    └── geo.types.ts               # TypeScript interfaces
```

### 4.2 Component Hierarchy

```
<GeoAnalyticsPage>
  ├── <GeoHeader statistics={...} />
  ├── <GeoFilters 
  │       timeframe={...}
  │       viewMode={...}
  │       metric={...}
  │       onChange={...}
  │   />
  ├── <Flex>
  │   ├── <GeoMap 
  │   │       data={locationData}
  │   │       onLocationClick={handleLocationClick}
  │   │   >
  │   │     <GeoMapMarker />
  │   │     <GeoMapTooltip />
  │   │   </GeoMap>
  │   └── <Flex flexDirection="column">
  │       ├── <LocationSummary data={topLocations} />
  │       └── <GeoLegend />
  │       </Flex>
  │   </Flex>
  └── {selectedLocation && (
        <LocationDrilldown 
          location={selectedLocation}
          onClose={...}
          onOrderClick={...}
        />
      )}
</GeoAnalyticsPage>
```

### 4.3 Type Definitions

```typescript
// types/geo.types.ts

export interface GeoFilters {
  timeframe: Timeframe;
  viewMode: 'country' | 'city';
  metric: 'orders' | 'revenue';
}

export interface LocationData {
  country: string;
  city?: string;
  orderCount: number;
  totalRevenue: number;
  avgOrderValue: number;
  coordinates: {
    lat: number;
    lng: number;
  };
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
```

### 4.4 Key Component APIs

#### GeoMap Component

```typescript
interface GeoMapProps {
  data: LocationData[];
  metric: 'orders' | 'revenue';
  onLocationClick: (location: LocationData) => void;
  onLocationHover?: (location: LocationData | null) => void;
  viewport?: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
  isLoading?: boolean;
}
```

#### GeoFilters Component

```typescript
interface GeoFiltersProps {
  timeframe: Timeframe;
  viewMode: 'country' | 'city';
  metric: 'orders' | 'revenue';
  onTimeframeChange: (timeframe: Timeframe) => void;
  onViewModeChange: (mode: 'country' | 'city') => void;
  onMetricChange: (metric: 'orders' | 'revenue') => void;
}
```

---

## 5. State Management

### 5.1 State Overview

```typescript
// GeoAnalyticsPage state
const [filters, setFilters] = useState<GeoFilters>({
  timeframe: { from: { value: 'now-7d' }, to: { value: 'now' } },
  viewMode: 'city',
  metric: 'orders',
});

const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
const [mapViewport, setMapViewport] = useState<MapViewport>({
  center: [20, 0],  // World center
  zoom: 2,
});
```

### 5.2 Data Flow

```
┌─────────────────┐
│   GeoFilters    │ ──(timeframe, viewMode, metric)──┐
└─────────────────┘                                  │
                                                     ▼
┌─────────────────┐     ┌─────────────────────────────────┐
│ useGeoFilters() │────▶│ useOrdersByLocation(filters)    │
└─────────────────┘     │   → DQL Query                   │
                        │   → Transform to LocationData[] │
                        └─────────────────────────────────┘
                                        │
                                        ▼
                        ┌─────────────────────────────────┐
                        │           GeoMap                │
                        │  (renders bubbles on worldmap)  │
                        └─────────────────────────────────┘
                                        │
                          (user clicks location)
                                        ▼
                        ┌─────────────────────────────────┐
                        │  useLocationOrders(location)    │
                        │   → DQL Query for orders        │
                        └─────────────────────────────────┘
                                        │
                                        ▼
                        ┌─────────────────────────────────┐
                        │     LocationDrilldown           │
                        │  (shows orders from location)   │
                        └─────────────────────────────────┘
```

---

## 6. Dependencies

### 6.1 New Package Required

```bash
npm install @dynatrace/strato-geo
```

**Package**: `@dynatrace/strato-geo@2.13.2`  
**Description**: Advanced Strato component for rendering maps with geospatial data layers  
**Status**: Available in npm registry

### 6.2 Existing Dependencies (already installed)

- `@dynatrace/strato-components` - Layout, Typography
- `@dynatrace/strato-components-preview` - Filters, Tables, Charts
- `@dynatrace-sdk/react-hooks` - useDql hook
- `@dynatrace/strato-design-tokens` - Colors, spacing

### 6.3 No External APIs Required

All geolocation is handled via static coordinate tables. No runtime API calls to geocoding services.

---

## 7. Implementation Plan

### Phase 1: Foundation (Day 1 - Morning)

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1.1 | Install `@dynatrace/strato-geo` package | 5 min |
| 1.2 | Create folder structure under `ui/app/pages/GeoAnalytics/` | 10 min |
| 1.3 | Define TypeScript types in `types/geo.types.ts` | 20 min |
| 1.4 | Create coordinate lookup tables in `utils/coordinates.ts` | 30 min |
| 1.5 | Implement `useGeoFilters` hook | 20 min |

### Phase 2: Data Layer (Day 1 - Afternoon)

| Task | Description | Est. Time |
|------|-------------|-----------|
| 2.1 | Implement `useOrdersByLocation` hook (DQL aggregation) | 45 min |
| 2.2 | Implement `formatGeoData` utility (transform DQL → map data) | 30 min |
| 2.3 | Implement `geoCalculations` (bubble sizing, color scaling) | 30 min |
| 2.4 | Write unit tests for data transformation | 30 min |

### Phase 3: UI Components (Day 2 - Morning)

| Task | Description | Est. Time |
|------|-------------|-----------|
| 3.1 | Create `GeoAnalyticsPage` shell with layout | 30 min |
| 3.2 | Implement `GeoHeader` component | 20 min |
| 3.3 | Implement `GeoFilters` component | 30 min |
| 3.4 | Implement `LocationSummary` component | 30 min |
| 3.5 | Implement `GeoLegend` component | 20 min |

### Phase 4: Map Integration (Day 2 - Afternoon)

| Task | Description | Est. Time |
|------|-------------|-----------|
| 4.1 | Explore `@dynatrace/strato-geo` API | 30 min |
| 4.2 | Implement `GeoMap` wrapper component | 1 hr |
| 4.3 | Implement bubble markers with data binding | 45 min |
| 4.4 | Implement hover tooltips | 30 min |
| 4.5 | Add zoom/pan interactions | 20 min |

### Phase 5: Drill-down (Day 3 - Morning)

| Task | Description | Est. Time |
|------|-------------|-----------|
| 5.1 | Implement `useLocationOrders` hook | 30 min |
| 5.2 | Implement `LocationDrilldown` panel | 45 min |
| 5.3 | Add navigation to Order Management page | 20 min |
| 5.4 | Handle loading/error states | 20 min |

### Phase 6: Integration (Day 3 - Afternoon)

| Task | Description | Est. Time |
|------|-------------|-----------|
| 6.1 | Add route in `App.tsx` | 10 min |
| 6.2 | Add navigation link in `Header.tsx` | 10 min |
| 6.3 | Integration testing with live data | 1 hr |
| 6.4 | Performance optimization (if needed) | 30 min |
| 6.5 | Documentation & code cleanup | 30 min |

### Total Estimated Time: **~3 days**

---

## 8. Routing & Navigation

### 8.1 Route Configuration

```typescript
// App.tsx
<Routes>
  <Route path="/" element={<OrderManagementPage />} />
  <Route path="/geo" element={<GeoAnalyticsPage />} />
</Routes>
```

### 8.2 Header Navigation

```typescript
// Header.tsx
<AppHeader.NavItems>
  <AppHeader.AppNavLink as={Link} to="/">Orders</AppHeader.AppNavLink>
  <AppHeader.AppNavLink as={Link} to="/geo">🗺️ Geographic</AppHeader.AppNavLink>
</AppHeader.NavItems>
```

---

## 9. Error Handling

### 9.1 Error States

| Scenario | Behavior |
|----------|----------|
| DQL query fails | Show error message with retry button |
| No orders in timeframe | Show empty state with "No orders found" message |
| Missing coordinates | Fall back to country centroid, log warning |
| Map fails to load | Show fallback table view of data |

### 9.2 Loading States

```typescript
// Skeleton loading pattern
{isLoading ? (
  <Skeleton height={400} />
) : (
  <GeoMap data={locationData} />
)}
```

---

## 10. Performance Considerations

### 10.1 Query Optimization

- Limit city-level queries to top 100 locations
- Use `summarize` aggregation in DQL (server-side, fast)
- Cache coordinate lookups (static data, no network)

### 10.2 Render Optimization

- Use `React.memo` for marker components
- Implement viewport culling (don't render off-screen markers)
- Debounce filter changes (300ms)

### 10.3 Bundle Size

- `@dynatrace/strato-geo` adds ~150KB to bundle
- Consider lazy loading: `React.lazy(() => import('./GeoAnalyticsPage'))`

---

## 11. Testing Strategy

### 11.1 Unit Tests

- `coordinates.ts` - City lookup, fallback logic
- `geoCalculations.ts` - Bubble sizing, color scaling
- `formatGeoData.ts` - DQL result transformation

### 11.2 Integration Tests

- `useOrdersByLocation` - Hook with mocked DQL responses
- `GeoMap` - Renders correct number of markers
- `LocationDrilldown` - Shows correct orders on selection

### 11.3 E2E Tests (Manual)

- [ ] Page loads without errors
- [ ] Map displays bubbles at correct locations
- [ ] Clicking bubble opens drill-down
- [ ] Timeframe filter affects data
- [ ] Navigation between Orders and Geographic works

---

## 12. Future Enhancements (Out of Scope)

1. **Time Animation**: Animate order flow over time
2. **Heatmap Mode**: Alternative visualization style
3. **Export**: Download geographic data as CSV
4. **Comparison**: Side-by-side regional comparison
5. **Success Rate by Region**: Color coding by order success rate
6. **Real-time Updates**: WebSocket-based live order tracking

---

## 13. Open Questions

1. **Q**: Should we show failed orders (which have no shipping address)?  
   **A**: No, only successful orders have address data. Show note explaining this.

2. **Q**: How many cities should we support in coordinate lookup?  
   **A**: Start with top 50 cities from current data, expand as needed.

3. **Q**: Should map state (zoom, center) persist across navigation?  
   **A**: Nice-to-have, not MVP. Can use URL params or local storage later.

---

## 14. Approval Checklist

- [ ] Product Owner approval on UX design
- [ ] Engineering lead approval on architecture
- [ ] Security review (no PII concerns - aggregated data only)
- [ ] Performance budget approved (150KB bundle increase)

---

## 15. References

- [Strato Geo Package](https://www.npmjs.com/package/@dynatrace/strato-geo)
- [Strato Design System](https://developer.dynatrace.com/design/about-strato-design-system/)
- [DQL Reference](https://docs.dynatrace.com/docs/platform/grail/dynatrace-query-language)
- [Feasibility Analysis](./worldmap-feasibility.md)

---

**Document Status**: ✅ Ready for Implementation  
**Next Step**: Get approval, then proceed with Phase 1
