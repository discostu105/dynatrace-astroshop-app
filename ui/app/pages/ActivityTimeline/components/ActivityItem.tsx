import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { ACTIVITY_TYPE_COLORS } from '../ActivityTimeline.const';
import type { Activity } from '../types/activity.types';
import { formatAbsoluteTime } from '../utils/activityUtils';
import { ActivityTypeBadge } from './ActivityTypeBadge';
import {
  CommitActivityContent,
  CommentActivityContent,
  TaskActivityContent,
  SettingsActivityContent,
  UserActivityContent,
  FileActivityContent,
  BranchActivityContent,
  PRActivityContent,
} from './ActivityComponents';

interface ActivityItemProps {
  activity: Activity;
  isFirst?: boolean;
  isLast?: boolean;
  onSelect: (activity: Activity) => void;
  showTimeline?: boolean;
}

const getRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
};

export const ActivityItem = ({
  activity,
  isFirst = false,
  isLast = false,
  onSelect,
  showTimeline = true,
}: ActivityItemProps) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [showAbsoluteTime, setShowAbsoluteTime] = React.useState<boolean>(false);

  const typeConfig = ACTIVITY_TYPE_COLORS[activity.data.type];
  const relativeTime = getRelativeTime(activity.timestamp);
  const absoluteTime = formatAbsoluteTime(activity.timestamp);

  const renderActivityContent = () => {
    switch (activity.data.type) {
      case 'commit':
        return <CommitActivityContent data={activity.data} />;
      case 'comment':
        return <CommentActivityContent data={activity.data} />;
      case 'task':
        return <TaskActivityContent data={activity.data} />;
      case 'settings':
        return <SettingsActivityContent data={activity.data} />;
      case 'user':
        return <UserActivityContent data={activity.data} />;
      case 'file':
        return <FileActivityContent data={activity.data} />;
      case 'branch':
        return <BranchActivityContent data={activity.data} />;
      case 'pr':
        return <PRActivityContent data={activity.data} />;
      default:
        return null;
    }
  };

  const handleNodeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSelect(activity);
    }
  };

  return (
    <Flex gap={16} style={{ position: 'relative' }}>
      {/* Timeline Column */}
      {showTimeline && (
        <div style={{ position: 'relative', width: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Vertical line before node */}
          {!isFirst && (
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                width: '2px',
                height: '20px',
                backgroundColor: typeConfig.border,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          )}

          {/* Node circle */}
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: typeConfig.bg,
              border: `3px solid ${typeConfig.border}`,
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: isHovered ? `0 0 12px ${typeConfig.border}44` : 'none',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onSelect(activity)}
            onKeyDown={handleNodeKeyDown}
            role="button"
            tabIndex={0}
            title={`Click to view ${activity.data.type} details`}
            aria-label={`Open details for ${activity.data.type}`}
          >
            <span style={{ fontSize: '12px' }}>{typeConfig.icon}</span>
          </div>

          {/* Vertical line after node */}
          {!isLast && (
            <div
              style={{
                position: 'absolute',
                top: '44px',
                width: '2px',
                height: 'calc(100% - 44px)',
                backgroundColor: typeConfig.border,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          )}
        </div>
      )}

      {/* Card Column */}
      <Surface
        style={{
          flex: 1,
          padding: '16px 20px',
          borderRadius: '10px',
          border: isHovered ? `1px solid ${typeConfig.border}` : '1px solid var(--dt-colors-border-neutral-default)',
          backgroundColor: isHovered ? `${typeConfig.bg}99` : 'var(--dt-colors-background-surface-default)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isHovered ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
          marginBottom: '20px',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(activity)}
      >
        <Flex flexDirection="column" gap={12}>
          {/* Header: User, Type, Time */}
          <Flex justifyContent="space-between" alignItems="flex-start" gap={12}>
            <Flex alignItems="center" gap={12} flex={1}>
              {/* User Avatar */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: typeConfig.bg,
                  border: `2px solid ${typeConfig.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                {activity.user.name.charAt(0).toUpperCase()}
              </div>

              {/* User Name and Type Badge */}
              <Flex flexDirection="column" gap={6}>
                <Text style={{ fontSize: '14px', fontWeight: '600' }}>{activity.user.name}</Text>
                <ActivityTypeBadge type={activity.data.type} size="small" />
              </Flex>
            </Flex>

            {/* Time (relative or absolute) */}
            <div
              style={{
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--dt-colors-background-container-default)',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={() => setShowAbsoluteTime(true)}
              onMouseLeave={() => setShowAbsoluteTime(false)}
              title="Hover to see exact time"
            >
              <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
                {showAbsoluteTime ? absoluteTime : relativeTime}
              </Text>
            </div>
          </Flex>

          {/* Activity Content */}
          <div style={{ marginLeft: '52px' }}>{renderActivityContent()}</div>

          {/* Aggregated count indicator */}
          {activity.aggregatedCount && activity.aggregatedCount > 1 && (
            <div
              style={{
                marginLeft: '52px',
                padding: '8px 12px',
                backgroundColor: 'var(--dt-colors-background-container-default)',
                borderRadius: '6px',
                border: `1px solid ${typeConfig.border}`,
                marginTop: '8px',
              }}
            >
              <Text style={{ fontSize: '12px', fontWeight: '600', color: typeConfig.text }}>
                +{activity.aggregatedCount - 1} more {activity.data.type}
                {activity.aggregatedCount > 2 ? 's' : ''}
              </Text>
            </div>
          )}
        </Flex>
      </Surface>
    </Flex>
  );
};
