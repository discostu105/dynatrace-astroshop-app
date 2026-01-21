# Order Management Dashboard - Application & UI Design

**Version**: 1.0  
**Date**: January 21, 2026  
**Status**: Ready for Implementation  
**Related**: [order-management-dql-design.md](./order-management-dql-design.md)

---

## Overview

The Order Management Dashboard provides operations teams with an interactive master/detail interface for investigating Astroshop orders. It reduces incident resolution time from **5+ minutes to <30 seconds** through contextual drill-down.

**Key Features**:
- Fast order lookup by ID, date, or status
- Rich order inspection with parsed product details
- Direct trace and session journey integration
- Interactive filtering and search

---

## Application Architecture

### Component Hierarchy

```
OrderManagementPage
├── OrderHeader
│   └── OrderStatistics (count, success rate)
│
├── OrderFilters
│   ├── TimeframeSelector
│   ├── StatusFilter (Success/Failure/All)
│   └── SearchBar (Order ID)
│
├── OrdersTable (Master View)
│   ├── Column: Status
│   ├── Column: Order ID
│   ├── Column: Timestamp
│   ├── Column: Session ID
│   ├── Column: Shipping Cost
│   ├── Column: Tracking ID
│   └── Column: Actions
│
└── OrderDetailPanel (Detail View - Conditional)
    ├── OrderSummary (IDs, timestamp, status)
    ├── OrderItems (parsed product list)
    ├── ShippingInfo (cost, tracking)
    └── RelatedActions (trace, journey, export)
```

### Data Flow

```
User Interaction → Filter State Update → DQL Query (useDql) 
→ Grail Business Events → Data Transformation → UI Rendering
→ User Clicks Row → Detail Panel Opens → Second Query
```

### State Management

```typescript
interface OrderManagementState {
  // Filter state
  filters: {
    timeframe: { from: Date; to: Date };
    status: 'all' | 'success' | 'failure';
    searchTerm: string;  // Order ID only
  };
  
  // Selection state
  selectedOrderId: string | null;
  
  // UI state
  isDetailPanelOpen: boolean;
}
```

### Technology Stack

- **UI Framework**: React with TypeScript
- **Components**: Strato Design System
  - `@dynatrace/strato-components-preview/tables` - DataTable
  - `@dynatrace/strato-components-preview/filters` - FilterBar, TimeframeSelector
  - `@dynatrace/strato-components/layouts` - Flex, Surface
  - `@dynatrace/strato-components/typography` - Heading, Text
- **Data Fetching**: `@dynatrace-sdk/react-hooks` - useDql
- **Date Formatting**: `@dynatrace-sdk/units`

---

## User Interface Design

### Master View: Orders Table

**Columns**:

| Column | Width | Type | Description |
|--------|-------|------|-------------|
| Status | 60px | Icon | ✅ Success / ❌ Failure |
| Order ID | 180px | Text | UUID with copy button |
| Timestamp | 180px | DateTime | Relative + absolute tooltip |
| Session ID | 180px | Text | UUID (clickable for journey) |
| Shipping Cost | 120px | Currency | Formatted USD |
| Tracking ID | 180px | Text | UUID (clickable to copy) |
| Actions | 80px | Button | View detail button |

**Interactions**:
- **Click row**: Opens detail panel (table 60%, panel 40%)
- **Hover row**: Subtle highlight
- **Click Order ID**: Copy to clipboard
- **Click Session ID**: Navigate to journey view
- **Timestamp**: Show absolute time in tooltip

**Empty State**:
```
┌─────────────────────────────────────┐
│   🔍 No orders found                │
│   Try adjusting your filters        │
└─────────────────────────────────────┘
```

**Loading State**:
```
┌─────────────────────────────────────┐
│   ⏳ Loading orders...              │
│   [ProgressBar]                     │
└─────────────────────────────────────┘
```

### Detail View: Order Panel

**Layout**: Right-side panel with sections

