import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Surface } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { Activity, ACTIVITY_TYPE_COLORS } from '../ActivityTimeline.const';
import { ActivityTypeBadge } from './ActivityTypeBadge';
import { CommitActivity } from './CommitActivity';
import { CommentActivity } from './CommentActivity';
import { TaskActivity } from './TaskActivity';
import { SettingsActivity } from './SettingsActivity';
import { UserActivity } from './UserActivity';
import { FileActivity } from './FileActivity';
import { BranchActivity } from './BranchActivity';

interface ActivityItemProps {
  activity: Activity;
  onSelectActivity: (activity: Activity) => void;
}

export const ActivityItem = ({
  activity,
  onSelectActivity,
}: ActivityItemProps) => {
  const nodeColor = ACTIVITY_TYPE_COLORS[activity.type];

  const renderActivityContent = () => {
    switch (activity.type) {
      case 'commit':
        return (
          <CommitActivity
            activity={activity}
            onViewDetails={() => onSelectActivity(activity)}
          />
        );
      case 'comment':
        return (
          <CommentActivity
            activity={activity}
            onViewDetails={() => onSelectActivity(activity)}
          />
        );
      case 'task':
        return (
          <TaskActivity
            activity={activity}
            onViewDetails={() => onSelectActivity(activity)}
          />
        );
      case 'settings':
        return (
          <SettingsActivity
            activity={activity}
            onViewDetails={() => onSelectActivity(activity)}
          />
        );
      case 'user':
        return <UserActivity activity={activity} />;
      case 'file':
        return (
          <FileActivity
            activity={activity}
            onViewDetails={() => onSelectActivity(activity)}
          />
        );
      case 'branch':
      case 'pr':
        return (
          <BranchActivity
            activity={activity}
            onViewDetails={() => onSelectActivity(activity)}
          />
        );
      default:
        return (
          <Text style={{ fontSize: '13px', color: 'var(--dt-colors-text-secondary-default)' }}>
            {activity.description}
          </Text>
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        position: 'relative',
      }}
    >
      {/* Timeline Connector Line */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '60px',
          width: '2px',
          height: 'calc(100% + 24px)',
          backgroundColor: 'var(--dt-colors-border-neutral-default)',
          zIndex: 0,
        }}
      />

      {/* Circular Node */}
      <div
        style={{
          flexShrink: 0,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: nodeColor,
          border: '3px solid var(--dt-colors-background-container-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '20px',
          zIndex: 1,
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)';
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${nodeColor}66`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
        onClick={() => onSelectActivity(activity)}
        title={`${activity.timestamp.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}`}
      >
        {getActivityIcon(activity.type)}
      </div>

      {/* Card Content */}
      <Surface
        style={{
          flex: 1,
          padding: '16px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: '1px solid var(--dt-colors-border-neutral-default)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            '0 2px 8px rgba(0, 0, 0, 0.08)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
        onClick={() => onSelectActivity(activity)}
      >
        {/* Header with User, Type Badge, and Time */}
        <Flex
          gap={12}
          alignItems="center"
          style={{
            marginBottom: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* User Avatar and Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: nodeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              {activity.userInitials}
            </div>
            <Text
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--dt-colors-text-primary-default)',
              }}
            >
              {activity.userName}
            </Text>
          </div>

          {/* Type Badge */}
          <ActivityTypeBadge type={activity.type} />

          {/* Relative Time */}
          <div style={{ marginLeft: 'auto' }}>
            <Text
              style={{
                fontSize: '12px',
                color: 'var(--dt-colors-text-secondary-default)',
              }}
              title={`${activity.timestamp.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}`}
            >
              {activity.relativeTime}
            </Text>
          </div>
        </Flex>

        {/* Activity-Type Specific Content */}
        {renderActivityContent()}
      </Surface>
    </div>
  );
};

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    commit: '📝',
    comment: '💬',
    task: '✅',
    settings: '⚙️',
    user: '👤',
    file: '📄',
    branch: '🌿',
    pr: '🔀',
  };
  return icons[type] || '📌';
}
