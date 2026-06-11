import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { useActivityTimeline } from './ActivityTimelinePage.hook';
import { MOCK_ACTIVITIES, ActivityType } from './ActivityTimeline.const';
import { ActivityFilters } from './components/ActivityFilters';
import { ActivityTimeline } from './components/ActivityTimeline';
import { ActivityDetailModal } from './components/ActivityDetailModal';

export const ActivityTimelinePage = () => {
  const { id: projectId = 'astro-shop' } = useParams<{ id: string }>();

  const {
    filters,
    groupBy,
    sortOrder,
    selectedActivity,
    filteredActivities,
    paginatedGroups,
    totalItems,
    hasMore,
    applyFilters,
    applySearchFilter,
    clearFilters,
    loadMore,
    setGroupBy,
    setSortOrder,
    setSelectedActivity,
  } = useActivityTimeline();

  // Calculate activity type counts for tab labels
  const activityTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: MOCK_ACTIVITIES.length,
      commit: 0,
      comment: 0,
      task: 0,
      settings: 0,
      user: 0,
      file: 0,
      branch: 0,
      pr: 0,
    };

    MOCK_ACTIVITIES.forEach((activity) => {
      if (activity.type !== 'branch' && activity.type !== 'pr') {
        counts[activity.type]++;
      } else if (activity.type === 'pr') {
        counts.pr++;
      } else {
        counts.branch++;
      }
    });

    return counts;
  }, []);

  // Determine if showing filtered empty state
  const isEmptyFiltered =
    filteredActivities.length === 0 &&
    (filters.searchQuery !== '' ||
      filters.activityType !== 'all' ||
      filters.userId !== 'all' ||
      filters.dateRange !== 'last7days');

  const handleRefresh = () => {
    // In a real app, this would refetch data from the server
    // For now, just reset page
  };

  return (
    <Flex
      flexDirection="column"
      style={{
        position: 'relative',
        height: '100%',
        backgroundColor: 'var(--dt-colors-background-container-default)',
      }}
    >
      {/* Page Header */}
      <div
        style={{
          padding: '24px',
          borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
          backgroundColor: 'var(--dt-colors-background-container-default)',
        }}
      >
        <Flex gap={16} alignItems="center" style={{ marginBottom: '12px' }}>
          <Heading level={1} style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
            Project Activity
          </Heading>

          {/* Project Badge */}
          <span
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: '#3b82f622',
              color: '#3b82f6',
              border: '1px solid #3b82f644',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {projectId}
          </span>

          {/* Refresh Button */}
          <Button
            variant="default"
            onClick={handleRefresh}
            style={{ marginLeft: 'auto' }}
          >
            🔄 Refresh
          </Button>
        </Flex>

        {/* Description */}
        <Text
          style={{
            fontSize: '13px',
            color: 'var(--dt-colors-text-secondary-default)',
            lineHeight: '1.5',
          }}
        >
          View all project events and team activities
        </Text>
      </div>

      {/* Filters */}
      <ActivityFilters
        filters={filters}
        groupBy={groupBy}
        sortOrder={sortOrder}
        activityTypeCounts={activityTypeCounts}
        onApplyFilters={applyFilters}
        onApplySearchFilter={applySearchFilter}
        onGroupByChange={setGroupBy}
        onSortOrderChange={setSortOrder}
        onClearFilters={clearFilters}
        onRefresh={handleRefresh}
      />

      {/* Timeline Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ActivityTimeline
          paginatedGroups={paginatedGroups}
          filteredActivitiesCount={filteredActivities.length}
          totalActivitiesCount={MOCK_ACTIVITIES.length}
          hasMore={hasMore}
          onSelectActivity={setSelectedActivity}
          onLoadMore={loadMore}
          isEmptyFiltered={isEmptyFiltered}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </Flex>
  );
};
