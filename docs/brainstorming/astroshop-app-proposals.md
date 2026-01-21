# Astroshop Domain-Specific Dynatrace App Proposals

**Date**: January 21, 2026  
**Context**: Exploring domain-specific use cases for Astroshop (telescope & astronomy equipment e-commerce)

## Executive Summary

Astroshop generates rich observability data across **8 business event types**, **13 microservices**, and serves **1,677 orders with $1.87M in shipping revenue** (last 2 hours). The data includes complete order details with product information, customer addresses, shipping tracking, and distributed traces.

This document outlines use cases where a **custom Dynatrace App** provides significant value over standard dashboards through interactive master/detail views, custom visualizations, and advanced business logic.

---

## 📊 Available Data Sources

### Business Events (via `fetch bizevents`)
| Event Type | Count | Description |
|------------|-------|-------------|
| `astroshop.web.recommendations` | 32,649 | Product recommendation views |
| `astroshop.web.cart` | 26,916 | Shopping cart interactions |
| `astroshop.web.products` | 11,067 | Product page views |
| `astroshop.web.currency` | 5,854 | Currency selection changes |
| `astroshop.web.home` | 2,056 | Homepage visits |
| `astroshop.web.checkout_success` | 1,682 | Successful checkouts |
| `astroshop.web.checkout.orderSummary` | 885 | Checkout summary views |
| `astroshop.web.checkout_failure` | 2 | Failed checkout attempts |

### Key Services (via `fetch spans`)
- **Frontend** (1M+ spans) - Next.js user-facing app
- **Recommendation** (49K) - ML-based product recommendations
- **Cart** (45K) - Redis-backed shopping cart
- **Image Provider** (38K) - Product image delivery
- **Payment** (893) - Payment processing
- **Fraud Detection** (1.8K) - Order fraud checks
- **Accounting** (890) - Order processing and bookkeeping
- **Shipping** (14K) - Shipping quotes and logistics

### Sample Products
- Telescopes: "Optical Tube Assembly" ($3,599), "Eclipsmart Travel Refractor" ($129.95)
- Accessories: "Lens Cleaning Kit" ($21.95), "Red Flashlight" ($57.80), "Solar Filter"

---

## 🎯 Use Cases Requiring Custom Apps

### 1. Order Management Dashboard ⭐⭐⭐ **HIGHEST PRIORITY**

#### Why Custom App is Essential
Standard dashboards cannot provide the interactive master/detail experience needed for order investigation.

#### Features

**Master View**: Scrollable orders table
- Order ID, timestamp, customer email, total amount
- Status indicators (success/failure)
- Country flags, currency icons
- Search by order ID, customer, product name
- Filter by date range, status, location

**Detail View**: Rich order inspection (on row click)
```
┌─────────────────────────────────────────┐
│ Order Details: fbf2bd40-f6a5-11f0...    │
├─────────────────────────────────────────┤
│ 👤 Customer Information                 │
│    hannah@example.com                   │
│    1 Hacker Way, Menlo Park, CA 94025  │
│                                         │
│ 📦 Order Items                          │
│    [Product Images]                     │
│    • Optical Tube Assembly (4x) $3,599 │
│    • Lens Cleaning Kit (2x) $21.95     │
│                                         │
│ 🚚 Shipping                             │
│    Tracking: 44455e2f-4a3e-4d45-...    │
│    Cost: $175.20 (USD)                 │
│                                         │
│ 💳 Payment                              │
│    Card: •••• 0005 (Amex)              │
│                                         │
│ [View Distributed Trace] [View Session]│
└─────────────────────────────────────────┘
```

**Advanced Capabilities**:
- Parse `items` JSON field (complex nested structure)
- Calculate order totals from line items
- Display product images from image-provider service
- Direct integration with Dynatrace trace viewer
- Export to CSV for reporting
- Flag high-value orders (>$5K)
- Show currency conversions

**DQL Query**:
```dql
fetch bizevents 
| filter event.type == "astroshop.web.checkout_success"
| fields timestamp, orderId, email, 
         shippingAddress.city, shippingAddress.state, shippingAddress.country,
         shippingCostTotal, shippingTrackingId, items, trace_id
| sort timestamp desc
| limit 100
```

**Why Dashboard Can't Do This**:
- ❌ No master/detail interaction
- ❌ Can't parse complex JSON fields
- ❌ Can't maintain selection state
- ❌ No deep linking to traces with context
- ❌ Limited formatting/styling options

---

### 2. Customer Journey Timeline Viewer ⭐⭐⭐ **HIGH VALUE**

