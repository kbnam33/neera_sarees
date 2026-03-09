# LOCALHOST DISCOUNT SETUP - Quick Fix

## Problem
On localhost, when you apply a discount code and click "PROCEED TO PAYMENT", you get an error because the database doesn't have the discount tables/columns.

**Why it works on live site (neera.store):** The production database has the discount tables set up.

**Why it fails on localhost:** Your local database is missing:
1. `discount_codes` table
2. Discount columns in `orders` table (`original_price`, `discount_code`, `discount_amount`)

## Solution: Run SQL Migrations on Localhost

### Option 1: Run Migrations in Supabase Dashboard

1. **Go to your Supabase project:**
   - URL: https://supabase.com/dashboard/project/xanrkptipcdhvklrvcia/editor

2. **Open SQL Editor:**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Run First Migration (Create discount_codes table):**
   - Copy entire contents of `scripts/create-discount-codes.sql`
   - Paste into SQL editor
   - Click "Run" button
   - Wait for success message

4. **Run Second Migration (Update orders table):**
   - Click "New Query" again
   - Copy entire contents of `scripts/update-orders-for-discounts.sql`
   - Paste into SQL editor
   - Click "Run" button
   - Wait for success message

5. **Verify Setup:**
   - Go to "Table Editor" in left sidebar
   - You should see `discount_codes` table with 4 codes
   - Click on `orders` table
   - You should see new columns: `original_price`, `discount_code`, `discount_amount`

### Option 2: Quick SQL Commands (Copy-Paste All at Once)

Open Supabase SQL Editor and run this:

```sql
-- Create discount_codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC DEFAULT 0,
  max_discount_amount NUMERIC,
  is_active BOOLEAN DEFAULT true,
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);

-- Enable RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Add read policy
DROP POLICY IF EXISTS "Anyone can read active discount codes" ON discount_codes;
CREATE POLICY "Anyone can read active discount codes"
ON discount_codes FOR SELECT
USING (is_active = true);

-- Insert sample codes
INSERT INTO discount_codes (code, discount_type, discount_value, min_order_amount, max_discount_amount, is_active, usage_limit, valid_until)
VALUES 
  ('NEERA10', 'percentage', 10, 0, NULL, true, NULL, '2026-12-31 23:59:59+00'),
  ('SAVE20', 'percentage', 20, 2000, 500, true, 100, '2026-06-30 23:59:59+00'),
  ('FLAT500', 'fixed', 500, 3000, NULL, true, 50, '2026-12-31 23:59:59+00'),
  ('WELCOME15', 'percentage', 15, 0, 1000, true, NULL, '2026-12-31 23:59:59+00')
ON CONFLICT (code) DO NOTHING;

-- Add discount columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS original_price NUMERIC,
ADD COLUMN IF NOT EXISTS discount_code TEXT,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;

-- Create index
CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders(discount_code);

-- Update existing orders
UPDATE orders 
SET original_price = total_price 
WHERE original_price IS NULL;
```

### Test After Setup

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Test the discount:**
   - Add items to cart
   - Go to checkout
   - Enter: `NEERA10`
   - Click "Apply"
   - Should show: "✓ NEERA10" with discount
   - Click "PROCEED TO PAYMENT"
   - Should work now! ✅

## Troubleshooting

### Error: "Discount feature not available"
- The `discount_codes` table doesn't exist
- Run the SQL migrations above

### Error: "Failed to create order"
- The `orders` table is missing discount columns
- Run the second part of the SQL migration (ALTER TABLE)

### Still getting payment error after applying discount?
1. Check browser console for specific error
2. Check Supabase logs: Dashboard → Logs
3. Make sure both SQL scripts ran successfully
4. Verify tables exist in Table Editor

### Test without discount first
To verify the basic payment flow works:
1. Don't apply any discount code
2. Just click "PROCEED TO PAYMENT"
3. If this works, the issue is only with discount feature

## Why This Happens

- **Production (neera.store):** You already ran these migrations ✅
- **Localhost:** These migrations haven't been run yet ❌

Both your local and production environments use the **same Supabase project**, so running the migrations once will fix both.

## Quick Check: Are Migrations Already Done?

Go to: https://supabase.com/dashboard/project/xanrkptipcdhvklrvcia/editor

Check if `discount_codes` table exists:
- If YES → Migrations are done, issue is something else
- If NO → Run the migrations above

## After Setup

Once migrations are complete:
- ✅ Discount codes work on localhost
- ✅ Discount codes work on production (neera.store)
- ✅ Payment works with or without discounts
- ✅ Orders save discount details

---

**Estimated time:** 5 minutes
**Difficulty:** Easy (just copy-paste SQL)
**Need help?** Check `DISCOUNT_CODES.md` for detailed docs
