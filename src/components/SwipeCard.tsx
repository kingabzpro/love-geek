'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';
import { Heart, X, MapPin } from 'lucide-react';
import { InterestBadge } from '@/components/InterestBadge';

interface Profile {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  interests: string[];
  age: number | null;
  location: string | null;
}

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (id: string, action: 'like' | 'dislike') => void;
  stackIndex?: number;
}

const stackTransform: Record<number, string> = {
  0: 'scale-100 translate-y-0 opacity-100',
  1: 'scale-[0.96] translate-y-3 opacity-80',
  2: 'scale-[0.92] translate-y-6 opacity-60',
};

export function SwipeCard({ profile, onSwipe, stackIndex = 0 }: SwipeCardProps) {
  const x = useMotionValue(0);
  const [exitX, setExitX] = useState<number>(0);

  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);

  const isTop = stackIndex === 0;

  const handleDragEnd = (_e: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) {
      setExitX(600);
      onSwipe(profile.id, 'like');
    } else if (info.offset.x < -100) {
      setExitX(-600);
      onSwipe(profile.id, 'dislike');
    }
  };

  const manualSwipe = (action: 'like' | 'dislike') => {
    const direction = action === 'like' ? 1 : -1;
    setExitX(direction * 600);
    onSwipe(profile.id, action);
  };

  return (
    <div
      className={`absolute inset-0 transition-all duration-300 ${stackTransform[stackIndex] ?? 'opacity-0'}`}
      style={{ zIndex: 10 - stackIndex }}
    >
      <motion.div
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        exit={{ x: exitX, opacity: 0, transition: { duration: 0.3 } }}
        style={isTop ? { x, rotate, opacity } : {}}
        className={`w-full h-full bg-card border border-border rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/60 ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      >
        {/* Image section */}
        <div className="relative flex-1 bg-surface overflow-hidden">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-subtle bg-elevated gap-2">
              <span className="font-mono text-4xl text-border">( ̄ω ̄)</span>
              <span className="font-mono text-xs text-text-subtle">no photo uploaded</span>
            </div>
          )}

          {/* LIKE overlay */}
          {isTop && (
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-8 left-6 pointer-events-none z-10"
            >
              <div className="border-4 border-like rounded-xl px-4 py-2 -rotate-12 shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                <span className="text-like font-black text-3xl uppercase tracking-widest">Like</span>
              </div>
            </motion.div>
          )}

          {/* NOPE overlay */}
          {isTop && (
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-8 right-6 pointer-events-none z-10"
            >
              <div className="border-4 border-dislike rounded-xl px-4 py-2 rotate-12 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                <span className="text-dislike font-black text-3xl uppercase tracking-widest">Nope</span>
              </div>
            </motion.div>
          )}

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-card via-card/70 to-transparent pointer-events-none" />

          {/* User info */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-baseline gap-2 mb-1">
              <h2 className="text-2xl font-black text-text">{profile.name}</h2>
              {profile.age && (
                <span className="text-text-muted text-base font-medium">{profile.age}</span>
              )}
            </div>
            {profile.location && (
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3 text-accent" />
                <span className="font-mono text-xs text-accent">{profile.location}</span>
              </div>
            )}
            {profile.bio && (
              <p className="text-text-muted text-sm line-clamp-2 leading-relaxed mb-2">{profile.bio}</p>
            )}
            {profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-10">
                {profile.interests.slice(0, 5).map((interest) => (
                  <InterestBadge key={interest} label={interest} />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action buttons — only on top card */}
      {isTop && (
        <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-6">
          <button
            onClick={() => manualSwipe('dislike')}
            className="p-4 bg-surface border-2 border-dislike/40 text-dislike rounded-full shadow-lg hover:bg-dislike/10 hover:border-dislike hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-200 active:scale-90"
          >
            <X size={28} />
          </button>
          <button
            onClick={() => manualSwipe('like')}
            className="p-4 bg-surface border-2 border-like/40 text-like rounded-full shadow-lg hover:bg-like/10 hover:border-like hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-200 active:scale-90"
          >
            <Heart size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
