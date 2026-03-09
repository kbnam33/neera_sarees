# Discount Feature Error Log

## Scope
This log captures all major errors encountered during discount feature implementation, how each was diagnosed, and in which trial (iteration) it was fixed.

## Iteration-wise Errors and Fixes

### Iteration 1 - SQL policy already exists
- **Error:** `ERROR: 42710: policy "Anyone can read active discount codes" for table "discount_codes" already exists`
- **Where seen:** Supabase SQL Editor while running `scripts/create-discount-codes.sql`.
- **Root cause:** Script used `CREATE POLICY` directly; reruns failed when policy already existed.
- **Fix applied:**
  - Updated `scripts/create-discount-codes.sql` to:
    - `DROP POLICY IF EXISTS "Anyone can read active discount codes" ON discount_codes;`
    - then `CREATE POLICY ...`
- **Status:** Fixed in Iteration 1.

### Iteration 2 - SQL trigger already exists
- **Error:** `ERROR: 42710: trigger "trigger_update_discount_codes_updated_at" for relation "discount_codes" already exists`
- **Where seen:** Supabase SQL Editor while running `scripts/create-discount-codes.sql` again.
- **Root cause:** Script used `CREATE TRIGGER` directly; reruns failed when trigger already existed.
- **Fix applied:**
  - Updated `scripts/create-discount-codes.sql` to:
    - `DROP TRIGGER IF EXISTS trigger_update_discount_codes_updated_at ON discount_codes;`
    - then `CREATE TRIGGER ...`
- **Status:** Fixed in Iteration 2.

### Iteration 3 - Checkout payment fails only with discount code
- **Error shown in UI/console:** `Payment initialization failed: Edge Function returned a non-2xx status code`
- **Where seen:** Local checkout after applying discount (`NEERA10`), while non-discount checkout worked.
- **Root cause:** Discounted totals produced decimal rupee amounts; backend order creation needed strict integer paise handling and robust amount validation.
- **Fix applied (backend):**
  - Updated `supabase/functions/create-razorpay-order/index.ts`:
    - Parse and validate numeric `amount`.
    - Convert with `Math.round(normalizedAmount * 100)` to integer paise.
    - Validate positive integer paise before Razorpay API call.
    - Improved Razorpay error extraction (`errorBody?.error?.description` fallback).
- **Fix applied (frontend):**
  - Updated `src/CheckoutPage.jsx`:
    - `discountAmount = Number(calculateDiscountAmount().toFixed(2))`
    - `finalTotal = Number(Math.max(subtotal - discountAmount, 0).toFixed(2))`
    - Added parsing of `orderError.context` from Supabase Function to surface real backend error message.
- **Deployment action:**
  - Deployed updated function:
    - `supabase functions deploy create-razorpay-order --project-ref xanrkptipcdhvklrvcia`
  - Verified secrets existed:
    - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.
- **Status:** Fixed in Iteration 3.

## Supporting SQL Hardening Added
- `scripts/create-discount-codes.sql` was made idempotent for reruns:
  - `CREATE TABLE IF NOT EXISTS`
  - `CREATE INDEX IF NOT EXISTS`
  - `DROP POLICY IF EXISTS` + `CREATE POLICY`
  - `ON CONFLICT (code) DO NOTHING` for inserts
  - `CREATE OR REPLACE FUNCTION`
  - `DROP TRIGGER IF EXISTS` + `CREATE TRIGGER`
- `scripts/update-orders-for-discounts.sql` already used safe `IF NOT EXISTS` column/index changes.

## Screenshot and Reference Evidence Used for Diagnosis

1. **`image-ae282bd3-e92b-4069-bf4e-f135b8c96837.png`**
   - Checkout page with discount applied and red error:
   - `Edge Function returned a non-2xx status code`.
   - Used to confirm payment failed specifically during discount flow.

2. **`image-e29a3b10-b4e3-48f1-9b0a-5cf01236e23b.png`**
   - Supabase SQL Editor error:
   - policy already exists.
   - Used to drive policy idempotency fix.

3. **`image-8c8e585a-eba0-46d4-b9da-326511d3f42c.png`**
   - Supabase SQL Editor error:
   - trigger already exists.
   - Used to drive trigger idempotency fix.

4. **`image-1269f9e8-7670-4f77-8e4d-a75880230874.png`**
   - Browser console with:
   - `FunctionsHttpError` and `Payment initialization failed: Edge Function returned a non-2xx status code`.
   - Used to confirm frontend was not surfacing backend details adequately.

5. **`image-247333f2-70fd-4a18-aec5-1bd6144f7b65.png`**
   - Research screenshot listing Razorpay non-2xx categories.
   - Used as reference context for probable API failure classes.

6. **`image-b55c6579-b254-4ff9-b5c8-d82779448645.png`**
   - Successful Razorpay popup after fixes with discounted amount shown.
   - Used to confirm final resolution.

## Final Outcome
- Discount application works.
- Payment initialization works with discount.
- Razorpay popup opens with discounted rupee value display (while backend sends integer paise).
- SQL scripts are rerunnable without policy/trigger/duplicate-code failures.
