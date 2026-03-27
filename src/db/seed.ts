import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { not, like } from 'drizzle-orm';
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
    imageUrl: `https://api.dicebear.com/9.x/lorelei/svg?seed=${user.name.first}&hair=variant02,variant03,variant04,variant05,variant07,variant08,variant13,variant14,variant15,variant16,variant17,variant18,variant20,variant22,variant28&backgroundColor=111d2e&radius=10`,
    interests: SAMPLE_INTERESTS[i % SAMPLE_INTERESTS.length],
    age: 22 + (i * 3),
    location: SAMPLE_LOCATIONS[i % SAMPLE_LOCATIONS.length],
    profileCompleted: true,
  }));

  console.log('Inserting seed profiles...');
  const inserted = await db.insert(schema.users).values(newUsers).returning({ id: schema.users.id });
  console.log(`Inserted ${inserted.length} profiles.`);

  // Find real user (non-mock) to create matches with
  const realUser = await db.query.users.findFirst({
    where: not(like(schema.users.clerkId, 'mock_%')),
  });

  if (!realUser) {
    console.log('No real user found — skipping match seeding. Sign in first, then re-run.');
    return;
  }

  console.log(`Creating matches for ${realUser.name} (${realUser.id})...`);

  // Create matches with first 3 seeded profiles
  const matchPairs = inserted.slice(0, 3).map(({ id: seedId }) => {
    const [user1Id, user2Id] = realUser.id < seedId
      ? [realUser.id, seedId]
      : [seedId, realUser.id];
    return { user1Id, user2Id };
  });

  await db.insert(schema.matches).values(matchPairs).onConflictDoNothing();
  console.log(`Created ${matchPairs.length} matches for ${realUser.name}!`);
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
