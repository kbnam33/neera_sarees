# Quick Setup for Discount Codes Feature

## Step-by-Step Setup Instructions

### 1. Run Database Migrations

You need to run two SQL scripts in your Supabase database:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

**First Script - Create Discount Codes Table:**
4. Copy the entire contents of `scripts/create-discount-codes.sql`
5. Paste it into the SQL editor
6. Click "Run" button
7. You should see success messages

**Second Script - Update Orders Table:**
8. Click "New Query" again
9. Copy the entire contents of `scripts/update-orders-for-discounts.sql`
10. Paste it into the SQL editor
11. Click "Run" button
12. You should see success messages

#### Option B: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to your project directory
cd d:\Neera

# Run the migrations
supabase db reset  # or use the SQL editor to run individual scripts
```

### 2. Verify Setup

After running the scripts, verify the setup:

1. Go to Supabase Dashboard → Table Editor
2. You should see a new table: `discount_codes`
3. Click on it and verify it has 4 pre-populated discount codes
4. Check the `orders` table has new columns: `original_price`, `discount_code`, `discount_amount`

### 3. Test the Feature

1. Start your development server:
```bash
npm run dev
```

2. Navigate to checkout with items in cart
3. Try applying discount code: **NEERA10**
4. Verify the discount is applied and total is recalculated
5. Complete a test order
6. Check order history to see discount displayed

### 4. Your Discount Code

**Recommended Code: NEERA10**
- Simple and memorable (7 characters)
- 10% off any order
- No minimum purchase required
- No maximum discount limit
- Valid until Dec 31, 2026
- Unlimited uses

## Troubleshooting

### Issue: "Table already exists" error
**Solution:** The table was already created. Skip to the next script.

### Issue: Discount code not working
**Checklist:**
- [ ] Both SQL scripts ran successfully
- [ ] discount_codes table exists in database
- [ ] discount_codes table has the 4 pre-populated codes
- [ ] orders table has the new columns
- [ ] RLS policies are enabled
- [ ] Supabase client is properly configured

### Issue: Can't see discount in order history
**Solution:** 
- Make sure you placed an order AFTER running the migration scripts
- Old orders won't have discount information

## All Available Discount Codes

| Code | Type | Discount | Min Order | Max Discount | Expires |
|------|------|----------|-----------|--------------|---------|
| **NEERA10** | % | 10% | None | None | Dec 31, 2026 |
| SAVE20 | % | 20% | ₹2,000 | ₹500 | Jun 30, 2026 |
| FLAT500 | Fixed | ₹500 | ₹3,000 | - | Dec 31, 2026 |
| WELCOME15 | % | 15% | None | ₹1,000 | Dec 31, 2026 |

## Need Help?

If you encounter any issues:
1. Check Supabase logs for errors
2. Verify RLS policies are active
3. Check browser console for JavaScript errors
4. Ensure all files are saved and server is restarted
