import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Ensures the currently authenticated Clerk user exists in our local Neon database.
 * This replaces the need for Clerk Webhooks by performing a "lazy sync".
 */
export async function ensureUserInDb() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      console.warn("ensureUserInDb: No Clerk user found in session.");
      return null;
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkUser.id),
    });

    if (existingUser) {
      return existingUser;
    }

    console.info(`ensureUserInDb: Syncing new user ${clerkUser.id} to DB...`);

    // Sync user details to DB if missing
    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Geek';
    
    const [newUser] = await db.insert(users).values({
      clerkId: clerkUser.id,
      name,
      imageUrl: clerkUser.imageUrl,
      bio: "I'm a geek looking for love.",
    }).onConflictDoNothing().returning();

    if (!newUser) {
      return await db.query.users.findFirst({
        where: eq(users.clerkId, clerkUser.id),
      });
    }

    console.info(`ensureUserInDb: Successfully synced user: ${clerkUser.id}`);
    return newUser;
  } catch (error) {
    console.error("ensureUserInDb: Critical error during user sync:", error);
    return null;
  }
}
