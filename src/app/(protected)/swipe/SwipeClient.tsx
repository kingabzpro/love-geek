'use client';

import { useState } from 'react';
import { SwipeCard } from '@/components/SwipeCard';
import { recordSwipe } from '@/actions/match';

interface Profile {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
}

export function SwipeClient({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [matchNotification, setMatchNotification] = useState<string | null>(null);

  const handleSwipe = async (id: string, action: 'like' | 'dislike') => {
    // Optimistic UI update
    setProfiles((prev) => prev.filter((p) => p.id !== id));

    try {
      const result = await recordSwipe(id, action);
      if (result.isMatch) {
        setMatchNotification("It's a Match! 🎉");
        setTimeout(() => setMatchNotification(null), 3000);
      }
    } catch (error) {
      console.error('Failed to record swipe', error);
      // In a real app, we might restore the card here
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="flex-1 h-full flex items-center justify-center p-8 text-center text-gray-500">
        <div>
          <h2 className="text-xl font-bold mb-2">No more geeks found!</h2>
          <p>Check back later for new profiles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center relative p-4 mt-8">
      {/* Reverse loop so the first element is on top of the DOM stack if using absolute positioning */}
      {profiles.map((profile, i) => {
        const isTopCard = i === 0;
        if (!isTopCard) return null; // Simple approach: Only render the top card to avoid z-index complexity with framer motion
        
        return (
          <SwipeCard 
            key={profile.id} 
            profile={profile} 
            onSwipe={handleSwipe} 
          />
        );
      })}

      {matchNotification && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 text-center transform scale-110">
            <h2 className="text-3xl font-black text-indigo-600 mb-2">{matchNotification}</h2>
            <p className="text-gray-600">Check your matches tab to start chatting.</p>
          </div>
        </div>
      )}
    </div>
  );
}