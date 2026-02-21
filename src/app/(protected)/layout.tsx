import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Ghost, Heart } from 'lucide-react';
import { ensureUserInDb } from '@/lib/user-sync';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazily sync the user to our DB if they don't exist yet
  await ensureUserInDb();

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-xl relative border-x border-gray-100">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Ghost className="w-8 h-8 text-indigo-600" />
          <span className="font-bold text-xl text-indigo-600">GeekMatch</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="flex-1 overflow-y-auto relative bg-gray-50">
        {children}
      </main>

      <nav className="flex justify-around items-center p-4 border-t bg-white sticky bottom-0 z-50">
        <Link href="/swipe" className="text-gray-500 hover:text-indigo-600 flex flex-col items-center">
          <Ghost className="w-6 h-6" />
          <span className="text-xs mt-1">Discover</span>
        </Link>
        <Link href="/matches" className="text-gray-500 hover:text-indigo-600 flex flex-col items-center">
          <Heart className="w-6 h-6" />
          <span className="text-xs mt-1">Matches</span>
        </Link>
      </nav>
    </div>
  );
}