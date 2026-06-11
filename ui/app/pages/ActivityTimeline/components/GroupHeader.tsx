import React from 'react';
import { Text } from '@dynatrace/strato-components/typography';

interface GroupHeaderProps {
  label: string;
}

export const GroupHeader = ({ label }: GroupHeaderProps) => {
  if (!label) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '24px 0 16px 0',
        paddingLeft: '16px',
      }}
    >
      {/* Vertical line indicator */}
      <div
        style={{
          width: '2px',
          height: '24px',
          backgroundColor: 'var(--dt-colors-border-neutral-default)',
        }}
      />
      <Text
        style={{
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--dt-colors-text-primary-default)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </Text>
    </div>
  );
};
