# Order Management Dashboard - DQL & Data Design

**Version**: 1.0  
**Date**: January 21, 2026  
**Status**: Tested & Validated  
**Environment**: https://your_tenant.apps.dynatracelabs.com/  
**Related**: [order-management-app-design.md](./order-management-app-design.md)

---

## Overview

This document contains all tested DQL queries and data schema specifications for the Order Management Dashboard, validated against live Astroshop data.

**Key Stats** (Last 2 hours):
- 1,708 successful checkouts
- 2 failed checkouts
- 99.88% success rate
- All queries execute in <100ms

---

## Data Schema

### Event: `astroshop.web.checkout_success`

| Field | Type | Populated | Example |
|-------|------|-----------|---------|
| `timestamp` | DateTime | ✅ | `2026-01-21T11:09:05.526Z` |
| `event.type` | String | ✅ | `astroshop.web.checkout_success` |
| `orderId` | UUID | ✅ | `99a14fb8-f6b9-11f0-90a1-9a764e2aadb2` |
| `sessionId` | UUID | ✅ | `9d18db8b-5fe0-4940-94b6-b1ad18f6daf2` |
| `shippingCostTotal` | Number | ✅ | `1283.2` |
| `shippingTrackingId` | UUID | ✅ | `818c0222-37cd-4996-8bd5-6038be72c3fb` |
| `items` | JSON String | ✅ | See Items Schema below |
| `trace_id` | String | ✅ | `c5c076701f510aa0f891a59b20cd4823` |
| `email` | String | ❌ NULL | Not populated |
| `shippingAddress` | Object | ❌ NULL | Not populated |

### Event: `astroshop.web.checkout_failure`

| Field | Type | Populated | Example |
|-------|------|-----------|---------|
| `timestamp` | DateTime | ✅ | `2026-01-21T09:31:06.012Z` |
| `event.type` | String | ✅ | `astroshop.web.checkout_failure` |
| `orderId` | UUID | ❌ NULL | Order never created |
| `sessionId` | UUID | ✅ | `6046a2e2-1126-471b-91cb-d6ec07ff97f4` |
| `email` | String | ✅ | `ian@example.com` |
| `trace_id` | String | ✅ | `bfbb306e47926ecf96e24dde265a80f8` |
| `shippingCostTotal` | Number | ❌ NULL | No cost for failure |
| `items` | JSON String | ❌ NULL | No items for failure |

### Items Field Structure

**Type**: JSON String containing array of item entries

**Structure**:
```typescript
interface ItemEntry {
  cost: {
    currencyCode: string;  // "USD"
    units: number;         // Dollar amount (e.g., 101)
    nanos: number;         // Fractional cents (e.g., 959999999)
  };
  item: {
    productId: string;     // SKU
    quantity: number;      // Quantity ordered
    product: {
      id: string;
      name: string;
      description: string;
      picture: string;     // Filename
      priceUsd: {
        currencyCode: string;
        units: number;
        nanos: number;
      };
      categories: string[]; // ["telescopes", "accessories"]
    };
  };
}
```

**Example**:
```json
[{
  "cost": {
    "currencyCode": "USD",
    "units": 101,
    "nanos": 959999999
  },
  "item": {
    "productId": "OLJCESPC7Z",
    "quantity": 9,
    "product": {
      "id": "OLJCESPC7Z",
      "name": "National Park Foundation Explorascope",
      "description": "The National Park Foundation's (NPF) Explorascope...",
      "picture": "NationalParkFoundationExplorascope.jpg",
      "priceUsd": {
        "currencyCode": "USD",
        "units": 101,
        "nanos": 960000000
      },
      "categories": ["telescopes"]
    }
  }
}]
```

**Important**: `cost.units + (cost.nanos / 1_000_000_000)` = **total line item cost** (not unit price)

---

## DQL Query Library

### Q1: Master View - Orders List

**Purpose**: Fetch orders for table display

```dql
fetch bizevents
| filter event.type == "astroshop.web.checkout_success"
| fields 
    timestamp,
    orderId,
    sessionId,
    shippingCostTotal,
    shippingTrackingId,
    items,
    trace_id,
    event.type
| sort timestamp desc
| limit 100
```

**Performance**: ~50ms  
**Use Case**: Main orders table

---

### Q2: Single Order Detail

**Purpose**: Fetch complete order information

```dql
fetch bizevents
| filter event.type == "astroshop.web.checkout_success" 
  and orderId == "<ORDER_ID>"
| fields 
    timestamp,
    orderId,
    sessionId,
    shippingCostTotal,
    shippingTrackingId,
    items,
    trace_id,
    event.type
| limit 1
```

**Performance**: ~40ms  
**Use Case**: Detail panel  
**Parameters**: `<ORDER_ID>` - UUID from table row

---

### Q3: Filter by Status

**Success Orders**:
```dql
fetch bizevents
| filter event.type == "astroshop.web.checkout_success"
| fields timestamp, orderId, sessionId, shippingCostTotal, trace_id
| sort timestamp desc
| limit 100
```

