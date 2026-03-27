'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Heart, User } from 'lucide-react';

const navItems = [
  { href: '/swipe', label: 'Discover', icon: Flame },
  { href: '/matches', label: 'Matches', icon: Heart },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-around bg-surface/90 backdrop-blur-md border-t border-border-subtle px-2 py-2 safe-area-inset-bottom">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 group"
          >
            <Icon
              size={22}
              className={`transition-colors duration-200 ${
                isActive ? 'text-accent' : 'text-text-subtle group-hover:text-text-muted'
              }`}
            />
            <span
              className={`font-mono text-[10px] transition-colors duration-200 ${
                isActive ? 'text-accent' : 'text-text-subtle group-hover:text-text-muted'
              }`}
            >
              {label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-accent absolute -bottom-0.5" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