```
╔══════════════════════════════════════════════════╗
║  ORDER DETAILS                     [×] Close     ║
╠══════════════════════════════════════════════════╣
║  Order ID: 99a14fb8-f6b9-11f0-90a1-9a764e2aadb2  ║
║  Status: ✅ Success                              ║
║  Created: Jan 21, 2026 11:09:05 (2 min ago)     ║
║  Session: 9d18db8b-5fe0-4940-94b6-b1ad18f6daf2  ║
╟──────────────────────────────────────────────────╢
║  📦 ORDER ITEMS (4 products, 32 items)          ║
║  ┌────────────────────────────────────────────┐ ║
║  │ [🔭] National Park Foundation Explorascope │ ║
║  │      SKU: OLJCESPC7Z                   ×9 │ ║
║  │      Unit: $101.96 | Total: $917.64       │ ║
║  ├────────────────────────────────────────────┤ ║
║  │ [🌞] Solar Filter                      ×10 │ ║
║  │      SKU: 6E92ZMYYFZ                      │ ║
║  │      Unit: $69.95 | Total: $699.50        │ ║
║  └────────────────────────────────────────────┘ ║
║                                                  ║
║  Subtotal: $1,617.14                            ║
║  Shipping: $1,283.20                            ║
║  Total: $2,900.34 USD                           ║
╟──────────────────────────────────────────────────╢
║  🚚 SHIPPING                                     ║
║     Tracking: 818c0222-37cd-4996-8bd5-6038...   ║
║     Cost: $1,283.20 USD                         ║
╟──────────────────────────────────────────────────╢
║  🔗 RELATED                                      ║
║     Session: 55 events                          ║
║     Trace: c5c076701f510aa0f891a59b20cd4823    ║
║                                                  ║
║  [📊 View Trace]  [🧭 View Journey]             ║
║  [📥 Export JSON] [📋 Copy Order ID]            ║
╚══════════════════════════════════════════════════╝
```

### Filter Bar

```
┌────────────────────────────────────────────────────┐
│ [📅 Last 2 hours ▼] [Status: All ▼]              │
│ [🔍 Search by Order ID...]                        │
│                                                    │
│ Showing 1,708 orders • 99.88% success rate        │
└────────────────────────────────────────────────────┘
```

**Filter Options**:
- **Timeframe**: Last 1h, 2h, 24h, 7d, 30d, Custom
- **Status**: All, Success, Failure
- **Search**: Order ID (exact or partial match)

---

## Component Implementation

### File Structure

```
ui/app/pages/OrderManagement/
├── OrderManagementPage.tsx
├── components/
│   ├── OrderHeader.tsx
│   ├── OrderFilters.tsx
│   ├── OrdersTable.tsx
│   ├── OrderDetailPanel.tsx
│   ├── OrderItems.tsx
│   ├── ShippingInfo.tsx
│   └── OrderActions.tsx
├── hooks/
│   ├── useOrders.ts
│   ├── useOrderDetail.ts
│   └── useOrderFilters.ts
├── utils/
│   ├── parseOrderItems.ts
│   ├── formatCurrency.ts
│   └── calculateOrderTotal.ts
└── types/
    └── order.types.ts
```

### Type Definitions

**`types/order.types.ts`**:
```typescript
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
```

### Custom Hooks

**`hooks/useOrders.ts`**:
```typescript
import { useDql } from '@dynatrace-sdk/react-hooks';
import { useMemo } from 'react';
import type { Order, OrderFilters } from '../types/order.types';

export const useOrders = (filters: OrderFilters) => {
  // Build query based on filters
  const query = useMemo(() => {
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
  }, [filters]);

  const { data, isLoading, error } = useDql({
    query,
    requestOptions: {
      from: filters.timeframe.from,
      to: filters.timeframe.to,
    },
  });

  const orders: Order[] = useMemo(() => {
    if (!data?.records) return [];
    return data.records.map(record => ({
      ...record,
      eventType: record['event.type'],
      traceId: record.trace_id,
    }));
  }, [data]);

  return { orders, isLoading, error };
};
```

