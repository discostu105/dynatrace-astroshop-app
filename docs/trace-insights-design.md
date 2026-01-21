# Trace Insights Design: Inline Order Performance Visualization

## Executive Summary

This design proposes extracting and visualizing trace data directly in the Order Management interface, providing instant performance insights before users dive into the full distributed trace. By analyzing span data from associated traces, we can surface key metrics like service timings, error indicators, and bottlenecks right in the order detail view.

## Problem Statement

Currently, orders display a "View Trace" button that opens the distributed tracing tool. While powerful, this requires context switching and doesn't give users a quick overview of order performance. Support teams and developers need immediate visibility into:
- Was this order slow? Which service caused the delay?
- Did any services fail or retry?
- How much time was spent on database operations?
- What was the end-to-end latency breakdown?

## Data Exploration Findings

### Available Trace Data

After exploring the Dynatrace Grail data, we discovered rich trace information available for orders:

#### 1. **Span Data Structure**
Each order trace contains 30+ spans covering the complete checkout flow:
- **Frontend**: checkout API route execution
- **Services**: payment, shipping, cart, email, currency, quote, accounting
- **Database**: Redis operations (HGET, HMSET, EXPIRE)
- **RPC Calls**: gRPC service-to-service communication
- **Messaging**: Kafka operations (orders process)

Example checkout trace breakdown (167ms total):
```
POST /api/checkout           142ms  (frontend)
├─ CheckoutService/PlaceOrder  94ms  (gRPC)
├─ ProductCatalog/GetProduct   46ms  (gRPC × 3)
├─ PaymentService/Charge        6ms  (gRPC)
├─ ShippingService              5ms  (get-quote, ship-order)
├─ EmailService                 7ms  (send_order_confirmation)
├─ CartService                  3ms  (GetCart, EmptyCart)
├─ CurrencyService              7ms  (Convert × 4)
└─ Redis operations             1.5ms (HGET, HMSET, EXPIRE)
```

#### 2. **Key Metrics Available**
- **Duration**: Per-span and total trace duration
- **Service Breakdown**: Time spent in each microservice
- **HTTP Status Codes**: Success/failure indicators
- **Exception Info**: `exception.type` and `exception.message` for errors
- **Database Operations**: `db.statement`, `db.system` for data access
- **Span Kinds**: server, client, internal, consumer (message queue)
- **RPC Services**: gRPC method names

#### 3. **Aggregatable Insights**

We can compute these metrics from span data:

**Performance Metrics:**
```dql
fetch spans | filter trace.id == toUid("...") 
| summarize 
    total_duration = sum(duration),
    avg_duration = avg(duration),
    span_count = count(),
    by: {service.name}
```

**Error Detection:**
```dql
fetch spans | filter trace.id == toUid("...") 
| summarize error_count = countIf(isNotNull(exception.type))
```

**Database Impact:**
```dql
fetch spans | filter trace.id == toUid("...") and isNotNull(db.statement)
| summarize 
    db_time = sum(duration),
    db_calls = count(),
    by: {db.system}
```

## Design Proposal

### 1. **Order Detail Panel - Trace Insights Section**

Add a new "Performance Insights" section to the OrderDetailPanel that displays trace-derived metrics when a traceId is available.

#### Visual Components:

**A. Performance Overview Card**
```
┌─────────────────────────────────────────┐
│ 🚀 Performance Overview                  │
├─────────────────────────────────────────┤
│ Total Duration:     167ms    ✓ Good     │
│ Service Calls:      36 spans            │
│ Database Ops:       3 calls (1.5ms)     │
│ Errors:            0                    │
└─────────────────────────────────────────┘
```

**B. Service Breakdown Chart**
- **Horizontal Bar Chart** showing time spent per service
- Color-coded by performance:
  - Green: < 50ms
  - Yellow: 50-200ms
  - Red: > 200ms
- Shows top 5 services by duration

```
┌─────────────────────────────────────────┐
│ 📊 Service Breakdown (by duration)      │
├─────────────────────────────────────────┤
│ frontend    ████████████████  142ms     │
│ shipping    █████              10ms     │
│ email       ███                 7ms     │
│ currency    ███                 7ms     │
│ payment     ██                  6ms     │
└─────────────────────────────────────────┘
```

**C. Critical Path Indicators**
- Highlight slowest span(s) in the trace
- Show if any service took > 100ms
- Display retry indicators if present

