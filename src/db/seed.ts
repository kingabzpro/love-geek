import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: ['.env.local', '.env'] });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const SAMPLE_INTERESTS: string[][] = [
  ['TypeScript', 'React', 'Next.js', 'Open Source', 'Gaming', 'Anime'],
  ['Python', 'AI/ML', 'Rust', 'Star Wars', 'D&D', 'Space'],
  ['Indie Games', 'Retro Gaming', 'Manga', 'Mechanical Keyboards', 'Linux', 'Vim'],
  ['Go', 'DevOps', 'Kubernetes', 'Board Games', 'Sci-Fi Books', 'Homelab'],
  ['Game Dev', 'RPGs', 'Lord of the Rings', 'Photography', '3D Printing', 'Robotics'],
];

const SAMPLE_LOCATIONS = ['San Francisco', 'Berlin', 'Tokyo', 'London', 'Amsterdam'];

async function main() {
  console.log('Fetching random profiles from the web...');
  const res = await fetch('https://randomuser.me/api/?gender=female&results=5');

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }

  const data = await res.json();

  const newUsers = data.results.map((user: any, i: number) => ({
    clerkId: `mock_${crypto.randomUUID()}`,
    name: `${user.name.first} ${user.name.last}`,
    bio: "Hi, I'm new here and looking for my player 2! 🎮 Let's build something awesome together.",
    imageUrl: `https://api.dicebear.com/9.x/lorelei/svg?seed=${user.name.first}&hair=variant02,variant03,variant04,variant05,variant07,variant08,variant13,variant14,variant15,variant16,variant17,variant18,variant20,variant22,variant28&radius=50`,
    interests: SAMPLE_INTERESTS[i % SAMPLE_INTERESTS.length],
    age: 22 + (i * 3),
    location: SAMPLE_LOCATIONS[i % SAMPLE_LOCATIONS.length],
    profileCompleted: true,
  }));

  console.log('Inserting into Neon database...');
  await db.insert(schema.users).values(newUsers);
  console.log('Successfully added 5 random profiles to swipe on!');
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
