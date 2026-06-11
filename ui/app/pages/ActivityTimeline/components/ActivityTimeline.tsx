import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Button } from "@dynatrace/strato-components/buttons";
import { Text } from "@dynatrace/strato-components/typography";
import type { Activity } from "../ActivityTimeline.const";
import { ActivityItem } from "./ActivityItem";
import { GroupHeader } from "./GroupHeader";
import { SkeletonLoader } from "./SkeletonLoader";

interface ActivityTimelineProps {
  groupedActivities: Record<string, Activity[]>;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSelectActivity: (activity: Activity) => void;
}

/**
 * Main timeline view component that displays grouped activities in chronological order.
 * Renders a vertical timeline with activity items grouped by date, user, or type.
 * Includes empty state and pagination with "Load More" button.
 */
export const ActivityTimeline = ({
  groupedActivities,
  isLoading,
  hasMore,
  onLoadMore,
  onSelectActivity,
}: ActivityTimelineProps) => {
  const groups = Object.entries(groupedActivities);
  const totalActivities = groups.reduce(
    (sum, [, activities]) => sum + activities.length,
    0,
  );

  // Show skeleton while loading
  if (isLoading) {
    return <SkeletonLoader />;
  }

  // Show empty state when no activities match the current filters
  if (totalActivities === 0) {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={16}
        style={{
          padding: "64px 24px",
          backgroundColor: "var(--dt-colors-background-container-default)",
          minHeight: "400px",
        }}
      >
        <div style={{ fontSize: "64px" }}>📭</div>
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--dt-colors-text-default)",
            margin: 0,
          }}
        >
          No activities found
        </Text>
        <Text
          style={{
            fontSize: "13px",
            color: "var(--dt-colors-text-secondary)",
            margin: 0,
          }}
        >
          Try adjusting your filters or search criteria
        </Text>
      </Flex>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",
        padding: "24px 24px",
        backgroundColor: "var(--dt-colors-background-container-default)",
        position: "relative",
      }}
    >
      {/* Vertical timeline line - visual indicator connecting all activity nodes */}
      <div
        style={{
          position: "absolute",
          left: "72px",
          top: "0",
          bottom: "0",
          width: "2px",
          backgroundColor: "#e5e7eb",
        }}
      />

      {/* Activities - rendered in groups with headers */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {groups.map(([groupName, activities]) => (
          <div key={groupName}>
            {/* Group header shows grouping key (date, user, type) and activity count */}
            <GroupHeader title={groupName} count={activities.length} />
            <div style={{ marginTop: "12px" }}>
              {activities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onSelect={onSelectActivity}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button - Pagination for large datasets */}
      {hasMore && (
        <Flex
          justifyContent="center"
          style={{ padding: "24px 0", position: "relative", zIndex: 1 }}
        >
          <Button variant="default" onClick={onLoadMore}>
            Load More Activities
          </Button>
        </Flex>
      )}
    </div>
  );
};
