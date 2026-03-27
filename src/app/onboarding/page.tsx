import { ensureUserInDb } from '@/lib/user-sync';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { OnboardingClient } from './OnboardingClient';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const user = await ensureUserInDb();

  if (user?.profileCompleted) {
    redirect('/swipe');
  }

  return (
    <div className="min-h-screen bg-background absolute inset-0 z-[100] overflow-auto flex flex-col max-w-md mx-auto border-x border-border-subtle">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-mono text-accent text-lg font-bold">{'</>'}</span>
          <span className="font-bold text-base text-text">GeekMatch</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <OnboardingClient
        initialName={user?.name ?? ''}
        initialBio={user?.bio ?? ''}
        initialImageUrl={user?.imageUrl ?? ''}
        initialInterests={user?.interests ?? []}
      />
    </div>
  );
}
