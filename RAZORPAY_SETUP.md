# Razorpay Setup Instructions

## Current Issue
The payment is failing because Razorpay API keys are not configured in Supabase Edge Functions.

## ⚠️ Important: Use Test Mode for Development

You're currently using a **live** Razorpay key (`rzp_live_RSARUIU2k4ARtL`). For testing, you should use **test mode** keys.

## Steps to Fix

### 1. Get Razorpay API Keys

**For Testing (Recommended):**
1. Go to https://dashboard.razorpay.com/
2. Switch to **Test Mode** (toggle in top-left corner)
3. Navigate to **Settings** → **API Keys** → **Generate Test Keys**
4. You'll get:
   - Test Key ID: `rzp_test_XXXXXXXXXXXX`
   - Test Key Secret: `YYYYYYYYYYYYYYYY`

**For Production:**
1. Go to https://dashboard.razorpay.com/
2. Switch to **Live Mode**
3. Complete KYC verification
4. Navigate to **Settings** → **API Keys** → **Generate Live Keys**

### 2. Set Environment Variables in Supabase

#### Option A: Via Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/xanrkptipcdhvklrvcia/settings/functions
2. Scroll to **Edge Function Secrets**
3. Click **Add Secret** or **New Secret**
4. Add these two secrets:

   **Secret 1:**
   - Name: `RAZORPAY_KEY_ID`
   - Value: `rzp_test_XXXXXXXXXXXX` (your test key ID)

   **Secret 2:**
   - Name: `RAZORPAY_KEY_SECRET`
   - Value: `YYYYYYYYYYYYYYYY` (your test key secret)

5. Click **Save**

#### Option B: Via Supabase CLI

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref xanrkptipcdhvklrvcia

# Set the secrets
supabase secrets set RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
supabase secrets set RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
```

### 3. Verify Edge Functions are Deployed

Check if your Edge Functions are deployed:

```bash
# List deployed functions
supabase functions list

# If not deployed, deploy them
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

Or deploy via Supabase Dashboard:
1. Go to **Edge Functions** in your Supabase Dashboard
2. Click on each function
3. Click **Deploy**

### 4. Update Local Environment File (Optional)

Update `.env.local` to use test keys for local development:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
```

### 5. Test the Payment Flow

1. Restart your development server: `npm run dev`
2. Add items to cart
3. Go to checkout
4. Fill in details
5. Click "PROCEED TO PAYMENT"
6. Use **test card details** (Razorpay provides these)

## Test Card Details (Razorpay Test Mode)

**Success Scenario:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Other Test Cards:**
- Declined: `4000 0000 0000 0002`
- Insufficient Funds: `4000 0000 0000 0127`

## Troubleshooting

### Error: "Edge Function returned a non-2xx status code"

**Possible causes:**
1. ❌ Razorpay keys not set in Supabase
2. ❌ Edge Functions not deployed
3. ❌ Invalid Razorpay keys
4. ❌ Network/CORS issues

**Solutions:**
1. ✅ Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Supabase
2. ✅ Deploy Edge Functions
3. ✅ Verify keys are correct in Razorpay Dashboard
4. ✅ Check browser console for detailed error

### Check Edge Function Logs

1. Go to Supabase Dashboard → Edge Functions
2. Click on `create-razorpay-order`
3. View **Logs** tab to see what error occurred
4. Look for messages like:
   - "Razorpay API keys are not set"
   - "Razorpay API Error: ..."

### Verify Configuration

Run this in browser console on checkout page to verify:

```javascript
// Check if Razorpay key is loaded
console.log('Razorpay Key:', import.meta.env.VITE_RAZORPAY_KEY_ID);

// Test Edge Function
const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
  body: { amount: 100 }
});
console.log('Response:', data, error);
```

## Next Steps After Setup

1. ✅ Set Razorpay secrets in Supabase
2. ✅ Deploy Edge Functions (if not already deployed)
3. ✅ Test with test mode keys
4. ✅ Verify payment flow works end-to-end
5. ✅ Once tested, switch to live keys for production

## Production Checklist

Before going live:
- [ ] Complete Razorpay KYC verification
- [ ] Generate live API keys
- [ ] Update Supabase secrets with live keys
- [ ] Update `.env.local` with live key ID
- [ ] Test with real payment methods
- [ ] Set up webhooks for payment notifications
- [ ] Enable payment modes (cards, UPI, netbanking, wallets)

## Important Notes

⚠️ **Never commit API secrets to Git**
⚠️ **Use test mode for all development/testing**
⚠️ **Keep live keys secure and only use in production**

## Contact Support

- **Razorpay Support:** https://razorpay.com/support/
- **Supabase Support:** https://supabase.com/support
