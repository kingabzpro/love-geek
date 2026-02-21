import { pgTable, text, timestamp, uuid, varchar, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  name: text('name').notNull(),
  bio: text('bio'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const swipes = pgTable('swipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  swiperId: uuid('swiper_id').references(() => users.id).notNull(),
  swipedId: uuid('swiped_id').references(() => users.id).notNull(),
  action: varchar('action', { length: 10 }).notNull(), // 'like' or 'dislike'
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return [
    uniqueIndex('swiper_swiped_idx').on(table.swiperId, table.swipedId),
  ];
});

export const matches = pgTable('matches', {
  id: uuid('id').defaultRandom().primaryKey(),
  user1Id: uuid('user1_id').references(() => users.id).notNull(),
  user2Id: uuid('user2_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return [
    uniqueIndex('user1_user2_idx').on(table.user1Id, table.user2Id),
  ];
});

export const usersRelations = relations(users, ({ many }) => ({
  swipesGiven: many(swipes, { relationName: 'swiper' }),
  swipesReceived: many(swipes, { relationName: 'swiped' }),
  matchesAsUser1: many(matches, { relationName: 'user1' }),
  matchesAsUser2: many(matches, { relationName: 'user2' }),
}));

export const swipesRelations = relations(swipes, ({ one }) => ({
  swiper: one(users, {
    fields: [swipes.swiperId],
    references: [users.id],
    relationName: 'swiper',
  }),
  swiped: one(users, {
    fields: [swipes.swipedId],
    references: [users.id],
    relationName: 'swiped',
  }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  user1: one(users, {
    fields: [matches.user1Id],
    references: [users.id],
    relationName: 'user1',
  }),
  user2: one(users, {
    fields: [matches.user2Id],
    references: [users.id],
    relationName: 'user2',
  }),
}));
