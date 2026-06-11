import React from "react";
import { useParams } from "react-router-dom";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import { useActivityTimeline } from "./ActivityTimelinePage.hook";
import { MOCK_ACTIVITIES } from "./ActivityTimeline.const";
import { ActivityFilters } from "./components/ActivityFilters";
import { ActivityTimeline } from "./components/ActivityTimeline";
import { ActivityDetailModal } from "./components/ActivityDetailModal";

/**
 * Activity Timeline Page - Displays a detailed chronological view of project activities
 * including commits, comments, tasks, and other events with filtering and grouping options.
 */
export const ActivityTimelinePage = () => {
  const { id } = useParams<{ id?: string }>();
  const projectId = id || "1";
  // TODO: In a real app, fetch the project name from the backend using projectId
  const projectName = "AstroShop";

  const {
    filters,
    updateSearchQuery,
    updateActivityType,
    updateUserId,
    updateDateRange,
    clearFilters,
    groupBy,
    setGroupBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    filteredActivities,
    groupedActivities,
    hasMore,
    selectedActivity,
    setSelectedActivity,
    isLoading,
  } = useActivityTimeline();

  /**
   * Gets related activities for the selected activity modal.
   * Shows up to 3 other activities from the same user to provide context.
   */
  const getRelatedActivities = () => {
    if (!selectedActivity) return [];
    return MOCK_ACTIVITIES.filter(
      (activity) =>
        activity.userId === selectedActivity.userId &&
        activity.id !== selectedActivity.id,
    ).slice(0, 3);
  };

  return (
    <Flex
      flexDirection="column"
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "var(--dt-colors-background-container-default)",
      }}
    >
      {/* Page Header - Shows title, project badge, and action buttons */}
      <div style={{ padding: "24px 24px 0" }}>
        <Flex alignItems="center" justifyContent="space-between" gap={12}>
          <Flex flexDirection="column" gap={4}>
            <Flex alignItems="center" gap={12}>
              <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>
                Project Activity
              </h1>
              <span
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#3b82f620",
                  color: "#3b82f6",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  border: "1px solid #3b82f640",
                }}
              >
                {projectName}
              </span>
            </Flex>
            <Text
              style={{
                color: "var(--dt-colors-text-subdued)",
                margin: 0,
                fontSize: "13px",
              }}
            >
              View all project events and team activities
            </Text>
          </Flex>
          <Flex gap={8}>
            <Button variant="default" onClick={() => {}}>
              🔄 Refresh
            </Button>
            <Button variant="default" onClick={() => {}}>
              ⚙️ Settings
            </Button>
          </Flex>
        </Flex>
      </div>

      {/* Filters - Allows searching, filtering by type/user/date, grouping, and sorting */}
      <ActivityFilters
        searchQuery={filters.searchQuery}
        activityType={filters.activityType}
        userId={filters.userId}
        dateRange={filters.dateRange}
        groupBy={groupBy}
        sortOrder={sortOrder}
        filteredCount={filteredActivities.length}
        totalCount={MOCK_ACTIVITIES.length}
        onSearchChange={updateSearchQuery}
        onActivityTypeChange={updateActivityType}
        onUserIdChange={updateUserId}
        onDateRangeChange={updateDateRange}
        onGroupByChange={setGroupBy}
        onSortOrderChange={setSortOrder}
        onClearFilters={clearFilters}
      />

      {/* Timeline - Main content area with grouped activities and timeline visualization */}
      <ActivityTimeline
        groupedActivities={groupedActivities}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={() => setPage(page + 1)}
        onSelectActivity={setSelectedActivity}
      />

      {/* Detail Modal - Shows comprehensive details for selected activity */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          relatedActivities={getRelatedActivities()}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </Flex>
  );
};
