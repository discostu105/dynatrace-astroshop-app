import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Skeleton, SkeletonText } from '@dynatrace/strato-components/content';
import { useActivityTimeline } from './ActivityTimelinePageHook';
import { ActivityFilters } from './components/ActivityFilters';
import { ActivityItem } from './components/ActivityItem';
import { ActivityDetailModal } from './components/ActivityDetailModal';

interface GroupHeaderProps {
  label: string;
  count: number;
}

const GroupHeader = ({ label, count }: GroupHeaderProps) => (
  <Flex alignItems="center" gap={12} padding={16} style={{ marginTop: '24px', marginBottom: '12px' }}>
    <div
      style={{
        flex: 1,
        height: '1px',
        backgroundColor: 'var(--dt-colors-border-neutral-default)',
      }}
    />
    <Heading
      level={5}
      style={{
        margin: 0,
        fontSize: '13px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'var(--dt-colors-text-secondary-default)',
        whiteSpace: 'nowrap',
      }}
    >
      {label} <span style={{ fontWeight: '500' }}>({count})</span>
    </Heading>
    <div
      style={{
        flex: 1,
        height: '1px',
        backgroundColor: 'var(--dt-colors-border-neutral-default)',
      }}
    />
  </Flex>
);

const LoadingStateComponent = () => (
  <Flex flexDirection="column" gap={20} padding={24}>
    {[...Array.from({ length: 5 })].map((_, i) => (
      <Surface key={i} style={{ padding: '16px 20px', borderRadius: '10px' }}>
        <Flex gap={16}>
          <Skeleton style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <Flex flexDirection="column" gap={8} flex={1}>
            <SkeletonText style={{ width: '30%' }} />
            <SkeletonText style={{ width: '60%' }} />
            <SkeletonText style={{ width: '40%' }} />
          </Flex>
        </Flex>
      </Surface>
    ))}
  </Flex>
);

const EmptyStateComponent = ({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap={16}
    padding={48}
    style={{ minHeight: '400px' }}
  >
    <div style={{ fontSize: '64px' }}>
      {hasFilters ? '🔍' : '📅'}
    </div>
    <Heading level={3} style={{ margin: 0, fontSize: '20px' }}>
      {hasFilters ? 'No activities match your filters' : 'No activity yet'}
    </Heading>
    <Text style={{ fontSize: '14px', color: 'var(--dt-colors-text-secondary-default)', textAlign: 'center', maxWidth: '400px' }}>
      {hasFilters
        ? 'Try adjusting your filters or search terms to find activities.'
        : 'Activities will appear here as your team works on the project.'}
    </Text>
    {hasFilters && (
      <Button variant="primary" onClick={onClearFilters}>
        Clear All Filters
      </Button>
    )}
  </Flex>
);

export const ActivityTimelinePage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    groupedActivities,
    paginatedActivities,
    activityCounts,
    uniqueUsers,
    selectedActivity,
    isLoading,
    filters,
    groupBy,
    sortOrder,
    hasMore,
    totalActivities,
    setSearchQuery,
    setActivityType,
    setUserId,
    setDateRange,
    setGroupBy,
    setSortOrder,
    selectActivity,
    loadMore,
    clearFilters,
    refresh,
  } = useActivityTimeline();

  // Keyboard navigation support: Escape to close the activity detail modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedActivity) {
        selectActivity(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedActivity, selectActivity]);

  // Check if any filter is active to show appropriate empty state message
  const hasFilters =
    filters.searchQuery ||
    filters.activityType !== 'all' ||
    filters.userId !== 'all' ||
    filters.dateRange !== 'last7days';

  const isEmptyState = paginatedActivities.length === 0;

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
      <Surface
        style={{
          padding: '24px',
          borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
          backgroundColor: 'var(--dt-colors-background-surface-default)',
        }}
      >
        <Flex flexDirection="column" gap={8}>
          <Flex justifyContent="space-between" alignItems="flex-start" gap={16}>
            <Flex flexDirection="column" gap={4} flex={1}>
              <Heading level={2} style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
                📅 Project Activity
              </Heading>
              <Text style={{ fontSize: '14px', color: 'var(--dt-colors-text-secondary-default)' }}>
                View all project events and team activities {id && <span>(Project: {id})</span>}
              </Text>
            </Flex>

            <Flex gap={12} style={{ flexShrink: 0 }}>
              <Button
                variant="default"
                onClick={refresh}
                style={{ padding: '8px 12px', fontSize: '12px' }}
                aria-label="Refresh activities"
              >
                🔄
              </Button>
              <Button
                variant="default"
                style={{ padding: '8px 12px', fontSize: '12px' }}
                aria-label="Activity settings"
              >
                ⚙️
              </Button>
            </Flex>
          </Flex>

          {/* Summary Stats */}
          {totalActivities > 0 && (
            <Flex gap={16} flexWrap="wrap" style={{ marginTop: '12px' }}>
              <div>
                <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Activities
                </Text>
                <Text style={{ fontSize: '18px', fontWeight: '600' }}>
                  {totalActivities}
                </Text>
              </div>
              <div>
                <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Team Members
                </Text>
                <Text style={{ fontSize: '18px', fontWeight: '600' }}>
                  {uniqueUsers.length}
                </Text>
              </div>
            </Flex>
          )}
        </Flex>
      </Surface>

      {/* Filters */}
      <ActivityFilters
        filters={filters}
        activityCounts={activityCounts}
        users={uniqueUsers}
        groupBy={groupBy}
        sortOrder={sortOrder}
        onSearchChange={setSearchQuery}
        onActivityTypeChange={setActivityType}
        onUserChange={setUserId}
        onDateRangeChange={setDateRange}
        onGroupByChange={setGroupBy}
        onSortOrderChange={setSortOrder}
        onClearFilters={clearFilters}
        onRefresh={refresh}
      />

      {/* Timeline Content */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {isLoading ? (
          <LoadingStateComponent />
        ) : isEmptyState ? (
          <EmptyStateComponent hasFilters={hasFilters} onClearFilters={clearFilters} />
        ) : (
          <Flex
            flexDirection="column"
            padding={24}
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              width: '100%',
            }}
          >
            {groupedActivities.map((group, groupIdx) => (
              <div key={`group_${groupIdx}`}>
                {/* Group Header */}
                {group.groupLabel && groupBy !== 'none' && (
                  <GroupHeader label={group.groupLabel} count={group.activities.length} />
                )}

                {/* Activities in Group */}
                {group.activities.map((activity, actIdx) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    isFirst={actIdx === 0 && groupIdx === 0}
                    isLast={actIdx === group.activities.length - 1 && groupIdx === groupedActivities.length - 1}
                    onSelect={selectActivity}
                    showTimeline={true}
                  />
                ))}
              </div>
            ))}

            {/* Load More Button */}
            {hasMore && !isLoading && (
              <Flex justifyContent="center" padding={24}>
                <Button
                  variant="primary"
                  onClick={loadMore}
                  style={{
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                  aria-label="Load more activities"
                >
                  Load More Activities
                </Button>
              </Flex>
            )}

            {/* No More Activities Message */}
            {!hasMore && paginatedActivities.length > 0 && (
              <Flex justifyContent="center" padding={24}>
                <Text style={{ fontSize: '13px', color: 'var(--dt-colors-text-secondary-default)', fontStyle: 'italic' }}>
                  No more activities to load
                </Text>
              </Flex>
            )}
          </Flex>
        )}
      </div>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={selectedActivity !== null}
        onClose={() => selectActivity(null)}
      />
    </Flex>
  );
};
