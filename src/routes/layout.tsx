import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  component: Layout,
});

function Layout() {
  return (
    <div>
      <h1>My App Layout</h1>
      <Outlet />
    </div>
  );
}
