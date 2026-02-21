import { getPotentialMatches } from '@/actions/match';
import { SwipeClient } from './SwipeClient';
import { redirect } from 'next/navigation';

export default async function SwipePage() {
  try {
    const profiles = await getPotentialMatches();
    return <SwipeClient initialProfiles={profiles} />;
  } catch (error) {
    // If not authenticated, the middleware should have caught this, 
    // but just in case or if user is not in DB yet (webhook delay)
    return (
      <div className="p-8 text-center">
        <h2>Please complete your profile to start swiping.</h2>
      </div>
    );
  }
}