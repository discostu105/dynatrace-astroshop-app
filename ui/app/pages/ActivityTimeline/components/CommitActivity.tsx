import React, { useState } from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Text, Heading } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Activity } from '../ActivityTimeline.const';

interface CommitActivityProps {
  activity: Activity;
  onViewDetails: () => void;
}

export const CommitActivity = ({ activity, onViewDetails }: CommitActivityProps) => {
  const [expandedFiles, setExpandedFiles] = useState(false);

  return (
    <Flex flexDirection="column" gap={8}>
      {/* Message and Hash */}
      <div>
        <Text style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
          {activity.commitMessage}
        </Text>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'monospace',
            backgroundColor: 'var(--dt-colors-background-neutral)',
            padding: '4px 8px',
            borderRadius: '4px',
            color: 'var(--dt-colors-text-secondary-default)',
            marginBottom: '8px',
          }}
        >
          {activity.commitHash}
        </div>
      </div>

      {/* Branch Badge */}
      {activity.branch && (
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            backgroundColor: '#06b6d422',
            color: '#06b6d4',
            border: '1px solid #06b6d444',
            width: 'fit-content',
          }}
        >
          🌿 {activity.branch}
        </span>
      )}

      {/* File Stats */}
      {activity.filesChanged && (
        <div style={{ fontSize: '13px', marginBottom: '8px' }}>
          <span style={{ color: 'var(--dt-colors-text-secondary-default)' }}>
            {activity.filesChanged} file{activity.filesChanged !== 1 ? 's' : ''} changed
          </span>
          <span style={{ margin: '0 12px', color: '#22c55e', fontWeight: '500' }}>
            +{activity.additions}
          </span>
          <span style={{ color: '#ef5350', fontWeight: '500' }}>
            -{activity.deletions}
          </span>
        </div>
      )}

      {/* File List */}
      {activity.files && activity.files.length > 0 && (
        <div>
          <Button
            variant="default"
            onClick={() => setExpandedFiles(!expandedFiles)}
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            {expandedFiles ? '▼' : '▶'} Files Changed ({activity.files.length})
          </Button>

          {expandedFiles && (
            <div
              style={{
                marginTop: '8px',
                borderLeft: '2px solid var(--dt-colors-border-neutral-default)',
                paddingLeft: '12px',
              }}
            >
              {activity.files.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: '12px',
                    marginBottom: '6px',
                    color: 'var(--dt-colors-text-secondary-default)',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '60px',
                      color: '#06b6d4',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}
                  >
                    {file.status}
                  </span>
                  <span>{file.path}</span>
                  <span style={{ color: '#999', marginLeft: '8px' }}>
                    +{file.changes}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View Commit Button */}
      <Button
        variant="default"
        onClick={onViewDetails}
        style={{ fontSize: '12px', marginTop: '8px', alignSelf: 'flex-start' }}
      >
        View Commit →
      </Button>
    </Flex>
  );
};
