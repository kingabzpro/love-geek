import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-2">
          <span className="font-mono text-accent text-xl font-bold">{'</>'}</span>
          <span className="font-bold text-lg text-text">GeekMatch</span>
        </Link>

        <SignUp fallbackRedirectUrl="/swipe" forceRedirectUrl="/swipe" />
      </div>
    </div>
  );
}