#### Why Custom App is Essential
Requires stateful, interactive timeline visualization with drill-down capabilities.

#### Features

**Session Explorer** (Master View):
- List of recent sessions with key metrics
- Session duration, events count, outcome (purchase/abandonment)
- Filter by outcome, date, user characteristics

**Timeline Visualization** (Detail View):
```
Session: eed3181b-e0a2-493e-bd2f-48074f7e48d0

🏠 Home View           ━━━━━━➤  📦 Product View      ━━━━━━➤
   10:40:29 (2s)                  10:40:31 (5s)
                                  Optical Tube Assembly
                                  
💡 Recommendations    ━━━━━━➤  🛒 Cart Add         ━━━━━━➤
   10:40:36 (3s)                  10:40:39 (8s)
   Showed 4 items                 +1 item
   
💵 Currency Change    ━━━━━━➤  ✅ Checkout Success
   10:40:47 (1s)                  10:40:48
   USD → EUR                      Order: fbf2bd40...
```

**Interactive Features**:
- Click event → Show full bizevent details
- Hover → Show duration and metrics
- Click "View Trace" → Open distributed trace for that event
- Highlight errors in red
- Show cart contents changes
- Display product thumbnails

**Session Insights**:
- Time to purchase
- Products viewed vs. purchased
- Recommendation effectiveness
- Points of friction (long delays)
- Error impact on conversion

**Why Dashboard Can't Do This**:
- ❌ No custom timeline visualization
- ❌ Can't aggregate events by session
- ❌ No hover/click interactions
- ❌ Can't show state changes (cart contents)

---

### 3. Product Catalog Health Monitor ⭐⭐ **GOOD VALUE**

#### Why Custom App is Valuable
Interactive product cards with computed health metrics and error correlation.

#### Features

**Product Grid View**:
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 🔭           │ │ 🔬           │ │ 🔦           │
│ Optical Tube │ │ Lens Kit     │ │ Red Flash.   │
│ Assembly     │ │              │ │              │
│ $3,599       │ │ $21.95       │ │ $57.80       │
│ 🟢 Healthy   │ │ 🔴 Errors!   │ │ 🟢 Healthy   │
│ 234 views    │ │ 66 errors    │ │ 189 views    │
│ ▁▂▃▅▇▃▂▁     │ │ ▁▂█▇▅▃▂▁     │ │ ▁▂▃▄▅▃▂▁     │
└──────────────┘ └──────────────┘ └──────────────┘
```

**Product Detail Panel** (on click):
- **Conversion Funnel**:
  - Views → Cart Adds → Purchases
  - Conversion rate calculation
- **Error Analysis**:
  - Recent errors by type
  - "impossible to get product for id X" (463 occurrences!)
  - Affected sessions and users
- **Performance Metrics**:
  - Image load times
  - API response times
  - Recommendation impressions

**Health Score Algorithm**:
```javascript
healthScore = (
  (views / avgViews) * 0.3 +
  (1 - errorRate) * 0.4 +
  (conversionRate / avgConversion) * 0.3
)
```

**Smart Alerts**:
- 🔴 Red: >10% error rate OR declining views >50%
- 🟡 Yellow: 5-10% error rate OR declining views >25%
- 🟢 Green: <5% error rate AND stable/growing views

**Why Dashboard Can't Do This**:
- ❌ No custom card-based layout
- ❌ Can't compute derived health scores
- ❌ Limited styling for visual indicators
- ❌ No drill-down to related data

---

### 4. Checkout Funnel with Failure Analysis ⭐⭐ **INVESTIGATIVE VALUE**

#### Why Custom App is Valuable
Interactive funnel with deep drill-down into individual failures.

#### Features

**Funnel Visualization**:
```
  Product Views
  ┌─────────────┐
  │   11,067    │
  └──────┬──────┘
         │ 36% drop
  Cart Adds
  ┌──────────┐
  │   4,010  │
  └────┬─────┘
       │ 78% drop
  Checkout Start
  ┌────────┐
  │   885  │
  └───┬────┘
      │ +90% proceed!
  ┌───▼─────┐
  │ Success │  Failure
  │  1,682  │    2
  └─────────┘
```

**Interactive Features**:
- Click any stage → Drill into sessions at that stage
- Click "Failure" → Show the 2 failed checkouts with full context
- Compare successful vs. failed cohorts

**Failure Investigation Panel**:
```
❌ Checkout Failure #1
   Session: 6046a2e2-1126-471b-91cb-d6ec07ff97f4
   Customer: ian@example.com
   Error: HTTP 500
   Time: 2026-01-21T09:31:06
   
   Cart Contents:
   • Product unavailable in catalog
   
   [View Full Session] [View Trace] [View Logs]
