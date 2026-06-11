import React from "react";
import type { ActivityType } from "../ActivityTimeline.const";
import {
  ACTIVITY_TYPE_COLORS,
  ACTIVITY_TYPE_ICONS,
  ACTIVITY_TYPE_LABELS,
} from "../ActivityTimeline.const";

interface ActivityTypeBadgeProps {
  type: ActivityType;
}

export const ActivityTypeBadge = ({ type }: ActivityTypeBadgeProps) => {
  const color = ACTIVITY_TYPE_COLORS[type];
  const icon = ACTIVITY_TYPE_ICONS[type];
  const label = ACTIVITY_TYPE_LABELS[type];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "12px",
        backgroundColor: `${color}20`,
        border: `1px solid ${color}40`,
        color: color,
        fontSize: "11px",
        fontWeight: "600",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: "10px" }}>{icon}</span>
      {label}
    </div>
  );
};
