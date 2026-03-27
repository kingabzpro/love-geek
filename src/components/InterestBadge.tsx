'use client';

interface InterestBadgeProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export function InterestBadge({
  label,
  selected = false,
  onClick,
  size = 'sm',
}: InterestBadgeProps) {
  const isToggleable = onClick !== undefined;

  const base =
    size === 'sm'
      ? 'font-mono text-xs px-2.5 py-1 rounded-md border transition-all duration-150 select-none'
      : 'font-mono text-sm px-3 py-1.5 rounded-lg border transition-all duration-150 select-none';

  const style = selected
    ? 'bg-accent text-background border-accent font-semibold'
    : isToggleable
    ? 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 cursor-pointer'
    : 'bg-accent/10 text-accent border-accent/20';

  if (isToggleable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${style}`}
      >
        {label}
      </button>
    );
  }

  return <span className={`${base} ${style}`}>{label}</span>;
}
