import { ReactNode } from 'react';
import { QuerySuspenseBoundary } from './QuerySuspenseBoundary';
import { QueryErrorBoundary } from './QueryErrorBoundary';

export function QueryBoundary({ children }: { children: ReactNode }) {
  return (
    <QuerySuspenseBoundary>
      <QueryErrorBoundary>{children}</QueryErrorBoundary>
    </QuerySuspenseBoundary>
  );
}
