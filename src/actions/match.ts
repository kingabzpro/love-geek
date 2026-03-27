'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { swipes, matches, users } from '@/db/schema';
import { eq, and, or, notInArray, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { ensureUserInDb } from '@/lib/user-sync';

const SwipeSchema = z.object({
  swipedDbId: z.string().uuid({ message: "Invalid ID format" }),
  action: z.enum(['like', 'dislike']),
});

export async function recordSwipe(swipedDbId: string, action: 'like' | 'dislike') {
  try {
    // 1. Input Validation
    const parsedInput = SwipeSchema.safeParse({ swipedDbId, action });
    if (!parsedInput.success) {
      console.warn("Validation error in recordSwipe:", parsedInput.error.format());
      return { success: false, error: "Invalid input parameters" };
    }

    // 2. Auth & Sync Verification
    const swiperDbUser = await ensureUserInDb();
    if (!swiperDbUser) {
      console.warn("Unauthorized attempt to record swipe or user sync failed");
      return { success: false, error: "Unauthorized" };
    }

    // 3. Rate Limiting
    if (!rateLimit(`swipe_${swiperDbUser.clerkId}`, 20, 10000)) {
      console.warn(`Rate limit exceeded for user: ${swiperDbUser.clerkId}`);
      return { success: false, error: "Too many requests. Please slow down." };
    }

    // 4. Self-swipe Protection
    if (swiperDbUser.id === swipedDbId) {
      console.warn(`User ${swiperDbUser.id} attempted to swipe on themselves.`);
      return { success: false, error: "You cannot swipe on yourself." };
    }

    // 5. Duplicate Protection
    const existingSwipe = await db.query.swipes.findFirst({
      where: and(
        eq(swipes.swiperId, swiperDbUser.id),
        eq(swipes.swipedId, swipedDbId)
      )
    });

    if (existingSwipe) {
      console.info(`User ${swiperDbUser.id} already swiped on ${swipedDbId}. Ignored.`);
      return { success: true, isMatch: false };
    }

    console.info(`Recording swipe: ${swiperDbUser.id} ${action} ${swipedDbId}`);

    await db.insert(swipes).values({
      swiperId: swiperDbUser.id,
      swipedId: swipedDbId,
      action,
    }).onConflictDoNothing();

    let isMatch = false;

    if (action === 'like') {
      const reciprocalSwipe = await db.query.swipes.findFirst({
        where: and(
          eq(swipes.swiperId, swipedDbId),
          eq(swipes.swipedId, swiperDbUser.id),
          eq(swipes.action, 'like')
        ),
      });

      if (reciprocalSwipe) {
        isMatch = true;

        const [user1Id, user2Id] = swiperDbUser.id < swipedDbId
          ? [swiperDbUser.id, swipedDbId]
          : [swipedDbId, swiperDbUser.id];

        await db.insert(matches).values({
          user1Id,
          user2Id,
        }).onConflictDoNothing();
        
        console.info(`New Match created between ${user1Id} and ${user2Id}!`);
        revalidatePath('/matches');
      }
    }

    return { success: true, isMatch };
  } catch (error) {
    console.error("Critical error in recordSwipe:", error);
    return { success: false, error: "Internal server error." };
  }
}

export async function getPotentialMatches() {
  try {
    const swiperDbUser = await ensureUserInDb();
    if (!swiperDbUser) {
      console.warn("Unauthorized attempt to get potential matches");
      return { success: false, error: "Unauthorized", data: [] };
    }

    if (!rateLimit(`get_matches_${swiperDbUser.clerkId}`, 10, 10000)) {
      console.warn(`Rate limit exceeded for getPotentialMatches user: ${swiperDbUser.clerkId}`);
      return { success: false, error: "Too many requests", data: [] };
    }

    // Get IDs of users we already swiped on
    const swipedOn = await db.select({ swipedId: swipes.swipedId })
      .from(swipes)
      .where(eq(swipes.swiperId, swiperDbUser.id));
      
    const excludeIds = swipedOn.map(s => s.swipedId);
    excludeIds.push(swiperDbUser.id); // Exclude self

    const query = excludeIds.length > 0
      ? db.query.users.findMany({ where: notInArray(users.id, excludeIds), limit: 10 })
      : db.query.users.findMany({ limit: 10 });

    const potentialUsers = await query;

    return { success: true, data: potentialUsers };
  } catch (error) {
    console.error("Critical error in getPotentialMatches:", error);
    return { success: false, error: "Internal server error.", data: [] };
  }
}

export async function getMatches() {
  try {
    const currentUser = await ensureUserInDb();
    if (!currentUser) {
       return { success: false, error: "Unauthorized", data: [] };
    }

    const userMatches = await db.select().from(matches)
      .where(
        or(
          eq(matches.user1Id, currentUser.id),
          eq(matches.user2Id, currentUser.id)
        )
      );
      
    const matchedUserIds = userMatches.map(m => 
      m.user1Id === currentUser.id ? m.user2Id : m.user1Id
    );

    if (matchedUserIds.length === 0) return { success: true, data: [] };

    const matchedUsers = await db.query.users.findMany({
      where: inArray(users.id, matchedUserIds),
    });

    return { success: true, data: matchedUsers, currentUserInterests: currentUser.interests };
  } catch (error) {
    console.error("Critical error in getMatches:", error);
    return { success: false, error: "Internal server error.", data: [] };
  }
}
