# Discount Codes Feature - Implementation Guide

## Overview
A discount code system has been implemented that allows customers to apply promotional codes during checkout for discounts on their orders.

## Database Setup

### Step 1: Create Discount Codes Table
Run the SQL script to create the discount_codes table:
```bash
# Execute in Supabase SQL Editor or via CLI
psql -f scripts/create-discount-codes.sql
```

### Step 2: Update Orders Table
Add discount-related columns to orders table:
```bash
# Execute in Supabase SQL Editor or via CLI
psql -f scripts/update-orders-for-discounts.sql
```

## Available Discount Codes

### Active Discount Codes:

1. **NEERA10**
   - Type: Percentage
   - Discount: 10% off
   - Minimum Order: None
   - Max Discount: Unlimited
   - Valid Until: Dec 31, 2026
   - Usage Limit: Unlimited

2. **SAVE20**
   - Type: Percentage
   - Discount: 20% off
   - Minimum Order: ₹2,000
   - Max Discount: ₹500
   - Valid Until: Jun 30, 2026
   - Usage Limit: 100 uses

3. **FLAT500**
   - Type: Fixed Amount
   - Discount: ₹500 flat off
   - Minimum Order: ₹3,000
   - Max Discount: N/A
   - Valid Until: Dec 31, 2026
   - Usage Limit: 50 uses

4. **WELCOME15**
   - Type: Percentage
   - Discount: 15% off
   - Minimum Order: None
   - Max Discount: ₹1,000
   - Valid Until: Dec 31, 2026
   - Usage Limit: Unlimited

## Recommended Discount Code for Testing

**Use: NEERA10**
- Short and simple (7 characters)
- Easy to remember
- Works on any order amount
- No usage limit
- Valid until end of 2026

## Features Implemented

### Customer Features:
- Input field for discount code on checkout page
- Real-time validation of discount codes
- Clear error messages for invalid/expired codes
- Applied discount shown with removal option
- Discount breakdown in order summary
- Discount details shown in order history

### Business Logic:
- Validates discount code existence and active status
- Checks validity dates (valid_from and valid_until)
- Enforces minimum order amount requirements
- Applies maximum discount caps
- Tracks usage limits and times_used
- Automatic usage count increment on successful order
- Supports both percentage and fixed amount discounts

### Order Tracking:
- Orders store original_price, discount_code, and discount_amount
- Order detail page shows discount breakdown
- Historical orders display applied discounts

## Discount Types

### Percentage Discount
```javascript
// Example: 15% off
discount_type: 'percentage'
discount_value: 15
max_discount_amount: 1000 // Optional cap
```

### Fixed Amount Discount
```javascript
// Example: ₹500 flat off
discount_type: 'fixed'
discount_value: 500
```

## How to Add New Discount Codes

### Via SQL:
```sql
INSERT INTO discount_codes (
  code, 
  discount_type, 
  discount_value, 
  min_order_amount, 
  max_discount_amount, 
  is_active, 
  usage_limit, 
  valid_until
) VALUES (
  'NEWYEAR25',
  'percentage',
  25,
  5000,
  1500,
  true,
  200,
  '2027-01-31 23:59:59+00'
);
```

### Via Supabase Dashboard:
1. Go to Table Editor
2. Select `discount_codes` table
3. Click "Insert row"
4. Fill in the fields
5. Save

## Testing Checklist

- [ ] Apply valid discount code - should show discount
- [ ] Apply invalid code - should show error
- [ ] Apply expired code - should show error
- [ ] Test minimum order amount requirement
- [ ] Test maximum discount cap
- [ ] Test usage limit enforcement
- [ ] Remove applied discount - should recalculate total
- [ ] Complete order with discount - should save correctly
- [ ] View order details - should show discount breakdown
- [ ] Test percentage discount calculation
- [ ] Test fixed amount discount calculation

## Security Considerations

✅ Row Level Security (RLS) enabled on discount_codes table
✅ Public read access only for active codes
✅ Validation on both client and server side
✅ Usage tracking prevents abuse
✅ Time-based validity prevents expired code usage
✅ Discount codes are case-insensitive (auto-uppercase)

## Files Modified

1. **src/CheckoutPage.jsx** - Added discount code UI and logic
2. **src/OrderDetailPage.jsx** - Display discount in order summary
3. **scripts/create-discount-codes.sql** - Create discount_codes table
4. **scripts/update-orders-for-discounts.sql** - Update orders table schema

## Future Enhancements (Optional)

- Admin panel to manage discount codes
- User-specific discount codes
- First-time customer discounts
- Category-specific discounts
- Buy X Get Y offers
- Referral discount codes
- Email notifications for discount campaigns
