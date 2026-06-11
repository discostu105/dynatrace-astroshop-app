// Activity types
export type ActivityType = 'commit' | 'comment' | 'task' | 'settings' | 'user' | 'file' | 'branch' | 'pr';

export type TaskStatus = 'created' | 'in-progress' | 'completed' | 'closed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type FileOperation = 'created' | 'deleted' | 'renamed' | 'modified';
export type DateRangeOption = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thismonth';
export type GroupByOption = 'date' | 'user' | 'type' | 'none';
export type SortOrder = 'newest' | 'oldest';

// User profiles
export const TEAM_MEMBERS = [
  { id: 'john-doe', name: 'John Doe', initials: 'JD', role: 'developer' },
  { id: 'sarah-johnson', name: 'Sarah Johnson', initials: 'SJ', role: 'developer' },
  { id: 'mike-chen', name: 'Mike Chen', initials: 'MC', role: 'developer' },
  { id: 'emma-davis', name: 'Emma Davis', initials: 'ED', role: 'project-manager' },
  { id: 'tom-wilson', name: 'Tom Wilson', initials: 'TW', role: 'designer' },
];

// Activity interface
export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userInitials: string;
  timestamp: Date;
  relativeTime: string;
  title: string;
  description: string;
  
  // Commit specific
  commitMessage?: string;
  commitHash?: string;
  branch?: string;
  filesChanged?: number;
  additions?: number;
  deletions?: number;
  files?: { path: string; status: 'added' | 'modified' | 'deleted'; changes: number }[];
  
  // Comment specific
  commentPreview?: string;
  commentFile?: string;
  commentLine?: number;
  replyCount?: number;
  
  // Task specific
  taskId?: string;
  taskTitle?: string;
  taskStatus?: TaskStatus;
  taskPriority?: TaskPriority;
  taskAssignee?: string;
  taskDueDate?: Date;
  
  // Settings specific
  settingName?: string;
  settingBefore?: string;
  settingAfter?: string;
  settingScope?: string;
  
  // File specific
  fileOperation?: FileOperation;
  filePath?: string;
  fileSize?: string;
  
  // Branch/PR specific
  branchName?: string;
  prNumber?: number;
  prTitle?: string;
  reviewers?: string[];
  mergedBy?: string;
}

// Utility function to calculate relative time
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString();
}

