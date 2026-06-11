import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Text, Strong } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";
import type {
  CommitActivity,
  CommentActivity,
  TaskActivity,
  SettingsActivity,
  UserActivity,
  FileActivity,
  BranchActivity,
  PRActivity,
} from "../ActivityTimeline.const";

export const CommitActivityBody = ({
  activity,
}: {
  activity: CommitActivity;
}) => (
  <Flex flexDirection="column" gap={8}>
    <Strong
      style={{ fontSize: "13px", color: "var(--dt-colors-text-default)" }}
    >
      {activity.commitMessage}
    </Strong>
    <Flex
      alignItems="center"
      gap={8}
      style={{ fontSize: "12px", color: "var(--dt-colors-text-secondary)" }}
    >
      <code
        style={{
          padding: "2px 6px",
          backgroundColor: "var(--dt-colors-background-neutral)",
          borderRadius: "4px",
        }}
      >
        {activity.commitHash}
      </code>
      <span>on</span>
      <div
        style={{
          padding: "2px 8px",
          borderRadius: "6px",
          backgroundColor: "#14b8a620",
          color: "#14b8a6",
          fontSize: "11px",
          fontWeight: "600",
        }}
      >
        {activity.branch}
      </div>
    </Flex>
    <Text
      style={{
        fontSize: "12px",
        color: "var(--dt-colors-text-secondary)",
        margin: 0,
      }}
    >
      {activity.filesChanged} files changed •{" "}
      <span style={{ color: "#22c55e" }}>+{activity.additions}</span> •{" "}
      <span style={{ color: "#ef5350" }}>-{activity.deletions}</span>
    </Text>
    {activity.files && activity.files.length > 0 && (
      <Flex flexDirection="column" gap={4} style={{ marginTop: "4px" }}>
        {activity.files.slice(0, 3).map((file, idx) => (
          <Text
            key={idx}
            style={{
              fontSize: "11px",
              color: "var(--dt-colors-text-secondary)",
              margin: 0,
            }}
          >
            📄 {file}
          </Text>
        ))}
        {activity.files.length > 3 && (
          <Text
            style={{
              fontSize: "11px",
              color: "var(--dt-colors-text-secondary)",
              margin: 0,
            }}
          >
            +{activity.files.length - 3} more files
          </Text>
        )}
      </Flex>
    )}
    <Flex gap={8} style={{ marginTop: "8px" }}>
      <Button variant="default" style={{ fontSize: "11px" }}>
        View Commit
      </Button>
    </Flex>
  </Flex>
);

export const CommentActivityBody = ({
  activity,
}: {
  activity: CommentActivity;
}) => (
  <Flex flexDirection="column" gap={8}>
    {activity.fileName && (
      <Text
        style={{
          fontSize: "12px",
          color: "var(--dt-colors-text-secondary)",
          margin: 0,
        }}
      >
        Commented on <Strong>{activity.fileName}</Strong>
        {activity.lineNumber && ` at line ${activity.lineNumber}`}
      </Text>
    )}
    <div
      style={{
        padding: "8px 12px",
        backgroundColor: "var(--dt-colors-background-neutral)",
        borderRadius: "6px",
        fontSize: "12px",
        color: "var(--dt-colors-text-default)",
        borderLeft: "3px solid #eab308",
      }}
    >
      {activity.commentText.length > 200
        ? activity.commentText.substring(0, 200) + "..."
        : activity.commentText}
    </div>
    {activity.replyCount > 0 && (
      <Text
        style={{
          fontSize: "12px",
          color: "var(--dt-colors-text-secondary)",
          margin: 0,
        }}
      >
        💬 {activity.replyCount}{" "}
        {activity.replyCount === 1 ? "reply" : "replies"}
      </Text>
    )}
    <Flex gap={8} style={{ marginTop: "8px" }}>
      <Button variant="default" style={{ fontSize: "11px" }}>
        View Comment
      </Button>
    </Flex>
  </Flex>
);

