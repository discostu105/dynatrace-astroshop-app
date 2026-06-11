import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import { Activity, ACTIVITY_TYPE_COLORS } from '../ActivityTimeline.const';
import { ActivityTypeBadge } from './ActivityTypeBadge';

interface ActivityDetailModalProps {
  activity: Activity | null;
  onClose: () => void;
}

export const ActivityDetailModal = ({
  activity,
  onClose,
}: ActivityDetailModalProps) => {
  if (!activity) return null;

  const nodeColor = ACTIVITY_TYPE_COLORS[activity.type];

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease',
        }}
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '600px',
          backgroundColor: 'var(--dt-colors-background-container-default)',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease',
          maxHeight: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <Heading level={3} style={{ margin: 0 }}>
            Activity Details
          </Heading>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--dt-colors-text-secondary-default)',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* User and Type Info */}
          <Flex gap={12} alignItems="center" style={{ marginBottom: '24px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: nodeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              {activity.userInitials}
            </div>
            <Flex flexDirection="column" gap={4}>
              <Text style={{ fontSize: '14px', fontWeight: '600' }}>
                {activity.userName}
              </Text>
              <ActivityTypeBadge type={activity.type} />
            </Flex>
          </Flex>

          {/* Timestamp */}
          <div style={{ marginBottom: '24px' }}>
            <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)', marginBottom: '4px' }}>
              Time
            </Text>
            <Text style={{ fontSize: '13px', fontWeight: '500' }}>
              {activity.timestamp.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </Text>
          </div>

          {/* Title and Description */}
          <div style={{ marginBottom: '24px' }}>
            <Text style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              {activity.title}
            </Text>
            <Text style={{ fontSize: '13px', color: 'var(--dt-colors-text-secondary-default)', lineHeight: '1.6' }}>
              {activity.description}
            </Text>
          </div>

          {/* Type-Specific Details */}
          {renderDetailedContent(activity)}

          {/* Related Activities Section */}
          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--dt-colors-border-neutral-default)' }}>
            <Text style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)' }}>
              Related Activities
            </Text>
            <Text style={{ fontSize: '13px', color: 'var(--dt-colors-text-secondary-default)' }}>
              No related activities found in this period.
            </Text>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--dt-colors-border-neutral-default)',
            display: 'flex',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <Button variant="default" onClick={onClose} style={{ flex: 1 }}>
            Close
          </Button>
          <Button variant="accent" style={{ flex: 1 }}>
            Open Full View
          </Button>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