// Generate activities
function generateActivities(): Activity[] {
  const now = new Date();
  const activities: Activity[] = [];
  let id = 1;

  // Helper to create date in past
  const daysAgo = (days: number, hours: number = 0, minutes: number = 0): Date => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    d.setHours(d.getHours() - hours);
    d.setMinutes(d.getMinutes() - minutes);
    return d;
  };

  // 1. Commit - John Doe, 2h ago
  activities.push({
    id: `activity-${id++}`,
    type: 'commit',
    userId: 'john-doe',
    userName: 'John Doe',
    userInitials: 'JD',
    timestamp: daysAgo(0, 2),
    relativeTime: '2h ago',
    title: 'Fixed authentication bug in login component',
    description: 'Resolved issue where OAuth token was not properly refreshed after expiration.',
    commitMessage: 'Fixed authentication bug in login component',
    commitHash: 'a1b2c3d',
    branch: 'feature/auth-fix',
    filesChanged: 5,
    additions: 125,
    deletions: 43,
    files: [
      { path: 'src/components/Login.tsx', status: 'modified', changes: 45 },
      { path: 'src/hooks/useAuth.ts', status: 'modified', changes: 28 },
      { path: 'src/utils/token.ts', status: 'modified', changes: 32 },
      { path: 'src/types/auth.types.ts', status: 'modified', changes: 12 },
      { path: 'src/pages/LoginPage.tsx', status: 'modified', changes: 8 },
    ],
  });

  // 2. Comment - Sarah Johnson, 3h ago
  activities.push({
    id: `activity-${id++}`,
    type: 'comment',
    userId: 'sarah-johnson',
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    timestamp: daysAgo(0, 3),
    relativeTime: '3h ago',
    title: 'Commented on Login.tsx',
    description: 'Left review comment on line 45 regarding error handling approach.',
    commentFile: 'src/components/Login.tsx',
    commentLine: 45,
    commentPreview: 'I think we should add more descriptive error messages for network failures. This will help users understand what went wrong.',
    replyCount: 2,
  });

  // 3. Task - Mike Chen, 5h ago (completed)
  activities.push({
    id: `activity-${id++}`,
    type: 'task',
    userId: 'mike-chen',
    userName: 'Mike Chen',
    userInitials: 'MC',
    timestamp: daysAgo(0, 5),
    relativeTime: '5h ago',
    title: 'Completed task: Update authentication documentation',
    description: 'Finished updating API documentation for authentication endpoints.',
    taskId: 'TASK-123',
    taskTitle: 'Update authentication documentation',
    taskStatus: 'completed',
    taskPriority: 'Medium',
  });

  // 4. Settings - Emma Davis, 1 day ago
  activities.push({
    id: `activity-${id++}`,
    type: 'settings',
    userId: 'emma-davis',
    userName: 'Emma Davis',
    userInitials: 'ED',
    timestamp: daysAgo(1),
    relativeTime: '1d ago',
    title: 'Changed feature flag: dark-mode',
    description: 'Toggled dark mode feature flag for all users.',
    settingName: 'Feature Flag: dark-mode',
    settingBefore: 'Disabled',
    settingAfter: 'Enabled',
    settingScope: 'Shared-UI',
  });

  // 5. User - Tom Wilson, 1 day ago
  activities.push({
    id: `activity-${id++}`,
    type: 'user',
    userId: 'tom-wilson',
    userName: 'Tom Wilson',
    userInitials: 'TW',
    timestamp: daysAgo(1),
    relativeTime: '1d ago',
    title: 'Tom Wilson joined the project',
    description: 'New team member added to AstroShop project.',
  });

  // 6. File - Sarah Johnson, 2 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'file',
    userId: 'sarah-johnson',
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    timestamp: daysAgo(2),
    relativeTime: '2d ago',
    title: 'Created new file: Dashboard.tsx',
    description: 'Added new dashboard component.',
    fileOperation: 'created',
    filePath: 'src/pages/Dashboard.tsx',
    fileSize: '2.5 KB',
  });

  // 7. Commit - John Doe, 2 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'commit',
    userId: 'john-doe',
    userName: 'John Doe',
    userInitials: 'JD',
    timestamp: daysAgo(2, 3),
    relativeTime: '2d ago',
    title: 'Implement dark mode toggle component',
    description: 'Added UI component for users to toggle dark mode preference.',
    commitMessage: 'Implement dark mode toggle component',
    commitHash: 'd4e5f6g',
    branch: 'feature/dark-mode',
    filesChanged: 8,
    additions: 234,
    deletions: 12,
    files: [
      { path: 'src/components/DarkModeToggle.tsx', status: 'added', changes: 125 },
      { path: 'src/hooks/useDarkMode.ts', status: 'added', changes: 45 },
      { path: 'src/styles/theme.ts', status: 'modified', changes: 32 },
      { path: 'src/App.tsx', status: 'modified', changes: 18 },
      { path: 'src/types/theme.types.ts', status: 'modified', changes: 8 },
      { path: 'src/utils/localStorage.ts', status: 'modified', changes: 4 },
      { path: 'README.md', status: 'modified', changes: 2 },
      { path: 'package.json', status: 'modified', changes: 0 },
    ],
  });

  // 8. Branch - Mike Chen, 3 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'branch',
    userId: 'mike-chen',
    userName: 'Mike Chen',
    userInitials: 'MC',
    timestamp: daysAgo(3),
    relativeTime: '3d ago',
    title: 'Created branch: feature/new-dashboard',
    description: 'Started work on new dashboard redesign.',
    branchName: 'feature/new-dashboard',
  });

  // 9. PR - Emma Davis, 4 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'pr',
    userId: 'emma-davis',
    userName: 'Emma Davis',
    userInitials: 'ED',
    timestamp: daysAgo(4),
    relativeTime: '4d ago',
    title: 'Merged PR #284: Add user authentication',
    description: 'Merged user authentication feature into main branch.',
    prNumber: 284,
    prTitle: 'Add user authentication',
    reviewers: ['John Doe', 'Sarah Johnson'],
    mergedBy: 'Emma Davis',
  });

  // 10. Task - Tom Wilson, 5 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'task',
    userId: 'tom-wilson',
    userName: 'Tom Wilson',
    userInitials: 'TW',
    timestamp: daysAgo(5),
    relativeTime: '5d ago',
    title: 'Created task: Fix navigation bug on mobile',
    description: 'New task created for fixing mobile navigation issue.',
    taskId: 'TASK-124',
    taskTitle: 'Fix navigation bug on mobile',
    taskStatus: 'created',
    taskPriority: 'High',
    taskAssignee: 'John Doe',
    taskDueDate: daysAgo(-15), // 15 days from now
  });

  // Additional activities (40+ more)
  
  // 11. Commit - Sarah Johnson, 5 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'commit',
    userId: 'sarah-johnson',
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    timestamp: daysAgo(5, 8),
    relativeTime: '5d ago',
    title: 'Refactor API service layer',
    description: 'Improved API service architecture and error handling.',
    commitMessage: 'Refactor API service layer for better maintainability',
    commitHash: 'h7i8j9k',
    branch: 'refactor/api-service',
    filesChanged: 6,
    additions: 178,
    deletions: 92,
    files: [
      { path: 'src/services/api.ts', status: 'modified', changes: 120 },
      { path: 'src/services/request.ts', status: 'modified', changes: 58 },
      { path: 'src/types/api.types.ts', status: 'modified', changes: 12 },
      { path: 'src/hooks/useAPI.ts', status: 'modified', changes: 8 },
      { path: 'src/utils/errorHandler.ts', status: 'added', changes: 32 },
      { path: 'src/constants/endpoints.ts', status: 'modified', changes: 8 },
    ],
  });

  // 12. Comment - Mike Chen, 6 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'comment',
    userId: 'mike-chen',
    userName: 'Mike Chen',
    userInitials: 'MC',
    timestamp: daysAgo(6),
    relativeTime: '6d ago',
    title: 'Commented on OrdersTable.tsx',
    description: 'Reviewed sorting implementation.',
    commentFile: 'src/components/OrdersTable.tsx',
    commentLine: 128,
    commentPreview: 'Great work on the performance optimization! The sorting now completes instantly with large datasets.',
    replyCount: 1,
  });

  // 13. Settings - John Doe, 6 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'settings',
    userId: 'john-doe',
    userName: 'John Doe',
    userInitials: 'JD',
    timestamp: daysAgo(6),
    relativeTime: '6d ago',
    title: 'Updated: API rate limit',
    description: 'Increased API rate limit for premium tier.',
    settingName: 'API Rate Limit (Premium)',
    settingBefore: '1000 req/hour',
    settingAfter: '5000 req/hour',
    settingScope: 'API Configuration',
  });

  // 14. File - Tom Wilson, 7 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'file',
    userId: 'tom-wilson',
    userName: 'Tom Wilson',
    userInitials: 'TW',
    timestamp: daysAgo(7),
    relativeTime: '7d ago',
    title: 'Renamed file: Navigation.tsx -> AppNavigation.tsx',
    description: 'Refactored component name for clarity.',
    fileOperation: 'renamed',
    filePath: 'src/components/Navigation.tsx',
  });

  // 15. Commit - Mike Chen, 7 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'commit',
    userId: 'mike-chen',
    userName: 'Mike Chen',
    userInitials: 'MC',
    timestamp: daysAgo(7, 2),
    relativeTime: '7d ago',
    title: 'Add unit tests for dashboard',
    description: 'Comprehensive test coverage for dashboard component.',
    commitMessage: 'Add unit tests for dashboard component',
    commitHash: 'l0m1n2o',
    branch: 'feature/dashboard-tests',
    filesChanged: 4,
    additions: 287,
    deletions: 0,
    files: [
      { path: 'src/components/__tests__/Dashboard.test.tsx', status: 'added', changes: 145 },
      { path: 'src/hooks/__tests__/useDashboard.test.ts', status: 'added', changes: 98 },
      { path: 'src/__mocks__/dashboardData.ts', status: 'added', changes: 44 },
      { path: 'jest.config.js', status: 'modified', changes: 0 },
    ],
  });

  // 16. Task - Emma Davis, 8 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'task',
    userId: 'emma-davis',
    userName: 'Emma Davis',
    userInitials: 'ED',
    timestamp: daysAgo(8),
    relativeTime: '8d ago',
    title: 'Completed task: Design system documentation',
    description: 'Finished comprehensive design system documentation.',
    taskId: 'TASK-125',
    taskTitle: 'Design system documentation',
    taskStatus: 'completed',
    taskPriority: 'High',
  });

  // 17. Comment - Sarah Johnson, 9 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'comment',
    userId: 'sarah-johnson',
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    timestamp: daysAgo(9),
    relativeTime: '9d ago',
    title: 'Commented on useAuth.ts',
    description: 'Suggested improvements to authentication flow.',
    commentFile: 'src/hooks/useAuth.ts',
    commentLine: 34,
    commentPreview: 'Consider adding a refresh mechanism to handle expired tokens silently in the background.',
    replyCount: 3,
  });

  // 18. PR - John Doe, 10 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'pr',
    userId: 'john-doe',
    userName: 'John Doe',
    userInitials: 'JD',
    timestamp: daysAgo(10),
    relativeTime: '10d ago',
    title: 'Merged PR #283: Performance improvements',
    description: 'Merged performance optimization PR.',
    prNumber: 283,
    prTitle: 'Performance improvements - optimize bundle size',
    reviewers: ['Sarah Johnson', 'Mike Chen'],
    mergedBy: 'John Doe',
  });

  // 19. Branch - Sarah Johnson, 11 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'branch',
    userId: 'sarah-johnson',
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    timestamp: daysAgo(11),
    relativeTime: '11d ago',
    title: 'Created branch: bugfix/order-pagination',
    description: 'Started fixing pagination issues in order list.',
    branchName: 'bugfix/order-pagination',
  });

  // 20. Commit - Emma Davis, 12 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'commit',
    userId: 'emma-davis',
    userName: 'Emma Davis',
    userInitials: 'ED',
    timestamp: daysAgo(12),
    relativeTime: '12d ago',
    title: 'Update dependencies to latest versions',
    description: 'Updated all package dependencies to latest stable versions.',
    commitMessage: 'Update dependencies to latest versions',
    commitHash: 'p3q4r5s',
    branch: 'chore/update-deps',
    filesChanged: 3,
    additions: 12,
    deletions: 8,
    files: [
      { path: 'package.json', status: 'modified', changes: 5 },
      { path: 'package-lock.json', status: 'modified', changes: 4 },
      { path: 'CHANGELOG.md', status: 'modified', changes: 3 },
    ],
  });

  // 21. Task - Mike Chen, 13 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'task',
    userId: 'mike-chen',
    userName: 'Mike Chen',
    userInitials: 'MC',
    timestamp: daysAgo(13),
    relativeTime: '13d ago',
    title: 'In progress: Implement caching strategy',
    description: 'Working on implementing caching layer for API calls.',
    taskId: 'TASK-126',
    taskTitle: 'Implement caching strategy',
    taskStatus: 'in-progress',
    taskPriority: 'Medium',
    taskAssignee: 'Mike Chen',
    taskDueDate: daysAgo(-5),
  });

  // 22. Settings - Tom Wilson, 14 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'settings',
    userId: 'tom-wilson',
    userName: 'Tom Wilson',
    userInitials: 'TW',
    timestamp: daysAgo(14),
    relativeTime: '14d ago',
    title: 'Changed: Default theme color',
    description: 'Updated default application theme colors.',
    settingName: 'Default Theme Color',
    settingBefore: '#1976d2',
    settingAfter: '#1890ff',
    settingScope: 'UI Theme',
  });

  // 23. File - John Doe, 15 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'file',
    userId: 'john-doe',
    userName: 'John Doe',
    userInitials: 'JD',
    timestamp: daysAgo(15),
    relativeTime: '15d ago',
    title: 'Created new file: useGeoLocation.ts',
    description: 'Added geolocation tracking hook.',
    fileOperation: 'created',
    filePath: 'src/hooks/useGeoLocation.ts',
    fileSize: '1.8 KB',
  });

  // 24. Comment - Emma Davis, 16 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'comment',
    userId: 'emma-davis',
    userName: 'Emma Davis',
    userInitials: 'ED',
    timestamp: daysAgo(16),
    relativeTime: '16d ago',
    title: 'Commented on GeoAnalytics page',
    description: 'Reviewed geographic analytics implementation.',
    commentFile: 'src/pages/GeoAnalytics.tsx',
    commentLine: 67,
    commentPreview: 'The map rendering looks great! Consider adding loading states for better UX.',
    replyCount: 2,
  });

  // 25. Commit - Sarah Johnson, 17 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'commit',
    userId: 'sarah-johnson',
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    timestamp: daysAgo(17, 6),
    relativeTime: '17d ago',
    title: 'Add accessibility improvements',
    description: 'Improved keyboard navigation and screen reader support.',
    commitMessage: 'Add accessibility improvements - WCAG 2.1 compliance',
    commitHash: 't6u7v8w',
    branch: 'feature/a11y',
    filesChanged: 12,
    additions: 156,
    deletions: 34,
    files: [
      { path: 'src/components/Button.tsx', status: 'modified', changes: 24 },
      { path: 'src/components/Modal.tsx', status: 'modified', changes: 18 },
      { path: 'src/hooks/useKeyboard.ts', status: 'added', changes: 45 },
      { path: 'src/utils/a11y.ts', status: 'added', changes: 32 },
      { path: 'src/components/Nav.tsx', status: 'modified', changes: 15 },
      { path: 'src/components/Form.tsx', status: 'modified', changes: 12 },
      { path: 'src/types/a11y.types.ts', status: 'added', changes: 8 },
      { path: 'README.md', status: 'modified', changes: 2 },
    ],
  });

  // 26. PR - Mike Chen, 18 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'pr',
    userId: 'mike-chen',
    userName: 'Mike Chen',
    userInitials: 'MC',
    timestamp: daysAgo(18),
    relativeTime: '18d ago',
    title: 'Merged PR #282: Add error boundary',
    description: 'Merged error boundary implementation.',
    prNumber: 282,
    prTitle: 'Add error boundary and error logging',
    reviewers: ['John Doe'],
    mergedBy: 'Mike Chen',
  });

  // 27. Task - John Doe, 19 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'task',
    userId: 'john-doe',
    userName: 'John Doe',
    userInitials: 'JD',
    timestamp: daysAgo(19),
    relativeTime: '19d ago',
    title: 'Completed task: Security audit',
    description: 'Finished comprehensive security audit.',
    taskId: 'TASK-127',
    taskTitle: 'Security audit',
    taskStatus: 'completed',
    taskPriority: 'Critical',
  });

  // 28. File - Sarah Johnson, 20 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'file',
    userId: 'sarah-johnson',
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    timestamp: daysAgo(20),
    relativeTime: '20d ago',
    title: 'Deleted file: deprecated/OldComponent.tsx',
    description: 'Removed deprecated component.',
    fileOperation: 'deleted',
    filePath: 'src/deprecated/OldComponent.tsx',
  });

  // 29. Branch - Emma Davis, 21 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'branch',
    userId: 'emma-davis',
    userName: 'Emma Davis',
    userInitials: 'ED',
    timestamp: daysAgo(21),
    relativeTime: '21d ago',
    title: 'Created branch: release/v1.0.0',
    description: 'Started release branch for v1.0.0.',
    branchName: 'release/v1.0.0',
  });

  // 30. Commit - Tom Wilson, 22 days ago
  activities.push({
    id: `activity-${id++}`,
    type: 'commit',
    userId: 'tom-wilson',
    userName: 'Tom Wilson',
    userInitials: 'TW',
    timestamp: daysAgo(22),
    relativeTime: '22d ago',
    title: 'Design token updates',
    description: 'Updated design tokens for consistent styling.',
    commitMessage: 'Update design tokens for v1.0.0 release',
    commitHash: 'x9y0z1a',
    branch: 'design/tokens-v1',
    filesChanged: 5,
    additions: 89,
    deletions: 52,
    files: [
      { path: 'src/styles/tokens.ts', status: 'modified', changes: 45 },
      { path: 'src/styles/colors.ts', status: 'modified', changes: 28 },
      { path: 'src/styles/spacing.ts', status: 'modified', changes: 16 },
    ],
  });

  // Additional activities to reach 50+
  // 31-50 activities
  const additionalActivities = [
    {
      type: 'comment' as ActivityType,
      userId: 'mike-chen',
      userName: 'Mike Chen',
      userInitials: 'MC',
      title: 'Commented on ErrorBoundary.tsx',
      commentFile: 'src/components/ErrorBoundary.tsx',
      commentLine: 45,
      commentPreview: 'Good catch on the error logging. We should also capture breadcrumbs for better debugging.',
      replyCount: 1,
    },
    {
      type: 'task' as ActivityType,
      userId: 'sarah-johnson',
      userName: 'Sarah Johnson',
      userInitials: 'SJ',
      title: 'Created task: Database optimization',
      taskId: 'TASK-128',
      taskTitle: 'Database optimization',
      taskStatus: 'created' as TaskStatus,
      taskPriority: 'High' as TaskPriority,
    },
    {
      type: 'commit' as ActivityType,
      userId: 'john-doe',
      userName: 'John Doe',
      userInitials: 'JD',
      title: 'Add GraphQL integration',
      commitMessage: 'Add GraphQL integration for API',
      commitHash: 'b2c3d4e',
      branch: 'feature/graphql',
      filesChanged: 9,
      additions: 245,
      deletions: 78,
    },
    {
      type: 'settings' as ActivityType,
      userId: 'emma-davis',
      userName: 'Emma Davis',
      userInitials: 'ED',
      title: 'Changed: Database connection pool',
      settingName: 'DB Connection Pool Size',
      settingBefore: '10',
      settingAfter: '25',
      settingScope: 'Database',
    },
    {
      type: 'file' as ActivityType,
      userId: 'tom-wilson',
      userName: 'Tom Wilson',
      userInitials: 'TW',
      title: 'Created new file: icons.ts',
      filePath: 'src/assets/icons.ts',
      fileSize: '3.2 KB',
      fileOperation: 'created' as FileOperation,
    },
    {
      type: 'pr' as ActivityType,
      userId: 'mike-chen',
      userName: 'Mike Chen',
      userInitials: 'MC',
      title: 'Merged PR #281: State management refactor',
      prNumber: 281,
      prTitle: 'Refactor state management with Redux',
      reviewers: ['Sarah Johnson', 'John Doe'],
      mergedBy: 'Mike Chen',
    },
    {
      type: 'branch' as ActivityType,
      userId: 'sarah-johnson',
      userName: 'Sarah Johnson',
      userInitials: 'SJ',
      title: 'Created branch: feature/offline-mode',
      branchName: 'feature/offline-mode',
    },
    {
      type: 'commit' as ActivityType,
      userId: 'emma-davis',
      userName: 'Emma Davis',
      userInitials: 'ED',
      title: 'Add service worker for offline support',
      commitMessage: 'Implement service worker for offline functionality',
      commitHash: 'f5g6h7i',
      branch: 'feature/offline-mode',
      filesChanged: 6,
      additions: 167,
      deletions: 23,
    },
    {
      type: 'task' as ActivityType,
      userId: 'john-doe',
      userName: 'John Doe',
      userInitials: 'JD',
      title: 'In progress: Update company branding',
      taskId: 'TASK-129',
      taskTitle: 'Update company branding',
      taskStatus: 'in-progress' as TaskStatus,
      taskPriority: 'Low' as TaskPriority,
    },
    {
      type: 'comment' as ActivityType,
      userId: 'tom-wilson',
      userName: 'Tom Wilson',
      userInitials: 'TW',
      title: 'Commented on design-system.md',
      commentFile: 'docs/design-system.md',
      commentLine: 120,
      commentPreview: 'The spacing scale looks consistent. Should we add examples for responsive breakpoints?',
      replyCount: 0,
    },
    {
      type: 'file' as ActivityType,
      userId: 'mike-chen',
      userName: 'Mike Chen',
      userInitials: 'MC',
      title: 'Modified file: API endpoints',
      filePath: 'src/constants/endpoints.ts',
      fileSize: '2.1 KB',
      fileOperation: 'modified' as FileOperation,
    },
    {
      type: 'commit' as ActivityType,
      userId: 'sarah-johnson',
      userName: 'Sarah Johnson',
      userInitials: 'SJ',
      title: 'Implement real-time notifications',
      commitMessage: 'Add real-time WebSocket notifications',
      commitHash: 'j8k9l0m',
      branch: 'feature/notifications',
      filesChanged: 7,
      additions: 198,
      deletions: 45,
    },
    {
      type: 'settings' as ActivityType,
      userId: 'john-doe',
      userName: 'John Doe',
      userInitials: 'JD',
      title: 'Changed: Email notification settings',
      settingName: 'Email Notifications',
      settingBefore: 'Disabled',
      settingAfter: 'Enabled',
      settingScope: 'Email',
    },
    {
      type: 'pr' as ActivityType,
      userId: 'emma-davis',
      userName: 'Emma Davis',
      userInitials: 'ED',
      title: 'Merged PR #280: Add TypeScript strict mode',
      prNumber: 280,
      prTitle: 'Enable TypeScript strict mode',
      reviewers: ['John Doe'],
      mergedBy: 'Emma Davis',
    },
    {
      type: 'task' as ActivityType,
      userId: 'mike-chen',
      userName: 'Mike Chen',
      userInitials: 'MC',
      title: 'Closed task: Legacy API removal',
      taskId: 'TASK-130',
      taskTitle: 'Remove legacy API endpoints',
      taskStatus: 'closed' as TaskStatus,
      taskPriority: 'Medium' as TaskPriority,
    },
    {
      type: 'commit' as ActivityType,
      userId: 'tom-wilson',
      userName: 'Tom Wilson',
      userInitials: 'TW',
      title: 'Add responsive design system',
      commitMessage: 'Implement responsive design utilities',
      commitHash: 'n1o2p3q',
      branch: 'feature/responsive',
      filesChanged: 8,
      additions: 223,
      deletions: 67,
    },
    {
      type: 'branch' as ActivityType,
      userId: 'john-doe',
      userName: 'John Doe',
      userInitials: 'JD',
      title: 'Created branch: hotfix/critical-bug',
      branchName: 'hotfix/critical-bug',
    },
    {
      type: 'file' as ActivityType,
      userId: 'sarah-johnson',
      userName: 'Sarah Johnson',
      userInitials: 'SJ',
      title: 'Deleted file: unused styles',
      filePath: 'src/styles/unused.css',
      fileOperation: 'deleted' as FileOperation,
    },
    {
      type: 'comment' as ActivityType,
      userId: 'emma-davis',
      userName: 'Emma Davis',
      userInitials: 'ED',
      title: 'Commented on pull request',
      commentFile: 'PR #279',
      commentLine: 0,
      commentPreview: 'LGTM! This implementation looks solid. Nice work on the comprehensive testing.',
      replyCount: 0,
    },
    {
      type: 'task' as ActivityType,
      userId: 'tom-wilson',
      userName: 'Tom Wilson',
      userInitials: 'TW',
      title: 'Created task: Update user documentation',
      taskId: 'TASK-131',
      taskTitle: 'Update user documentation',
      taskStatus: 'created' as TaskStatus,
      taskPriority: 'Medium' as TaskPriority,
    },
  ];

  // Add activities with timestamps distributed over past 30 days
  additionalActivities.forEach((activity, index) => {
    const daysAgoVal = 23 + Math.floor(index / 2);
    activities.push({
      ...(activity as unknown as Activity),
      id: `activity-${id++}`,
      timestamp: daysAgo(daysAgoVal),
      relativeTime: `${daysAgoVal}d ago`,
    });
  });

  // More activities to reach 50+ total
  const moreTasks = [
    { taskId: 'TASK-132', taskTitle: 'Implement dark mode', taskPriority: 'High' as TaskPriority },
    { taskId: 'TASK-133', taskTitle: 'Performance testing', taskPriority: 'Medium' as TaskPriority },
    { taskId: 'TASK-134', taskTitle: 'User feedback survey', taskPriority: 'Low' as TaskPriority },
    { taskId: 'TASK-135', taskTitle: 'Setup CI/CD pipeline', taskPriority: 'Critical' as TaskPriority },
  ];

  moreTasks.forEach((task, index) => {
    activities.push({
      id: `activity-${id++}`,
      type: 'task',
      userId: TEAM_MEMBERS[index % 5].id,
      userName: TEAM_MEMBERS[index % 5].name,
      userInitials: TEAM_MEMBERS[index % 5].initials,
      timestamp: daysAgo(28 + index),
      relativeTime: `${28 + index}d ago`,
      title: `Created task: ${task.taskTitle}`,
      description: `New task for ${task.taskTitle}`,
      taskId: task.taskId,
      taskTitle: task.taskTitle,
      taskStatus: 'created',
      taskPriority: task.taskPriority,
    });
  });

  // Sort by timestamp newest first
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return activities;
}

export const MOCK_ACTIVITIES = generateActivities();

// Color mapping for activity types
export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  commit: '#3b82f6', // Blue
  task: '#22c55e', // Green
  comment: '#eab308', // Yellow
  settings: '#a855f7', // Purple
  user: '#6b7280', // Gray
  file: '#f97316', // Orange
  branch: '#06b6d4', // Teal
  pr: '#ec4899', // Pink
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  commit: 'Commit',
  task: 'Task',
  comment: 'Comment',
  settings: 'Settings',
  user: 'User',
  file: 'File',
  branch: 'Branch',
  pr: 'Pull Request',
};

export interface GroupedActivities {
  groupLabel: string;
  activities: Activity[];
}
