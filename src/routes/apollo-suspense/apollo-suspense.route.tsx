import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/apollo-suspense')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_layout/apollo-suspense"!</div>;
}
