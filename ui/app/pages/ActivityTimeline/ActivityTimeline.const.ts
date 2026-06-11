export type ActivityType =
  | "commit"
  | "comment"
  | "task"
  | "settings"
  | "user"
  | "file"
  | "branch"
  | "pr";
export type GroupBy = "date" | "user" | "type" | "none";
export type SortOrder = "newest" | "oldest";
export type DateRange =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "custom";

export interface ActivityFilters {
  searchQuery: string;
  activityType: ActivityType | "all";
  userId: string; // 'all' or a specific user ID
  dateRange: DateRange;
  customStartDate?: Date;
  customEndDate?: Date;
}

export interface BaseActivity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  description: string;
}

export interface CommitActivity extends BaseActivity {
  type: "commit";
  commitHash: string;
  commitMessage: string;
  branch: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  files?: string[];
}

export interface CommentActivity extends BaseActivity {
  type: "comment";
  commentText: string;
  fileName?: string;
  lineNumber?: number;
  replyCount: number;
}

export interface TaskActivity extends BaseActivity {
  type: "task";
  taskId: string;
  taskTitle: string;
  action: "created" | "updated" | "completed" | "in_progress";
  priority: "low" | "medium" | "high" | "critical";
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: Date;
}

export interface SettingsActivity extends BaseActivity {
  type: "settings";
  settingName: string;
  previousValue: string;
  newValue: string;
  scope: string;
}

export interface UserActivity extends BaseActivity {
  type: "user";
  action: "joined" | "left" | "role_changed" | "assigned";
  role?: string;
}

export interface FileActivity extends BaseActivity {
  type: "file";
  operation: "created" | "deleted" | "renamed" | "moved";
  filePath: string;
  fileName: string;
  fileSize?: string;
  oldPath?: string;
}

export interface BranchActivity extends BaseActivity {
  type: "branch";
  action: "created" | "deleted" | "merged";
  branchName: string;
  sourceBranch?: string;
}

export interface PRActivity extends BaseActivity {
  type: "pr";
  action: "opened" | "merged" | "closed" | "reviewed";
  prNumber: number;
  prTitle: string;
  reviewers?: string[];
  status: "open" | "merged" | "closed";
}

export type Activity =
  | CommitActivity
  | CommentActivity
  | TaskActivity
  | SettingsActivity
  | UserActivity
  | FileActivity
  | BranchActivity
  | PRActivity;

const USERS = [
  { id: "john-doe", name: "John Doe" },
  { id: "sarah-johnson", name: "Sarah Johnson" },
  { id: "mike-chen", name: "Mike Chen" },
  { id: "emma-davis", name: "Emma Davis" },
  { id: "tom-wilson", name: "Tom Wilson" },
];

const getRandomUser = () => USERS[Math.floor(Math.random() * USERS.length)];

