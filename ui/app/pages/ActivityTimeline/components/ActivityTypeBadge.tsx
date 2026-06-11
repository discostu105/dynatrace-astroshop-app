import React from 'react';
import { Text } from '@dynatrace/strato-components/typography';
import { ACTIVITY_TYPE_COLORS } from '../ActivityTimeline.const';
import type { ActivityType } from '../types/activity.types';

interface ActivityTypeBadgeProps {
  type: ActivityType;
  size?: 'small' | 'medium';
}

export const ActivityTypeBadge = ({ type, size = 'medium' }: ActivityTypeBadgeProps) => {
  const config = ACTIVITY_TYPE_COLORS[type];

  if (!config) {
    return null;
  }

  const isSmall = size === 'small';
  const padding = isSmall ? '2px 8px' : '4px 12px';
  const fontSize = isSmall ? '11px' : '12px';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '4px' : '6px',
        padding,
        borderRadius: '12px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <span style={{ fontSize: isSmall ? '12px' : '14px' }}>{config.icon}</span>
      <Text style={{ fontSize, fontWeight: '600', color: config.text, textTransform: 'capitalize' }}>
        {type}
      </Text>
    </div>
  );
};