**D. Error Indicators (if present)**
```
┌─────────────────────────────────────────┐
│ ⚠️  Issues Detected                      │
├─────────────────────────────────────────┤
│ • PaymentService returned 500           │
│ • exception: CardDeclinedException      │
│ • Retry attempted: Yes (succeeded)      │
└─────────────────────────────────────────┘
```

### 2. **Orders Table - Quick Performance Indicators**

Add inline performance badges to the orders table:

| Order ID | Timestamp | Status | Trace Performance | Actions |
|----------|-----------|--------|-------------------|---------|
| ORD-123  | 10:23 AM  | ✓ Success | 🟢 Fast (142ms) | View |
| ORD-124  | 10:24 AM  | ✓ Success | 🟡 Slow (2.1s) | View |
| ORD-125  | 10:25 AM  | ❌ Failed | 🔴 Error (503) | View |

**Performance Badge Logic:**
- 🟢 Fast: < 500ms
- 🟡 Slow: 500ms - 2s
- 🔴 Very Slow: > 2s
- 🔴 Error: Has exceptions

### 3. **Data Model Extensions**

**New Types:**
```typescript
export interface TraceInsights {
  totalDuration: number;
  spanCount: number;
  serviceBreakdown: ServiceTiming[];
  databaseOperations: DatabaseStats;
  errors: TraceError[];
  slowestService: string;
  hasRetries: boolean;
}

export interface ServiceTiming {
  serviceName: string;
  totalTime: number;
  spanCount: number;
  percentage: number;
}

export interface DatabaseStats {
  totalCalls: number;
  totalDuration: number;
  operations: { system: string; calls: number; duration: number }[];
}

export interface TraceError {
  serviceName: string;
  spanName: string;
  exceptionType: string;
  exceptionMessage: string;
  statusCode?: number;
}
```

**Extended Order Type:**
```typescript
export interface Order {
  // ... existing fields
  traceInsights?: TraceInsights; // Populated if traceId exists
  performanceBadge?: 'fast' | 'slow' | 'very-slow' | 'error';
}
```

### 4. **DQL Queries for Trace Insights**

**Query 1: Service Breakdown**
```dql
fetch spans, from: {{timestamp}} - 5m, to: {{timestamp}} + 5m
| filter trace.id == toUid("{{traceId}}")
| summarize 
    total_time = sum(duration),
    span_count = count(),
    by: {service.name}
| sort total_time desc
```

**Query 2: Error Detection**
```dql
fetch spans, from: {{timestamp}} - 5m, to: {{timestamp}} + 5m
| filter trace.id == toUid("{{traceId}}")
| filter isNotNull(exception.type)
| fields 
    service.name, 
    span.name, 
    exception.type, 
    exception.message,
    http.response.status_code
```

**Query 3: Database Operations**
```dql
fetch spans, from: {{timestamp}} - 5m, to: {{timestamp}} + 5m
| filter trace.id == toUid("{{traceId}}")
| filter isNotNull(db.statement)
| summarize 
    db_time = sum(duration),
    db_calls = count(),
    by: {db.system}
```

**Query 4: Total Trace Duration**
```dql
fetch spans, from: {{timestamp}} - 5m, to: {{timestamp}} + 5m
| filter trace.id == toUid("{{traceId}}")
| summarize 
    total_duration = max(duration),
    total_spans = count(),
    error_count = countIf(isNotNull(exception.type))
```

### 5. **Implementation Approach**

#### Phase 1: Data Layer
1. Create `useTraceInsights` hook that:
   - Takes `traceId` and `timestamp`
   - Executes DQL queries in parallel using multiple `useDql` hooks
   - Combines results into `TraceInsights` object
   - Caches results per traceId

2. Create `useOrderWithTraceInsights` hook that:
   - Extends existing order data with trace insights
   - Computes performance badge
   - Only fetches trace data when order detail is opened

#### Phase 2: UI Components
1. Create `TraceInsightsPanel` component:
   - Performance overview card
   - Service breakdown chart (use Strato HistogramChart or custom bar chart)
   - Error indicators (if present)
   - Link to full distributed trace view

2. Create `PerformanceBadge` component:
   - Small inline indicator for table view
   - Tooltip with basic stats on hover

3. Update `OrderDetailPanel`:
   - Add TraceInsightsPanel between OrderHeader and OrderItems
   - Show loading skeleton while fetching trace data
   - Handle missing trace data gracefully

