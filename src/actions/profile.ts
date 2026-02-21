'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ensureUserInDb } from '@/lib/user-sync';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50),
  bio: z.string().max(250).optional(),
  imageUrl: z.string().url({ message: "Invalid image URL" }).or(z.literal('')).optional(),
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

    const parsed = ProfileSchema.safeParse({ name, bio, imageUrl });
    
    if (!parsed.success) {
      console.warn("updateProfile: Invalid form data", parsed.error);
      return;
    }

    await db.update(users)
      .set({
        name: parsed.data.name,
        bio: parsed.data.bio,
        imageUrl: parsed.data.imageUrl || user.imageUrl, // Fallback to current if empty
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