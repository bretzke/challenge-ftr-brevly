import { Outlet } from 'react-router-dom';

export default function DefaultLayout() {
  return (
    <main className="bg-gray-200 min-h-dvh flex items-center justify-center p-3">
      <Outlet />
    </main>
  );
}
