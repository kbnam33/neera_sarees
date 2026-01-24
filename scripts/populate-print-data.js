import { createClient } from '@supabase/supabase-js';
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

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Intelligent print type detection based on product name
function detectPrintType(productName, fabricType) {
  const nameLower = productName.toLowerCase();
  
  // Check for explicit print mentions
  if (nameLower.includes('floral') || nameLower.includes('flower')) return 'Floral';
  if (nameLower.includes('print') || nameLower.includes('kalamkari')) return 'Printed';
  if (nameLower.includes('stripe') || nameLower.includes('lines')) return 'Striped';
  if (nameLower.includes('check') || nameLower.includes('checked')) return 'Checked';
  if (nameLower.includes('dot') || nameLower.includes('polka')) return 'Dotted';
  if (nameLower.includes('paisley') || nameLower.includes('butta') || nameLower.includes('temple')) return 'Traditional';
  if (nameLower.includes('geometric') || nameLower.includes('abstract')) return 'Geometric';
  
  // Default to solid for most sarees
  return 'Solid';
}

async function populatePrintData() {
  console.log('=== Phase 4 Step 4: Populate Print Data ===\n');

  try {
    // First, verify print_type column exists
    console.log('1. Verifying print_type column exists...');
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('id, name, print_type')
      .limit(1);
    
    if (testError || !testData) {
      console.error('✗ Error accessing products table:', testError?.message);
      console.log('\n⚠️  Please ensure print_type column is added to products table first!');
      console.log('Run: node scripts/add-print-column.js');
      return;
    }

    if (testData.length > 0 && !('print_type' in testData[0])) {
      console.error('✗ print_type column does NOT exist in products table');
      console.log('\n⚠️  Please add print_type column first!');
      return;
    }

    console.log('✓ print_type column verified');

    // Fetch all products
    console.log('\n2. Fetching all products...');
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, fabric_type, print_type');
    
    if (fetchError || !products) {
      console.error('✗ Error fetching products:', fetchError?.message);
      return;
    }

    console.log(`✓ Fetched ${products.length} products`);

    // Analyze current state
    const withPrint = products.filter(p => p.print_type && p.print_type !== '').length;
    const withoutPrint = products.length - withPrint;
    
    console.log(`\n3. Current print data status:`);
    console.log(`   - With print_type: ${withPrint}`);
    console.log(`   - Without print_type: ${withoutPrint}`);

    if (withoutPrint === 0) {
      console.log('\n✓ All products already have print_type data!');
      return;
    }

    // Populate print types
    console.log(`\n4. Populating print_type for ${withoutPrint} products...`);
    
    let updated = 0;
    let errors = 0;

    for (const product of products) {
      if (!product.print_type || product.print_type === '') {
        const printType = detectPrintType(product.name, product.fabric_type);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ print_type: printType })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`   ✗ Error updating product ${product.id}:`, updateError.message);
          errors++;
        } else {
          updated++;
          if (updated % 20 === 0) {
            console.log(`   ... ${updated}/${withoutPrint} products updated`);
          }
        }
      }
    }

    console.log(`\n5. Population complete:`);
    console.log(`   ✓ Successfully updated: ${updated} products`);
    if (errors > 0) {
      console.log(`   ✗ Errors encountered: ${errors} products`);
    }

    // Verify data distribution
    console.log(`\n6. Verifying data distribution...`);
    const { data: allProducts, error: verifyError } = await supabase
      .from('products')
      .select('print_type');
    
    if (!verifyError && allProducts) {
      const distribution = {};
      allProducts.forEach(p => {
        if (p.print_type) {
          distribution[p.print_type] = (distribution[p.print_type] || 0) + 1;
        }
      });

      console.log('\nPrint Type Distribution:');
      Object.entries(distribution)
        .sort((a, b) => b[1] - a[1])
        .forEach(([type, count]) => {
          const percentage = ((count / allProducts.length) * 100).toFixed(1);
          console.log(`   - ${type}: ${count} products (${percentage}%)`);
        });

      const totalWithPrint = Object.values(distribution).reduce((a, b) => a + b, 0);
      const coverage = ((totalWithPrint / allProducts.length) * 100).toFixed(1);
      console.log(`\n   Total coverage: ${totalWithPrint}/${allProducts.length} (${coverage}%)`);
    }

  } catch (error) {
    console.error('Unexpected error:', error.message);
  }

  console.log('\n=== Print Data Population Complete ===');
}

populatePrintData().catch(console.error);
