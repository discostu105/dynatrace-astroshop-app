import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Activity } from '../ActivityTimeline.const';

interface FileActivityProps {
  activity: Activity;
  onViewDetails: () => void;
}

const OPERATION_ICONS: Record<string, string> = {
  created: '✨',
  deleted: '🗑️',
  renamed: '✏️',
  modified: '📝',
};

const OPERATION_COLORS: Record<string, string> = {
  created: '#22c55e',
  deleted: '#ef5350',
  renamed: '#f59e0b',
  modified: '#3b82f6',
};

export const FileActivity = ({ activity, onViewDetails }: FileActivityProps) => {
  const operation = activity.fileOperation || 'modified';
  const icon = OPERATION_ICONS[operation] || '📄';
  const color = OPERATION_COLORS[operation] || '#999';

  return (
    <Flex flexDirection="column" gap={8}>
      {/* Operation and File Path */}
      <div>
        <Text
          style={{
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '4px',
          }}
        >
          {icon} {operation.charAt(0).toUpperCase() + operation.slice(1)}
        </Text>
        {activity.filePath && (
          <div
            style={{
              fontSize: '12px',
              fontFamily: 'monospace',
              backgroundColor: 'var(--dt-colors-background-neutral)',
              padding: '6px 8px',
              borderRadius: '4px',
              color: 'var(--dt-colors-text-secondary-default)',
              borderLeft: `3px solid ${color}`,
            }}
          >
            {activity.filePath}
          </div>
        )}
      </div>

      {/* File Size (if created) */}
      {activity.fileSize && operation === 'created' && (
        <div style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
          <span style={{ fontWeight: '500' }}>Size:</span> {activity.fileSize}
        </div>
      )}

      {/* View File Button */}
      <Button
        variant="default"
        onClick={onViewDetails}
        style={{ fontSize: '12px', alignSelf: 'flex-start', marginTop: '4px' }}
      >
        View File →
      </Button>
    </Flex>
  );
};