**Failed Orders**:
```dql
fetch bizevents
| filter event.type == "astroshop.web.checkout_failure"
| fields timestamp, sessionId, email, trace_id
| sort timestamp desc
```

**All Orders**:
```dql
fetch bizevents
| filter event.type == "astroshop.web.checkout_success" 
  or event.type == "astroshop.web.checkout_failure"
| fields timestamp, orderId, sessionId, event.type
| sort timestamp desc
| limit 100
```

**Performance**: ~50ms  
**Use Case**: Status filter dropdown

---

### Q4: Filter by Date Range

```dql
fetch bizevents, from: now() - 24h, to: now()
| filter event.type == "astroshop.web.checkout_success"
| fields timestamp, orderId, sessionId, shippingCostTotal
| sort timestamp desc
| limit 100
```

**Performance**: ~30ms  
**Use Case**: Timeframe selector  
**Timeframe Options**:
- `now() - 1h` (Last hour)
- `now() - 2h` (Last 2 hours - default)
- `now() - 24h` (Last 24 hours)
- `now() - 7d` (Last 7 days)
- `now() - 30d` (Last 30 days)

---

### Q5: Search by Order ID

**Exact Match**:
```dql
fetch bizevents
| filter event.type == "astroshop.web.checkout_success" 
  and orderId == "<ORDER_ID>"
| fields timestamp, orderId, sessionId, shippingCostTotal
| limit 1
```

**Partial Match** (for autocomplete):
```dql
fetch bizevents
| filter event.type == "astroshop.web.checkout_success" 
  and matchesValue(orderId, "<PARTIAL_ID>*")
| fields timestamp, orderId, sessionId
| sort timestamp desc
| limit 10
```

**Performance**: ~30ms  
**Use Case**: Search bar  
**Parameters**: `<ORDER_ID>` or `<PARTIAL_ID>` - Full or partial UUID

---

### Q6: Order Statistics

```dql
fetch bizevents
| filter event.type == "astroshop.web.checkout_success" 
  or event.type == "astroshop.web.checkout_failure"
| summarize 
    totalOrders = count(),
    successfulOrders = countIf(event.type == "astroshop.web.checkout_success"),
    failedOrders = countIf(event.type == "astroshop.web.checkout_failure")
```

**Performance**: ~60ms  
**Use Case**: Statistics header  
**Example Output**:
```json
{
  "totalOrders": "1710",
  "successfulOrders": "1708",
  "failedOrders": "2"
}
```

**Success Rate Calculation**:
```typescript
const successRate = (stats.successfulOrders / stats.totalOrders) * 100;
// 99.88%
```

---

### Q7: Shipping Revenue

```dql
fetch bizevents
| filter event.type == "astroshop.web.checkout_success"
| summarize totalShippingRevenue = sum(shippingCostTotal)
```

**Performance**: ~50ms  
**Use Case**: Revenue dashboard  
**Example Output**: `{ "totalShippingRevenue": 1870432.50 }`

---

### Q8: Session to Orders Correlation

```dql
fetch bizevents
| filter sessionId == "<SESSION_ID>"
| fields timestamp, event.type, sessionId, orderId, trace_id
| sort timestamp asc
```

**Performance**: ~40ms  
**Use Case**: Customer journey timeline  
**Parameters**: `<SESSION_ID>` - UUID from order

**Example Output** (55 events in session):
```json
[
  { "timestamp": "2026-01-21T11:09:00.765Z", "event.type": "astroshop.web.cart" },
  { "timestamp": "2026-01-21T11:09:00.767Z", "event.type": "astroshop.web.currency" },
  { "timestamp": "2026-01-21T11:09:01.436Z", "event.type": "astroshop.web.recommendations" },
  { "timestamp": "2026-01-21T11:09:05.526Z", "event.type": "astroshop.web.checkout_success", "orderId": "99a14fb8..." }
]
```

---

### Q9: Failed Orders Analysis

```dql
fetch bizevents
| filter event.type == "astroshop.web.checkout_failure"
| fields timestamp, sessionId, email, trace_id
| sort timestamp desc
```

**Performance**: ~30ms  
**Use Case**: Failure investigation  
**Example Output**:
```json
[
  {
    "timestamp": "2026-01-21T09:31:06.012Z",
    "sessionId": "6046a2e2-1126-471b-91cb-d6ec07ff97f4",
    "email": "ian@example.com",
    "trace_id": "bfbb306e47926ecf96e24dde265a80f8"
  }
]
```

---

### Q10: Combined Filters

**Example**: Last 24h + Success + Order ID search

```dql
fetch bizevents, from: now() - 24h, to: now()
| filter event.type == "astroshop.web.checkout_success"
  and matchesValue(orderId, "<SEARCH_TERM>*")
| fields timestamp, orderId, sessionId, shippingCostTotal
| sort timestamp desc
| limit 100
```

