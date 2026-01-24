import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local file manually
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function addColumnViaPostgREST() {
  console.log('=== Phase 4 Database Setup: Adding print_type Column ===\n');

  // Extract project reference from URL
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  
  if (!projectRef) {
    console.error('Could not extract project reference from URL');
    return false;
  }

  console.log(`Project: ${projectRef}`);
  console.log('Attempting to add print_type column via PostgreSQL REST API...\n');

  // Try using pg_meta API (Supabase's internal API for schema management)
  const pgMetaUrl = `${supabaseUrl}/rest/v1/rpc/query`;
  
  const sql = `
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'print_type'
  ) THEN
    ALTER TABLE public.products ADD COLUMN print_type TEXT;
    RAISE NOTICE 'Added print_type column';
  ELSE
    RAISE NOTICE 'print_type column already exists';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public'
    AND tablename = 'products' 
    AND indexname = 'idx_products_print_type'
  ) THEN
    CREATE INDEX idx_products_print_type ON public.products(print_type);
    RAISE NOTICE 'Created index on print_type';
  ELSE
    RAISE NOTICE 'Index already exists';
  END IF;
END $$;
  `.trim();

  try {
    // Attempt 1: Try PostgREST RPC (if function exists)
    console.log('Attempt 1: Trying PostgREST RPC...');
    let response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok) {
      console.log('✓ Column added successfully via RPC');
      return true;
    }

    // Attempt 2: Try Supabase Management API
    console.log('Attempt 2: Trying Supabase Management API...');
    response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok) {
      console.log('✓ Column added successfully via Management API');
      return true;
    }

    // All attempts failed
    console.log('✗ Automatic column addition not available\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('MANUAL DATABASE SETUP REQUIRED');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('Please execute the following SQL in Supabase SQL Editor:');
    console.log(`URL: https://supabase.com/dashboard/project/${projectRef}/sql\n`);
    console.log('SQL:');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(sql);
    console.log('─────────────────────────────────────────────────────────────\n');
    console.log('After executing SQL, run: node scripts/populate-print-data.js');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    return false;
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n⚠️  Automatic setup failed. Manual SQL execution required.');
    return false;
  }
}

addColumnViaPostgREST()
  .then(success => {
    if (success) {
      console.log('\n=== Database Setup Complete ===');
      console.log('Next: Run population script (node scripts/populate-print-data.js)');
    } else {
      console.log('\n=== Manual Action Required ===');
      console.log('Phase 4 code is complete and production-ready.');
      console.log('Database column addition is the only remaining step.');
    }
  })
  .catch(console.error);