**`hooks/useOrderDetail.ts`**:
```typescript
import { useDql } from '@dynatrace-sdk/react-hooks';
import { useMemo } from 'react';
import { parseOrderItems } from '../utils/parseOrderItems';
import type { Order, OrderItem } from '../types/order.types';

export const useOrderDetail = (orderId: string | null) => {
  const query = orderId
    ? `fetch bizevents
       | filter (event.type == "astroshop.web.checkout_success" or event.type == "astroshop.web.checkout_failure")
         and orderId == "${orderId}"
       | fields timestamp, orderId, sessionId, shippingCostTotal, 
                shippingTrackingId, items, trace_id, event.type
       | limit 1`
    : null;

  const { data, isLoading, error } = useDql({
    query: query || '',
    skip: !query,
  });

  const orderWithItems = useMemo(() => {
    if (!data?.records?.[0]) return null;
    
    const record = data.records[0];
    const parsedItems = parseOrderItems(record.items);
    
    return {
      order: {
        ...record,
        eventType: record['event.type'],
        traceId: record.trace_id,
      } as Order,
      items: parsedItems,
    };
  }, [data]);

  return { orderWithItems, isLoading, error };
};
```

### Utility Functions

**`utils/parseOrderItems.ts`**:
```typescript
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
    return entries.map(entry => ({
      productId: entry.item.productId,
      name: entry.item.product.name,
      description: entry.item.product.description,
      picture: entry.item.product.picture,
      quantity: entry.item.quantity,
      unitPrice: entry.item.product.priceUsd.units + 
                 (entry.item.product.priceUsd.nanos / 1_000_000_000),
      lineTotal: entry.cost.units + (entry.cost.nanos / 1_000_000_000),
      currency: entry.cost.currencyCode,
      categories: entry.item.product.categories,
    }));
  } catch (error) {
    console.error('Failed to parse order items:', error);
    return [];
  }
};
```

**`utils/calculateOrderTotal.ts`**:
```typescript
import type { OrderItem } from '../types/order.types';

export const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => sum + item.lineTotal, 0);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
```

---

## Component Examples

### OrdersTable Component

```typescript
import { DataTable } from '@dynatrace/strato-components-preview/tables';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import type { Order } from '../types/order.types';

interface OrdersTableProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
  isLoading: boolean;
}

export const OrdersTable = ({ orders, onSelectOrder, isLoading }: OrdersTableProps) => {
  const columns = [
    {
      id: 'status',
      header: 'Status',
      accessor: (row: Order) => 
        row.eventType.includes('success') ? '✅' : '❌',
      minWidth: 60,
    },
    {
      id: 'orderId',
      header: 'Order ID',
      accessor: 'orderId',
      cell: ({ value }) => (
        <Text onClick={() => navigator.clipboard.writeText(value)}>
          {value.substring(0, 12)}...
        </Text>
      ),
    },
    {
      id: 'timestamp',
      header: 'Timestamp',
      accessor: 'timestamp',
      cell: ({ value }) => formatRelativeTime(value),
    },
    {
      id: 'sessionId',
      header: 'Session ID',
      accessor: 'sessionId',
      cell: ({ value }) => value.substring(0, 12) + '...',
    },
    {
      id: 'shippingCost',
      header: 'Shipping Cost',
      accessor: 'shippingCostTotal',
      cell: ({ value }) => formatCurrency(value),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button onClick={() => onSelectOrder(row.orderId)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      loading={isLoading}
    />
  );
};
```

### OrderDetailPanel Component

