'use client';

import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { Heart, X } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
}

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (id: string, action: 'like' | 'dislike') => void;
}

export function SwipeCard({ profile, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [exitX, setExitX] = useState<number>(0);

  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = async (e: any, info: any) => {
    if (info.offset.x > 100) {
      setExitX(200);
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe(profile.id, 'like');
    } else if (info.offset.x < -100) {
      setExitX(-200);
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe(profile.id, 'dislike');
    } else {
      controls.start({ x: 0, transition: { type: 'spring' } });
    }
  };

  const manualSwipe = async (action: 'like' | 'dislike') => {
    const direction = action === 'like' ? 1 : -1;
    setExitX(direction * 200);
    await controls.start({ x: direction * 500, opacity: 0, transition: { duration: 0.3 } });
    onSwipe(profile.id, action);
  };

  return (
    <div className="relative w-full max-w-sm h-[500px] flex items-center justify-center">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, rotate, opacity }}
        className="absolute w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing border border-gray-200 flex flex-col"
      >
        <div className="relative flex-1 bg-gray-100">
          {profile.imageUrl ? (
            <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover pointer-events-none" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
              No Photo
            </div>
          )}
          
          {/* Overlays */}
          <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-green-500 rounded-lg px-4 py-2 rotate-[-15deg] pointer-events-none">
            <span className="text-green-500 font-bold text-4xl uppercase">Like</span>
          </motion.div>
          
          <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg] pointer-events-none">
            <span className="text-red-500 font-bold text-4xl uppercase">Nope</span>
          </motion.div>
        </div>
        
        <div className="p-6 bg-white h-[120px] flex flex-col justify-end">
          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-gray-600 line-clamp-2 mt-1">{profile.bio || "No bio yet."}</p>
        </div>
      </motion.div>

      {/* Buttons to trigger swipes */}
      <div className="absolute -bottom-20 flex space-x-6">
        <button 
          onClick={() => manualSwipe('dislike')}
          className="p-4 bg-white text-red-500 rounded-full shadow-lg border border-gray-200 hover:scale-110 transition-transform"
        >
          <X size={32} />
        </button>
        <button 
          onClick={() => manualSwipe('like')}
          className="p-4 bg-white text-green-500 rounded-full shadow-lg border border-gray-200 hover:scale-110 transition-transform"
        >
          <Heart size={32} />
        </button>
      </div>
    </div>
  );
}
