'use server';

import { db } from '@/db';
import { users, swipes, matches } from '@/db/schema';
import { eq, and, or, count } from 'drizzle-orm';
import { ensureUserInDb } from '@/lib/user-sync';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50),
  bio: z.string().max(250).optional(),
  imageUrl: z.string().url({ message: "Invalid image URL" }).or(z.literal('')).optional(),
  interests: z.array(z.string()).min(1, { message: "Pick at least 1 interest" }).max(10),
  githubUrl: z.string().url({ message: "Invalid GitHub URL" }).or(z.literal('')).optional(),
  age: z.number().int().min(18).max(99).optional(),
  location: z.string().max(100).optional(),
});

export async function updateProfile(formData: FormData): Promise<void> {
  let isSuccess = false;
  try {
    const user = await ensureUserInDb();
    if (!user) {
      console.warn("updateProfile: Unauthorized");
      return;
    }

    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const location = formData.get('location') as string;
    const ageRaw = formData.get('age') as string;
    const interestsRaw = formData.get('interests') as string;

    let interests: string[] = [];
    try {
      interests = JSON.parse(interestsRaw || '[]');
    } catch {
      interests = [];
    }

    const age = ageRaw ? parseInt(ageRaw, 10) : undefined;

    const parsed = ProfileSchema.safeParse({ name, bio, imageUrl, interests, githubUrl, age: isNaN(age as number) ? undefined : age, location });

    if (!parsed.success) {
      console.warn("updateProfile: Invalid form data", parsed.error);
      return;
    }

    await db.update(users)
      .set({
        name: parsed.data.name,
        bio: parsed.data.bio,
        imageUrl: parsed.data.imageUrl || user.imageUrl,
        interests: parsed.data.interests,
        githubUrl: parsed.data.githubUrl || null,
        age: parsed.data.age ?? null,
        location: parsed.data.location || null,
        profileCompleted: true,
      })
      .where(eq(users.id, user.id));

    revalidatePath('/', 'layout');
    isSuccess = true;

  } catch (error) {
    console.error("Critical error in updateProfile:", error);
    return;
  }

  if (isSuccess) {
    redirect('/swipe');
  }
}

export async function getProfileStats() {
  try {
    const currentUser = await ensureUserInDb();
    if (!currentUser) return { swipesGiven: 0, likesReceived: 0, matchCount: 0 };

    const [swipesGivenResult, likesReceivedResult, matchCountResult] = await Promise.all([
      db.select({ value: count() }).from(swipes).where(eq(swipes.swiperId, currentUser.id)),
      db.select({ value: count() }).from(swipes).where(
        and(eq(swipes.swipedId, currentUser.id), eq(swipes.action, 'like'))
      ),
      db.select({ value: count() }).from(matches).where(
        or(eq(matches.user1Id, currentUser.id), eq(matches.user2Id, currentUser.id))
      ),
    ]);

    return {
      swipesGiven: swipesGivenResult[0]?.value ?? 0,
      likesReceived: likesReceivedResult[0]?.value ?? 0,
      matchCount: matchCountResult[0]?.value ?? 0,
      user: currentUser,
    };
  } catch (error) {
    console.error("Critical error in getProfileStats:", error);
    return { swipesGiven: 0, likesReceived: 0, matchCount: 0, user: null };
  }
}
