# Quick Fix for "Edge Function returned a non-2xx status code" Error

## The Problem
Your payment is failing because Razorpay API keys are missing from Supabase Edge Functions.

## Quick Solution (5 minutes)

### Step 1: Get Your Razorpay Secret Key
1. Go to: https://dashboard.razorpay.com/
2. Switch to **Test Mode** (toggle at top)
3. Click **Settings** → **API Keys**
4. Click **Generate Test Keys** (if you don't have them)
5. Copy both:
   - Key ID (starts with `rzp_test_`)
   - Key Secret (long string)

### Step 2: Add to Supabase
1. Go to: https://supabase.com/dashboard/project/xanrkptipcdhvklrvcia/settings/functions
2. Find **Edge Function Secrets** section
3. Add these two secrets:
   ```
   RAZORPAY_KEY_ID = rzp_test_XXXXXXXXXXXX
   RAZORPAY_KEY_SECRET = your_secret_key_here
   ```
4. Click **Save**

### Step 3: Deploy Edge Functions (if needed)
1. In Supabase Dashboard, go to **Edge Functions**
2. Click on `create-razorpay-order`
3. Click **Deploy** button
4. Repeat for `verify-razorpay-payment`

### Step 4: Test Again
1. Refresh your checkout page
2. Try payment again
3. Should work now! ✅

## Still Not Working?

### Check Edge Function Logs
1. Supabase Dashboard → Edge Functions → Logs
2. Look for error messages
3. Common errors:
   - "Razorpay API keys are not set" → Go back to Step 2
   - "401 Unauthorized" → Wrong API keys
   - "CORS error" → Edge Function not deployed

### Test Edge Function Manually
Open browser console on your site and run:

```javascript
const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
  body: { amount: 100 }
});
console.log('Response:', data);
console.log('Error:', error);
```

If you see `error`, check the message for details.

## Alternative: Test Locally Without Payment

If you want to test the site without setting up Razorpay:

1. Comment out the payment code temporarily
2. Create a test order directly in the database
3. This is NOT recommended for production

## Need More Help?

See the detailed guide: `RAZORPAY_SETUP.md`
