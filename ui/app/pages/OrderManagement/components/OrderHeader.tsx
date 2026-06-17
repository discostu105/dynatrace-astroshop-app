import React from 'react';
import { Flex, Surface } from '@dynatrace/strato-components/layouts';
import { Heading, Text } from '@dynatrace/strato-components/typography';
import { ProgressCircle } from '@dynatrace/strato-components/content';
import type { OrderStatistics } from '../types/order.types';

interface OrderHeaderProps {
  statistics: OrderStatistics;
  isLoading: boolean;
  successRateVariant?: 'ring' | 'gauge' | 'bar';
}

const MetricCard = ({ 
  label, 
  value, 
  icon,
  color = 'default',
  isLoading 
}: { 
  label: string; 
  value: string | number; 
  icon: string;
  color?: 'default' | 'success' | 'critical';
  isLoading: boolean;
}) => {
  const colorMap = {
    default: 'var(--dt-colors-text-primary-default)',
    success: 'var(--dt-colors-charts-status-success-default)',
    critical: 'var(--dt-colors-charts-status-critical-default)',
  };
  
  const bgColorMap = {
    default: 'var(--dt-colors-background-surface-default)',
    success: 'rgba(44, 165, 44, 0.08)',
    critical: 'rgba(239, 83, 80, 0.08)',
  };

  return (
    <Surface style={{ 
      padding: '16px 24px', 
      minWidth: '140px', 
      borderRadius: '12px',
      backgroundColor: bgColorMap[color],
      border: `1px solid ${color === 'default' ? 'var(--dt-colors-border-neutral-default)' : 'transparent'}`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <Flex flexDirection="column" gap={8}>
        <Flex alignItems="center" gap={8}>
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <Text style={{ 
            fontSize: '11px', 
            color: 'var(--dt-colors-text-secondary-default)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            fontWeight: '600'
          }}>
            {label}
          </Text>
        </Flex>
        {isLoading ? (
          <ProgressCircle size="small" />
        ) : (
          <Text style={{ fontSize: '32px', fontWeight: '700', color: colorMap[color], lineHeight: '1' }}>
            {value}
          </Text>
        )}
      </Flex>
    </Surface>
  );
};

const SuccessRateVisual = ({ 
  rate, 
  isLoading, 
  variant = 'ring' 
}: { 
  rate: number; 
  isLoading: boolean;
  variant?: 'ring' | 'gauge' | 'bar';
}) => {
  if (isLoading) {
    return <ProgressCircle size="small" />;
  }
  
  const getColor = () => {
    if (rate >= 95) return 'var(--dt-colors-charts-status-success-default)';
    if (rate >= 80) return 'var(--dt-colors-charts-status-warning-default)';
    return 'var(--dt-colors-charts-status-critical-default)';
  };
  
  const RING_CIRCUMFERENCE = 2 * Math.PI * 40;
  
  const labelStyle: React.CSSProperties = { 
    fontSize: '11px', 
    color: 'var(--dt-colors-text-secondary-default)', 
    textTransform: 'uppercase', 
    letterSpacing: '0.5px',
    fontWeight: '600'
  };
  
  // Variant 1: Ring (existing behavior)
  if (variant === 'ring') {
    return (
      <Flex flexDirection="column" gap={8} alignItems="center" style={{ minWidth: '180px' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
            <title>Success rate: {rate.toFixed(0)}%</title>
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--dt-colors-border-neutral-default)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={getColor()}
              strokeWidth="8"
              strokeDasharray={`${(rate / 100) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
              strokeLinecap="round"
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <Text style={{ fontSize: '24px', fontWeight: '700', color: getColor() }}>
              {rate.toFixed(0)}%
            </Text>
          </div>
        </div>
        <Text style={labelStyle}>
          📈 Success Rate
        </Text>
      </Flex>
    );
  }
  
  // Variant 2: Gauge (semicircular speedometer)
  if (variant === 'gauge') {
    const gaugeWidth = 120;
    const gaugeHeight = 80;
    const centerX = gaugeWidth / 2;
    const centerY = gaugeHeight - 10;
    const radius = 45;
    const strokeWidth = 8;
    
    // Calculate arc parameters (180° sweep from left to right)
    const startAngle = 180; // Start at left (180°)
    const endAngle = 360; // End at right (360° or 0°)
    const progressAngle = startAngle + (rate / 100) * 180;
    
    const polarToCartesian = (angle: number) => {
      const angleInRadians = (angle * Math.PI) / 180;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
      };
    };
    
    const describeArc = (start: number, end: number) => {
      const startPoint = polarToCartesian(start);
      const endPoint = polarToCartesian(end);
      const largeArcFlag = end - start <= 180 ? '0' : '1';
      return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`;
    };
    
    const needlePoint = polarToCartesian(progressAngle);
    
    return (
      <Flex flexDirection="column" gap={8} alignItems="center" style={{ minWidth: '180px' }}>
        <div style={{ position: 'relative', width: `${gaugeWidth}px`, height: `${gaugeHeight}px` }}>
          <svg width={gaugeWidth} height={gaugeHeight}>
            <title>Success rate: {rate.toFixed(0)}%</title>
            {/* Background arc */}
            <path
              d={describeArc(180, 360)}
              fill="none"
              stroke="var(--dt-colors-border-neutral-default)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d={describeArc(180, progressAngle)}
              fill="none"
              stroke={getColor()}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Needle */}
            <line
              x1={centerX}
              y1={centerY}
              x2={needlePoint.x}
              y2={needlePoint.y}
              stroke={getColor()}
              strokeWidth="2"
            />
            {/* Center dot */}
            <circle
              cx={centerX}
              cy={centerY}
              r="3"
              fill={getColor()}
            />
          </svg>
          <div style={{
            position: 'absolute',
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}>
            <Text style={{ fontSize: '24px', fontWeight: '700', color: getColor() }}>
              {rate.toFixed(0)}%
            </Text>
          </div>
        </div>
        <Text style={labelStyle}>
          📈 Success Rate
        </Text>
      </Flex>
    );
  }
  
  // Variant 3: Bar (horizontal progress bar with gradient and milestones)
  if (variant === 'bar') {
    const barWidth = 200;
    const barHeight = 12;
    const milestone80 = (80 / 100) * barWidth;
    const milestone95 = (95 / 100) * barWidth;
    const progressWidth = (rate / 100) * barWidth;
    
    return (
      <Flex flexDirection="column" gap={8} alignItems="center" style={{ minWidth: '220px' }}>
        <Text style={{ fontSize: '24px', fontWeight: '700', color: getColor() }}>
          {rate.toFixed(0)}%
        </Text>
        <div style={{ position: 'relative', width: `${barWidth}px` }}>
          {/* Background bar */}
          <div style={{
            width: `${barWidth}px`,
            height: `${barHeight}px`,
            backgroundColor: 'var(--dt-colors-border-neutral-default)',
            borderRadius: '6px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Progress bar with gradient */}
            <div style={{
              width: `${progressWidth}px`,
              height: '100%',
              background: `linear-gradient(to right, rgba(44, 165, 44, 0.3), ${getColor()})`,
              borderRadius: '6px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          {/* Milestone markers */}
          <div style={{ position: 'relative', width: `${barWidth}px`, height: '20px' }}>
            {/* 80% marker */}
            <div style={{
              position: 'absolute',
              left: `${milestone80}px`,
              top: '-6px',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '2px',
                height: '8px',
                backgroundColor: 'var(--dt-colors-text-secondary-default)'
              }} />
              <Text style={{ 
                fontSize: '10px', 
                color: 'var(--dt-colors-text-secondary-default)',
                marginTop: '2px'
              }}>
                80%
              </Text>
            </div>
            
            {/* 95% marker */}
            <div style={{
              position: 'absolute',
              left: `${milestone95}px`,
              top: '-6px',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '2px',
                height: '8px',
                backgroundColor: 'var(--dt-colors-text-secondary-default)'
              }} />
              <Text style={{ 
                fontSize: '10px', 
                color: 'var(--dt-colors-text-secondary-default)',
                marginTop: '2px'
              }}>
                95%
              </Text>
            </div>
          </div>
        </div>
        <Text style={labelStyle}>
          📈 Success Rate
        </Text>
      </Flex>
    );
  }
};

export const OrderHeader = ({ statistics, isLoading, successRateVariant }: OrderHeaderProps) => {
  return (
    <Flex 
      gap={20} 
      padding={24} 
      paddingLeft={32}
      paddingRight={32}
      alignItems="center"
      style={{ 
        borderBottom: '1px solid var(--dt-colors-border-neutral-default)', 
        backgroundColor: 'var(--dt-colors-background-surface-default)',
        minHeight: '140px',
        background: 'linear-gradient(135deg, var(--dt-colors-background-surface-default) 0%, var(--dt-colors-background-container-default) 100%)'
      }}
    >
      <Flex flexDirection="column" gap={4}>
        <Heading level={2} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>📦</span>
          Order Management
        </Heading>
        <Text style={{ color: 'var(--dt-colors-text-secondary-default)', fontSize: '13px' }}>
          Monitor and analyze your e-commerce orders
        </Text>
      </Flex>
      
      {/* Visual Success Rate Infographic */}
      <SuccessRateVisual 
        rate={statistics.successRate} 
        isLoading={isLoading} 
        variant={successRateVariant}
      />
      
      {/* Metrics in a horizontal row */}
      <Flex gap={16} style={{ flex: 1 }} alignItems="center" flexWrap="wrap">
        <MetricCard 
          label="Total Orders" 
          value={statistics.totalOrders}
          icon="📊"
          isLoading={isLoading}
        />
        
        <MetricCard 
          label="Successful" 
          value={statistics.successfulOrders}
          icon="✅"
          color="success"
          isLoading={isLoading}
        />
        
        {statistics.failedOrders > 0 && (
          <MetricCard 
            label="Failed" 
            value={statistics.failedOrders}
            icon="❌"
            color="critical"
            isLoading={isLoading}
          />
        )}
      </Flex>
    </Flex>
  );
};
