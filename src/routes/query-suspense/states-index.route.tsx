import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/states/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Select a state</div>;
}