export const TaskActivityBody = ({ activity }: { activity: TaskActivity }) => (
  <Flex flexDirection="column" gap={8}>
    <Flex alignItems="center" gap={8}>
      <div
        style={{
          padding: "2px 8px",
          borderRadius: "6px",
          backgroundColor:
            activity.action === "completed"
              ? "#22c55e20"
              : activity.action === "in_progress"
                ? "#eab30820"
                : "#a855f720",
          color:
            activity.action === "completed"
              ? "#22c55e"
              : activity.action === "in_progress"
                ? "#eab308"
                : "#a855f7",
          fontSize: "11px",
          fontWeight: "600",
        }}
      >
        {activity.action === "completed"
          ? "✓ Completed"
          : activity.action === "in_progress"
            ? "⚙ In Progress"
            : activity.action === "created"
              ? "✚ Created"
              : "✎ Updated"}
      </div>
      <Strong
        style={{ fontSize: "13px", color: "var(--dt-colors-text-default)" }}
      >
        {activity.taskTitle}
      </Strong>
    </Flex>
    <Flex
      alignItems="center"
      gap={8}
      style={{ fontSize: "12px", color: "var(--dt-colors-text-secondary)" }}
    >
      <code
        style={{
          padding: "2px 6px",
          backgroundColor: "var(--dt-colors-background-neutral)",
          borderRadius: "4px",
        }}
      >
        {activity.taskId}
      </code>
      <div
        style={{
          padding: "2px 6px",
          borderRadius: "4px",
          backgroundColor:
            activity.priority === "critical"
              ? "#ef535020"
              : activity.priority === "high"
                ? "#eab30820"
                : activity.priority === "medium"
                  ? "#3b82f620"
                  : "#6b728020",
          color:
            activity.priority === "critical"
              ? "#ef5350"
              : activity.priority === "high"
                ? "#eab308"
                : activity.priority === "medium"
                  ? "#3b82f6"
                  : "#6b7280",
          fontSize: "11px",
          fontWeight: "600",
          textTransform: "uppercase",
        }}
      >
        {activity.priority}
      </div>
      {activity.dueDate && (
        <span>
          Due:{" "}
          {activity.dueDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      )}
    </Flex>
    {activity.assigneeName && (
      <Text
        style={{
          fontSize: "12px",
          color: "var(--dt-colors-text-secondary)",
          margin: 0,
        }}
      >
        👤 Assigned to <Strong>{activity.assigneeName}</Strong>
      </Text>
    )}
    <Flex gap={8} style={{ marginTop: "8px" }}>
      <Button variant="default" style={{ fontSize: "11px" }}>
        View Task
      </Button>
    </Flex>
  </Flex>
);

export const SettingsActivityBody = ({
  activity,
}: {
  activity: SettingsActivity;
}) => (
  <Flex flexDirection="column" gap={8}>
    <Text
      style={{
        fontSize: "12px",
        color: "var(--dt-colors-text-secondary)",
        margin: 0,
      }}
    >
      Changed setting: <Strong>{activity.settingName}</Strong>
    </Text>
    <Flex alignItems="center" gap={12}>
      <div
        style={{
          padding: "4px 10px",
          borderRadius: "6px",
          backgroundColor: "#ef535020",
          color: "#ef5350",
          fontSize: "12px",
          fontWeight: "600",
          textDecoration: "line-through",
        }}
      >
        {activity.previousValue}
      </div>
      <span
        style={{ color: "var(--dt-colors-text-secondary)", fontSize: "12px" }}
      >
        →
      </span>
      <div
        style={{
          padding: "4px 10px",
          borderRadius: "6px",
          backgroundColor: "#22c55e20",
          color: "#22c55e",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {activity.newValue}
      </div>
    </Flex>
    <Text
      style={{
        fontSize: "12px",
        color: "var(--dt-colors-text-secondary)",
        margin: 0,
      }}
    >
      Scope: <Strong>{activity.scope}</Strong>
    </Text>
    <Flex gap={8} style={{ marginTop: "8px" }}>
      <Button variant="default" style={{ fontSize: "11px" }}>
        View Settings
      </Button>
    </Flex>
  </Flex>
);

export const UserActivityBody = ({ activity }: { activity: UserActivity }) => (
  <Flex flexDirection="column" gap={8}>
    <Flex alignItems="center" gap={8}>
      <span style={{ fontSize: "16px" }}>👤</span>
      <Text
        style={{
          fontSize: "12px",
          color: "var(--dt-colors-text-default)",
          margin: 0,
        }}
      >
        <Strong>{activity.userName}</Strong>{" "}
        {activity.action === "joined"
          ? "joined the project"
          : activity.action === "left"
            ? "left the project"
            : activity.action === "role_changed"
              ? `changed role to ${activity.role}`
              : "was assigned"}
      </Text>
    </Flex>
    {activity.role && (
      <div
        style={{
          padding: "4px 10px",
          borderRadius: "6px",
          backgroundColor: "var(--dt-colors-background-neutral)",
          color: "var(--dt-colors-text-secondary)",
          fontSize: "11px",
          fontWeight: "600",
          width: "fit-content",
        }}
      >
        {activity.role}
      </div>
    )}
  </Flex>
);

export const FileActivityBody = ({ activity }: { activity: FileActivity }) => (
  <Flex flexDirection="column" gap={8}>
    <Flex alignItems="center" gap={8}>
      <div
        style={{
          padding: "2px 8px",
          borderRadius: "6px",
          backgroundColor: "#f9731620",
          color: "#f97316",
          fontSize: "11px",
          fontWeight: "600",
          textTransform: "uppercase",
        }}
      >
        {activity.operation}
      </div>
      <Strong
        style={{ fontSize: "13px", color: "var(--dt-colors-text-default)" }}
      >
        {activity.fileName}
      </Strong>
    </Flex>
    <Text
      style={{
        fontSize: "12px",
        color: "var(--dt-colors-text-secondary)",
        margin: 0,
      }}
    >
      📁 {activity.filePath}
    </Text>
    {activity.fileSize && (
      <Text
        style={{
          fontSize: "12px",
          color: "var(--dt-colors-text-secondary)",
          margin: 0,
        }}
      >
        {activity.fileSize}
      </Text>
    )}
    <Flex gap={8} style={{ marginTop: "8px" }}>
      <Button variant="default" style={{ fontSize: "11px" }}>
        View File
      </Button>
    </Flex>
  </Flex>
);

export const BranchActivityBody = ({
  activity,
}: {
  activity: BranchActivity;
}) => (
  <Flex flexDirection="column" gap={8}>
    <Flex alignItems="center" gap={8}>
      <div
        style={{
          padding: "2px 8px",
          borderRadius: "6px",
          backgroundColor: "#14b8a620",
          color: "#14b8a6",
          fontSize: "11px",
          fontWeight: "600",
          textTransform: "uppercase",
        }}
      >
        {activity.action}
      </div>
      <Strong
        style={{ fontSize: "13px", color: "var(--dt-colors-text-default)" }}
      >
        {activity.branchName}
      </Strong>
    </Flex>
    {activity.sourceBranch && (
      <Text
        style={{
          fontSize: "12px",
          color: "var(--dt-colors-text-secondary)",
          margin: 0,
        }}
      >
        from{" "}
        <code
          style={{
            padding: "2px 6px",
            backgroundColor: "var(--dt-colors-background-neutral)",
            borderRadius: "4px",
          }}
        >
          {activity.sourceBranch}
        </code>
      </Text>
    )}
    <Flex gap={8} style={{ marginTop: "8px" }}>
      <Button variant="default" style={{ fontSize: "11px" }}>
        View Branch
      </Button>
    </Flex>
  </Flex>
);

export const PRActivityBody = ({ activity }: { activity: PRActivity }) => (
  <Flex flexDirection="column" gap={8}>
    <Flex alignItems="center" gap={8}>
      <div
        style={{
          padding: "2px 8px",
          borderRadius: "6px",
          backgroundColor:
            activity.status === "merged"
              ? "#6366f120"
              : activity.status === "closed"
                ? "#ef535020"
                : "#22c55e20",
          color:
            activity.status === "merged"
              ? "#6366f1"
              : activity.status === "closed"
                ? "#ef5350"
                : "#22c55e",
          fontSize: "11px",
          fontWeight: "600",
          textTransform: "uppercase",
        }}
      >
        {activity.status === "merged"
          ? "✓ Merged"
          : activity.status === "closed"
            ? "✗ Closed"
            : "○ Open"}
      </div>
      <Strong
        style={{ fontSize: "13px", color: "var(--dt-colors-text-default)" }}
      >
        #{activity.prNumber} {activity.prTitle}
      </Strong>
    </Flex>
    {activity.reviewers && activity.reviewers.length > 0 && (
      <Text
        style={{
          fontSize: "12px",
          color: "var(--dt-colors-text-secondary)",
          margin: 0,
        }}
      >
        Reviewers: {activity.reviewers.join(", ")}
      </Text>
    )}
    <Flex gap={8} style={{ marginTop: "8px" }}>
      <Button variant="default" style={{ fontSize: "11px" }}>
        View PR
      </Button>
    </Flex>
  </Flex>
);
