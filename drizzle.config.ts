import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations', // or any path
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
