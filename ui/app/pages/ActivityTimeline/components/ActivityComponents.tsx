import React, { useState } from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Text } from '@dynatrace/strato-components/typography';
import { Button } from '@dynatrace/strato-components/buttons';
import type {
  CommitActivityData,
  CommentActivityData,
  TaskActivityData,
  SettingsActivityData,
  UserActivityData,
  FileActivityData,
  BranchActivityData,
  PRActivityData,
} from '../types/activity.types';

/**
 * Activity type-specific content renderers.
 * Each component formats and displays the relevant details for its activity type.
 * Used in both ActivityItem (preview) and ActivityDetailModal (full details).
 */

// ========== COMMIT ACTIVITY ==========
// Displays commit message, hash, branch, file stats, and expandable file list
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- expanded state is part of future feature expansion
export const CommitActivityContent = ({ data }: { data: CommitActivityData }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Flex flexDirection="column" gap={12}>
      {/* Message and Hash */}
      <div>
        <Text style={{ fontSize: '14px', fontWeight: '500' }}>{data.message}</Text>
        <Text style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--dt-colors-text-secondary-default)' }}>
          {data.commitHash}
        </Text>
      </div>

      {/* Branch Badge */}
      <div style={{ display: 'inline-block' }}>
        <div
          style={{
            padding: '4px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid var(--dt-colors-charts-categorical-grass-default)',
          }}
        >
          <Text style={{ fontSize: '12px', color: 'var(--dt-colors-charts-categorical-grass-default)', fontWeight: '500' }}>
            🌿 {data.branch}
          </Text>
        </div>
      </div>

      {/* File Stats */}
      <Flex gap={16} flexWrap="wrap">
        <div>
          <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Files Changed
          </Text>
          <Text style={{ fontSize: '18px', fontWeight: '600' }}>{data.filesChanged}</Text>
        </div>
        <div>
          <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Additions
          </Text>
          <Text style={{ fontSize: '18px', fontWeight: '600', color: 'var(--dt-colors-charts-categorical-grass-default)' }}>
            +{data.additions}
          </Text>
        </div>
        <div>
          <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Deletions
          </Text>
          <Text style={{ fontSize: '18px', fontWeight: '600', color: 'var(--dt-colors-charts-categorical-sunrise-default)' }}>
            -{data.deletions}
          </Text>
        </div>
      </Flex>

      {/* Expandable File List */}
      {data.files && data.files.length > 0 && (
        <>
          <Button
            variant="default"
            onClick={() => setExpanded(!expanded)}
            style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '12px' }}
          >
            {expanded ? '−' : '+'} {data.files.length} files
          </Button>

          {expanded && (
            <Surface
              style={{
                padding: '12px',
                backgroundColor: 'var(--dt-colors-background-container-default)',
                borderRadius: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              <Flex flexDirection="column" gap={8}>
                {data.files.map((file, idx) => (
                  <Flex key={idx} justifyContent="space-between" alignItems="center" gap={12}>
                    <Text style={{ fontSize: '12px', fontFamily: 'monospace', flex: 1, wordBreak: 'break-word' }}>
                      {file.path}
                    </Text>
                    <Text style={{ fontSize: '11px', color: 'var(--dt-colors-charts-categorical-grass-default)', whiteSpace: 'nowrap' }}>
                      +{file.additions}
                    </Text>
                    <Text style={{ fontSize: '11px', color: 'var(--dt-colors-charts-categorical-sunrise-default)', whiteSpace: 'nowrap' }}>
                      -{file.deletions}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Surface>
          )}
        </>
      )}

      <Button variant="default" style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '12px' }}>
        View Commit
      </Button>
    </Flex>
  );
};

// ========== COMMENT ACTIVITY ==========
// Displays comment context, preview text, line reference, and reply count
export const CommentActivityContent = ({ data }: { data: CommentActivityData }) => {
  return (
    <Flex flexDirection="column" gap={12}>
      {/* Context */}
      <div style={{ padding: '8px 12px', backgroundColor: 'var(--dt-colors-background-container-default)', borderRadius: '6px' }}>
        <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>📍 {data.context}</Text>
        {data.line && (
          <Text style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dt-colors-text-secondary-default)' }}>
            Line {data.line}
          </Text>
        )}
      </div>

      {/* Preview */}
      <Text style={{ fontSize: '14px', lineHeight: '1.5' }}>{data.preview}</Text>

      {/* Reply count */}
      {data.replyCount > 0 && (
        <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)', fontStyle: 'italic' }}>
          💬 {data.replyCount} {data.replyCount === 1 ? 'reply' : 'replies'}
        </Text>
      )}

      <Button variant="default" style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '12px' }}>
        View Full Comment
      </Button>
    </Flex>
  );
};

