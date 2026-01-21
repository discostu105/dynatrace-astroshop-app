import { useDql } from '@dynatrace-sdk/react-hooks';
import { useMemo } from 'react';
import type { TraceInsights, ServiceTiming, DatabaseStats, TraceError, PerformanceBadgeType } from '../types/traceInsights.types';

export const useTraceInsights = (traceId: string | null, timestamp: string) => {
  // Build time range for query - 5 minutes before and after the order timestamp
  const timeRange = useMemo(() => {
    if (!timestamp) return { from: 'now()-5m', to: 'now()' };
    return {
      from: `"${timestamp}" - 5m`,
      to: `"${timestamp}" + 5m`,
    };
  }, [timestamp]);

  // Query 1: Service Breakdown
  const serviceQuery = useMemo(() => {
    if (!traceId) return null;
    return `
      fetch spans, from: ${timeRange.from}, to: ${timeRange.to}
      | filter trace.id == toUid("${traceId}")
      | summarize 
          total_time = sum(duration),
          span_count = count(),
          by: {service.name}
      | sort total_time desc
    `;
  }, [traceId, timeRange]);

  // Query 2: Error Detection
  const errorQuery = useMemo(() => {
    if (!traceId) return null;
    return `
      fetch spans, from: ${timeRange.from}, to: ${timeRange.to}
      | filter trace.id == toUid("${traceId}")
      | filter isNotNull(exception.type)
      | fields 
          service.name, 
          span.name, 
          exception.type, 
          exception.message,
          http.response.status_code
    `;
  }, [traceId, timeRange]);

  // Query 3: Database Operations
  const dbQuery = useMemo(() => {
    if (!traceId) return null;
    return `
      fetch spans, from: ${timeRange.from}, to: ${timeRange.to}
      | filter trace.id == toUid("${traceId}")
      | filter isNotNull(db.statement)
      | summarize 
          db_time = sum(duration),
          db_calls = count(),
          by: {db.system}
    `;
  }, [traceId, timeRange]);

  // Query 4: Total Trace Metrics
  const totalQuery = useMemo(() => {
    if (!traceId) return null;
    return `
      fetch spans, from: ${timeRange.from}, to: ${timeRange.to}
      | filter trace.id == toUid("${traceId}")
      | summarize 
          max_duration = max(duration),
          total_spans = count(),
          error_count = countIf(isNotNull(exception.type))
    `;
  }, [traceId, timeRange]);

  // Execute queries
  const { data: serviceData, isLoading: serviceLoading } = useDql({
    query: serviceQuery || 'fetch spans | limit 0',
  });

  const { data: errorData, isLoading: errorLoading } = useDql({
    query: errorQuery || 'fetch spans | limit 0',
  });

  const { data: dbData, isLoading: dbLoading } = useDql({
    query: dbQuery || 'fetch spans | limit 0',
  });

  const { data: totalData, isLoading: totalLoading } = useDql({
    query: totalQuery || 'fetch spans | limit 0',
  });

  const isLoading = serviceLoading || errorLoading || dbLoading || totalLoading;

  // Process and combine data into TraceInsights
  const insights: TraceInsights | null = useMemo(() => {
    if (!traceId || !totalData?.records?.[0]) return null;

    const totalRecord = totalData.records[0] as any;
    const totalDuration = totalRecord.max_duration || 0;
    const spanCount = totalRecord.total_spans || 0;
    const errorCount = totalRecord.error_count || 0;

    // Process service breakdown
    const serviceBreakdown: ServiceTiming[] = (serviceData?.records || []).map((record: any) => ({
      serviceName: record['service.name'] || 'unknown',
      totalTime: record.total_time || 0,
      spanCount: record.span_count || 0,
      percentage: totalDuration > 0 ? ((record.total_time || 0) / totalDuration) * 100 : 0,
    }));

    // Find slowest service
    const slowestService = serviceBreakdown.length > 0 
      ? serviceBreakdown[0].serviceName 
      : null;

    // Process database operations
    const databaseOperations: DatabaseStats = {
      totalCalls: 0,
      totalDuration: 0,
      operations: (dbData?.records || []).map((record: any) => {
        const calls = record.db_calls || 0;
        const duration = record.db_time || 0;
        return {
          system: record['db.system'] || 'unknown',
          calls,
          duration,
        };
      }),
    };

    databaseOperations.totalCalls = databaseOperations.operations.reduce((sum, op) => sum + op.calls, 0);
    databaseOperations.totalDuration = databaseOperations.operations.reduce((sum, op) => sum + op.duration, 0);

    // Process errors
    const errors: TraceError[] = (errorData?.records || []).map((record: any) => ({
      serviceName: record['service.name'] || 'unknown',
      spanName: record['span.name'] || 'unknown',
      exceptionType: record['exception.type'] || 'unknown',
      exceptionMessage: record['exception.message'] || 'No message',
      statusCode: record['http.response.status_code'],
    }));

    // Determine performance badge
    let performanceBadge: PerformanceBadgeType;
    if (errorCount > 0) {
      performanceBadge = 'error';
    } else if (totalDuration > 2000000000) { // > 2 seconds (duration is in nanoseconds)
      performanceBadge = 'very-slow';
    } else if (totalDuration > 500000000) { // > 500ms
      performanceBadge = 'slow';
    } else {
      performanceBadge = 'fast';
    }

    return {
      totalDuration,
      spanCount,
      serviceBreakdown,
      databaseOperations,
      errors,
      slowestService,
      hasRetries: false, // TODO: Implement retry detection if needed
      performanceBadge,
    };
  }, [traceId, serviceData, errorData, dbData, totalData]);

  return { insights, isLoading };
};