```

**Cohort Analysis**:
- Success rate by geography
- Product categories with highest abandonment
- Payment method failure rates
- Fraud detection correlation

**Why Dashboard Can't Do This**:
- ❌ No interactive funnel builder
- ❌ Can't drill into individual sessions
- ❌ No side-by-side comparison
- ❌ Limited context preservation

---

### 5. Fraud Detection Monitor ⭐ **SECURITY VALUE**

#### Why Custom App is Valuable
Real-time monitoring with intelligent alerting and investigation workflow.

#### Features

**Real-Time Orders Feed**:
- Streaming view of orders as they come in
- Fraud score badges (from fraud-detection service)
- Auto-highlight suspicious patterns

**Risk Indicators**:
- 🔴 High Risk: Unusual shipping location, high value, new customer
- 🟡 Medium Risk: Velocity alerts, multiple cards tried
- 🟢 Low Risk: Returning customer, normal patterns

**Investigation Workflow**:
1. Order flagged by fraud service
2. Click → Show full order details
3. View customer history (past orders)
4. See fraud service spans and decision logic
5. Manual override option

**Why Dashboard Can't Do This**:
- ❌ No streaming/real-time updates
- ❌ Can't implement custom risk algorithms
- ❌ No investigation workflow

---

## 📊 Use Cases That Work as Dashboards

These **don't require** a custom app:

### Simple Metrics & Charts
- **Revenue Tracking**: Time series of orders and revenue
- **Service Health**: Standard service monitoring (latency, errors, throughput)
- **Error Rates**: Log analysis with filters and aggregations
- **Conversion Rates**: Simple calculated metrics

**Example Dashboard Tiles**:
```dql
// Total orders
fetch bizevents 
| filter event.type == "astroshop.web.checkout_success"
| summarize count()

// Checkout success rate over time
fetch bizevents 
| filter contains(event.type, "checkout")
| makeTimeseries 
    success = countIf(event.type == "astroshop.web.checkout_success"),
    failure = countIf(event.type == "astroshop.web.checkout_failure"),
    interval:5m
    
// Top countries by orders
fetch bizevents 
| filter event.type == "astroshop.web.checkout_success"
| summarize order_count = count(), by:{shippingAddress.country}
| sort order_count desc
```

---

## 🏗️ Implementation Roadmap

### Phase 1: Order Management (Week 1)
**Effort**: 1-2 days  
**Priority**: ⭐⭐⭐

**Components to Build**:
- `OrdersTable` component (master view)
- `OrderDetail` component (detail panel)
- `useDql` hook for fetching orders
- JSON parsing utilities for `items` field
- Trace integration helper

**Key Technologies**:
- `@dynatrace/strato-components-preview/tables` - DataTable
- `@dynatrace/strato-components/layouts` - Flex, Surface
- `@dynatrace-sdk/react-hooks` - useDql
- Custom JSON parser for nested items structure

### Phase 2: Customer Journey Timeline (Week 2)
**Effort**: 2-3 days  
**Priority**: ⭐⭐

**Components to Build**:
- `SessionExplorer` component
- `TimelineVisualization` component (custom SVG)
- Session event aggregation logic
- Timeline event cards

### Phase 3: Product Health Monitor (Week 3)
**Effort**: 1-2 days  
**Priority**: ⭐⭐

**Components to Build**:
- `ProductGrid` component
- `ProductCard` with health indicators
- Health score calculation algorithm
- Error correlation logic

---

## 💡 The Killer Demo Story

**Title**: "From Business Event to Root Cause in 30 Seconds"

### Setup
Operations team notices: **"2 checkout failures in last 2 hours"** on standard dashboard.

### Investigation Flow

**1. Standard Dashboard** (Starting Point)
```
⚠️ Alert: 2 Checkout Failures
   Last 2 hours
   Error rate: 0.12%
```

**2. Switch to Astroshop App → Order Management**
```
Orders List (showing failed order):
❌ Failed | 09:31:06 | ian@example.com | $0.00
```

**3. Click Failed Order → Detail Panel Opens**
```
┌─────────────────────────────────────────┐
│ ❌ Failed Order Details                 │
├─────────────────────────────────────────┤
│ Customer: ian@example.com               │
│ Session: 6046a2e2-1126-471b...          │
│ Error: HTTP 500 - Internal Server Error │
│                                         │
│ Cart Contents:                          │
│ • Product ID: L9ECAV7KIM               │
│   ⚠️ Product catalog error              │
│                                         │
│ [View Customer Journey] [View Trace]    │
└─────────────────────────────────────────┘
```

**4. Click "View Customer Journey"**
```
Session Timeline:
🏠 Home → 📦 Products → 🛒 Cart → ❌ Checkout Failed
                                      ↑
                              Error: Product unavailable
