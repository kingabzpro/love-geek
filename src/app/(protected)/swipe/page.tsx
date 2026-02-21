import { getPotentialMatches } from '@/actions/match';
import { SwipeClient } from './SwipeClient';

export const dynamic = 'force-dynamic';

export default async function SwipePage() {
  try {
    const result = await getPotentialMatches();
    
    if (!result.success) {
      return (
        <div className="p-8 text-center text-red-500 flex items-center justify-center h-full">
          <h2>Error loading profiles: {result.error}</h2>
        </div>
      );
    }

    return <SwipeClient initialProfiles={result.data || []} />;
  } catch (error) {
    // If not authenticated, the middleware should have caught this.
    // Lazy sync occurs in the layout, so this is just a fallback for unexpected errors.
    return (
      <div className="p-8 text-center flex items-center justify-center h-full">
        <h2>Please complete your profile to start swiping.</h2>
      </div>
    );
  }
}