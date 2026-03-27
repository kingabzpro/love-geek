'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface MatchCardProps {
  user: {
    id: string;
    name: string;
    imageUrl: string | null;
    bio: string | null;
    interests: string[];
    age: number | null;
    location: string | null;
  };
  sharedInterests: string[];
}

export function MatchCard({ user, sharedInterests }: MatchCardProps) {
  const avatarFallback = `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(user.name)}`;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-accent/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square bg-elevated overflow-hidden">
        <Image
          src={user.imageUrl || avatarFallback}
          alt={user.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

        {/* Shared interests badge */}
        {sharedInterests.length > 0 && (
          <div className="absolute top-2 right-2 bg-accent/20 backdrop-blur-sm border border-accent/40 rounded-full px-2 py-0.5">
            <span className="font-mono text-[10px] text-accent font-semibold">
              {sharedInterests.length} shared
            </span>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm text-text">{user.name}</span>
            {user.age && <span className="text-text-muted text-xs">{user.age}</span>}
          </div>
          {user.location && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-accent" />
              <span className="font-mono text-[10px] text-accent truncate">{user.location}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
