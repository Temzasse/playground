import { ReactNode } from 'react';
import { QuerySuspenseBoundary } from './query-suspense-boundary';
import { QueryErrorBoundary } from './query-error-boundary';

export function QueryBoundary({ children }: { children: ReactNode }) {
  return (
    <QuerySuspenseBoundary>
      <QueryErrorBoundary>{children}</QueryErrorBoundary>
    </QuerySuspenseBoundary>
  );
}
