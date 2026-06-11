import React, { useState } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Text, Strong } from "@dynatrace/strato-components/typography";
import type { Activity } from "../ActivityTimeline.const";
import { ACTIVITY_TYPE_COLORS } from "../ActivityTimeline.const";
import { ActivityTypeBadge } from "./ActivityTypeBadge";
import {
  CommitActivityBody,
  CommentActivityBody,
  TaskActivityBody,
  SettingsActivityBody,
  UserActivityBody,
  FileActivityBody,
  BranchActivityBody,
  PRActivityBody,
} from "./ActivityBodies";

interface ActivityItemProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
}

/**
 * Extracts user initials from a full name for avatar display.
 * Handles multiple words and returns max 2 characters.
 */
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Formats a date as a human-readable relative time.
 * Returns "just now", "2h ago", "3 days ago", or a date string for older activities.
 */
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/**
 * Maps an activity type to its corresponding body component.
 * Each activity type (commit, comment, task, etc.) has a unique renderer.
 */
const getActivityBody = (activity: Activity) => {
  switch (activity.type) {
    case "commit":
      return <CommitActivityBody activity={activity} />;
    case "comment":
      return <CommentActivityBody activity={activity} />;
    case "task":
      return <TaskActivityBody activity={activity} />;
    case "settings":
      return <SettingsActivityBody activity={activity} />;
    case "user":
      return <UserActivityBody activity={activity} />;
    case "file":
      return <FileActivityBody activity={activity} />;
    case "branch":
      return <BranchActivityBody activity={activity} />;
    case "pr":
      return <PRActivityBody activity={activity} />;
    default:
      return null;
  }
};

/**
 * Individual activity item with timeline visualization.
 * Renders a colored timeline node and clickable card with activity-specific details.
 */
export const ActivityItem = ({ activity, onSelect }: ActivityItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const nodeColor = ACTIVITY_TYPE_COLORS[activity.type];

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        paddingBottom: "24px",
        position: "relative",
      }}
    >
      {/* Timeline node - Colored circle positioned relative to parent timeline line */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "56px",
          paddingTop: "6px",
        }}
      >
        {/* Node circle */}
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: nodeColor,
            border: `2px solid white`,
            boxShadow: `0 0 0 2px ${nodeColor}`,
            zIndex: 2,
          }}
        />
      </div>

      {/* Card content */}
      <div
        style={{
          flex: 1,
          backgroundColor: "white",
          border: "1px solid var(--dt-colors-border-neutral-default)",
          borderRadius: "8px",
          padding: "16px",
          cursor: "pointer",
          boxShadow: isHovered ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(activity)}
      >
        {/* Header: User, Badge, Time */}
        <Flex alignItems="center" gap={12} marginBottom={8}>
          {/* User avatar */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--dt-colors-text-default)",
              flexShrink: 0,
            }}
          >
            {getInitials(activity.userName)}
          </div>

          <Flex flexDirection="column" gap={4} flex={1}>
            <Strong
              style={{
                fontSize: "13px",
                color: "var(--dt-colors-text-default)",
              }}
            >
              {activity.userName}
            </Strong>
            <Text
              style={{
                fontSize: "11px",
                color: "var(--dt-colors-text-secondary)",
                margin: 0,
              }}
            >
              {formatTimeAgo(activity.timestamp)}
            </Text>
          </Flex>

          {/* Badge and time */}
          <Flex alignItems="center" gap={8} style={{ marginLeft: "auto" }}>
            <ActivityTypeBadge type={activity.type} />
          </Flex>
        </Flex>

        {/* Activity body */}
        <div style={{ paddingLeft: "52px" }}>{getActivityBody(activity)}</div>
      </div>
    </div>
  );
};
