import { UserButton } from '@clerk/nextjs';
import { ensureUserInDb } from '@/lib/user-sync';
import { redirect } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await ensureUserInDb();

  if (user && !user.profileCompleted) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-surface shadow-2xl shadow-black/50 relative border-x border-border-subtle">
      <header className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-mono text-accent text-lg font-bold">{'</>'}</span>
          <span className="font-bold text-base text-text tracking-tight">GeekMatch</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="flex-1 overflow-y-auto relative bg-background">
        {children}
      </main>

      <div className="sticky bottom-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
