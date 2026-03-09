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

async function addPrintColumnViaSQL() {
  console.log('=== Phase 4 Step 3: Database Schema Update ===\n');

  const sql = `
DO $$
BEGIN
  -- Add print_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'print_type'
  ) THEN
    ALTER TABLE products ADD COLUMN print_type TEXT;
    RAISE NOTICE 'Added print_type column';
  ELSE
    RAISE NOTICE 'print_type column already exists';
  END IF;

  -- Create index if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'products' AND indexname = 'idx_products_print_type'
  ) THEN
    CREATE INDEX idx_products_print_type ON products(print_type);
    RAISE NOTICE 'Created index on print_type';
  ELSE
    RAISE NOTICE 'Index on print_type already exists';
  END IF;
END $$;
`.trim();

  try {
    console.log('1. Attempting to add print_type column via Supabase REST API...\n');

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.status === 404) {
      console.log('⚠️  RPC function not available. Using alternative method...\n');
      console.log('Please execute the following SQL in Supabase SQL Editor:');
      console.log('='.repeat(60));
      console.log(sql);
      console.log('='.repeat(60));
      console.log('\nSteps:');
      console.log('1. Go to: https://supabase.com/dashboard/project/xanrkptipcdhvklrvcia/sql');
      console.log('2. Paste the SQL above');
      console.log('3. Click "Run"');
      console.log('4. Return here and run: node scripts/populate-print-data.js');
      return false;
    }

    const result = await response.json();
    
    if (response.ok) {
      console.log('✓ SQL executed successfully');
      console.log('✓ print_type column added (or already exists)');
      console.log('✓ Index created on print_type');
      return true;
    } else {
      console.error('✗ Error executing SQL:', result);
      return false;
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.log('\n⚠️  Could not add column automatically.');
    console.log('\nPlease add the column manually using Supabase Dashboard:');
    console.log('SQL Command:');
    console.log('='.repeat(60));
    console.log(sql);
    console.log('='.repeat(60));
    return false;
  }
}

addPrintColumnViaSQL()
  .then(success => {
    if (success) {
      console.log('\n=== Database Schema Update Complete ===');
      console.log('\nNext step: Run populate script');
      console.log('Command: node scripts/populate-print-data.js');
    } else {
      console.log('\n=== Manual Action Required ===');
    }
  })
  .catch(console.error);
