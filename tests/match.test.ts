import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Next.js cache revalidatePath before importing actions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
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
          onConflictDoNothing: vi.fn(() => ({
            returning: vi.fn().mockResolvedValue([{ id: 'new-id' }]),
          })),
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
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { recordSwipe } from '@/actions/match';

const VALID_UUID_1 = '11111111-1111-4111-8111-111111111111';
const VALID_UUID_2 = '22222222-2222-4222-8222-222222222222';

describe('recordSwipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns validation error if input is invalid (not a uuid)', async () => {
    const result = await recordSwipe('invalid_id', 'like');
    expect(result).toEqual({ success: false, error: 'Invalid input parameters' });
  });

  it('returns unauthorized error if the user is not authenticated', async () => {
    vi.mocked(currentUser).mockResolvedValue(null);

    const result = await recordSwipe(VALID_UUID_2, 'like');
    expect(result).toEqual({ success: false, error: 'Unauthorized' });
  });

  it('returns error if user swipes on themselves', async () => {
    vi.mocked(currentUser).mockResolvedValue({ id: 'clerk123', firstName: 'Test', lastName: 'User', imageUrl: '' } as any);
    vi.mocked(db.query.users.findFirst).mockResolvedValue({ id: VALID_UUID_1, clerkId: 'clerk123' } as any);

    const result = await recordSwipe(VALID_UUID_1, 'like');
    expect(result).toEqual({ success: false, error: 'You cannot swipe on yourself.' });
  });

  it('records a like swipe successfully but does not create a match if reciprocal swipe does not exist', async () => {
    vi.mocked(currentUser).mockResolvedValue({ id: 'clerk123', firstName: 'Test', lastName: 'User', imageUrl: '' } as any);
    
    // Mock user lookup
    vi.mocked(db.query.users.findFirst).mockResolvedValue({ id: VALID_UUID_1, clerkId: 'clerk123' } as any);
    
    // Mock duplicate check + reciprocal swipe lookup
    vi.mocked(db.query.swipes.findFirst).mockResolvedValueOnce(null as any) // Duplicate check
                                      .mockResolvedValueOnce(null as any); // Reciprocal check

    const result = await recordSwipe(VALID_UUID_2, 'like');

    expect(result).toEqual({ success: true, isMatch: false });
    expect(db.insert).toHaveBeenCalledTimes(1); // Only inserted swipe, no match
  });

  it('records a like swipe and creates a match if reciprocal swipe exists', async () => {
    vi.mocked(currentUser).mockResolvedValue({ id: 'clerk123', firstName: 'Test', lastName: 'User', imageUrl: '' } as any);
    
    // Mock user lookup
    vi.mocked(db.query.users.findFirst).mockResolvedValue({ id: VALID_UUID_1, clerkId: 'clerk123' } as any);
    
    // Mock reciprocal swipe lookup (returns an existing swipe)
    vi.mocked(db.query.swipes.findFirst).mockResolvedValueOnce(null as any) // duplicate check
                                      .mockResolvedValueOnce({ id: 'swipe1', action: 'like' } as any); // reciprocal check

    const result = await recordSwipe(VALID_UUID_2, 'like');

    expect(result).toEqual({ success: true, isMatch: true });
    expect(db.insert).toHaveBeenCalledTimes(2); // Inserted swipe AND match
  });

  it('records a dislike swipe successfully and never creates a match', async () => {
    vi.mocked(currentUser).mockResolvedValue({ id: 'clerk123', firstName: 'Test', lastName: 'User', imageUrl: '' } as any);
    vi.mocked(db.query.users.findFirst).mockResolvedValue({ id: VALID_UUID_1, clerkId: 'clerk123' } as any);
    vi.mocked(db.query.swipes.findFirst).mockResolvedValue(null as any); // duplicate check

    const result = await recordSwipe(VALID_UUID_2, 'dislike');

    expect(result).toEqual({ success: true, isMatch: false });
    expect(db.insert).toHaveBeenCalledTimes(1); // Only swipe recorded
  });

  it('does nothing and returns success if the swipe is a duplicate', async () => {
    vi.mocked(currentUser).mockResolvedValue({ id: 'clerk123', firstName: 'Test', lastName: 'User', imageUrl: '' } as any);
    vi.mocked(db.query.users.findFirst).mockResolvedValue({ id: VALID_UUID_1, clerkId: 'clerk123' } as any);
    // Return existing swipe for duplicate check
    vi.mocked(db.query.swipes.findFirst).mockResolvedValue({ id: 'existing_swipe' } as any); 

    const result = await recordSwipe(VALID_UUID_2, 'like');

    expect(result).toEqual({ success: true, isMatch: false });
    expect(db.insert).not.toHaveBeenCalled(); // No insert on duplicate
  });
});