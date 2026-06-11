import React from 'react';
import { Text, Heading } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Activity, GroupedActivities } from '../ActivityTimeline.const';
import { ActivityItem } from './ActivityItem';
import { GroupHeader } from './GroupHeader';

interface ActivityTimelineProps {
  paginatedGroups: GroupedActivities[];
  filteredActivitiesCount: number;
  totalActivitiesCount: number;
  hasMore: boolean;
  isLoading?: boolean;
  onSelectActivity: (activity: Activity) => void;
  onLoadMore: () => void;
  isEmptyFiltered?: boolean;
  onClearFilters?: () => void;
}

export const ActivityTimeline = ({
  paginatedGroups,
  filteredActivitiesCount,
  totalActivitiesCount,
  hasMore,
  isLoading = false,
  onSelectActivity,
  onLoadMore,
  isEmptyFiltered = false,
  onClearFilters,
}: ActivityTimelineProps) => {
  // Empty state for no activities at all
  if (totalActivitiesCount === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--dt-colors-text-secondary-default)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
        <Heading level={3}>No activity yet</Heading>
        <Text
          style={{
            fontSize: '13px',
            marginTop: '8px',
            maxWidth: '400px',
          }}
        >
          Activities will appear here as team members make changes to the project.
        </Text>
      </div>
    );
  }

  // Empty state for filtered results with no matches
  if (isEmptyFiltered && filteredActivitiesCount === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--dt-colors-text-secondary-default)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <Heading level={3}>No activities match your filters</Heading>
        <Text
          style={{
            fontSize: '13px',
            marginTop: '8px',
            maxWidth: '400px',
          }}
        >
          Try adjusting your search query, filters, or date range to find activities.
        </Text>
        {onClearFilters && (
          <Button
            variant="default"
            onClick={onClearFilters}
            style={{ marginTop: '16px' }}
          >
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  // Timeline content
  return (
    <div style={{ padding: '24px' }}>
      {/* Activity count */}
      <Text
        style={{
          fontSize: '12px',
          color: 'var(--dt-colors-text-secondary-default)',
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Showing {filteredActivitiesCount} of {totalActivitiesCount} activities
      </Text>

      {/* Timeline */}
      {paginatedGroups.map((group, groupIdx) => (
        <div key={groupIdx}>
          {group.groupLabel && <GroupHeader label={group.groupLabel} />}

          {group.activities.map((activity, itemIdx) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onSelectActivity={onSelectActivity}
            />
          ))}
        </div>
      ))}

      {/* Loading state */}
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
            color: 'var(--dt-colors-text-secondary-default)',
          }}
        >
          <Text style={{ fontSize: '13px' }}>Loading more activities...</Text>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '32px',
            paddingBottom: '20px',
          }}
        >
          <Button variant="default" onClick={onLoadMore}>
            Load More Activities
          </Button>
        </div>
      )}

      {/* End of timeline */}
      {!hasMore && filteredActivitiesCount > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
            marginTop: '20px',
            borderTop: '1px solid var(--dt-colors-border-neutral-default)',
          }}
        >
          <Text
            style={{
              fontSize: '12px',
              color: 'var(--dt-colors-text-secondary-default)',
            }}
          >
            ✓ End of timeline
          </Text>
        </div>
      )}
    </div>
  );
};
