import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Activity } from '../ActivityTimeline.const';

interface SettingsActivityProps {
  activity: Activity;
  onViewDetails: () => void;
}

export const SettingsActivity = ({ activity, onViewDetails }: SettingsActivityProps) => {
  return (
    <Flex flexDirection="column" gap={8}>
      {/* Setting Name */}
      {activity.settingName && (
        <Text style={{ fontSize: '14px', fontWeight: '500' }}>
          {activity.settingName}
        </Text>
      )}

      {/* Before → After Value */}
      {(activity.settingBefore || activity.settingAfter) && (
        <div style={{ fontSize: '13px', marginBottom: '8px' }}>
          <span
            style={{
              textDecoration: 'line-through',
              color: '#ef5350',
              marginRight: '8px',
            }}
          >
            {activity.settingBefore}
          </span>
          <span style={{ color: 'var(--dt-colors-text-secondary-default)' }}>→</span>
          <span
            style={{
              fontWeight: '600',
              color: '#22c55e',
              marginLeft: '8px',
            }}
          >
            {activity.settingAfter}
          </span>
        </div>
      )}

      {/* Scope */}
      {activity.settingScope && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--dt-colors-text-secondary-default)',
          }}
        >
          <span style={{ fontWeight: '500' }}>Scope:</span> {activity.settingScope}
        </div>
      )}

      {/* View Settings Button */}
      <Button
        variant="default"
        onClick={onViewDetails}
        style={{ fontSize: '12px', alignSelf: 'flex-start', marginTop: '4px' }}
      >
        View Settings →
      </Button>
    </Flex>
  );
};
