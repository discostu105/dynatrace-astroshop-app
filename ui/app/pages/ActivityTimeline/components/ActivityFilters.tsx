import React, { useState, useCallback } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { TextInput } from '@dynatrace/strato-components-preview/forms';
import { Select } from '@dynatrace/strato-components-preview/forms';
import { Tabs, Tab } from '@dynatrace/strato-components-preview/navigation';
import { Button } from '@dynatrace/strato-components/buttons';
import {
  ActivityType,
  DateRangeOption,
  GroupByOption,
  SortOrder,
  TEAM_MEMBERS,
} from '../ActivityTimeline.const';
import { ActivityFilters as ActivityFiltersType } from '../ActivityTimelinePage.hook';

interface ActivityFiltersProps {
  filters: ActivityFiltersType;
  groupBy: GroupByOption;
  sortOrder: SortOrder;
  activityTypeCounts: Record<string, number>;
  onApplyFilters: (filters: Partial<ActivityFiltersType>) => void;
  onApplySearchFilter: (query: string) => void;
  onGroupByChange: (groupBy: GroupByOption) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
}

export const ActivityFilters = ({
  filters,
  groupBy,
  sortOrder,
  activityTypeCounts,
  onApplyFilters,
  onApplySearchFilter,
  onGroupByChange,
  onSortOrderChange,
  onClearFilters,
  onRefresh,
}: ActivityFiltersProps) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      onApplySearchFilter(value);
    },
    [onApplySearchFilter]
  );

  const handleTypeTabChange = (index: number) => {
    const types: Array<ActivityType | 'all'> = [
      'all',
      'commit',
      'comment',
      'task',
      'settings',
      'user',
      'file',
      'branch',
      'pr',
    ];
    onApplyFilters({ activityType: types[index] });
  };

  const activeTypeIndex = [
    'all',
    'commit',
    'comment',
    'task',
    'settings',
    'user',
    'file',
    'branch',
    'pr',
  ].indexOf(filters.activityType as string);

  return (
    <Flex
      flexDirection="column"
      gap={12}
      padding={12}
      paddingLeft={24}
      paddingRight={24}
      style={{
        backgroundColor: 'var(--dt-colors-background-container-default)',
        borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
      }}
    >
      {/* Search Input */}
      <div style={{ maxWidth: '500px' }}>
        <TextInput
          placeholder="Search activities…"
          value={searchInput}
          onChange={(value) => handleSearchChange(value)}
        />
      </div>

      {/* Activity Type Tabs */}
      <div style={{ overflowX: 'auto', minHeight: '48px' }}>
        <Tabs selectedIndex={activeTypeIndex} onChange={handleTypeTabChange}>
          <Tab title={`All (${activityTypeCounts['all'] || 0})`}>All</Tab>
          <Tab title={`Commits (${activityTypeCounts['commit'] || 0})`}>Commits</Tab>
          <Tab title={`Comments (${activityTypeCounts['comment'] || 0})`}>Comments</Tab>
          <Tab title={`Tasks (${activityTypeCounts['task'] || 0})`}>Tasks</Tab>
          <Tab title={`Settings (${activityTypeCounts['settings'] || 0})`}>Settings</Tab>
          <Tab title={`Users (${activityTypeCounts['user'] || 0})`}>Users</Tab>
          <Tab title={`Files (${activityTypeCounts['file'] || 0})`}>Files</Tab>
          <Tab title={`Branches (${activityTypeCounts['branch'] || 0})`}>Branches</Tab>
          <Tab title={`PRs (${activityTypeCounts['pr'] || 0})`}>PRs</Tab>
        </Tabs>
      </div>

      {/* Filter Controls */}
      <Flex
        gap={12}
        alignItems="center"
        flexWrap="wrap"
        style={{
          backgroundColor: 'var(--dt-colors-background-container-default)',
        }}
      >
        {/* User Filter */}
        <div style={{ minWidth: '200px' }}>
          <Select
            name="user-filter"
            value={filters.userId}
            onChange={(value) => onApplyFilters({ userId: value as string })}
          >
            <Select.Content>
              <Select.Option value="all">All Users</Select.Option>
              {TEAM_MEMBERS.map((member) => (
                <Select.Option key={member.id} value={member.id}>
                  {member.name}
                </Select.Option>
              ))}
            </Select.Content>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div style={{ minWidth: '200px' }}>
          <Select
            name="date-range"
            value={filters.dateRange}
            onChange={(value) => onApplyFilters({ dateRange: value as DateRangeOption })}
          >
            <Select.Content>
              <Select.Option value="today">Today</Select.Option>
              <Select.Option value="yesterday">Yesterday</Select.Option>
              <Select.Option value="last7days">Last 7 Days</Select.Option>
              <Select.Option value="last30days">Last 30 Days</Select.Option>
              <Select.Option value="thismonth">This Month</Select.Option>
            </Select.Content>
          </Select>
        </div>

        {/* Group By Dropdown */}
        <div style={{ minWidth: '180px' }}>
          <Select
            name="group-by"
            value={groupBy}
            onChange={(value) => onGroupByChange(value as GroupByOption)}
          >
            <Select.Content>
              <Select.Option value="date">Group by Date</Select.Option>
              <Select.Option value="user">Group by User</Select.Option>
              <Select.Option value="type">Group by Type</Select.Option>
              <Select.Option value="none">No Grouping</Select.Option>
            </Select.Content>
          </Select>
        </div>

        {/* Sort Order Dropdown */}
        <div style={{ minWidth: '180px' }}>
          <Select
            name="sort-order"
            value={sortOrder}
            onChange={(value) => onSortOrderChange(value as SortOrder)}
          >
            <Select.Content>
              <Select.Option value="newest">Newest First</Select.Option>
              <Select.Option value="oldest">Oldest First</Select.Option>
            </Select.Content>
          </Select>
        </div>

        {/* Refresh Button */}
        <Button variant="default" onClick={onRefresh}>
          🔄 Refresh
        </Button>

        {/* Clear Filters Button (visible if filters applied) */}
        {(filters.searchQuery ||
          filters.activityType !== 'all' ||
          filters.userId !== 'all' ||
          filters.dateRange !== 'last7days' ||
          groupBy !== 'date' ||
          sortOrder !== 'newest') && (
          <Button variant="default" onClick={onClearFilters}>
            Clear All
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