// ========== TASK ACTIVITY ==========
// Displays task ID, title, status, priority, assignee, and due date
export const TaskActivityContent = ({ data }: { data: TaskActivityData }) => {
  const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
    created: {
      bg: 'rgba(33, 150, 243, 0.1)',
      text: 'var(--dt-colors-charts-categorical-blue-default)',
      icon: '📋',
    },
    in_progress: {
      bg: 'rgba(255, 193, 7, 0.1)',
      text: 'var(--dt-colors-charts-categorical-yellow-default)',
      icon: '⚡',
    },
    completed: {
      bg: 'rgba(76, 175, 80, 0.1)',
      text: 'var(--dt-colors-charts-categorical-grass-default)',
      icon: '✅',
    },
  };

  const statusConfig = statusColors[data.status];

  const priorityColors: Record<string, string> = {
    low: 'var(--dt-colors-charts-categorical-blue-default)',
    medium: 'var(--dt-colors-charts-categorical-yellow-default)',
    high: 'var(--dt-colors-charts-categorical-sunrise-default)',
  };

  return (
    <Flex flexDirection="column" gap={12}>
      {/* Title and Status */}
      <div>
        <Text style={{ fontSize: '14px', fontWeight: '500' }}>{data.title}</Text>
        <Text style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--dt-colors-text-secondary-default)' }}>
          {data.taskId}
        </Text>
      </div>

      {/* Status and Priority Badges */}
      <Flex gap={12} flexWrap="wrap">
        <div
          style={{
            padding: '4px 12px',
            borderRadius: '8px',
            backgroundColor: statusConfig.bg,
            border: `1px solid ${statusConfig.text}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{statusConfig.icon}</span>
          <Text style={{ fontSize: '12px', fontWeight: '500', color: statusConfig.text, textTransform: 'capitalize' }}>
            {data.status.replace('_', ' ')}
          </Text>
        </div>

        {data.priority && (
          <div
            style={{
              padding: '4px 12px',
              borderRadius: '8px',
              backgroundColor: `${priorityColors[data.priority]}20`,
              border: `1px solid ${priorityColors[data.priority]}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Text style={{ fontSize: '12px', fontWeight: '500', color: priorityColors[data.priority], textTransform: 'capitalize' }}>
              {data.priority} Priority
            </Text>
          </div>
        )}
      </Flex>

      {/* Assignee and Due Date */}
      <Flex gap={16} flexWrap="wrap">
        {data.assignee && (
          <div>
            <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Assignee
            </Text>
            <Text style={{ fontSize: '13px', fontWeight: '500' }}>{data.assignee.name}</Text>
          </div>
        )}
        {data.dueDate && (
          <div>
            <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Due Date
            </Text>
            <Text style={{ fontSize: '13px', fontWeight: '500' }}>
              {new Date(data.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </div>
        )}
      </Flex>

      <Button variant="default" style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '12px' }}>
        View Task
      </Button>
    </Flex>
  );
};

// ========== SETTINGS ACTIVITY ==========
// Displays setting name with before/after values and scope
export const SettingsActivityContent = ({ data }: { data: SettingsActivityData }) => {
  return (
    <Flex flexDirection="column" gap={12}>
      {/* Setting Name */}
      <Text style={{ fontSize: '14px', fontWeight: '500' }}>{data.settingName}</Text>

      {/* Before/After Values */}
      <Flex gap={16} alignItems="center" flexWrap="wrap">
        <div>
          <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Before
          </Text>
          <Text style={{ fontSize: '13px', textDecoration: 'line-through', color: 'var(--dt-colors-text-secondary-default)' }}>
            {data.beforeValue}
          </Text>
        </div>

        <span style={{ color: 'var(--dt-colors-text-secondary-default)' }}>→</span>

        <div>
          <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            After
          </Text>
          <Text style={{ fontSize: '13px', fontWeight: '600', color: 'var(--dt-colors-charts-categorical-grass-default)' }}>
            {data.afterValue}
          </Text>
        </div>
      </Flex>

      {/* Scope */}
      <div
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          backgroundColor: 'var(--dt-colors-background-container-default)',
          display: 'inline-block',
          width: 'fit-content',
        }}
      >
        <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
          📍 Scope: <strong>{data.scope}</strong>
        </Text>
      </div>

      <Button variant="default" style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '12px' }}>
        View Settings
      </Button>
    </Flex>
  );
};

// ========== USER ACTIVITY ==========
// Displays user action description and optional target user information
export const UserActivityContent = ({ data }: { data: UserActivityData }) => {
  return (
    <Flex flexDirection="column" gap={8}>
      <Text style={{ fontSize: '14px' }}>
        <strong>{data.targetUser?.name || 'A team member'}</strong> {data.action}
      </Text>
    </Flex>
  );
};