```typescript
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { OrderItems } from './OrderItems';
import { ShippingInfo } from './ShippingInfo';
import type { Order, OrderItem } from '../types/order.types';

interface OrderDetailPanelProps {
  order: Order;
  items: OrderItem[];
  onClose: () => void;
}

export const OrderDetailPanel = ({ order, items, onClose }: OrderDetailPanelProps) => {
  const subtotal = calculateOrderTotal(items);
  const total = subtotal + order.shippingCostTotal;
  
  return (
    <Flex flexDirection="column" gap={16}>
      <Flex justifyContent="space-between">
        <Heading level={3}>Order Details</Heading>
        <Button variant="ghost" onClick={onClose}>×</Button>
      </Flex>
      
      <Flex flexDirection="column" gap={8}>
        <Text>Order ID: {order.orderId}</Text>
        <Text>Status: {order.eventType.includes('success') ? '✅ Success' : '❌ Failure'}</Text>
        <Text>Created: {formatTimestamp(order.timestamp)}</Text>
        <Text>Session: {order.sessionId}</Text>
      </Flex>
      
      <OrderItems items={items} />
      
      <Flex flexDirection="column" gap={4}>
        <Text>Subtotal: {formatCurrency(subtotal)}</Text>
        <Text>Shipping: {formatCurrency(order.shippingCostTotal)}</Text>
        <Text weight="bold">Total: {formatCurrency(total)}</Text>
      </Flex>
      
      <ShippingInfo 
        trackingId={order.shippingTrackingId}
        cost={order.shippingCostTotal}
      />
      
      <Flex gap={8}>
        <Button onClick={() => openTrace(order.traceId)}>
          View Trace
        </Button>
        <Button onClick={() => openJourney(order.sessionId)}>
          View Journey
        </Button>
      </Flex>
    </Flex>
  );
};
```

---

## Integration Points

### Deep Link to Distributed Trace

```typescript
const openTrace = (traceId: string) => {
  const traceUrl = `/ui/diagnostictools/purepaths?gtf=-2h&gf=all&trace=${traceId}`;
  window.open(traceUrl, '_blank');
};
```

### Navigate to Customer Journey

```typescript
const openJourney = (sessionId: string) => {
  // Navigate to Customer Journey page (if implemented)
  navigate(`/customer-journey?sessionId=${sessionId}`);
};
```

---

## Error Handling

### Query Error
```typescript
if (error) {
  return (
    <MessageContainer type="error">
      <Strong>Failed to load orders</Strong>
      <Paragraph>{error.message}</Paragraph>
      <Button onClick={retry}>Retry</Button>
    </MessageContainer>
  );
}
```

### Empty State
```typescript
if (!isLoading && orders.length === 0) {
  return (
    <MessageContainer type="info">
      <Strong>No orders found</Strong>
      <Paragraph>Try adjusting your filters or time range.</Paragraph>
    </MessageContainer>
  );
}
```

### Parsing Errors
```typescript
const parseOrderItems = (itemsJson: string): OrderItem[] => {
  try {
    const items = JSON.parse(itemsJson);
    if (!Array.isArray(items)) {
      console.warn('Items is not an array:', items);
      return [];
    }
    return items.map(transformItem);
  } catch (error) {
    console.error('Failed to parse order items:', error);
    return [];
  }
};
```

---

## Performance Optimization

### Query Caching
```typescript
const { data } = useDql({
  query,
  staleTime: 30_000, // Cache for 30 seconds
});
```

### Debounced Search
```typescript
import { useDebouncedValue } from '@dynatrace/strato-components-preview/hooks';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebouncedValue(searchTerm, 300);
```

### Virtual Scrolling
```typescript
// For large datasets, use DataTable with virtualization
<DataTable
  data={orders}
  columns={columns}
  virtualized
  rowHeight={48}
/>
```

---

## Required Configuration

### app.config.json

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

## Development Roadmap

### Week 1: Core Implementation
- [ ] Day 1-2: Set up page structure, routing, basic table
- [ ] Day 3: Implement filters (status, date, search)
- [ ] Day 4: Build detail panel with items parsing
- [ ] Day 5: Add trace/journey integration, testing

### Week 2: Polish & Enhancement
- [ ] Error handling and loading states
- [ ] Performance optimization
- [ ] User acceptance testing
- [ ] Documentation

---

**Document Owner**: Engineering Team  
**Last Updated**: January 21, 2026  
**Status**: Ready for Implementation
![alt text](image.png)