const generateMockActivities = (): Activity[] => {
  const activities: Activity[] = [];
  const now = new Date();

  // 1. Commit, John Doe, 2h ago
  activities.push({
    id: "1",
    type: "commit",
    userId: "john-doe",
    userName: "John Doe",
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    description: "Fixed authentication bug in login component",
    commitHash: "a1b2c3d",
    commitMessage: "Fixed authentication bug in login component",
    branch: "feature/auth-fix",
    filesChanged: 5,
    additions: 125,
    deletions: 43,
    files: [
      "src/components/Login.tsx",
      "src/services/auth.ts",
      "src/types/auth.types.ts",
      "src/utils/tokenManager.ts",
      "src/hooks/useAuth.ts",
    ],
  });

  // 2. Comment, Sarah Johnson, 3h ago
  activities.push({
    id: "2",
    type: "comment",
    userId: "sarah-johnson",
    userName: "Sarah Johnson",
    timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    description: "Commented on Login.tsx",
    commentText:
      "Great fix! The authentication flow is much smoother now. Have you tested with SSO providers?",
    fileName: "Login.tsx",
    lineNumber: 45,
    replyCount: 2,
  });

  // 3. Task, Mike Chen, 5h ago
  activities.push({
    id: "3",
    type: "task",
    userId: "mike-chen",
    userName: "Mike Chen",
    timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    description: "Completed Update authentication documentation",
    taskId: "TASK-123",
    taskTitle: "Update authentication documentation",
    action: "completed",
    priority: "medium",
    dueDate: new Date(now.getTime() - 12 * 60 * 60 * 1000),
  });

  // 4. Settings, Emma Davis, 1 day ago
  activities.push({
    id: "4",
    type: "settings",
    userId: "emma-davis",
    userName: "Emma Davis",
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    description: "Feature Flag: dark-mode",
    settingName: "Feature Flag: dark-mode",
    previousValue: "Disabled",
    newValue: "Enabled",
    scope: "Shared-UI",
  });

  // 5. User, Tom Wilson, 1 day ago
  activities.push({
    id: "5",
    type: "user",
    userId: "tom-wilson",
    userName: "Tom Wilson",
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    description: "joined the project",
    action: "joined",
    role: "Developer",
  });

  // 6. File, Sarah Johnson, 2 days ago
  activities.push({
    id: "6",
    type: "file",
    userId: "sarah-johnson",
    userName: "Sarah Johnson",
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    description: "created Dashboard.tsx",
    operation: "created",
    filePath: "src/pages/Dashboard/",
    fileName: "Dashboard.tsx",
    fileSize: "2.5 KB",
  });

  // 7. Commit, John Doe, 2 days ago
  activities.push({
    id: "7",
    type: "commit",
    userId: "john-doe",
    userName: "John Doe",
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    description: "Implement dark mode toggle component",
    commitHash: "d4e5f6g",
    commitMessage: "Implement dark mode toggle component",
    branch: "feature/dark-mode",
    filesChanged: 8,
    additions: 234,
    deletions: 12,
    files: [
      "src/components/ThemeToggle.tsx",
      "src/hooks/useTheme.ts",
      "src/context/ThemeContext.tsx",
      "src/styles/darkMode.css",
      "src/utils/themeUtils.ts",
      "src/types/theme.types.ts",
      "src/components/Layout.tsx",
      "src/App.tsx",
    ],
  });

  // 8. Branch, Mike Chen, 3 days ago
  activities.push({
    id: "8",
    type: "branch",
    userId: "mike-chen",
    userName: "Mike Chen",
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    description: "created branch feature/new-dashboard",
    action: "created",
    branchName: "feature/new-dashboard",
    sourceBranch: "main",
  });

  // 9. PR, Emma Davis, 4 days ago
  activities.push({
    id: "9",
    type: "pr",
    userId: "emma-davis",
    userName: "Emma Davis",
    timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    description: "merged PR #284",
    action: "merged",
    prNumber: 284,
    prTitle: "Add user authentication",
    status: "merged",
    reviewers: ["John Doe", "Sarah Johnson"],
  });

  // 10. Task, Tom Wilson, 5 days ago
  activities.push({
    id: "10",
    type: "task",
    userId: "tom-wilson",
    userName: "Tom Wilson",
    timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    description: "created Fix navigation bug on mobile",
    taskId: "TASK-124",
    taskTitle: "Fix navigation bug on mobile",
    action: "created",
    priority: "high",
    assigneeId: "john-doe",
    assigneeName: "John Doe",
    dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
  });

  // Generate 40+ more activities
  const activityTypes: ActivityType[] = [
    "commit",
    "comment",
    "task",
    "settings",
    "user",
    "file",
    "branch",
    "pr",
  ];

  for (let i = 11; i <= 60; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(
      now.getTime() - (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000,
    );
    const user = getRandomUser();
    const type =
      activityTypes[Math.floor(Math.random() * activityTypes.length)];

    switch (type) {
      case "commit":
        activities.push({
          id: String(i),
          type: "commit",
          userId: user.id,
          userName: user.name,
          timestamp,
          description: `Commit: ${["Refactor component structure", "Add unit tests", "Optimize performance", "Update dependencies", "Fix critical bug", "Implement feature", "Clean up code", "Update documentation"][Math.floor(Math.random() * 8)]}`,
          commitHash: Math.random().toString(36).substring(7),
          commitMessage: [
            "Refactor component structure",
            "Add unit tests",
            "Optimize performance",
            "Update dependencies",
            "Fix critical bug",
            "Implement feature",
            "Clean up code",
            "Update documentation",
          ][Math.floor(Math.random() * 8)],
          branch: `feature/task-${Math.floor(Math.random() * 100)}`,
          filesChanged: Math.floor(Math.random() * 15) + 1,
          additions: Math.floor(Math.random() * 500) + 10,
          deletions: Math.floor(Math.random() * 200) + 5,
          files: [
            `src/file${Math.floor(Math.random() * 50)}.ts`,
            `src/file${Math.floor(Math.random() * 50)}.tsx`,
          ],
        });
        break;

      case "comment":
        activities.push({
          id: String(i),
          type: "comment",
          userId: user.id,
          userName: user.name,
          timestamp,
          description: `Comment on ${["Component.tsx", "Hook.ts", "Utils.ts", "Types.ts", "Service.ts"][Math.floor(Math.random() * 5)]}`,
          commentText: [
            "Great work!",
            "This needs review",
            "Can we optimize this?",
            "Looks good to me",
            "Please fix the issue",
          ][Math.floor(Math.random() * 5)],
          fileName: [
            "Component.tsx",
            "Hook.ts",
            "Utils.ts",
            "Types.ts",
            "Service.ts",
          ][Math.floor(Math.random() * 5)],
          lineNumber: Math.floor(Math.random() * 100) + 1,
          replyCount: Math.floor(Math.random() * 5),
        });
        break;

      case "task": {
        const taskActions: (
          | "created"
          | "updated"
          | "completed"
          | "in_progress"
        )[] = ["created", "updated", "completed", "in_progress"];
        const priorities: ("low" | "medium" | "high" | "critical")[] = [
          "low",
          "medium",
          "high",
          "critical",
        ];
        activities.push({
          id: String(i),
          type: "task",
          userId: user.id,
          userName: user.name,
          timestamp,
          description: `${taskActions[Math.floor(Math.random() * taskActions.length)]} task TASK-${Math.floor(Math.random() * 500) + 100}`,
          taskId: `TASK-${Math.floor(Math.random() * 500) + 100}`,
          taskTitle: [
            "Implement new feature",
            "Fix critical bug",
            "Update documentation",
            "Refactor code",
            "Optimize performance",
          ][Math.floor(Math.random() * 5)],
          action: taskActions[Math.floor(Math.random() * taskActions.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          assigneeId: USERS[Math.floor(Math.random() * USERS.length)].id,
          assigneeName: USERS[Math.floor(Math.random() * USERS.length)].name,
          dueDate: new Date(
            now.getTime() +
              Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
          ),
        });
        break;
      }

      case "settings":
        activities.push({
          id: String(i),
          type: "settings",
          userId: user.id,
          userName: user.name,
          timestamp,
          description: `Settings changed`,
          settingName: [
            "Feature Flag: beta-features",
            "API Rate Limit",
            "Max Upload Size",
            "Session Timeout",
            "Email Notifications",
          ][Math.floor(Math.random() * 5)],
          previousValue: ["Disabled", "1000", "10MB", "30min", "Enabled"][
            Math.floor(Math.random() * 5)
          ],
          newValue: ["Enabled", "5000", "50MB", "60min", "Disabled"][
            Math.floor(Math.random() * 5)
          ],
          scope: [
            "Project-Settings",
            "Team-Config",
            "Organization",
            "Shared-UI",
            "Integration",
          ][Math.floor(Math.random() * 5)],
        });
        break;

      case "user":
        const userActions: ("joined" | "left" | "role_changed" | "assigned")[] =
          ["joined", "left", "role_changed", "assigned"];
        activities.push({
          id: String(i),
          type: "user",
          userId: user.id,
          userName: user.name,
          timestamp,
          description: `User event: ${userActions[Math.floor(Math.random() * userActions.length)]}`,
          action: userActions[Math.floor(Math.random() * userActions.length)],
          role: ["Developer", "Lead", "Manager", "Admin", "Viewer"][
            Math.floor(Math.random() * 5)
          ],
        });
        break;

      case "file":
        const fileOps: ("created" | "deleted" | "renamed" | "moved")[] = [
          "created",
          "deleted",
          "renamed",
          "moved",
        ];
        activities.push({
          id: String(i),
          type: "file",
          userId: user.id,
          userName: user.name,
          timestamp,
          description: `File operation`,
          operation: fileOps[Math.floor(Math.random() * fileOps.length)],
          filePath: `src/components/Component${Math.floor(Math.random() * 50)}/`,
          fileName: `Component${Math.floor(Math.random() * 50)}.tsx`,
          fileSize: `${Math.floor(Math.random() * 100) + 1} KB`,
          oldPath: `src/old/path/Component.tsx`,
        });
        break;

      case "branch":
        const branchActions: ("created" | "deleted" | "merged")[] = [
          "created",
          "deleted",
          "merged",
        ];
        activities.push({
          id: String(i),
          type: "branch",
          userId: user.id,
          userName: user.name,
          timestamp,
          description: `Branch operation`,
          action:
            branchActions[Math.floor(Math.random() * branchActions.length)],
          branchName: `feature/task-${Math.floor(Math.random() * 200) + 1}`,
          sourceBranch: "main",
        });
        break;

      case "pr":
        const prActions: ("opened" | "merged" | "closed" | "reviewed")[] = [
          "opened",
          "merged",
          "closed",
          "reviewed",
        ];
        const prStatuses: ("open" | "merged" | "closed")[] = [
          "open",
          "merged",
          "closed",
        ];
        activities.push({
          id: String(i),
          type: "pr",
          userId: user.id,
          userName: user.name,
          timestamp,
          description: `PR operation`,
          action: prActions[Math.floor(Math.random() * prActions.length)],
          prNumber: Math.floor(Math.random() * 500) + 200,
          prTitle: [
            "Add feature",
            "Fix issue",
            "Update dependencies",
            "Refactor code",
            "Optimize performance",
          ][Math.floor(Math.random() * 5)],
          status: prStatuses[Math.floor(Math.random() * prStatuses.length)],
          reviewers: [
            USERS[Math.floor(Math.random() * USERS.length)].name,
            USERS[Math.floor(Math.random() * USERS.length)].name,
          ],
        });
        break;
    }
  }

  return activities.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
};

export const MOCK_ACTIVITIES = generateMockActivities();

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  commit: "Commits",
  comment: "Comments",
  task: "Tasks",
  settings: "Settings",
  user: "Users",
  file: "Files",
  branch: "Branches",
  pr: "Pull Requests",
};

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  commit: "#3b82f6",
  task: "#22c55e",
  comment: "#eab308",
  settings: "#a855f7",
  user: "#6b7280",
  file: "#f97316",
  branch: "#14b8a6",
  pr: "#6366f1",
};

export const ACTIVITY_TYPE_ICONS: Record<ActivityType, string> = {
  commit: "📝",
  comment: "💬",
  task: "✓",
  settings: "⚙️",
  user: "👤",
  file: "📄",
  branch: "🌿",
  pr: "🔀",
};
