import { getMatches } from '@/actions/match';
import { MatchCard } from '@/components/MatchCard';
import Link from 'next/link';
import { Flame } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
  const result = await getMatches();

  if (!result.success) {
    return (
      <div className="p-6 text-center">
        <p className="text-dislike font-mono text-sm">Error: {result.error}</p>
      </div>
    );
  }

  const matches = result.data ?? [];
  const currentUserInterests = result.currentUserInterests ?? [];

  return (
    <div className="flex flex-col min-h-full pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <h1 className="font-bold text-lg text-text">Matches</h1>
        {matches.length > 0 && (
          <span className="font-mono text-xs text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1">
            {matches.length} connected
          </span>
        )}
      </div>

      {matches.length === 0 ? (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
          <div className="font-mono text-5xl mb-4 select-none">( ._. )</div>
          <h2 className="font-bold text-base text-text mb-2">No matches yet</h2>
          <p className="text-text-muted text-sm mb-1">Your matches array is currently empty.</p>
          <p className="font-mono text-xs text-accent/60 mb-6">
            {'// TODO: swipe right more often'}
          </p>
          <Link
            href="/swipe"
            className="inline-flex items-center gap-2 bg-accent text-background font-bold rounded-xl px-5 py-2.5 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all text-sm"
          >
            <Flame size={16} />
            Start Swiping
          </Link>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 gap-3">
          {matches.map((user) => {
            const sharedInterests = (user.interests ?? []).filter((i) =>
              currentUserInterests.includes(i)
            );
            return (
              <MatchCard key={user.id} user={user} sharedInterests={sharedInterests} />
            );
          })}
        </div>
      )}
    </div>
  );
}
