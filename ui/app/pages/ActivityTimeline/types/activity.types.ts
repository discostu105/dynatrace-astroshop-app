export type ActivityType = 'commit' | 'comment' | 'task' | 'settings' | 'user' | 'file' | 'branch' | 'pr';
export type DateGroup = 'Today' | 'Yesterday' | 'Last Week' | 'Older';
export type GroupByOption = 'date' | 'user' | 'type' | 'none';
export type SortOrder = 'newest' | 'oldest';
export type DateRange = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thismonth' | 'custom';
export type TaskStatus = 'created' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ActivityUser {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

// Commit Activity
export interface CommitActivityData {
  type: 'commit';
  commitHash: string;
  message: string;
  branch: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  files?: Array<{
    path: string;
    additions: number;
    deletions: number;
  }>;
}

// Comment Activity
export interface CommentActivityData {
  type: 'comment';
  context: string; // e.g., "Commented on Login.tsx"
  preview: string;
  line?: number;
  replyCount: number;
  fullText?: string;
}

// Task Activity
export interface TaskActivityData {
  type: 'task';
  taskId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: ActivityUser;
  dueDate?: string;
  fullDetails?: string;
}

// Settings Activity
export interface SettingsActivityData {
  type: 'settings';
  settingName: string;
  beforeValue: string;
  afterValue: string;
  scope: string;
}

// User Activity
export interface UserActivityData {
  type: 'user';
  action: string; // e.g., "joined the project"
  targetUser?: ActivityUser;
}

// File Activity
export interface FileActivityData {
  type: 'file';
  operation: 'created' | 'deleted' | 'renamed';
  filePath: string;
  fileSize?: number;
  previousPath?: string;
}

// Branch Activity
export interface BranchActivityData {
  type: 'branch';
  action: 'created' | 'deleted' | 'merged';
  branchName: string;
  sourceBranch?: string;
}

// PR Activity
export interface PRActivityData {
  type: 'pr';
  action: 'created' | 'merged' | 'closed';
  prNumber: number;
  title: string;
  reviewers?: ActivityUser[];
  status?: 'open' | 'merged' | 'closed';
}

export type ActivityData =
  | CommitActivityData
  | CommentActivityData
  | TaskActivityData
  | SettingsActivityData
  | UserActivityData
  | FileActivityData
  | BranchActivityData
  | PRActivityData;

export interface Activity {
  id: string;
  timestamp: string;
  user: ActivityUser;
  data: ActivityData;
  aggregatedCount?: number; // For grouped activities (e.g., "5 commits")
}

export interface ActivityFilters {
  searchQuery: string;
  activityType: ActivityType | 'all';
  userId: string | 'all';
  dateRange: DateRange;
  customStartDate?: string;
  customEndDate?: string;
}

export interface GroupedActivities {
  groupLabel: string;
  activities: Activity[];
}

export interface ActivityDetailModalProps {
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
}
