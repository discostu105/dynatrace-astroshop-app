import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { TextInput } from "@dynatrace/strato-components-preview/forms";
import { Select } from "@dynatrace/strato-components-preview/forms";
import { Button } from "@dynatrace/strato-components/buttons";
import type {
  Activity,
  ActivityType,
  GroupBy,
  SortOrder,
} from "../ActivityTimeline.const";
import {
  MOCK_ACTIVITIES,
  ACTIVITY_TYPE_LABELS,
} from "../ActivityTimeline.const";

interface ActivityFiltersProps {
  searchQuery: string;
  activityType: ActivityType | "all";
  userId: string;
  dateRange:
    | "today"
    | "yesterday"
    | "last7days"
    | "last30days"
    | "thisMonth"
    | "custom";
  groupBy: GroupBy;
  sortOrder: SortOrder;
  filteredCount: number;
  totalCount: number;
  onSearchChange: (query: string) => void;
  onActivityTypeChange: (type: ActivityType | "all") => void;
  onUserIdChange: (userId: string) => void;
  onDateRangeChange: (
    range:
      | "today"
      | "yesterday"
      | "last7days"
      | "last30days"
      | "thisMonth"
      | "custom",
  ) => void;
  onGroupByChange: (groupBy: GroupBy) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onClearFilters: () => void;
}

export const ActivityFilters = ({
  searchQuery,
  activityType,
  userId,
  dateRange,
  groupBy,
  sortOrder,
  filteredCount,
  totalCount,
  onSearchChange,
  onActivityTypeChange,
  onUserIdChange,
  onDateRangeChange,
  onGroupByChange,
  onSortOrderChange,
  onClearFilters,
}: ActivityFiltersProps) => {
  const activityTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: totalCount };
    (MOCK_ACTIVITIES as Activity[]).forEach((activity) => {
      counts[activity.type] = (counts[activity.type] || 0) + 1;
    });
    return counts;
  }, [totalCount]);

  const uniqueUsers = React.useMemo(() => {
    const users = new Map<string, string>();
    (MOCK_ACTIVITIES as Activity[]).forEach((activity) => {
      if (!users.has(activity.userId)) {
        users.set(activity.userId, activity.userName);
      }
    });
    return Array.from(users.entries());
  }, []);

  return (
    <Flex
      flexDirection="column"
      gap={12}
      style={{
        padding: "12px 24px",
        backgroundColor: "var(--dt-colors-background-container-default)",
        borderBottom: "1px solid var(--dt-colors-border-neutral-default)",
      }}
    >
      {/* First row: Search and Info */}
      <Flex alignItems="center" gap={12}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <TextInput
            placeholder="🔍 Search activities..."
            value={searchQuery}
            onChange={(value) => onSearchChange(value)}
            style={{ width: "100%" }}
          />
        </div>
        <div
          style={{ fontSize: "12px", color: "var(--dt-colors-text-secondary)" }}
        >
          Showing {filteredCount} of {totalCount} activities
        </div>
      </Flex>

      {/* Second row: Activity type tabs */}
      <Flex alignItems="center" gap={8} flexWrap="wrap">
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--dt-colors-text-secondary)",
            minWidth: "60px",
          }}
        >
          Types:
        </span>
        {[
          "all",
          "commit",
          "comment",
          "task",
          "settings",
          "user",
          "file",
          "branch",
          "pr",
        ].map((type) => {
          const count = activityTypeCounts[type] || 0;
          const isSelected = activityType === type;
          return (
            <Button
              key={type}
              variant={isSelected ? "emphasized" : "default"}
              onClick={() => onActivityTypeChange(type as ActivityType | "all")}
              style={{
                fontSize: "11px",
                padding: "4px 12px",
                minWidth: "auto",
              }}
            >
              {type === "all"
                ? "All"
                : ACTIVITY_TYPE_LABELS[type as ActivityType]}{" "}
              ({count})
            </Button>
          );
        })}
      </Flex>

      {/* Third row: Dropdowns */}
      <Flex alignItems="center" gap={12} flexWrap="wrap">
        <div style={{ minWidth: "180px" }}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--dt-colors-text-secondary)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            User
          </label>
          <Select
            name="userId"
            value={userId}
            onChange={(value) => onUserIdChange(value as string)}
            style={{ width: "100%" }}
          >
            <Select.Content>
              <Select.Option value="all">All Users</Select.Option>
              {uniqueUsers.map(([id, name]) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div style={{ minWidth: "180px" }}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--dt-colors-text-secondary)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Date Range
          </label>
          <Select
            name="dateRange"
            value={dateRange}
            onChange={(value) => {
              const dateRangeValue = value as
                | "today"
                | "yesterday"
                | "last7days"
                | "last30days"
                | "thisMonth"
                | "custom";
              onDateRangeChange(dateRangeValue);
            }}
            style={{ width: "100%" }}
          >
            <Select.Content>
              <Select.Option value="today">Today</Select.Option>
              <Select.Option value="yesterday">Yesterday</Select.Option>
              <Select.Option value="last7days">Last 7 Days</Select.Option>
              <Select.Option value="last30days">Last 30 Days</Select.Option>
              <Select.Option value="thisMonth">This Month</Select.Option>
            </Select.Content>
          </Select>
        </div>

        <div style={{ minWidth: "180px" }}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--dt-colors-text-secondary)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Group By
          </label>
          <Select
            name="groupBy"
            value={groupBy}
            onChange={(value) => onGroupByChange(value as GroupBy)}
            style={{ width: "100%" }}
          >
            <Select.Content>
              <Select.Option value="date">Date</Select.Option>
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="type">Type</Select.Option>
              <Select.Option value="none">None</Select.Option>
            </Select.Content>
          </Select>
        </div>

        <div style={{ minWidth: "180px" }}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--dt-colors-text-secondary)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Sort Order
          </label>
          <Select
            name="sortOrder"
            value={sortOrder}
            onChange={(value) => onSortOrderChange(value as SortOrder)}
            style={{ width: "100%" }}
          >
            <Select.Content>
              <Select.Option value="newest">Newest First</Select.Option>
              <Select.Option value="oldest">Oldest First</Select.Option>
            </Select.Content>
          </Select>
        </div>

        <Button
          variant="default"
          onClick={onClearFilters}
          style={{ fontSize: "11px", marginTop: "20px" }}
        >
          Clear Filters
        </Button>
      </Flex>
    </Flex>
  );
};
