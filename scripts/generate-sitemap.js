/**
 * Sitemap Generator for Neera Sarees
 * Generates XML sitemap with all product, category, and key pages
 * All Sarees page is prioritized as PRIMARY TARGET (priority 1.0)
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://qjkyzqvnvcgqejnlhegf.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa3l6cXZudmNncWVqbmxoZWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2ODU5MTIsImV4cCI6MjA1MzI2MTkxMn0.EfILqLr3KfY4x_1oGUKmpwxXHYfAyPQfC13dBDCe4nY'
);

const BASE_URL = 'https://neera.store';

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...\n');

  // Fetch all products
  const { data: products, error } = await supabase
    .from('products')
    .select('fabric_type, slug, print_type, updated_at')
    .eq('is_public', true);

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  console.log(`✅ Fetched ${products.length} products`);

  // Extract unique fabric types and print types
  const fabricTypes = [...new Set(products.map(p => p.fabric_type).filter(Boolean))];
  const printTypes = [...new Set(products.map(p => p.print_type).filter(Boolean))];

  console.log(`✅ Found ${fabricTypes.length} fabric types`);
  console.log(`✅ Found ${printTypes.length} print types\n`);

  // Start building sitemap
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Homepage
  sitemap += '  <url>\n';
  sitemap += `    <loc>${BASE_URL}/</loc>\n`;
  sitemap += '    <changefreq>weekly</changefreq>\n';
  sitemap += '    <priority>0.9</priority>\n';
  sitemap += '  </url>\n';

  // All Sarees page - PRIMARY TARGET (highest priority)
  sitemap += '  <url>\n';
  sitemap += `    <loc>${BASE_URL}/products</loc>\n`;
  sitemap += '    <changefreq>daily</changefreq>\n';
  sitemap += '    <priority>1.0</priority>\n';
  sitemap += '  </url>\n';

  // Product pages
  products.forEach(product => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}/products/${encodeURIComponent(product.fabric_type)}/${encodeURIComponent(product.slug)}</loc>\n`;
    if (product.updated_at) {
      sitemap += `    <lastmod>${new Date(product.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
    }
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    sitemap += '  </url>\n';
  });

  // Fabric category pages
  fabricTypes.forEach(fabric => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}/fabric/${encodeURIComponent(fabric)}</loc>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.7</priority>\n';
    sitemap += '  </url>\n';
  });

  // Print category pages
  printTypes.forEach(print => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}/prints/${encodeURIComponent(print)}</loc>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.7</priority>\n';
    sitemap += '  </url>\n';
  });

  // Key pages
  const keyPages = [
    { path: '/story', priority: 0.6, changefreq: 'monthly' },
    { path: '/contact-us', priority: 0.5, changefreq: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
    { path: '/terms-and-conditions', priority: 0.3, changefreq: 'yearly' },
    { path: '/shipping-policy', priority: 0.4, changefreq: 'monthly' },
    { path: '/refund-and-exchange-policy', priority: 0.4, changefreq: 'monthly' }
  ];

  keyPages.forEach(page => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}${page.path}</loc>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';

  // Write to public directory
  fs.writeFileSync('./public/sitemap.xml', sitemap);

  const totalUrls = 2 + products.length + fabricTypes.length + printTypes.length + keyPages.length;

  console.log('\n✅ Sitemap generated successfully!');
  console.log(`📄 Location: public/sitemap.xml`);
  console.log(`📊 Total URLs: ${totalUrls}`);
  console.log(`   - Homepage: 1 (priority 0.9)`);
  console.log(`   - All Sarees: 1 (priority 1.0 - PRIMARY TARGET)`);
  console.log(`   - Product pages: ${products.length} (priority 0.8)`);
  console.log(`   - Fabric categories: ${fabricTypes.length} (priority 0.7)`);
  console.log(`   - Print categories: ${printTypes.length} (priority 0.7)`);
  console.log(`   - Key pages: ${keyPages.length} (priority 0.3-0.6)`);
}

generateSitemap().catch(console.error);
