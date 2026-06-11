import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { Activity } from '../ActivityTimeline.const';

interface UserActivityProps {
  activity: Activity;
}

export const UserActivity = ({ activity }: UserActivityProps) => {
  const getActivityIcon = (description: string): string => {
    if (description.includes('joined')) return '👤';
    if (description.includes('assigned')) return '👥';
    if (description.includes('removed')) return '🚫';
    if (description.includes('invited')) return '📧';
    return '👥';
  };

  return (
    <Flex flexDirection="column" gap={8}>
      <Text style={{ fontSize: '14px', fontWeight: '500' }}>
        {getActivityIcon(activity.description)} {activity.title}
      </Text>
      <Text
        style={{
          fontSize: '13px',
          color: 'var(--dt-colors-text-secondary-default)',
          lineHeight: '1.5',
        }}
      >
        {activity.description}
      </Text>
    </Flex>
  );
};
