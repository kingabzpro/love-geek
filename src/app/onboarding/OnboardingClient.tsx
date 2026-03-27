'use client';

import { useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { updateProfile } from '@/actions/profile';
import { InterestBadge } from '@/components/InterestBadge';
import { INTEREST_CATEGORIES } from '@/lib/interests';
import { ArrowRight, ArrowLeft, MapPin, Github, Rocket } from 'lucide-react';
import Image from 'next/image';

interface OnboardingClientProps {
  initialName: string;
  initialBio: string;
  initialImageUrl: string;
  initialInterests: string[];
}

const TOTAL_STEPS = 4;

export function OnboardingClient({
  initialName,
  initialBio,
  initialImageUrl,
  initialInterests,
}: OnboardingClientProps) {
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Step 1
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  // Step 2
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  // Step 3
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialInterests);
  // Step 4
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const [error, setError] = useState('');

  const avatarSrc =
    imageUrl ||
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(name || 'geek')}`;

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 10
        ? [...prev, interest]
        : prev
    );
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length >= 2;
    if (step === 2) return selectedInterests.length >= 1;
    return true;
  };

  const handleNext = () => {
    setError('');
    if (!canProceed()) {
      if (step === 0) setError('Name must be at least 2 characters.');
      if (step === 2) setError('Pick at least 1 interest.');
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const handleSubmit = () => {
    setError('');
    if (selectedInterests.length === 0) {
      setStep(2);
      return;
    }
    const formData = new FormData();
    formData.set('name', name.trim());
    formData.set('bio', bio.trim());
    formData.set('imageUrl', imageUrl.trim());
    formData.set('interests', JSON.stringify(selectedInterests));
    formData.set('age', age);
    formData.set('location', location.trim());
    formData.set('githubUrl', githubUrl.trim());

    startTransition(() => {
      updateProfile(formData);
    });
  };

  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Progress bar */}
      <div className="h-1 bg-border-subtle w-full">
        <div
          className="h-full bg-accent transition-all duration-500 rounded-full"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="font-mono text-xs text-text-subtle">
          step {step + 1}/{TOTAL_STEPS}
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-accent' : 'bg-border-subtle'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 0 — Basic Info */}
          {step === 0 && (
            <motion.div key="step-0" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.22 }}>
              <h2 className="font-bold text-2xl text-text mb-1">Who are you?</h2>
              <p className="text-text-muted text-sm mb-6">Set up your player profile.</p>

              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-text-subtle uppercase tracking-widest block mb-1.5">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., MasterCoder99"
                    maxLength={50}
                    className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-3 text-text placeholder-text-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 font-mono text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-text-subtle uppercase tracking-widest block mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="What's your tech stack? Favorite game? Current hyperfixation?"
                    maxLength={250}
                    rows={4}
                    className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-3 text-text placeholder-text-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 font-mono text-sm transition-colors resize-none"
                  />
                  <div className="text-right font-mono text-xs text-text-subtle mt-1">
                    {bio.length}/250
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1 — Avatar */}
          {step === 1 && (
            <motion.div key="step-1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.22 }}>
              <h2 className="font-bold text-2xl text-text mb-1">Your avatar</h2>
              <p className="text-text-muted text-sm mb-6">Paste an image URL or use your auto-generated avatar.</p>

              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-border bg-elevated shadow-lg">
                  <Image
                    src={avatarSrc}
                    alt="Avatar preview"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                {!imageUrl && (
                  <p className="font-mono text-xs text-accent/60">
                    ↑ auto-generated from your name
                  </p>
                )}
              </div>

              <div>
                <label className="font-mono text-xs text-text-subtle uppercase tracking-widest block mb-1.5">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-3 text-text placeholder-text-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 font-mono text-sm transition-colors"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2 — Interests */}
          {step === 2 && (
            <motion.div key="step-2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.22 }}>
              <h2 className="font-bold text-2xl text-text mb-1">Your interests</h2>
              <div className="flex items-center justify-between mb-5">
                <p className="text-text-muted text-sm">Pick what defines you (up to 10).</p>
                <span className="font-mono text-xs text-accent bg-accent/10 border border-accent/20 rounded-full px-2.5 py-1">
                  {selectedInterests.length}/10
                </span>
              </div>

              <div className="space-y-5">
                {Object.entries(INTEREST_CATEGORIES).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-mono text-[10px] text-text-subtle uppercase tracking-widest mb-2">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((interest) => (
                        <InterestBadge
                          key={interest}
                          label={interest}
                          selected={selectedInterests.includes(interest)}
                          onClick={() => toggleInterest(interest)}
                          size="md"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3 — Preview + optional details */}
          {step === 3 && (
            <motion.div key="step-3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.22 }}>
              <h2 className="font-bold text-2xl text-text mb-1">Ready to launch?</h2>
              <p className="text-text-muted text-sm mb-5">Add a few extras, then go find your Player 2.</p>

              {/* Mini profile preview */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden mb-5 shadow-lg">
                <div className="flex items-center gap-3 p-4 border-b border-border-subtle">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-border flex-shrink-0">
                    <Image src={avatarSrc} alt={name} width={48} height={48} className="object-cover" unoptimized />
                  </div>
                  <div>
                    <div className="font-bold text-text text-sm">{name || 'Your Name'}</div>
                    {bio && <p className="text-text-muted text-xs line-clamp-1 mt-0.5">{bio}</p>}
                  </div>
                </div>
                {selectedInterests.length > 0 && (
                  <div className="p-3 flex flex-wrap gap-1.5">
                    {selectedInterests.slice(0, 6).map((i) => (
                      <InterestBadge key={i} label={i} size="sm" />
                    ))}
                    {selectedInterests.length > 6 && (
                      <span className="font-mono text-xs text-text-subtle">+{selectedInterests.length - 6} more</span>
                    )}
                  </div>
                )}
              </div>

              {/* Optional extras */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="font-mono text-xs text-text-subtle block mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                      min={18}
                      max={99}
                      className="w-full bg-surface border border-border-subtle rounded-xl px-3 py-2.5 text-text placeholder-text-subtle focus:border-accent focus:outline-none font-mono text-sm transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="font-mono text-xs text-text-subtle block mb-1">
                      <MapPin className="inline w-3 h-3 mr-1" />Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco"
                      maxLength={100}
                      className="w-full bg-surface border border-border-subtle rounded-xl px-3 py-2.5 text-text placeholder-text-subtle focus:border-accent focus:outline-none font-mono text-sm transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono text-xs text-text-subtle block mb-1">
                    <Github className="inline w-3 h-3 mr-1" />GitHub URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="w-full bg-surface border border-border-subtle rounded-xl px-3 py-2.5 text-text placeholder-text-subtle focus:border-accent focus:outline-none font-mono text-sm transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <p className="mt-3 font-mono text-xs text-dislike">{error}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="px-5 pb-8 pt-4 flex gap-3 border-t border-border-subtle bg-surface/60 backdrop-blur-sm">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-2 border border-border text-text-muted rounded-xl px-5 py-3 hover:border-accent/40 hover:text-text transition-all font-mono text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}
        {step < TOTAL_STEPS - 1 ? (
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 bg-accent text-background font-bold rounded-xl px-5 py-3 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all text-sm"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-accent text-background font-bold rounded-xl px-5 py-3 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="font-mono text-sm">Launching...</span>
            ) : (
              <>
                <Rocket size={16} />
                Launch Profile
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
