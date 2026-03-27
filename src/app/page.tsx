import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { LandingHero } from '@/components/LandingHero';
import { Terminal, Zap, Shield } from 'lucide-react';

const FEATURES = [
  {
    icon: Terminal,
    title: 'Match by Stack',
    description: 'Swipe on devs who actually know what a monad is.',
  },
  {
    icon: Zap,
    title: 'Instant Matching',
    description: 'Our O(1) algorithm finds your complement.',
  },
  {
    icon: Shield,
    title: 'Geek-Verified',
    description: 'No fake profiles. Just real nerds.',
  },
];

const STATS = [
  { value: '10,247', label: 'Geeks Joined' },
  { value: '3,891', label: 'Matches Made' },
  { value: 'TypeScript', label: 'Strict Mode ✓' },
];

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect('/swipe');

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* CSS grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Radial glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-mono text-accent font-bold text-lg">{'</>'}</span>
          <span className="font-bold text-base text-text">GeekMatch</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-text-subtle">
          <span className="hidden sm:inline text-accent/60">v2.0.0</span>
        </div>
      </nav>

      {/* Hero */}
      <LandingHero />

      {/* Stats */}
      <section className="relative z-10 max-w-lg mx-auto px-6 mb-14">
        <div className="grid grid-cols-3 gap-3">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-2xl p-4 text-center hover:border-accent/30 transition-colors"
            >
              <div className="font-black text-lg text-text leading-tight">{value}</div>
              <div className="font-mono text-[10px] text-text-subtle mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-lg mx-auto px-6 pb-20">
        <h2 className="font-bold text-xl text-text text-center mb-6">
          Why{' '}
          <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
            GeekMatch
          </span>
          ?
        </h2>
        <div className="space-y-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-4 bg-card border border-border rounded-2xl p-4 hover:border-accent/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.08)] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-text">{title}</h3>
                <p className="text-text-muted text-sm mt-0.5 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-subtle py-6 text-center">
        <p className="font-mono text-xs text-text-subtle">
          {'// GeekMatch © 2026 — find your Player 2'}
        </p>
      </footer>
    </div>
  );
}
