import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Activity } from '../ActivityTimeline.const';

interface BranchActivityProps {
  activity: Activity;
  onViewDetails?: () => void;
}

export const BranchActivity = ({ activity, onViewDetails }: BranchActivityProps) => {
  const isPR = activity.type === 'pr';

  return (
    <Flex flexDirection="column" gap={8}>
      {/* Title */}
      <Text style={{ fontSize: '14px', fontWeight: '500' }}>
        {isPR ? '🔀' : '🌿'} {activity.title}
      </Text>

      {/* Branch Name or PR Details */}
      {activity.branchName && (
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'monospace',
            backgroundColor: 'var(--dt-colors-background-neutral)',
            padding: '6px 8px',
            borderRadius: '4px',
            color: 'var(--dt-colors-text-secondary-default)',
          }}
        >
          {activity.branchName}
        </div>
      )}

      {/* PR Details */}
      {isPR && (
        <>
          {activity.prNumber && (
            <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
              PR #{activity.prNumber}
            </div>
          )}

          {activity.prTitle && (
            <Text style={{ fontSize: '13px', marginBottom: '8px' }}>
              {activity.prTitle}
            </Text>
          )}

          {/* Reviewers */}
          {activity.reviewers && activity.reviewers.length > 0 && (
            <div style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
              <span style={{ fontWeight: '500' }}>Reviewers:</span>{' '}
              {activity.reviewers.join(', ')}
            </div>
          )}

          {/* Merged By */}
          {activity.mergedBy && (
            <div style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
              <span style={{ fontWeight: '500' }}>Merged by:</span> {activity.mergedBy}
            </div>
          )}
        </>
      )}

      {/* View Button */}
      {onViewDetails && (
        <Button
          variant="default"
          onClick={onViewDetails}
          style={{ fontSize: '12px', alignSelf: 'flex-start', marginTop: '4px' }}
        >
          {isPR ? 'View PR →' : 'View Branch →'}
        </Button>
      )}
    </Flex>
  );
};
