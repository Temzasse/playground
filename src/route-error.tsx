import type { ErrorComponentProps } from '@tanstack/react-router';
import { useEffect } from 'react';

export function RouteError({ error, reset }: ErrorComponentProps) {
  useEffect(() => {
    if (error) {
      console.log('Route error', error);
    }
  }, [error]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <strong>There was an error!</strong>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
