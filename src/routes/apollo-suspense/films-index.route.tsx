import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/films/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Select a film</div>;
}
