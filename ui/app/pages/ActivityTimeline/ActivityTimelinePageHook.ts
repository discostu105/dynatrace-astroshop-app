import { useState, useMemo, useCallback } from 'react';
import type { Activity, ActivityFilters, GroupByOption, SortOrder, GroupedActivities, DateRange } from './types/activity.types';
import { MOCK_ACTIVITIES, TEAM_MEMBERS } from './ActivityTimeline.const';
import {
  filterActivities,
  sortActivities,
  groupActivities,
  aggregateActivities,
  getActivityTypeCounts,
  getUniqueUsers,
  paginateActivities,
} from './utils/activityUtils';

const PAGE_SIZE = 20;
const DEBOUNCE_DELAY = 300;

export interface UseActivityTimelineReturn {
  // Data
  activities: Activity[];
  groupedActivities: GroupedActivities[];
  filteredActivities: Activity[];
  paginatedActivities: Activity[];
  activityCounts: Record<string, number>;
  uniqueUsers: typeof TEAM_MEMBERS;
  selectedActivity: Activity | null;
  isLoading: boolean;

  // Filters and options
  filters: ActivityFilters;
  groupBy: GroupByOption;
  sortOrder: SortOrder;
  currentPage: number;
  hasMore: boolean;
  totalActivities: number;

  // Actions
  setSearchQuery: (query: string) => void;
  setActivityType: (type: string) => void;
  setUserId: (userId: string) => void;
  setDateRange: (range: string | DateRange) => void;
  setCustomDateRange: (start: string, end: string) => void;
  setGroupBy: (groupBy: GroupByOption) => void;
  setSortOrder: (order: SortOrder) => void;
  selectActivity: (activity: Activity | null) => void;
  loadMore: () => void;
  clearFilters: () => void;
  refresh: () => void;
}

export const useActivityTimeline = (): UseActivityTimelineReturn => {
  // State - Filters
  const [filters, setFilters] = useState<ActivityFilters>({
    searchQuery: '',
    activityType: 'all',
    userId: 'all',
    dateRange: 'last7days',
  });

  // State - UI
  const [groupBy, setGroupBy] = useState<GroupByOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Filter actions with debounced search
  const setSearchQuery = useCallback((query: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: query }));
      setCurrentPage(0); // Reset pagination on filter change
    }, DEBOUNCE_DELAY);

    setSearchTimeout(timeout);
  }, [searchTimeout]);

  const setActivityType = useCallback((type: string) => {
    setFilters(prev => ({ ...prev, activityType: type as any }));
    setCurrentPage(0);
  }, []);

  const setUserId = useCallback((userId: string) => {
    setFilters(prev => ({ ...prev, userId }));
    setCurrentPage(0);
  }, []);

  const setDateRange = useCallback((range: string | DateRange) => {
    setFilters(prev => ({ ...prev, dateRange: range, customStartDate: undefined, customEndDate: undefined }));
    setCurrentPage(0);
  }, []);

  const setCustomDateRange = useCallback((start: string, end: string) => {
    setFilters(prev => ({ ...prev, dateRange: 'custom', customStartDate: start, customEndDate: end }));
    setCurrentPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      activityType: 'all',
      userId: 'all',
      dateRange: 'last7days',
    });
    setCurrentPage(0);
  }, []);

  const loadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const refresh = useCallback(() => {
    setIsLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const selectActivity = useCallback((activity: Activity | null) => {
    setSelectedActivity(activity);
  }, []);

  // Compute derived data
  const activities = useMemo(() => MOCK_ACTIVITIES, []);

  const activityCounts = useMemo(() => getActivityTypeCounts(activities) as Record<string, number>, [activities]);

  const uniqueUsers = useMemo(() => {
    const users = getUniqueUsers(activities) as typeof TEAM_MEMBERS;
    return users;
  }, [activities]);

  const filteredActivities = useMemo(() => {
    let result = filterActivities(activities, filters);
    result = aggregateActivities(result);
    result = sortActivities(result, sortOrder);
    return result;
  }, [activities, filters, sortOrder]);

  const totalActivities = filteredActivities.length;

  const { items: paginatedActivities, hasMore } = useMemo(() => {
    const paginated = paginateActivities(filteredActivities, PAGE_SIZE, currentPage);
    return {
      items: paginated.items,
      hasMore: paginated.hasMore,
    };
  }, [filteredActivities, currentPage]);

  const groupedActivities = useMemo(() => {
    return groupActivities(paginatedActivities, groupBy);
  }, [paginatedActivities, groupBy]);

  return {
    // Data
    activities,
    groupedActivities,
    filteredActivities,
    paginatedActivities,
    activityCounts,
    uniqueUsers,
    selectedActivity,
    isLoading,

    // State
    filters,
    groupBy,
    sortOrder,
    currentPage,
    hasMore,
    totalActivities,

    // Actions
    setSearchQuery,
    setActivityType,
    setUserId,
    setDateRange,
    setCustomDateRange,
    setGroupBy,
    setSortOrder,
    selectActivity,
    loadMore,
    clearFilters,
    refresh,
  };
};
