'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TAGLINES = [
  'Find Your Player 2.',
  'Your Algorithm for Love.',
  '404: Loneliness Not Found.',
  'Merge Branches, Not Just Lives.',
];

export function LandingHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % TAGLINES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="font-mono text-xs text-accent">geek-first dating</span>
      </div>

      {/* Headline */}
      <h1 className="font-black text-4xl sm:text-5xl text-text leading-tight mb-4 tracking-tight">
        The dating app
        <br />
        <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
          built by devs, for devs.
        </span>
      </h1>

      {/* Animated tagline */}
      <div className="h-8 flex items-center justify-center overflow-hidden mb-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-base text-text-muted"
          >
            {TAGLINES[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href="/sign-up"
          className="flex items-center justify-center gap-2 bg-accent text-background font-bold rounded-xl px-6 py-3.5 hover:shadow-[0_0_24px_rgba(0,212,255,0.5)] transition-all duration-200 group text-sm"
        >
          Start Swiping
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/sign-in"
          className="flex items-center justify-center border border-border text-text-muted rounded-xl px-6 py-3.5 hover:border-accent/40 hover:text-text transition-all duration-200 text-sm font-mono"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}
