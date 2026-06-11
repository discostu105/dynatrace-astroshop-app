import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Button } from '@dynatrace/strato-components/buttons';
import { Activity } from '../ActivityTimeline.const';

interface CommentActivityProps {
  activity: Activity;
  onViewDetails: () => void;
}

export const CommentActivity = ({ activity, onViewDetails }: CommentActivityProps) => {
  return (
    <Flex flexDirection="column" gap={8}>
      {/* File Context */}
      {activity.commentFile && (
        <div style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
          <span>Commented on </span>
          <span
            style={{
              fontFamily: 'monospace',
              backgroundColor: 'var(--dt-colors-background-neutral)',
              padding: '2px 6px',
              borderRadius: '3px',
              marginRight: '4px',
            }}
          >
            {activity.commentFile}
          </span>
          {activity.commentLine && (
            <span>
              at line <strong>{activity.commentLine}</strong>
            </span>
          )}
        </div>
      )}

      {/* Comment Preview */}
      {activity.commentPreview && (
        <div
          style={{
            fontSize: '13px',
            color: 'var(--dt-colors-text-primary-default)',
            lineHeight: '1.5',
            maxHeight: '80px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontStyle: 'italic',
          }}
        >
          "{activity.commentPreview}"
        </div>
      )}

      {/* Reply Count */}
      {activity.replyCount !== undefined && activity.replyCount > 0 && (
        <div
          style={{
            fontSize: '12px',
            color: '#3b82f6',
            fontWeight: '500',
          }}
        >
          💬 {activity.replyCount} {activity.replyCount === 1 ? 'reply' : 'replies'}
        </div>
      )}

      {/* View Comment Button */}
      <Button
        variant="default"
        onClick={onViewDetails}
        style={{ fontSize: '12px', alignSelf: 'flex-start' }}
      >
        View Comment →
      </Button>
    </Flex>
  );
};