function renderDetailedContent(activity: Activity): React.ReactNode {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: '20px' }}>
      <Text style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--dt-colors-text-secondary-default)' }}>
        {title}
      </Text>
      {children}
    </div>
  );

  switch (activity.type) {
    case 'commit':
      return (
        <>
          {activity.commitMessage && (
            <Section title="Commit Message">
              <Text style={{ fontSize: '13px' }}>{activity.commitMessage}</Text>
            </Section>
          )}
          {activity.commitHash && (
            <Section title="Hash">
              <code style={{ fontSize: '12px', fontFamily: 'monospace', backgroundColor: 'var(--dt-colors-background-neutral)', padding: '6px 8px', borderRadius: '4px', display: 'block' }}>
                {activity.commitHash}
              </code>
            </Section>
          )}
          {activity.branch && (
            <Section title="Branch">
              <Text style={{ fontSize: '13px' }}>{activity.branch}</Text>
            </Section>
          )}
          {activity.filesChanged && (
            <Section title="Files Changed">
              <Text style={{ fontSize: '13px' }}>
                {activity.filesChanged} file{activity.filesChanged !== 1 ? 's' : ''} changed
              </Text>
              <Flex gap={16} style={{ marginTop: '8px' }}>
                <Text style={{ fontSize: '13px', color: '#22c55e', fontWeight: '600' }}>
                  +{activity.additions}
                </Text>
                <Text style={{ fontSize: '13px', color: '#ef5350', fontWeight: '600' }}>
                  -{activity.deletions}
                </Text>
              </Flex>
            </Section>
          )}
        </>
      );

    case 'comment':
      return (
        <>
          {activity.commentFile && (
            <Section title="File">
              <Text style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                {activity.commentFile}
              </Text>
            </Section>
          )}
          {activity.commentLine && (
            <Section title="Line Number">
              <Text style={{ fontSize: '13px' }}>{activity.commentLine}</Text>
            </Section>
          )}
          {activity.commentPreview && (
            <Section title="Comment">
              <Text style={{ fontSize: '13px', lineHeight: '1.6' }}>
                {activity.commentPreview}
              </Text>
            </Section>
          )}
          {activity.replyCount !== undefined && (
            <Section title="Replies">
              <Text style={{ fontSize: '13px' }}>
                {activity.replyCount} {activity.replyCount === 1 ? 'reply' : 'replies'}
              </Text>
            </Section>
          )}
        </>
      );

    case 'task':
      return (
        <>
          {activity.taskId && (
            <Section title="Task ID">
              <Text style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                {activity.taskId}
              </Text>
            </Section>
          )}
          {activity.taskStatus && (
            <Section title="Status">
              <Text style={{ fontSize: '13px', textTransform: 'capitalize' }}>
                {activity.taskStatus.replace('-', ' ')}
              </Text>
            </Section>
          )}
          {activity.taskPriority && (
            <Section title="Priority">
              <Text style={{ fontSize: '13px' }}>{activity.taskPriority}</Text>
            </Section>
          )}
          {activity.taskAssignee && (
            <Section title="Assigned To">
              <Text style={{ fontSize: '13px' }}>{activity.taskAssignee}</Text>
            </Section>
          )}
          {activity.taskDueDate && (
            <Section title="Due Date">
              <Text style={{ fontSize: '13px' }}>
                {activity.taskDueDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </Section>
          )}
        </>
      );

    case 'settings':
      return (
        <>
          {activity.settingScope && (
            <Section title="Scope">
              <Text style={{ fontSize: '13px' }}>{activity.settingScope}</Text>
            </Section>
          )}
          <Section title="Changes">
            <Flex gap={8} alignItems="center">
              <Text
                style={{
                  fontSize: '13px',
                  textDecoration: 'line-through',
                  color: '#ef5350',
                }}
              >
                {activity.settingBefore}
              </Text>
              <Text style={{ color: 'var(--dt-colors-text-secondary-default)' }}>→</Text>
              <Text style={{ fontSize: '13px', fontWeight: '600', color: '#22c55e' }}>
                {activity.settingAfter}
              </Text>
            </Flex>
          </Section>
        </>
      );

    case 'file':
      return (
        <>
          {activity.filePath && (
            <Section title="File Path">
              <Text style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                {activity.filePath}
              </Text>
            </Section>
          )}
          {activity.fileSize && (
            <Section title="Size">
              <Text style={{ fontSize: '13px' }}>{activity.fileSize}</Text>
            </Section>
          )}
          {activity.fileOperation && (
            <Section title="Operation">
              <Text style={{ fontSize: '13px', textTransform: 'capitalize' }}>
                {activity.fileOperation}
              </Text>
            </Section>
          )}
        </>
      );

    case 'branch':
    case 'pr':
      return (
        <>
          {activity.branchName && (
            <Section title="Branch">
              <Text style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                {activity.branchName}
              </Text>
            </Section>
          )}
          {activity.prNumber && (
            <Section title="Pull Request">
              <Text style={{ fontSize: '13px' }}>PR #{activity.prNumber}</Text>
            </Section>
          )}
          {activity.reviewers && activity.reviewers.length > 0 && (
            <Section title="Reviewers">
              <Text style={{ fontSize: '13px' }}>{activity.reviewers.join(', ')}</Text>
            </Section>
          )}
        </>
      );

    default:
      return null;
  }
}
