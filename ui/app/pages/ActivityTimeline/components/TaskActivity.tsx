import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Activity } from '../ActivityTimeline.const';

interface TaskActivityProps {
  activity: Activity;
  onViewDetails: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#8b5cf6',
  Medium: '#f59e0b',
  High: '#ef5350',
  Critical: '#dc2626',
};

const STATUS_ICONS: Record<string, string> = {
  created: '📝',
  'in-progress': '⏳',
  completed: '✅',
  closed: '🔒',
};

export const TaskActivity = ({ activity, onViewDetails }: TaskActivityProps) => {
  const statusIcon = STATUS_ICONS[activity.taskStatus || 'created'];
  const priorityColor = PRIORITY_COLORS[activity.taskPriority || 'Medium'];

  return (
    <Flex flexDirection="column" gap={8}>
      {/* Task Title */}
      {activity.taskTitle && (
        <Text style={{ fontSize: '14px', fontWeight: '500' }}>
          {activity.taskTitle}
        </Text>
      )}

      {/* Task ID and Status */}
      <Flex gap={12} alignItems="center" style={{ flexWrap: 'wrap' }}>
        {activity.taskId && (
          <span
            style={{
              fontSize: '12px',
              fontFamily: 'monospace',
              backgroundColor: 'var(--dt-colors-background-neutral)',
              padding: '2px 8px',
              borderRadius: '4px',
              color: 'var(--dt-colors-text-secondary-default)',
              fontWeight: '500',
            }}
          >
            {activity.taskId}
          </span>
        )}

        {activity.taskStatus && (
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              backgroundColor: '#22c55e22',
              color: '#22c55e',
              border: '1px solid #22c55e44',
              fontWeight: '500',
            }}
          >
            {statusIcon} {activity.taskStatus.charAt(0).toUpperCase() + activity.taskStatus.slice(1).replace('-', ' ')}
          </span>
        )}

        {activity.taskPriority && (
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              backgroundColor: `${priorityColor}22`,
              color: priorityColor,
              border: `1px solid ${priorityColor}44`,
              fontWeight: '500',
            }}
          >
            ⚡ {activity.taskPriority}
          </span>
        )}
      </Flex>

      {/* Assignee and Due Date */}
      <Flex gap={16} style={{ flexWrap: 'wrap', fontSize: '12px' }}>
        {activity.taskAssignee && (
          <div style={{ color: 'var(--dt-colors-text-secondary-default)' }}>
            <span style={{ fontWeight: '500' }}>Assigned to:</span> {activity.taskAssignee}
          </div>
        )}
        {activity.taskDueDate && (
          <div style={{ color: 'var(--dt-colors-text-secondary-default)' }}>
            <span style={{ fontWeight: '500' }}>Due:</span>{' '}
            {activity.taskDueDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        )}
      </Flex>

      {/* View Task Button */}
      <Button
        variant="default"
        onClick={onViewDetails}
        style={{ fontSize: '12px', alignSelf: 'flex-start', marginTop: '4px' }}
      >
        View Task →
      </Button>
    </Flex>
  );
};
