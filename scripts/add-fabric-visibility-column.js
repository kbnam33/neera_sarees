/**
 * Migration: Add is_public column to fabrics table
 * Controls fabric-level visibility on the website.
 * When a fabric is private, all its products are hidden from the website.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const sql = `
DO $$
BEGIN
  -- Add is_public column to fabrics table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fabrics' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE fabrics ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT true;
    RAISE NOTICE 'Added is_public column to fabrics table';
  ELSE
    RAISE NOTICE 'is_public column already exists on fabrics table';
  END IF;

  -- Backfill any NULL values (safety net)
  UPDATE fabrics SET is_public = true WHERE is_public IS NULL;

  -- Create index for faster filtering
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'fabrics' AND indexname = 'idx_fabrics_is_public'
  ) THEN
    CREATE INDEX idx_fabrics_is_public ON fabrics(is_public);
    RAISE NOTICE 'Created index on fabrics.is_public';
  ELSE
    RAISE NOTICE 'Index on fabrics.is_public already exists';
  END IF;
END $$;
`.trim();

async function runMigration() {
  console.log('=== Migration: Add fabric visibility column ===\n');
  console.log('SQL to execute:');
  console.log('─'.repeat(60));
  console.log(sql);
  console.log('─'.repeat(60));
  console.log();

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (response.status === 404) {
      console.log('⚠️  exec_sql RPC not available. Run the SQL manually:\n');
      console.log('1. Go to: https://supabase.com/dashboard/project/xanrkptipcdhvklrvcia/sql');
      console.log('2. Paste the SQL above and click Run');
      return false;
    }

    const result = await response.json();

    if (response.ok) {
      console.log('✓ Migration executed successfully');
      console.log('✓ fabrics.is_public column added (default: true)');
      console.log('✓ Index created on fabrics.is_public');
      return true;
    } else {
      console.error('✗ Error:', result);
      return false;
    }
  } catch (err) {
    console.error('✗ Error:', err.message);
    console.log('\n⚠️  Run the SQL above manually in the Supabase SQL Editor.');
    return false;
  }
}

async function verifyCcolumn() {
  console.log('\n=== Verifying column exists ===');
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/fabrics?select=id,is_public&limit=3`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      console.log('✓ Column verified. Sample rows:');
      console.table(data);
    } else {
      console.error('✗ Verification failed:', data);
    }
  } catch (err) {
    console.error('✗ Verification error:', err.message);
  }
}

runMigration()
  .then(async (success) => {
    if (success) {
      await verifyCcolumn();
      console.log('\n=== Migration complete ===');
      console.log('All existing fabrics are now public (is_public = true).');
      console.log('Use the admin tool to set specific fabrics as private.');
    } else {
      console.log('\n=== Manual action required ===');
    }
  })
  .catch(console.error);
