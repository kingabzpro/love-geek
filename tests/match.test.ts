import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Next.js cache revalidatePath before importing actions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

// Mock Database
vi.mock('@/db', () => {
  return {
    db: {
      query: {
        users: { findFirst: vi.fn(), findMany: vi.fn() },
        swipes: { findFirst: vi.fn() },
      },
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          onConflictDoNothing: vi.fn().mockResolvedValue({}),
          onConflictDoUpdate: vi.fn().mockResolvedValue({}),
        })),
      })),
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValue([]),
        }))
      })),
    },
  };
});

// Import after mocks are set up
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { recordSwipe } from '@/actions/match';

describe('recordSwipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws an error if the user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    await expect(recordSwipe('swiped123', 'like')).rejects.toThrow('Unauthorized');
  });

  it('throws an error if swiper does not exist in the database', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'clerk123' } as any);
    vi.mocked(db.query.users.findFirst).mockResolvedValue(null as any);

    await expect(recordSwipe('swiped123', 'like')).rejects.toThrow('User not found in DB');
  });

  it('records a like swipe successfully but does not create a match if reciprocal swipe does not exist', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'clerk123' } as any);
    
    // Mock user lookup
    vi.mocked(db.query.users.findFirst).mockResolvedValue({ id: 'db-user-1', clerkId: 'clerk123' } as any);
    
    // Mock reciprocal swipe lookup (returns nothing)
    vi.mocked(db.query.swipes.findFirst).mockResolvedValue(null as any);

    const result = await recordSwipe('db-user-2', 'like');

    expect(result).toEqual({ success: true, isMatch: false });
    expect(db.insert).toHaveBeenCalledTimes(1); // Only inserted swipe, no match
  });

  it('records a like swipe and creates a match if reciprocal swipe exists', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'clerk123' } as any);
    
    // Mock user lookup
    vi.mocked(db.query.users.findFirst).mockResolvedValue({ id: 'db-user-1', clerkId: 'clerk123' } as any);
    
    // Mock reciprocal swipe lookup (returns an existing swipe)
    vi.mocked(db.query.swipes.findFirst).mockResolvedValue({ id: 'swipe1', action: 'like' } as any);

    const result = await recordSwipe('db-user-2', 'like');

    expect(result).toEqual({ success: true, isMatch: true });
    expect(db.insert).toHaveBeenCalledTimes(2); // Inserted swipe AND match
  });

  it('records a dislike swipe successfully and never creates a match', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'clerk123' } as any);
    vi.mocked(db.query.users.findFirst).mockResolvedValue({ id: 'db-user-1', clerkId: 'clerk123' } as any);

    const result = await recordSwipe('db-user-2', 'dislike');

    expect(result).toEqual({ success: true, isMatch: false });
    expect(db.insert).toHaveBeenCalledTimes(1); // Only swipe recorded
    // Should NOT have checked for reciprocal swipe
    expect(db.query.swipes.findFirst).not.toHaveBeenCalled();
  });
});
