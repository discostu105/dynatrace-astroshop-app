import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
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

interface ActivityDetailModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}

export const ActivityDetailModal = ({ activity, isOpen, onClose }: ActivityDetailModalProps) => {
  if (!isOpen || !activity) return null;

  const typeConfig = ACTIVITY_TYPE_COLORS[activity.data.type];

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

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        }}
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal Panel */}
      <Flex
        flexDirection="column"
        gap={0}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '600px',
          maxWidth: '90vw',
          backgroundColor: 'var(--dt-colors-background-surface-default)',
          borderLeft: '1px solid var(--dt-colors-border-neutral-default)',
          zIndex: 1000,
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          padding={24}
          style={{
            borderBottom: '1px solid var(--dt-colors-border-neutral-default)',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--dt-colors-background-surface-default)',
            zIndex: 10,
          }}
        >
          <Flex alignItems="center" gap={16} flex={1}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: typeConfig.bg,
                border: `2px solid ${typeConfig.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
              }}
            >
              {activity.user.name.charAt(0).toUpperCase()}
            </div>
            <Flex flexDirection="column" gap={6}>
              <div style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                Activity Details
              </div>
              <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
                {activity.user.name}
              </Text>
            </Flex>
          </Flex>

          <Button
            variant="default"
            onClick={onClose}
            aria-label="Close"
            style={{
              fontSize: '20px',
              padding: '8px 12px',
              minWidth: 'auto',
              flexShrink: 0,
            }}
          >
            ✕
          </Button>
        </Flex>

        {/* Content */}
        <Flex flexDirection="column" gap={24} padding={24}>
          {/* Activity Meta */}
          <Flex flexDirection="column" gap={12}>
            <Flex justifyContent="space-between" alignItems="center">
              <ActivityTypeBadge type={activity.data.type} />
              <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
                {formatAbsoluteTime(activity.timestamp)}
              </Text>
            </Flex>

            <Surface
              style={{
                padding: '12px',
                backgroundColor: 'var(--dt-colors-background-container-default)',
                borderRadius: '8px',
                border: '1px solid var(--dt-colors-border-neutral-default)',
              }}
            >
              <Flex flexDirection="column" gap={8}>
                <div>
                  <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    User
                  </Text>
                  <Text style={{ fontSize: '13px', fontWeight: '500' }}>{activity.user.name}</Text>
                  {activity.user.email && (
                    <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
                      {activity.user.email}
                    </Text>
                  )}
                </div>
              </Flex>
            </Surface>
          </Flex>

          {/* Activity-specific details */}
          <Flex flexDirection="column" gap={12}>
            <div style={{ margin: 0, fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Details
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--dt-colors-background-container-default)', borderRadius: '8px' }}>
              {renderActivityContent()}
            </div>
          </Flex>

          {/* Related Activities Section (placeholder) */}
          <Flex flexDirection="column" gap={12}>
            <div style={{ margin: 0, fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Activity Info
            </div>
            <Surface
              style={{
                padding: '12px',
                backgroundColor: 'var(--dt-colors-background-container-default)',
                borderRadius: '8px',
                border: '1px solid var(--dt-colors-border-neutral-default)',
              }}
            >
              <Flex flexDirection="column" gap={8}>
                <Flex justifyContent="space-between">
                  <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>Activity ID</Text>
                  <Text style={{ fontSize: '12px', fontFamily: 'monospace' }}>{activity.id}</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>Type</Text>
                  <Text style={{ fontSize: '12px', fontWeight: '500', textTransform: 'capitalize' }}>
                    {activity.data.type}
                  </Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>Timestamp</Text>
                  <Text style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    {new Date(activity.timestamp).toISOString()}
                  </Text>
                </Flex>
              </Flex>
            </Surface>
          </Flex>

          {/* Action Buttons */}
          <Flex gap={12} style={{ marginTop: '12px' }}>
            <Button variant="primary" style={{ flex: 1 }}>
              View Full Details
            </Button>
            <Button variant="default" onClick={onClose} style={{ flex: 1 }}>
              Close
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
