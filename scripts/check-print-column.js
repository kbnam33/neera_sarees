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
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPrintColumn() {
  console.log('=== Phase 4 Step 2: Database Infrastructure Check for Print ===\n');

  // Fetch sample products to check columns
  console.log('1. Checking products table structure...');
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .limit(3);

  if (error) {
    console.error('Error fetching products:', error.message);
    return;
  }

  if (products && products.length > 0) {
    console.log('✓ Products table accessible');
    console.log(`✓ Sample product columns:`, Object.keys(products[0]).sort().join(', '));
    
    // Check if print-related column exists
    const sampleProduct = products[0];
    const hasPrintType = 'print_type' in sampleProduct;
    const hasPrint = 'print' in sampleProduct;
    
    console.log(`\n2. Checking for print-related columns...`);
    if (hasPrintType) {
      console.log('✓ print_type column EXISTS');
    } else if (hasPrint) {
      console.log('✓ print column EXISTS');
    } else {
      console.log('✗ NO print-related column found');
      console.log('  Action needed: Add print_type column to products table');
    }

    // Check print data population
    console.log(`\n3. Analyzing existing print data...`);
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select(hasPrintType ? 'print_type' : (hasPrint ? 'print' : 'id'));

    if (!allError && allProducts) {
      const printColumn = hasPrintType ? 'print_type' : (hasPrint ? 'print' : null);
      
      if (printColumn) {
        const withPrint = allProducts.filter(p => p[printColumn] && p[printColumn] !== '').length;
        const withoutPrint = allProducts.length - withPrint;
        const percentage = ((withPrint / allProducts.length) * 100).toFixed(1);
        
        console.log(`✓ Total products: ${allProducts.length}`);
        console.log(`  - With print data: ${withPrint} (${percentage}%)`);
        console.log(`  - Without print data: ${withoutPrint}`);

        // Get unique print types
        if (withPrint > 0) {
          const uniquePrints = [...new Set(allProducts
            .filter(p => p[printColumn])
            .map(p => p[printColumn])
          )].sort();
          
          console.log(`\n4. Unique print types found (${uniquePrints.length}):`);
          uniquePrints.forEach(print => console.log(`  - ${print}`));
        }
      } else {
        console.log('✗ No print column found to analyze');
      }
    }

    // Show sample product data (first 10 fields only for readability)
    console.log(`\n5. Sample product data (first product, selected fields):`);
    const sample = {
      id: products[0].id,
      name: products[0].name,
      fabric_type: products[0].fabric_type,
      print_type: products[0].print_type || products[0].print || 'N/A',
      price: products[0].price,
      colors: products[0].colors
    };
    console.log(JSON.stringify(sample, null, 2));
  }

  console.log('\n=== Database Infrastructure Check Complete ===');
}

checkPrintColumn().catch(console.error);
