import { useState, useMemo, useCallback } from 'react';
import {
  Activity,
  MOCK_ACTIVITIES,
  DateRangeOption,
  GroupByOption,
  SortOrder,
  ActivityType,
} from './ActivityTimeline.const';

export interface ActivityFilters {
  searchQuery: string;
  activityType: ActivityType | 'all';
  userId: string | 'all';
  dateRange: DateRangeOption;
}

export interface GroupedActivities {
  groupLabel: string;
  activities: Activity[];
}

export const useActivityTimeline = () => {
  const [filters, setFilters] = useState<ActivityFilters>({
    searchQuery: '',
    activityType: 'all',
    userId: 'all',
    dateRange: 'last7days',
  });

  const [groupBy, setGroupBy] = useState<GroupByOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const ITEMS_PER_PAGE = 20;

  // Apply filters with AND logic
  const filteredActivities = useMemo(() => {
    let result = [...MOCK_ACTIVITIES];

    // Date range filter
    const now = new Date();
    const cutoffDate = new Date(now);

    switch (filters.dateRange) {
      case 'today':
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        cutoffDate.setDate(cutoffDate.getDate() - 1);
        cutoffDate.setHours(0, 0, 0, 0);
        result = result.filter(
          (a) =>
            a.timestamp >= cutoffDate &&
            a.timestamp < new Date(cutoffDate.getTime() + 24 * 60 * 60 * 1000)
        );
        return result;
      case 'last7days':
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case 'last30days':
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        break;
      case 'thismonth':
        cutoffDate.setDate(1);
        break;
    }

    result = result.filter((a) => a.timestamp >= cutoffDate);

    // Activity type filter
    if (filters.activityType !== 'all') {
      result = result.filter((a) => a.type === filters.activityType);
    }

    // User filter
    if (filters.userId !== 'all') {
      result = result.filter((a) => a.userId === filters.userId);
    }

    // Search filter (AND logic on multiple fields)
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((a) => {
        const searchFields = [
          a.title,
          a.description,
          a.userName,
          a.commitMessage,
          a.taskTitle,
          a.commentFile,
          a.filePath,
          a.branchName,
          a.prTitle,
        ];
        return searchFields.some((field) => field?.toLowerCase().includes(query));
      });
    }

    return result;
  }, [filters]);

  // Group activities
  const groupedActivities = useMemo(() => {
    const sorted =
      sortOrder === 'newest'
        ? [...filteredActivities]
        : [...filteredActivities].reverse();

    if (groupBy === 'none') {
      return [{ groupLabel: '', activities: sorted }];
    }

    const groups: Record<string, Activity[]> = {};

    sorted.forEach((activity) => {
      let groupLabel = '';

      switch (groupBy) {
        case 'date': {
          const date = new Date(activity.timestamp);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          if (
            date.toDateString() === today.toDateString()
          ) {
            groupLabel = 'Today';
          } else if (
            date.toDateString() === yesterday.toDateString()
          ) {
            groupLabel = 'Yesterday';
          } else {
            groupLabel = date.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            });
          }
          break;
        }
        case 'user':
          groupLabel = activity.userName;
          break;
        case 'type':
          groupLabel = activity.type.charAt(0).toUpperCase() + activity.type.slice(1);
          break;
      }

      if (!groups[groupLabel]) {
        groups[groupLabel] = [];
      }
      groups[groupLabel].push(activity);
    });

    return Object.entries(groups).map(([label, activities]) => ({
      groupLabel: label,
      activities,
    }));
  }, [filteredActivities, groupBy, sortOrder]);

  // Pagination
  const paginatedGroups = useMemo(() => {
    let totalItems = 0;
    const result: GroupedActivities[] = [];

    for (const group of groupedActivities) {
      const startIdx = totalItems;
      const endIdx = totalItems + group.activities.length;
      const pageStart = (page - 1) * ITEMS_PER_PAGE;
      const pageEnd = page * ITEMS_PER_PAGE;

      if (endIdx > pageStart && startIdx < pageEnd) {
        const sliceStart = Math.max(0, pageStart - startIdx);
        const sliceEnd = Math.min(group.activities.length, pageEnd - startIdx);

        result.push({
          groupLabel: group.groupLabel,
          activities: group.activities.slice(sliceStart, sliceEnd),
        });
      }

      totalItems = endIdx;
    }

    return result;
  }, [groupedActivities, page]);

  const totalItems = useMemo(
    () => groupedActivities.reduce((sum, g) => sum + g.activities.length, 0),
    [groupedActivities]
  );

  const hasMore = page * ITEMS_PER_PAGE < totalItems;

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const applySearchFilter = useCallback((query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery: query }));
      setPage(1);
    }, 300);

    setSearchTimeout(timeout);
  }, [searchTimeout]);

  const applyFilters = useCallback(
    (newFilters: Partial<ActivityFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(1);
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      activityType: 'all',
      userId: 'all',
      dateRange: 'last7days',
    });
    setGroupBy('date');
    setSortOrder('newest');
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  return {
    // State
    filters,
    groupBy,
    sortOrder,
    page,
    selectedActivity,
    
    // Data
    filteredActivities,
    paginatedGroups,
    totalItems,
    hasMore,
    
    // Operations
    applyFilters,
    applySearchFilter,
    clearFilters,
    loadMore,
    setGroupBy,
    setSortOrder,
    setSelectedActivity,
  };
};
