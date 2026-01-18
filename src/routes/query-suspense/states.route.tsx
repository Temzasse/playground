import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';

import { Sidebar } from './sidebar';
import { queries } from './queries';

export const Route = createFileRoute('/_layout/states')({
  component: RouteComponent,

  loader: async ({ context }) => {
    const statesQueryRef = queries.states();

    void context.queryClient.prefetchQuery(statesQueryRef);

    return { statesQueryRef };
  },
});

function RouteComponent() {
  const [_, forceRender] = useState(0);
  const [latency, setLatency] = useState(200);

  return (
    <div
      style={{
        padding: 40,
        display: 'flex',
        gap: 16,
      }}
    >
      <Sidebar />

      <div
        style={{
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'start',
        }}
      >
        <Outlet />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: 12,
            backgroundColor: '#f5f5f5',
            borderRadius: 4,
            marginTop: 40,
          }}
        >
          <button onClick={() => forceRender((p) => p + 1)}>Re-render</button>
          <span>Latency {latency}ms</span>
          <input
            type="range"
            min={200}
            max={4000}
            step={100}
            value={latency}
            onChange={(e) => {
              setLatency(Number(e.target.value));
              (window as any).__LATENCY__ = Number(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