#### Phase 3: Performance Optimizations
1. Lazy-load trace insights (only fetch when detail panel opens)
2. Cache trace insights in memory
3. Consider aggregating insights at order creation time (future)

### 6. **UI Component Structure**

```
OrderDetailPanel
├─ OrderHeader (existing)
├─ TraceInsightsPanel (NEW)
│  ├─ PerformanceOverviewCard
│  │  ├─ SingleValue (total duration)
│  │  ├─ HealthIndicator (error status)
│  │  └─ Stats grid (spans, db calls, errors)
│  ├─ ServiceBreakdownChart
│  │  └─ HistogramChart (horizontal bars)
│  ├─ ErrorIndicators (conditional)
│  │  └─ MessageContainer (warning/error)
│  └─ ViewFullTraceButton
├─ OrderItems (existing)
├─ ShippingInfo (existing)
└─ OrderActions (existing)
```

### 7. **Strato Components to Use**

- **Charts**: `HistogramChart` from `@dynatrace/strato-components-preview/charts`
- **Stats Display**: `SingleValue` for key metrics
- **Status Indicators**: `HealthIndicator` from `@dynatrace/strato-components-preview/content`
- **Errors**: `MessageContainer` for error display
- **Layout**: `Flex`, `Grid`, `Surface` from layouts
- **Loading**: `Skeleton`, `SkeletonText` for loading states

### 8. **Benefits**

1. **Faster Debugging**: Support teams can immediately see if an order was slow without opening traces
2. **Proactive Monitoring**: Identify patterns (e.g., "shipping service is slow today")
3. **Better UX**: No context switching for basic performance info
4. **Data-Driven**: Surface real observability data in business workflows
5. **Progressive Disclosure**: Quick insights → Full trace (if needed)

### 9. **Future Enhancements**

1. **Trace Timeline Visualization**: Mini-flame graph or waterfall chart
2. **Comparative Analysis**: Compare this order's performance to average
3. **Anomaly Detection**: Flag orders with unusual trace patterns
4. **SLO Indicators**: Show if order met performance SLOs
5. **Aggregated Insights**: Table-level performance summaries
6. **Real-time Updates**: Stream trace data as spans arrive

### 10. **Open Questions**

1. **Data Freshness**: How long after checkout is trace data available? (Investigate span ingestion lag)
2. **Missing Traces**: What % of orders have associated traces? Handle gracefully if missing
3. **Performance**: Will fetching trace data for every order detail slow down the UI? (Implement lazy loading)
4. **Sampling**: Are all traces sampled? Check `trace.is_sampled` field
5. **Security**: Any PII concerns in span attributes? (Review span data)

## Example Implementation Snippet

```typescript
// hooks/useTraceInsights.ts
export const useTraceInsights = (traceId: string | null, timestamp: string) => {
  const serviceQuery = useMemo(() => {
    if (!traceId) return null;
    return `
      fetch spans, from: "${timestamp}" - 5m, to: "${timestamp}" + 5m
      | filter trace.id == toUid("${traceId}")
      | summarize total_time = sum(duration), span_count = count(), by: {service.name}
      | sort total_time desc
    `;
  }, [traceId, timestamp]);

  const { data: serviceData, isLoading: serviceLoading } = useDql({
    query: serviceQuery,
    skip: !serviceQuery,
  });

  // ... similar for error query, db query, etc.

  const insights: TraceInsights | null = useMemo(() => {
    if (!serviceData) return null;
    
    return {
      serviceBreakdown: serviceData.records.map(r => ({
        serviceName: r['service.name'] || 'unknown',
        totalTime: r.total_time,
        spanCount: r.span_count,
        percentage: (r.total_time / maxDuration) * 100,
      })),
      // ... compute other fields
    };
  }, [serviceData, errorData, dbData]);

  return { insights, isLoading: serviceLoading };
};
```

## Summary

By extracting key performance metrics from trace data and visualizing them inline in the Order Management interface, we can:
- Reduce time-to-insight for order performance issues
- Empower support teams with observability data
- Create a tighter feedback loop between business events and technical telemetry
- Demonstrate the value of distributed tracing in business workflows

This design leverages Dynatrace's rich span data to bring observability insights directly into the app experience, making performance analysis accessible without requiring deep tracing expertise.
