import type { Activity, ActivityFilters, GroupByOption, GroupedActivities, DateGroup, DateRange } from '../types/activity.types';

export const formatRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
};

export const formatAbsoluteTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const getDateGroup = (timestamp: string): DateGroup => {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (activityDate.getTime() === today.getTime()) return 'Today';
  if (activityDate.getTime() === yesterday.getTime()) return 'Yesterday';
  if (activityDate.getTime() > weekAgo.getTime()) return 'Last Week';
  return 'Older';
};

export const getDateRangeTimestamps = (
  dateRange: DateRange,
  customStart?: string,
  customEnd?: string
): { start: Date; end: Date } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let start: Date;

  switch (dateRange) {
    case 'today':
      start = today;
      break;
    case 'yesterday':
      start = new Date(today);
      start.setDate(start.getDate() - 1);
      break;
    case 'last7days':
      start = new Date(today);
      start.setDate(start.getDate() - 7);
      break;
    case 'last30days':
      start = new Date(today);
      start.setDate(start.getDate() - 30);
      break;
    case 'thismonth':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'custom':
      start = customStart ? new Date(customStart) : today;
      break;
    default:
      start = today;
  }

  return {
    start,
    end: dateRange === 'custom' && customEnd ? new Date(customEnd) : now,
  };
};

export const searchActivities = (activities: Activity[], query: string): Activity[] => {
  if (!query.trim()) return activities;

  const q = query.toLowerCase();
  return activities.filter(activity => {
    const { data, user } = activity;
    const userMatch = user.name.toLowerCase().includes(q) || user.email?.toLowerCase().includes(q);

    switch (data.type) {
      case 'commit':
        return userMatch || data.message.toLowerCase().includes(q) || data.commitHash.includes(q);
      case 'comment':
        return userMatch || data.preview.toLowerCase().includes(q) || data.context.toLowerCase().includes(q);
      case 'task':
        return userMatch || data.title.toLowerCase().includes(q) || data.taskId.toLowerCase().includes(q);
      case 'settings':
        return userMatch || data.settingName.toLowerCase().includes(q);
      case 'file':
        return userMatch || data.filePath.toLowerCase().includes(q);
      case 'branch':
        return userMatch || data.branchName.toLowerCase().includes(q);
      case 'pr':
        return userMatch || data.title.toLowerCase().includes(q) || data.prNumber.toString().includes(q);
      case 'user':
        return userMatch || data.action.toLowerCase().includes(q);
      default:
        return userMatch;
    }
  });
};

export const filterActivities = (activities: Activity[], filters: ActivityFilters): Activity[] => {
  let filtered = [...activities];

  if (filters.activityType !== 'all') {
    filtered = filtered.filter(a => a.data.type === filters.activityType);
  }

  if (filters.userId !== 'all') {
    filtered = filtered.filter(a => a.user.id === filters.userId);
  }

  const { start, end } = getDateRangeTimestamps(filters.dateRange, filters.customStartDate, filters.customEndDate);
  filtered = filtered.filter(a => {
    const activityDate = new Date(a.timestamp);
    return activityDate >= start && activityDate <= end;
  });

  if (filters.searchQuery.trim()) {
    filtered = searchActivities(filtered, filters.searchQuery);
  }

  return filtered;
};

export const sortActivities = (activities: Activity[], order: 'newest' | 'oldest'): Activity[] => {
  const sorted = [...activities];
  sorted.sort((a, b) => {
    const aTime = new Date(a.timestamp).getTime();
    const bTime = new Date(b.timestamp).getTime();
    return order === 'newest' ? bTime - aTime : aTime - bTime;
  });
  return sorted;
};

export const groupActivities = (activities: Activity[], groupBy: GroupByOption): GroupedActivities[] => {
  if (groupBy === 'none') {
    return [{ groupLabel: '', activities }];
  }

  const groups = new Map<string, Activity[]>();

  activities.forEach(activity => {
    let groupLabel = '';

    switch (groupBy) {
      case 'date':
        groupLabel = getDateGroup(activity.timestamp);
        break;
      case 'user':
        groupLabel = activity.user.name;
        break;
      case 'type':
        groupLabel = activity.data.type.charAt(0).toUpperCase() + activity.data.type.slice(1) + 's';
        break;
      case 'none':
        groupLabel = '';
        break;
    }

    if (!groups.has(groupLabel)) {
      groups.set(groupLabel, []);
    }
    const groupList = groups.get(groupLabel);
    if (groupList) {
      groupList.push(activity);
    }
  });

  const result: GroupedActivities[] = [];

  if (groupBy === 'date') {
    const dateOrder: DateGroup[] = ['Today', 'Yesterday', 'Last Week', 'Older'];
    dateOrder.forEach(label => {
      const groupList = groups.get(label);
      if (groupList) {
        result.push({ groupLabel: label, activities: groupList });
      }
    });
  } else if (groupBy === 'type') {
    const typeOrder = ['Commits', 'Comments', 'Tasks', 'Settings', 'Users', 'Files', 'Branches', 'Prs'];
    typeOrder.forEach(label => {
      const groupList = groups.get(label);
      if (groupList) {
        result.push({ groupLabel: label, activities: groupList });
      }
    });
  } else if (groupBy === 'user') {
    const sorted = Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    sorted.forEach(([label, groupList]) => {
      result.push({ groupLabel: label, activities: groupList });
    });
  }

  return result;
};

export const aggregateActivities = (activities: Activity[], timeWindowMs: number = 3600000): Activity[] => {
  if (activities.length === 0) return [];

  const aggregated: Activity[] = [];
  let currentGroup: Activity[] = [activities[0]];

  for (let i = 1; i < activities.length; i++) {
    const current = activities[i];
    const previous = activities[i - 1];

    const isSameType = current.data.type === previous.data.type;
    const isSameUser = current.user.id === previous.user.id;
    const withinTimeWindow = Math.abs(
      new Date(current.timestamp).getTime() - new Date(previous.timestamp).getTime()
    ) < timeWindowMs;

    if (isSameType && isSameUser && withinTimeWindow) {
      currentGroup.push(current);
    } else {
      if (currentGroup.length > 1) {
        aggregated.push({
          ...currentGroup[0],
          aggregatedCount: currentGroup.length,
        });
      } else {
        aggregated.push(...currentGroup);
      }

      currentGroup = [current];
    }
  }

  if (currentGroup.length > 1) {
    aggregated.push({
      ...currentGroup[0],
      aggregatedCount: currentGroup.length,
    });
  } else {
    aggregated.push(...currentGroup);
  }

  return aggregated;
};

export const getActivityTypeCounts = (activities: Activity[]): Record<string, number> => {
  const counts: Record<string, number> = {
    all: activities.length,
    commit: 0,
    comment: 0,
    task: 0,
    settings: 0,
    user: 0,
    file: 0,
    branch: 0,
    pr: 0,
  };

  activities.forEach(a => {
    counts[a.data.type]++;
  });

  return counts;
};

export const getUniqueUsers = (activities: Activity[]) => {
  const userMap = new Map<string, typeof activities[0]['user']>();
  activities.forEach(a => {
    if (!userMap.has(a.user.id)) {
      userMap.set(a.user.id, a.user);
    }
  });
  return Array.from(userMap.values());
};

export const paginateActivities = (
  activities: Activity[],
  pageSize: number,
  pageNumber: number
): { items: Activity[]; hasMore: boolean; total: number } => {
  const total = activities.length;
  const start = pageNumber * pageSize;
  const end = start + pageSize;
  const items = activities.slice(start, end);
  const hasMore = end < total;

  return { items, hasMore, total };
};
