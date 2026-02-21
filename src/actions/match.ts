'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { swipes, matches, users } from '@/db/schema';
import { eq, and, or, notInArray, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function recordSwipe(swipedDbId: string, action: 'like' | 'dislike') {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const swiperDbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });

  if (!swiperDbUser) {
    throw new Error('User not found in DB');
  }

  // Record the swipe
  await db.insert(swipes).values({
    swiperId: swiperDbUser.id,
    swipedId: swipedDbId,
    action,
  }).onConflictDoNothing(); // Simply do nothing if they swipe again for MVP

  let isMatch = false;

  if (action === 'like') {
    // Check if the other person already liked us
    const reciprocalSwipe = await db.query.swipes.findFirst({
      where: and(
        eq(swipes.swiperId, swipedDbId),
        eq(swipes.swipedId, swiperDbUser.id),
        eq(swipes.action, 'like')
      ),
    });

    if (reciprocalSwipe) {
      isMatch = true;

      // Ensure user1Id < user2Id for consistent uniqueness
      const [user1Id, user2Id] = swiperDbUser.id < swipedDbId
        ? [swiperDbUser.id, swipedDbId]
        : [swipedDbId, swiperDbUser.id];

      await db.insert(matches).values({
        user1Id,
        user2Id,
      }).onConflictDoNothing();
      
      revalidatePath('/matches');
    }
  }

  return { success: true, isMatch };
}

export async function getPotentialMatches() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const swiperDbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });

  if (!swiperDbUser) throw new Error('User not found');

  // Get IDs of users we already swiped on
  const swipedOn = await db.select({ swipedId: swipes.swipedId }).from(swipes).where(eq(swipes.swiperId, swiperDbUser.id));
  const excludeIds = swipedOn.map(s => s.swipedId);
  excludeIds.push(swiperDbUser.id); // Exclude self

  // Get potential users
  const potentialUsers = await db.query.users.findMany({
    where: notInArray(users.id, excludeIds),
    limit: 10,
  });
  
  return potentialUsers;
}

export async function getMatches() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');

  const currentUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });

  if (!currentUser) throw new Error('User not found');

  const userMatches = await db.select().from(matches)
    .where(
      or(
        eq(matches.user1Id, currentUser.id),
        eq(matches.user2Id, currentUser.id)
      )
    );
    
  // Get details of the matched users
  const matchedUserIds = userMatches.map(m => 
    m.user1Id === currentUser.id ? m.user2Id : m.user1Id
  );

  if (matchedUserIds.length === 0) return [];

  const matchedUsers = await db.query.users.findMany({
    where: inArray(users.id, matchedUserIds),
  });

  return matchedUsers;
}
