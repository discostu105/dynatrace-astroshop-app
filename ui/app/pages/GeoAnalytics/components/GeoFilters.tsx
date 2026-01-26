import React from 'react';
import { Flex } from '@dynatrace/strato-components/layouts';
import { Surface } from '@dynatrace/strato-components/layouts';
import { TimeframeSelector } from '@dynatrace/strato-components-preview/filters';
import { Select, Label, FormField } from '@dynatrace/strato-components-preview/forms';
import type { GeoFilters as GeoFiltersType } from '../types/geo.types';

interface GeoFiltersProps {
  filters: GeoFiltersType;
  onTimeframeChange: (timeframe: GeoFiltersType['timeframe']) => void;
  onViewModeChange: (mode: 'country' | 'city') => void;
  onMetricChange: (metric: 'orders' | 'revenue') => void;
}

export const GeoFilters: React.FC<GeoFiltersProps> = ({
  filters,
  onTimeframeChange,
  onViewModeChange,
  onMetricChange,
}) => {
  return (
    <Surface>
      <Flex gap={32} padding={16} alignItems="flex-end" flexWrap="wrap">
        <FormField>
          <Label>Timeframe</Label>
          <TimeframeSelector
            value={filters.timeframe}
            onChange={onTimeframeChange}
          />
        </FormField>

        <FormField>
          <Label>View</Label>
          <Select
            value={filters.viewMode}
            onChange={(value) => onViewModeChange(value as 'country' | 'city')}
          >
            <Select.Content>
              <Select.Option value="country">By Country</Select.Option>
              <Select.Option value="city">By City</Select.Option>
            </Select.Content>
          </Select>
        </FormField>

        <FormField>
          <Label>Metric</Label>
          <Select
            value={filters.metric}
            onChange={(value) => onMetricChange(value as 'orders' | 'revenue')}
          >
            <Select.Content>
              <Select.Option value="orders">Order Count</Select.Option>
              <Select.Option value="revenue">Revenue</Select.Option>
            </Select.Content>
          </Select>
        </FormField>
      </Flex>
    </Surface>
  );
};
