import { Navbar } from '@/components/Navbar';
import { requireAdmin } from '@/lib/auth-helpers';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect to login if not authenticated
  // or to home if not an admin
  await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Cursos Play and Learn. All rights reserved.</p>
      </footer>
    </div>
  );
} 