export interface TraceInsights {
  totalDuration: number;
  spanCount: number;
  serviceBreakdown: ServiceTiming[];
  databaseOperations: DatabaseStats;
  errors: TraceError[];
  slowestService: string | null;
  hasRetries: boolean;
  performanceBadge: 'fast' | 'slow' | 'very-slow' | 'error';
}

export interface ServiceTiming {
  serviceName: string;
  totalTime: number;
  spanCount: number;
  percentage: number;
}

export interface DatabaseStats {
  totalCalls: number;
  totalDuration: number;
  operations: DatabaseOperation[];
}

export interface DatabaseOperation {
  system: string;
  calls: number;
  duration: number;
}

export interface TraceError {
  serviceName: string;
  spanName: string;
  exceptionType: string;
  exceptionMessage: string;
  statusCode?: number;
}

export type PerformanceBadgeType = 'fast' | 'slow' | 'very-slow' | 'error';
