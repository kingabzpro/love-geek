export const GEEK_INTERESTS = [
  // Languages & Tech
  'TypeScript',
  'Python',
  'Rust',
  'Go',
  'React',
  'Next.js',
  'Linux',
  'Kubernetes',
  'AI/ML',
  'Web3',
  'Open Source',
  'DevOps',
  'Vim',
  // Gaming
  'Gaming',
  'RPGs',
  'Strategy Games',
  'Indie Games',
  'Retro Gaming',
  'Speedrunning',
  'Game Dev',
  'D&D',
  'Board Games',
  'Magic: The Gathering',
  // Sci-Fi & Culture
  'Star Wars',
  'Star Trek',
  'Dune',
  'Lord of the Rings',
  'Marvel',
  'Anime',
  'Manga',
  'Sci-Fi Books',
  // Hobbies
  '3D Printing',
  'Electronics',
  'Mechanical Keyboards',
  'Photography',
  'Homelab',
  'Robotics',
  'Space',
  'Astronomy',
] as const;

export type GeekInterest = (typeof GEEK_INTERESTS)[number];

export const INTEREST_CATEGORIES: Record<string, readonly string[]> = {
  'Languages & Tech': [
    'TypeScript', 'Python', 'Rust', 'Go', 'React', 'Next.js',
    'Linux', 'Kubernetes', 'AI/ML', 'Web3', 'Open Source', 'DevOps', 'Vim',
  ],
  Gaming: [
    'Gaming', 'RPGs', 'Strategy Games', 'Indie Games', 'Retro Gaming',
    'Speedrunning', 'Game Dev', 'D&D', 'Board Games', 'Magic: The Gathering',
  ],
  'Sci-Fi & Culture': [
    'Star Wars', 'Star Trek', 'Dune', 'Lord of the Rings',
    'Marvel', 'Anime', 'Manga', 'Sci-Fi Books',
  ],
  Hobbies: [
    '3D Printing', 'Electronics', 'Mechanical Keyboards',
    'Photography', 'Homelab', 'Robotics', 'Space', 'Astronomy',
  ],
};
