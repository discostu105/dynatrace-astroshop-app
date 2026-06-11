import React, { useState } from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { TextInput } from '@dynatrace/strato-components-preview/forms';
import { Select } from '@dynatrace/strato-components-preview/forms';
import { Button } from '@dynatrace/strato-components/buttons';
import type { ActivityFilters, GroupByOption, SortOrder, DateRange } from '../types/activity.types';

interface ActivityFiltersProps {
  filters: ActivityFilters;
  activityCounts: Record<string, number>;
  users: Array<{ id: string; name: string }>;
  groupBy: GroupByOption;
  sortOrder: SortOrder;
  onSearchChange: (query: string) => void;
  onActivityTypeChange: (type: string) => void;
  onUserChange: (userId: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onGroupByChange: (groupBy: GroupByOption) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
}

const TypeTabButton = ({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    variant={isActive ? 'primary' : 'default'}
    style={{
      padding: '8px 12px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    }}
  >
    {label} <span style={{ opacity: 0.7, marginLeft: '4px' }}>({count})</span>
  </Button>
);

export const ActivityFilters = ({
  filters,
  activityCounts,
  users,
  groupBy,
  sortOrder,
  onSearchChange,
  onActivityTypeChange,
  onUserChange,
  onDateRangeChange,
  onGroupByChange,
  onSortOrderChange,
  onClearFilters,
  onRefresh,
}: ActivityFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Surface
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
        backgroundColor: 'var(--dt-colors-background-container-default)',
      }}
    >
      <Flex flexDirection="column" gap={16}>
        {/* Row 1: Search and Actions */}
        <Flex gap={12} alignItems="center" flexWrap="wrap">
          <div style={{ flex: 1, minWidth: '250px', maxWidth: '400px' }}>
            <TextInput
              placeholder="🔍 Search activities…"
              value={filters.searchQuery}
              onChange={(value) => onSearchChange(value)}
              aria-label="Search activities"
            />
          </div>

          <Button variant="default" onClick={onRefresh} style={{ padding: '8px 12px', fontSize: '12px' }}>
            🔄 Refresh
          </Button>

          <Button
            variant="default"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{ padding: '8px 12px', fontSize: '12px' }}
          >
            {showAdvanced ? '▼' : '▶'} Options
          </Button>

          {(filters.searchQuery ||
            filters.activityType !== 'all' ||
            filters.userId !== 'all' ||
            filters.dateRange !== 'last7days') && (
            <Button
              variant="default"
              onClick={onClearFilters}
              style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--dt-colors-charts-status-critical-default)' }}
            >
              ✕ Clear All
            </Button>
          )}
        </Flex>

        {/* Row 2: Activity Type Tabs */}
        <Flex gap={8} flexWrap="wrap" alignItems="center">
          <Text style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)', minWidth: '80px' }}>
            Type:
          </Text>
          <Flex gap={8} flexWrap="wrap">
            <TypeTabButton
              label="All"
              count={activityCounts.all}
              isActive={filters.activityType === 'all'}
              onClick={() => onActivityTypeChange('all')}
            />
            <TypeTabButton
              label="🔷 Commits"
              count={activityCounts.commit}
              isActive={filters.activityType === 'commit'}
              onClick={() => onActivityTypeChange('commit')}
            />
            <TypeTabButton
              label="💬 Comments"
              count={activityCounts.comment}
              isActive={filters.activityType === 'comment'}
              onClick={() => onActivityTypeChange('comment')}
            />
            <TypeTabButton
              label="✅ Tasks"
              count={activityCounts.task}
              isActive={filters.activityType === 'task'}
              onClick={() => onActivityTypeChange('task')}
            />
            <TypeTabButton
              label="⚙️ Settings"
              count={activityCounts.settings}
              isActive={filters.activityType === 'settings'}
              onClick={() => onActivityTypeChange('settings')}
            />
            <TypeTabButton
              label="👤 Users"
              count={activityCounts.user}
              isActive={filters.activityType === 'user'}
              onClick={() => onActivityTypeChange('user')}
            />
            <TypeTabButton
              label="📄 Files"
              count={activityCounts.file}
              isActive={filters.activityType === 'file'}
              onClick={() => onActivityTypeChange('file')}
            />
            <TypeTabButton
              label="🌿 Branches"
              count={activityCounts.branch}
              isActive={filters.activityType === 'branch'}
              onClick={() => onActivityTypeChange('branch')}
            />
            <TypeTabButton
              label="🔀 PRs"
              count={activityCounts.pr}
              isActive={filters.activityType === 'pr'}
              onClick={() => onActivityTypeChange('pr')}
            />
          </Flex>
        </Flex>

        {/* Advanced Options */}
        {showAdvanced && (
          <Flex gap={16} flexWrap="wrap" alignItems="flex-end" style={{ paddingTop: '12px', borderTop: '1px solid var(--dt-colors-border-neutral-default)' }}>
            {/* Filter by User */}
            <div style={{ minWidth: '180px' }}>
              <Text style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)', marginBottom: '4px', display: 'block' }}>
                User
              </Text>
              <Select value={filters.userId} onChange={(value) => onUserChange(value)}>
                <Select.Content>
                  <Select.Option value="all">All Users</Select.Option>
                  {users.map(user => (
                    <Select.Option key={user.id} value={user.id}>
                      {user.name}
                    </Select.Option>
                  ))}
                </Select.Content>
              </Select>
            </div>

            {/* Filter by Date Range */}
            <div style={{ minWidth: '180px' }}>
              <Text style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)', marginBottom: '4px', display: 'block' }}>
                Date Range
              </Text>
              <Select value={filters.dateRange} onChange={(value) => onDateRangeChange(value as DateRange)}>
                <Select.Content>
                  <Select.Option value="today">Today</Select.Option>
                  <Select.Option value="yesterday">Yesterday</Select.Option>
                  <Select.Option value="last7days">Last 7 Days</Select.Option>
                  <Select.Option value="last30days">Last 30 Days</Select.Option>
                  <Select.Option value="thismonth">This Month</Select.Option>
                  <Select.Option value="custom">Custom Range</Select.Option>
                </Select.Content>
              </Select>
            </div>

            {/* Group By */}
            <div style={{ minWidth: '140px' }}>
              <Text style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)', marginBottom: '4px', display: 'block' }}>
                Group By
              </Text>
              <Select value={groupBy} onChange={(value) => onGroupByChange(value as GroupByOption)}>
                <Select.Content>
                  <Select.Option value="date">Date</Select.Option>
                  <Select.Option value="user">User</Select.Option>
                  <Select.Option value="type">Type</Select.Option>
                  <Select.Option value="none">None</Select.Option>
                </Select.Content>
              </Select>
            </div>

            {/* Sort Order */}
            <div style={{ minWidth: '140px' }}>
              <Text style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)', marginBottom: '4px', display: 'block' }}>
                Sort
              </Text>
              <Select value={sortOrder} onChange={(value) => onSortOrderChange(value as SortOrder)}>
                <Select.Content>
                  <Select.Option value="newest">Newest First</Select.Option>
                  <Select.Option value="oldest">Oldest First</Select.Option>
                </Select.Content>
              </Select>
            </div>
          </Flex>
        )}
      </Flex>
    </Surface>
  );
};