// ========== FILE ACTIVITY ==========
// Displays file operation (created/deleted/renamed) with path and size info
export const FileActivityContent = ({ data }: { data: FileActivityData }) => {
  const operationConfig: Record<string, { icon: string; label: string; color: string }> = {
    created: { icon: '✨', label: 'Created', color: 'var(--dt-colors-charts-categorical-grass-default)' },
    deleted: { icon: '🗑️', label: 'Deleted', color: 'var(--dt-colors-charts-categorical-sunrise-default)' },
    renamed: { icon: '✏️', label: 'Renamed', color: 'var(--dt-colors-charts-categorical-yellow-default)' },
  };

  const config = operationConfig[data.operation];

  return (
    <Flex flexDirection="column" gap={12}>
      {/* Operation Badge */}
      <div
        style={{
          padding: '4px 12px',
          borderRadius: '8px',
          backgroundColor: `${config.color}20`,
          border: `1px solid ${config.color}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          width: 'fit-content',
        }}
      >
        <span>{config.icon}</span>
        <Text style={{ fontSize: '12px', fontWeight: '500', color: config.color }}>{config.label}</Text>
      </div>

      {/* File Path */}
      <Text style={{ fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
        {data.filePath}
      </Text>

      {/* Previous Path (if renamed) */}
      {data.previousPath && (
        <Text style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--dt-colors-text-secondary-default)' }}>
          formerly: {data.previousPath}
        </Text>
      )}

      {/* File Size */}
      {data.fileSize && (
        <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
          📦 {(data.fileSize / 1024).toFixed(2)} KB
        </Text>
      )}

      <Button variant="default" style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '12px' }}>
        View File
      </Button>
    </Flex>
  );
};

// ========== BRANCH ACTIVITY ==========
// Displays branch operation (created/deleted/merged) with branch name and source
export const BranchActivityContent = ({ data }: { data: BranchActivityData }) => {
  const actionConfig: Record<string, string> = {
    created: '✨ Created branch',
    deleted: '🗑️ Deleted branch',
    merged: '✅ Merged branch',
  };

  return (
    <Flex flexDirection="column" gap={12}>
      <Text style={{ fontSize: '14px' }}>
        {actionConfig[data.action]} <strong style={{ fontFamily: 'monospace' }}>{data.branchName}</strong>
      </Text>

      {data.sourceBranch && (
        <Text style={{ fontSize: '12px', color: 'var(--dt-colors-text-secondary-default)' }}>
          from <strong style={{ fontFamily: 'monospace' }}>{data.sourceBranch}</strong>
        </Text>
      )}
    </Flex>
  );
};

// ========== PR ACTIVITY ==========
// Displays PR number, title, status, and list of reviewers
export const PRActivityContent = ({ data }: { data: PRActivityData }) => {
  const statusConfig: Record<string, { icon: string; color: string }> = {
    open: { icon: '🔵', color: 'var(--dt-colors-charts-categorical-blue-default)' },
    merged: { icon: '✅', color: 'var(--dt-colors-charts-categorical-grass-default)' },
    closed: { icon: '❌', color: 'var(--dt-colors-charts-categorical-sunrise-default)' },
  };

  const config = statusConfig[data.status || 'open'];

  return (
    <Flex flexDirection="column" gap={12}>
      {/* PR Title and Number */}
      <div>
        <Text style={{ fontSize: '14px', fontWeight: '500' }}>
          PR #{data.prNumber}: {data.title}
        </Text>
      </div>

      {/* Status Badge */}
      {data.status && (
        <div
          style={{
            padding: '4px 12px',
            borderRadius: '8px',
            backgroundColor: `${config.color}20`,
            border: `1px solid ${config.color}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            width: 'fit-content',
          }}
        >
          <span>{config.icon}</span>
          <Text style={{ fontSize: '12px', fontWeight: '500', color: config.color, textTransform: 'capitalize' }}>
            {data.status}
          </Text>
        </div>
      )}

      {/* Reviewers */}
      {data.reviewers && data.reviewers.length > 0 && (
        <Flex gap={8} flexWrap="wrap">
          <Text style={{ fontSize: '11px', color: 'var(--dt-colors-text-secondary-default)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Reviewers
          </Text>
          {data.reviewers.map(reviewer => (
            <Text key={reviewer.id} style={{ fontSize: '12px', fontWeight: '500' }}>
              {reviewer.name}
            </Text>
          ))}
        </Flex>
      )}

      <Button variant="default" style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '12px' }}>
        View PR
      </Button>
    </Flex>
  );
};
