import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Provide a dummy connection string during Next.js build if DATABASE_URL is not set
const sql = neon(process.env.DATABASE_URL || 'postgres://dummy:dummy@dummy.neon.tech/dummy');
export const db = drizzle(sql, { schema });
