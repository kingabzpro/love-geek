import { getProfileStats } from '@/actions/profile';
import { InterestBadge } from '@/components/InterestBadge';
import { Github, MapPin, Edit, Flame, Heart, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { swipesGiven, likesReceived, matchCount, user } = await getProfileStats();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <p className="text-text-muted font-mono text-sm">// Loading profile...</p>
      </div>
    );
  }

  const avatarFallback = `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(user.name)}`;

  return (
    <div className="flex flex-col min-h-full pb-6">
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-surface to-background px-5 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-border flex-shrink-0 shadow-lg">
            <Image
              src={user.imageUrl || avatarFallback}
              alt={user.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="font-bold text-xl text-text truncate">{user.name}</h1>
              {user.age && <span className="text-text-muted text-sm">{user.age}</span>}
            </div>
            {user.location && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
                <span className="font-mono text-xs text-accent">{user.location}</span>
              </div>
            )}
            {user.bio && (
              <p className="text-text-muted text-sm mt-2 leading-relaxed line-clamp-3">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Edit button */}
        <Link
          href="/onboarding"
          className="absolute top-5 right-5 p-2 bg-elevated border border-border rounded-lg text-text-muted hover:text-accent hover:border-accent/40 transition-all"
        >
          <Edit size={16} />
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 px-5 py-4">
        {[
          { icon: Flame, label: 'Swipes', value: swipesGiven },
          { icon: Heart, label: 'Liked You', value: likesReceived },
          { icon: Users, label: 'Matches', value: matchCount },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-xl p-3 text-center flex flex-col items-center gap-1"
          >
            <Icon size={16} className="text-accent" />
            <span className="font-bold text-lg text-text leading-none">{value}</span>
            <span className="font-mono text-[10px] text-text-subtle">{label}</span>
          </div>
        ))}
      </div>

      {/* Interests */}
      {user.interests && user.interests.length > 0 && (
        <div className="px-5 py-3 border-t border-border-subtle">
          <h2 className="font-mono text-xs text-text-subtle mb-3 uppercase tracking-widest">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <InterestBadge key={interest} label={interest} />
            ))}
          </div>
        </div>
      )}

      {/* GitHub link */}
      {user.githubUrl && (
        <div className="px-5 py-3 border-t border-border-subtle">
          <a
            href={user.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors group"
          >
            <Github size={16} className="group-hover:text-accent transition-colors" />
            <span className="font-mono text-sm truncate">{user.githubUrl.replace('https://', '')}</span>
          </a>
        </div>
      )}

      {/* Empty interests prompt */}
      {(!user.interests || user.interests.length === 0) && (
        <div className="px-5 py-4 border-t border-border-subtle">
          <Link
            href="/onboarding"
            className="flex items-center gap-2 font-mono text-sm text-accent/60 hover:text-accent transition-colors"
          >
            <span>+ Add your interests</span>
          </Link>
        </div>
      )}
    </div>
  );
}