```

**5. Click "View Trace"** → Opens distributed trace
```
Frontend → Product Catalog Service
              ↓ [500 Error]
          "impossible to get product for id L9ECAV7KIM"
```

**6. Cross-reference with Product Health Monitor**
```
Product: Lens Cleaning Kit (L9ECAV7KIM)
🔴 Status: DEGRADED
   66 errors in last hour
   "impossible to get product" - backend database issue
```

### Result
**Root Cause Identified**: Product catalog database outage affecting multiple products.

**Business Impact Quantified**:
- 2 failed checkouts = ~$100 lost revenue
- 66 product view errors = potential for more failures
- Affects 6% of product catalog

**Action Taken**: Alert backend team, temporarily hide affected products from catalog.

### Why This Required a Custom App
- ✅ Master/detail navigation preserved context
- ✅ Parsed complex nested JSON (cart items)
- ✅ Linked business event → session → trace → root cause
- ✅ Cross-referenced with product health data
- ✅ Rich UI with images, formatting, context

**This investigation flow is IMPOSSIBLE with dashboards alone.**

---

## 📋 Technical Architecture

### Data Flow
```
Dynatrace Grail (Bizevents, Spans, Logs)
    ↓
DQL Queries (via useDql hook)
    ↓
React Components (Strato Design System)
    ↓
User Interactions → State Management
    ↓
Detail Views & Drill-Down
    ↓
Dynatrace Platform Integration (Traces, Entities)
```

### Key Dependencies
- `@dynatrace/strato-components[-preview]` - UI components
- `@dynatrace-sdk/react-hooks` - Data fetching (useDql)
- `@dynatrace-sdk/client-query` - Direct query client
- `@dynatrace-sdk/app-environment` - Platform integration
- Custom parsers for business event JSON fields

### DQL Query Patterns

**Orders with Full Context**:
```dql
fetch bizevents 
| filter event.type == "astroshop.web.checkout_success"
| fields timestamp, orderId, sessionId, email, 
         shippingAddress.city, shippingAddress.state, 
         shippingAddress.country, shippingCostTotal, 
         shippingTrackingId, items, trace_id
| sort timestamp desc
| limit 100
```

**Session Events for Timeline**:
```dql
fetch bizevents
| filter sessionId == "eed3181b-e0a2-493e-bd2f-48074f7e48d0"
| sort timestamp asc
| fields timestamp, event.type, url.path, trace_id
```

**Product Health Metrics**:
```dql
fetch bizevents
| filter event.type == "astroshop.web.products"
| summarize views = count()
| join [
    fetch logs
    | filter loglevel == "ERROR" 
      and contains(content, "impossible to get product")
    | summarize errors = count()
  ]
```

---

## 🎯 Success Metrics

### User Experience
- Time to identify failed order root cause: **<30 seconds** (vs. 5+ minutes with dashboards)
- Context switches reduced: **80%** (stay in one app)
- User satisfaction: Target **9/10** from ops team

### Business Impact
- Faster incident resolution: **70% reduction** in MTTR
- Revenue protection: Identify and fix issues before more customers affected
- Customer satisfaction: Proactive issue resolution

### Technical Metrics
- App load time: <2 seconds
- Query performance: <500ms for order list
- Real-time updates: <5 second latency

---

## 📝 Next Steps

1. **Validate with Stakeholders**: Review proposals with ops, product, and engineering teams
2. **Prioritize Phase 1**: Get buy-in for Order Management as MVP
3. **Design Review**: UI/UX mockups for master/detail patterns
4. **Development Sprint 1**: Build Order Management (2 days)
5. **User Testing**: Ops team validation with real incidents
6. **Iterate & Expand**: Add Customer Journey Timeline in Phase 2

---

## 🔗 Related Resources

- [Astroshop Data Exploration](./astroshop-data-exploration.md) (if created)
- [Dynatrace App Toolkit Documentation](https://dt-url.net/app-toolkit)
- [Strato Design System](https://dt-url.net/strato)
- [DQL Documentation](https://dt-url.net/dql)

---

**Document Owner**: Engineering Team  
**Last Updated**: January 21, 2026  
**Status**: Proposal - Awaiting Approval
