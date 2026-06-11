import React from 'react';
import { ActivityType, ACTIVITY_TYPE_COLORS, ACTIVITY_TYPE_LABELS } from '../ActivityTimeline.const';

interface ActivityTypeBadgeProps {
  type: ActivityType;
}

export const ActivityTypeBadge = ({ type }: ActivityTypeBadgeProps) => {
  const color = ACTIVITY_TYPE_COLORS[type];
  const label = ACTIVITY_TYPE_LABELS[type];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: `${color}22`,
        color: color,
        border: `1px solid ${color}44`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
};
