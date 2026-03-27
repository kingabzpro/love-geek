'use client';

import { useState } from 'react';
import { SwipeCard } from '@/components/SwipeCard';
import { recordSwipe } from '@/actions/match';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, RotateCcw } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  interests: string[];
  age: number | null;
  location: string | null;
}

export function SwipeClient({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedName, setMatchedName] = useState('');

  const handleSwipe = async (id: string, action: 'like' | 'dislike') => {
    const matchedProfile = profiles.find((p) => p.id === id);
    setProfiles((prev) => prev.filter((p) => p.id !== id));

    try {
      const result = await recordSwipe(id, action);
      if (result.success && result.isMatch && matchedProfile) {
        setMatchedName(matchedProfile.name);
        setShowMatch(true);
      } else if (!result.success) {
        console.error('Failed to record swipe:', result.error);
      }
    } catch (error) {
      console.error('Failed to record swipe', error);
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="flex-1 h-full flex items-center justify-center p-8 text-center">
        <div>
          <div className="font-mono text-5xl mb-4 text-border">(×_×)</div>
          <h2 className="text-lg font-bold text-text mb-2">Stack overflow</h2>
          <p className="text-text-muted text-sm font-mono mb-1">No more geeks in queue.</p>
          <p className="font-mono text-xs text-accent/60">// Come back later for more profiles</p>
          <Link
            href="/matches"
            className="mt-6 inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 rounded-xl px-5 py-2.5 font-mono text-sm hover:bg-accent/20 transition-colors"
          >
            <Heart size={16} />
            View Matches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center relative px-4 pt-4 pb-20">
      {/* Card stack */}
      <div className="relative w-full max-w-sm" style={{ height: 'min(65vh, 520px)' }}>
        <AnimatePresence>
          {[...profiles].slice(0, 3).reverse().map((profile, reversedIndex) => {
            const stackIndex = Math.min(profiles.slice(0, 3).length - 1 - reversedIndex, 2);
            return (
              <SwipeCard
                key={profile.id}
                profile={profile}
                onSwipe={handleSwipe}
                stackIndex={stackIndex}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Match modal */}
      <AnimatePresence>
        {showMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-card border border-accent/40 rounded-3xl p-8 text-center shadow-[0_0_40px_rgba(0,212,255,0.2)] max-w-xs w-full"
            >
              <div className="text-4xl mb-4">💘</div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-2">
                It&apos;s a Match!
              </h2>
              <p className="text-text-muted text-sm mb-6">
                You and <span className="text-text font-semibold">{matchedName}</span> liked each other.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/matches"
                  className="flex items-center justify-center gap-2 bg-accent text-background font-bold rounded-xl px-6 py-3 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
                >
                  <Heart size={18} />
                  View Matches
                </Link>
                <button
                  onClick={() => setShowMatch(false)}
                  className="flex items-center justify-center gap-2 border border-border text-text-muted rounded-xl px-6 py-3 hover:border-accent/40 hover:text-text transition-all font-mono text-sm"
                >
                  <RotateCcw size={16} />
                  Keep Swiping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
