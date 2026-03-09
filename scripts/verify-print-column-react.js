/**
 * Verification Script for React SPA - Print Type Column
 * 
 * Purpose: Verify that the print_type column exists in the products table
 * and contains valid data for the React application to use.
 * 
 * This script checks:
 * - Existence of print_type column
 * - Data population status
 * - Unique print type values
 * - Data quality (nulls, formatting issues)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        env[match[1].trim()] = match[2].trim();
      }
    });
    return env;
  } catch (error) {
    console.error('Error loading .env.local:', error.message);
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Missing Supabase credentials');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('='.repeat(60));
console.log('REACT SPA - PRINT_TYPE COLUMN VERIFICATION');
console.log('='.repeat(60));
console.log();

async function verifyPrintColumn() {
  try {
    // 1. Check if print_type column exists by querying products
    console.log('📊 Step 1: Checking print_type column existence...');
    console.log();
    
    const { data: sampleProducts, error: sampleError } = await supabase
      .from('products')
      .select('id, name, print_type')
      .limit(5);

    if (sampleError) {
      if (sampleError.message.includes('column') || sampleError.message.includes('does not exist')) {
        console.error('❌ FAILED: print_type column does NOT exist');
        console.error('Error:', sampleError.message);
        console.log();
        console.log('⚠️  ACTION REQUIRED: Add print_type column to products table');
        console.log('   SQL: ALTER TABLE products ADD COLUMN print_type TEXT;');
        return false;
      }
      throw sampleError;
    }

    console.log('✅ SUCCESS: print_type column exists in products table');
    console.log(`   Sample: ${sampleProducts.length} products queried successfully`);
    console.log();

    // 2. Count total products and products with print_type data
    console.log('📊 Step 2: Analyzing print_type data population...');
    console.log();

    const { count: totalCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('id, name, print_type');

    if (allError) throw allError;

    const productsWithPrint = allProducts.filter(p => p.print_type && p.print_type.trim() !== '');
    const productsWithoutPrint = allProducts.filter(p => !p.print_type || p.print_type.trim() === '');

    console.log(`   Total products: ${totalCount}`);
    console.log(`   Products with print_type: ${productsWithPrint.length} (${((productsWithPrint.length / totalCount) * 100).toFixed(1)}%)`);
    console.log(`   Products without print_type: ${productsWithoutPrint.length} (${((productsWithoutPrint.length / totalCount) * 100).toFixed(1)}%)`);
    console.log();

    // 3. Analyze unique print types
    console.log('📊 Step 3: Analyzing unique print types...');
    console.log();

    const uniquePrintTypes = [...new Set(productsWithPrint.map(p => p.print_type))].sort();

    console.log(`   Unique print types found: ${uniquePrintTypes.length}`);
    console.log();
    console.log('   Print Type Distribution:');
    console.log('   ' + '-'.repeat(50));

    uniquePrintTypes.forEach(printType => {
      const count = productsWithPrint.filter(p => p.print_type === printType).length;
      const percentage = ((count / totalCount) * 100).toFixed(1);
      console.log(`   ${printType.padEnd(20)} : ${count.toString().padStart(3)} products (${percentage}%)`);
    });

    console.log('   ' + '-'.repeat(50));
    console.log();

    // 4. Data quality checks
    console.log('📊 Step 4: Data quality assessment...');
    console.log();

    // Check for formatting issues
    const printTypesWithSpaces = uniquePrintTypes.filter(pt => pt.includes('  ')); // double spaces
    const printTypesWithSpecialChars = uniquePrintTypes.filter(pt => /[^a-zA-Z\s-]/.test(pt));
    const printTypesInconsistentCase = uniquePrintTypes.filter(pt => {
      const words = pt.split(' ');
      return words.some(word => word.length > 0 && word[0] === word[0].toLowerCase());
    });

    if (printTypesWithSpaces.length > 0) {
      console.log(`   ⚠️  Warning: ${printTypesWithSpaces.length} print types have double spaces`);
      printTypesWithSpaces.forEach(pt => console.log(`      - "${pt}"`));
    }

    if (printTypesWithSpecialChars.length > 0) {
      console.log(`   ⚠️  Warning: ${printTypesWithSpecialChars.length} print types have special characters`);
      printTypesWithSpecialChars.forEach(pt => console.log(`      - "${pt}"`));
    }

    if (printTypesInconsistentCase.length > 0) {
      console.log(`   ⚠️  Warning: ${printTypesInconsistentCase.length} print types have inconsistent capitalization`);
      printTypesInconsistentCase.forEach(pt => console.log(`      - "${pt}"`));
    }

    if (printTypesWithSpaces.length === 0 && 
        printTypesWithSpecialChars.length === 0 && 
        printTypesInconsistentCase.length === 0) {
      console.log('   ✅ No data quality issues detected');
    }

    console.log();

    // 5. Summary and decision
    console.log('='.repeat(60));
    console.log('VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log();

    const dataPopulationPercent = (productsWithPrint.length / totalCount) * 100;
    const hasMinimumPrintTypes = uniquePrintTypes.length >= 3;
    const hasMinimumPopulation = dataPopulationPercent >= 50;

    console.log(`✅ print_type column: EXISTS`);
    console.log(`${hasMinimumPopulation ? '✅' : '❌'} Data population: ${dataPopulationPercent.toFixed(1)}% (Minimum: 50%)`);
    console.log(`${hasMinimumPrintTypes ? '✅' : '❌'} Unique print types: ${uniquePrintTypes.length} (Minimum: 3)`);
    console.log();

    if (hasMinimumPopulation && hasMinimumPrintTypes) {
      console.log('✅ READY TO PROCEED: Column exists with sufficient data');
      console.log('   → You can proceed to Step 2 of Phase React-1');
      console.log();
      console.log('📋 Next Steps:');
      console.log('   1. Document these findings in PROGRESS.md under Phase React-1 Step 1');
      console.log('   2. Proceed to Step 2: Audit Current Prints Table Implementation');
      return true;
    } else {
      console.log('⚠️  ATTENTION REQUIRED: Column exists but data insufficient');
      console.log();
      if (!hasMinimumPopulation) {
        console.log(`   ❌ Only ${dataPopulationPercent.toFixed(1)}% of products have print_type data`);
        console.log('      → Need at least 50% data population');
        console.log('      → Run: node scripts/populate-print-data.js');
      }
      if (!hasMinimumPrintTypes) {
        console.log(`   ❌ Only ${uniquePrintTypes.length} unique print types found`);
        console.log('      → Need at least 3 print types');
        console.log('      → Verify data population script');
      }
      console.log();
      return false;
    }

  } catch (error) {
    console.error('❌ VERIFICATION FAILED:', error.message);
    console.error();
    console.error('Stack trace:', error.stack);
    return false;
  }
}

// Execute verification
verifyPrintColumn()
  .then(success => {
    console.log('='.repeat(60));
    if (success) {
      console.log('✅ Verification completed successfully');
      process.exit(0);
    } else {
      console.log('❌ Verification completed with issues');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
