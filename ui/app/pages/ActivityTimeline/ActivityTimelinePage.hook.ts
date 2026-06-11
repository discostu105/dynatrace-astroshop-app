import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  Activity,
  ActivityFilters,
  GroupBy,
  SortOrder,
  ActivityType,
} from "./ActivityTimeline.const";
import { MOCK_ACTIVITIES } from "./ActivityTimeline.const";

const ITEMS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 300; // Delay search to avoid excessive filtering

/**
 * Hook for managing activity timeline state, filtering, grouping, and pagination.
 */
export const useActivityTimeline = () => {
  const [filters, setFilters] = useState<ActivityFilters>({
    searchQuery: "",
    activityType: "all",
    userId: "all",
    dateRange: "last30days",
  });
  const [groupBy, setGroupBy] = useState<GroupBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query to avoid excessive re-filtering while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(filters.searchQuery);
      setPage(1); // Reset to first page when search changes
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  const updateSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const updateActivityType = useCallback((type: ActivityType | "all") => {
    setFilters((prev) => ({ ...prev, activityType: type }));
    setPage(1);
  }, []);

  const updateUserId = useCallback((userId: string) => {
    setFilters((prev) => ({ ...prev, userId }));
    setPage(1);
  }, []);

  const updateDateRange = useCallback(
    (
      range:
        | "today"
        | "yesterday"
        | "last7days"
        | "last30days"
        | "thisMonth"
        | "custom",
    ) => {
      setFilters((prev) => ({ ...prev, dateRange: range }));
      setPage(1);
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      activityType: "all",
      userId: "all",
      dateRange: "last30days",
    });
    setDebouncedSearchQuery("");
    setPage(1);
  }, []);

  // ===== FILTERING STAGE =====
  // Apply all active filters to the activity list
  const filteredActivities = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(
      startOfToday.getTime() - 24 * 60 * 60 * 1000,
    );
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let result = MOCK_ACTIVITIES.filter((activity) => {
      // Date range filter
      const activityDate = new Date(activity.timestamp);

      let passDateFilter = true;
      switch (filters.dateRange) {
        case "today":
          passDateFilter =
            activityDate >= startOfToday && activityDate < startOfYesterday;
          break;
        case "yesterday":
          passDateFilter =
            activityDate >= startOfYesterday && activityDate < startOfToday;
          break;
        case "last7days":
          passDateFilter =
            activity.timestamp.getTime() >=
            now.getTime() - 7 * 24 * 60 * 60 * 1000;
          break;
        case "last30days":
          passDateFilter =
            activity.timestamp.getTime() >=
            now.getTime() - 30 * 24 * 60 * 60 * 1000;
          break;
        case "thisMonth":
          passDateFilter = activityDate >= startOfThisMonth;
          break;
        case "custom":
          if (filters.customStartDate && filters.customEndDate) {
            passDateFilter =
              activity.timestamp >= filters.customStartDate &&
              activity.timestamp <= filters.customEndDate;
          }
          break;
      }

      if (!passDateFilter) return false;

      // Activity type filter
      if (
        filters.activityType !== "all" &&
        activity.type !== filters.activityType
      ) {
        return false;
      }

      // User ID filter
      if (
        filters.userId &&
        filters.userId !== "all" &&
        activity.userId !== filters.userId
      ) {
        return false;
      }

      // Search query filter (case-insensitive)
      if (debouncedSearchQuery.trim()) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesDescription = activity.description
          .toLowerCase()
          .includes(query);
        const matchesUserName = activity.userName.toLowerCase().includes(query);

        let matchesTypeSpecific = false;
        switch (activity.type) {
          case "commit":
            matchesTypeSpecific =
              activity.commitMessage.toLowerCase().includes(query) ||
              (activity.files?.some((f) => f.toLowerCase().includes(query)) ??
                false);
            break;
          case "comment":
            matchesTypeSpecific =
              activity.commentText.toLowerCase().includes(query) ||
              (activity.fileName?.toLowerCase().includes(query) ?? false);
            break;
          case "task":
            matchesTypeSpecific =
              activity.taskTitle.toLowerCase().includes(query) ||
              activity.taskId.toLowerCase().includes(query);
            break;
          case "file":
            matchesTypeSpecific =
              activity.fileName.toLowerCase().includes(query) ||
              activity.filePath.toLowerCase().includes(query);
            break;
          case "branch":
            matchesTypeSpecific = activity.branchName
              .toLowerCase()
              .includes(query);
            break;
          case "pr":
            matchesTypeSpecific = activity.prTitle
              .toLowerCase()
              .includes(query);
            break;
        }

        if (!matchesDescription && !matchesUserName && !matchesTypeSpecific) {
          return false;
        }
      }

      return true;
    });

    // Sort
    if (sortOrder === "oldest") {
      result = result.reverse();
    }

    return result;
  }, [filters, debouncedSearchQuery, sortOrder]);

  // ===== PAGINATION STAGE =====
  // Apply pagination to filtered results
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);
  const hasMore = page < totalPages;

  // ===== GROUPING STAGE =====
  // Group paginated activities by selected strategy (date, user, type, or none)
  const groupedActivities = useMemo(() => {
    const groups: Record<string, Activity[]> = {};
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(
      startOfToday.getTime() - 24 * 60 * 60 * 1000,
    );

    paginatedActivities.forEach((activity) => {
      let groupKey = "";

      if (groupBy === "date") {
        const activityDate = new Date(activity.timestamp);

        if (activityDate >= startOfToday) {
          groupKey = "Today";
        } else if (activityDate >= startOfYesterday) {
          groupKey = "Yesterday";
        } else if (
          activity.timestamp.getTime() >=
          now.getTime() - 7 * 24 * 60 * 60 * 1000
        ) {
          groupKey = "This Week";
        } else if (
          activity.timestamp.getTime() >=
          now.getTime() - 14 * 24 * 60 * 60 * 1000
        ) {
          groupKey = "Last Week";
        } else {
          groupKey = "Older";
        }
      } else if (groupBy === "user") {
        groupKey = activity.userName;
      } else if (groupBy === "type") {
        const typeLabels: Record<string, string> = {
          commit: "Code Commits",
          comment: "Comments",
          task: "Tasks",
          settings: "Settings",
          user: "User Events",
          file: "File Operations",
          branch: "Branch Operations",
          pr: "Pull Requests",
        };
        groupKey = typeLabels[activity.type] || activity.type;
      } else {
        groupKey = "All Activities";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(activity);
    });

    return groups;
  }, [paginatedActivities, groupBy]);

  return {
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
    paginatedActivities,
    groupedActivities,
    totalPages,
    hasMore,
    selectedActivity,
    setSelectedActivity,
    isLoading,
    setIsLoading,
    totalActivities: MOCK_ACTIVITIES.length,
  };
};