**Dynamic Query Builder**:
```typescript
const buildQuery = (filters: OrderFilters): string => {
  const statusFilter = filters.status === 'all'
    ? '(event.type == "astroshop.web.checkout_success" or event.type == "astroshop.web.checkout_failure")'
    : `event.type == "astroshop.web.checkout_${filters.status}"`;
  
  const searchFilter = filters.searchTerm
    ? ` and matchesValue(orderId, "*${filters.searchTerm}*")`
    : '';
  
  return `
    fetch bizevents
    | filter ${statusFilter}${searchFilter}
    | fields timestamp, orderId, sessionId, shippingCostTotal, 
             shippingTrackingId, items, trace_id, event.type
    | sort timestamp desc
    | limit 100
  `.trim();
};
```

---

## Data Parsing

### Items JSON Parsing

```typescript
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
    console.error('Failed to parse items:', error);
    return [];
  }
};
```

### Currency Conversion

**nanos to decimal**:
```typescript
const convertToDecimal = (units: number, nanos: number): number => {
  return units + (nanos / 1_000_000_000);
};

// Example: units=101, nanos=959999999
// Result: 101.96
```

### Order Total Calculation

```typescript
const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => sum + item.lineTotal, 0);
};

const calculateGrandTotal = (items: OrderItem[], shippingCost: number): number => {
  return calculateOrderTotal(items) + shippingCost;
};
```

---

## Performance Metrics

| Query | Execution Time | Records Scanned | Status |
|-------|----------------|-----------------|--------|
| Master view | 50ms | ~1,700 | ✅ |
| Detail view | 40ms | ~1,700 | ✅ |
| Status filter | 50ms | ~1,700 | ✅ |
| Date range | 30ms | Variable | ✅ |
| Order search | 30ms | ~1,700 | ✅ |
| Statistics | 60ms | ~1,700 | ✅ |
| Session correlation | 40ms | Variable | ✅ |
| Failed orders | 30ms | 2 | ✅ |

**All queries meet <500ms target** ✅

---

## Known Limitations

### Missing Data Fields

**Not Available**:
- ❌ `email` (null in success events)
- ❌ `shippingAddress` (null everywhere)
- ❌ Country, city, state, zipCode (not populated)

**Impact**:
- Cannot filter by customer email
- Cannot filter by geographic location
- Cannot display shipping address

**Workarounds**:
1. Remove these features from UI
2. Join with other events via sessionId
3. Fix data pipeline to populate fields

### DQL Limitations

**Cannot do in DQL**:
- Parse complex nested JSON arrays
- Calculate order totals from items (do in app code)
- Full-text search (only pattern matching)

**Must do in Application**:
- Items JSON parsing
- Order total calculations
- High-value order filtering (>$5K)

---

## Query Patterns

### Pattern 1: Filter + Sort + Limit

```dql
fetch bizevents
| filter <CONDITIONS>
| fields <FIELD_LIST>
| sort timestamp desc
| limit 100
```

### Pattern 2: Aggregations

```dql
fetch bizevents
| filter <CONDITIONS>
| summarize <AGG_FUNCTIONS>, by: {<GROUP_BY>}
```

### Pattern 3: Time-Bounded Query

```dql
fetch bizevents, from: <START>, to: <END>
| filter <CONDITIONS>
| fields <FIELD_LIST>
```

### Pattern 4: Pattern Matching

```dql
fetch bizevents
| filter matchesValue(<FIELD>, "<PATTERN>*")
| fields <FIELD_LIST>
```

---

## Required Scopes

**app.config.json**:
```json
{
  "scopes": [
    { 
      "name": "storage:bizevents:read", 
      "comment": "Read business events for order data" 
    }
  ]
}
```

---

## Testing Checklist

- [x] All queries tested against live data
- [x] Performance benchmarks recorded
- [x] Schema validated and documented
- [x] Items parsing logic verified
- [x] Currency conversion tested
- [x] Edge cases identified (null fields)
- [x] Query patterns documented
- [x] Sample outputs captured

---

## Sample Data

### Successful Order
```json
{
  "timestamp": "2026-01-21T11:09:05.526000000Z",
  "orderId": "99a14fb8-f6b9-11f0-90a1-9a764e2aadb2",
  "sessionId": "9d18db8b-5fe0-4940-94b6-b1ad18f6daf2",
  "email": null,
  "shippingAddress": null,
  "shippingCostTotal": 1283.2,
  "shippingTrackingId": "818c0222-37cd-4996-8bd5-6038be72c3fb",
  "items": "[{...}]",
  "trace_id": "c5c076701f510aa0f891a59b20cd4823",
  "event.type": "astroshop.web.checkout_success"
}
```

### Failed Order
```json
{
  "timestamp": "2026-01-21T09:31:06.012000000Z",
  "orderId": null,
  "sessionId": "6046a2e2-1126-471b-91cb-d6ec07ff97f4",
  "email": "ian@example.com",
  "shippingAddress": null,
  "shippingCostTotal": null,
  "items": null,
  "trace_id": "bfbb306e47926ecf96e24dde265a80f8",
  "event.type": "astroshop.web.checkout_failure"
}
```

---

**Document Owner**: Engineering Team  
**Last Updated**: January 21, 2026  
**Status**: Tested & Validated  
**Testing Date**: January 21, 2026 11:08-11:11 UTC
