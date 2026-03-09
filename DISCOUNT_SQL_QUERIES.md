# Discount Code Management - SQL Queries

## Quick Reference for Managing Discount Codes

---

## 📊 VIEW ALL DISCOUNT CODES

```sql
-- View all discount codes
SELECT 
  code,
  discount_type,
  discount_value,
  min_order_amount,
  max_discount_amount,
  is_active,
  times_used,
  usage_limit,
  valid_from,
  valid_until,
  created_at
FROM discount_codes
ORDER BY created_at DESC;
```

---

## 🔍 VIEW ACTIVE CODES ONLY

```sql
-- View only active discount codes
SELECT 
  code,
  CASE 
    WHEN discount_type = 'percentage' THEN CONCAT(discount_value, '% off')
    WHEN discount_type = 'fixed' THEN CONCAT('₹', discount_value, ' flat off')
  END as discount_display,
  min_order_amount,
  max_discount_amount,
  times_used,
  usage_limit,
  valid_until
FROM discount_codes
WHERE is_active = true
  AND (valid_until IS NULL OR valid_until > NOW())
ORDER BY created_at DESC;
```

---

## ➕ CREATE NEW DISCOUNT CODE

### Percentage Discount (e.g., 15% off)
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
  'SPRING25',           -- Code name (uppercase)
  'percentage',         -- Type: percentage or fixed
  25,                   -- 25% off
  1000,                 -- Minimum order: ₹1,000
  750,                  -- Maximum discount: ₹750
  true,                 -- Active
  500,                  -- Can be used 500 times (NULL = unlimited)
  '2026-06-30 23:59:59+00'  -- Expires June 30, 2026
);
```

### Fixed Amount Discount (e.g., ₹300 flat off)
```sql
INSERT INTO discount_codes (
  code, 
  discount_type, 
  discount_value, 
  min_order_amount, 
  is_active, 
  valid_until
) VALUES (
  'FLAT300',
  'fixed',              -- Fixed amount
  300,                  -- ₹300 flat off
  1500,                 -- Minimum order: ₹1,500
  true,
  '2026-12-31 23:59:59+00'
);
```

### Unlimited Usage Code
```sql
INSERT INTO discount_codes (
  code, 
  discount_type, 
  discount_value, 
  is_active
) VALUES (
  'VIP20',
  'percentage',
  20,
  true
  -- No valid_until = never expires
  -- No usage_limit = unlimited uses
  -- No min_order_amount = works on any order
);
```

---

## ✏️ UPDATE DISCOUNT CODE

### Deactivate a Code
```sql
UPDATE discount_codes
SET is_active = false
WHERE code = 'NEERA10';
```

### Extend Expiry Date
```sql
UPDATE discount_codes
SET valid_until = '2027-12-31 23:59:59+00'
WHERE code = 'NEERA10';
```

### Increase Usage Limit
```sql
UPDATE discount_codes
SET usage_limit = 1000
WHERE code = 'SAVE20';
```

### Change Discount Value
```sql
UPDATE discount_codes
SET discount_value = 15
WHERE code = 'NEERA10';
-- Changes from 10% to 15%
```

### Reset Usage Counter
```sql
UPDATE discount_codes
SET times_used = 0
WHERE code = 'SAVE20';
```

---

## 🗑️ DELETE DISCOUNT CODE

```sql
-- Delete a specific code
DELETE FROM discount_codes
WHERE code = 'OLDCODE123';

-- Delete expired codes
DELETE FROM discount_codes
WHERE valid_until < NOW();

-- Delete unused codes older than 1 year
DELETE FROM discount_codes
WHERE times_used = 0 
  AND created_at < NOW() - INTERVAL '1 year';
```

---

## 📈 ANALYTICS QUERIES

### Most Used Discount Codes
```sql
SELECT 
  code,
  discount_type,
  discount_value,
  times_used,
  usage_limit,
  CASE 
    WHEN usage_limit IS NOT NULL 
    THEN ROUND((times_used::numeric / usage_limit::numeric) * 100, 2)
    ELSE NULL
  END as usage_percentage
FROM discount_codes
WHERE is_active = true
ORDER BY times_used DESC
LIMIT 10;
```

### Revenue Impact by Discount Code
```sql
SELECT 
  discount_code,
  COUNT(*) as orders_count,
  SUM(original_price) as original_revenue,
  SUM(total_price) as actual_revenue,
  SUM(discount_amount) as total_discounts,
  ROUND(AVG(discount_amount), 2) as avg_discount_per_order
FROM orders
WHERE discount_code IS NOT NULL
  AND payment_status = 'paid'
GROUP BY discount_code
ORDER BY total_discounts DESC;
```

### Orders with Discounts (Last 30 Days)
```sql
SELECT 
  id,
  discount_code,
  original_price,
  discount_amount,
  total_price,
  created_at
FROM orders
WHERE discount_code IS NOT NULL
  AND created_at > NOW() - INTERVAL '30 days'
  AND payment_status = 'paid'
ORDER BY created_at DESC;
```

### Expiring Soon (Next 7 Days)
```sql
SELECT 
  code,
  discount_value,
  discount_type,
  times_used,
  usage_limit,
  valid_until
FROM discount_codes
WHERE is_active = true
  AND valid_until BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY valid_until ASC;
```

---

## 🔧 MAINTENANCE QUERIES

### Clean Up Expired Codes
```sql
-- Deactivate expired codes (don't delete, keep for history)
UPDATE discount_codes
SET is_active = false
WHERE valid_until < NOW()
  AND is_active = true;
```

### Find Codes Reaching Usage Limit
```sql
SELECT 
  code,
  times_used,
  usage_limit,
  (usage_limit - times_used) as remaining_uses
FROM discount_codes
WHERE usage_limit IS NOT NULL
  AND times_used >= (usage_limit * 0.9)  -- 90% used
  AND is_active = true
ORDER BY remaining_uses ASC;
```

### Validate Code Setup
```sql
-- Find potential issues with discount codes
SELECT 
  code,
  CASE
    WHEN discount_value <= 0 THEN 'Invalid discount value'
    WHEN discount_type = 'percentage' AND discount_value > 100 THEN 'Percentage exceeds 100'
    WHEN usage_limit IS NOT NULL AND times_used >= usage_limit THEN 'Usage limit reached'
    WHEN valid_until IS NOT NULL AND valid_until < NOW() THEN 'Expired'
    ELSE 'OK'
  END as status
FROM discount_codes
WHERE is_active = true;
```

---

## 🎯 COMMON DISCOUNT CODE TEMPLATES

### Welcome Discount (New Customers)
```sql
INSERT INTO discount_codes (code, discount_type, discount_value, max_discount_amount, is_active, valid_until)
VALUES ('WELCOME10', 'percentage', 10, 500, true, '2026-12-31 23:59:59+00');
```

### Flash Sale (24 Hours)
```sql
INSERT INTO discount_codes (code, discount_type, discount_value, min_order_amount, usage_limit, is_active, valid_until)
VALUES ('FLASH30', 'percentage', 30, 2000, 100, true, NOW() + INTERVAL '24 hours');
```

### Bulk Purchase Discount
```sql
INSERT INTO discount_codes (code, discount_type, discount_value, min_order_amount, is_active)
VALUES ('BULK15', 'percentage', 15, 10000, true);
```

### Festival Discount
```sql
INSERT INTO discount_codes (code, discount_type, discount_value, min_order_amount, max_discount_amount, is_active, valid_until)
VALUES ('DIWALI25', 'percentage', 25, 1500, 1000, true, '2026-11-15 23:59:59+00');
```

### Referral Discount
```sql
INSERT INTO discount_codes (code, discount_type, discount_value, is_active)
VALUES ('REF200', 'fixed', 200, true);
```

---

## 🔐 SECURITY CHECKS

### Find Suspicious Activity
```sql
-- Codes being used more than expected
SELECT 
  code,
  times_used,
  usage_limit,
  created_at
FROM discount_codes
WHERE usage_limit IS NOT NULL
  AND times_used > usage_limit
ORDER BY (times_used - usage_limit) DESC;
```

### Audit Recent Changes
```sql
-- View recently updated codes
SELECT 
  code,
  discount_value,
  is_active,
  updated_at
FROM discount_codes
WHERE updated_at > NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;
```

---

## 📋 BULK OPERATIONS

### Create Multiple Codes at Once
```sql
INSERT INTO discount_codes (code, discount_type, discount_value, is_active, valid_until)
VALUES 
  ('SUMMER10', 'percentage', 10, true, '2026-08-31 23:59:59+00'),
  ('SUMMER15', 'percentage', 15, true, '2026-08-31 23:59:59+00'),
  ('SUMMER20', 'percentage', 20, true, '2026-08-31 23:59:59+00');
```

### Deactivate All Expired Codes
```sql
UPDATE discount_codes
SET is_active = false
WHERE valid_until < NOW();
```

### Extend All Active Codes by 30 Days
```sql
UPDATE discount_codes
SET valid_until = valid_until + INTERVAL '30 days'
WHERE is_active = true
  AND valid_until IS NOT NULL;
```

---

## 💡 TIPS

1. **Always use UPPERCASE for codes** - Makes them easier to remember and type
2. **Keep codes short** - 5-10 characters is ideal
3. **Make codes memorable** - Use brand name, occasion, or benefit
4. **Set expiry dates** - Creates urgency
5. **Track usage** - Monitor which codes perform best
6. **Test codes** - Always test new codes before sharing
7. **Document codes** - Keep a record of what each code is for

---

## 🆘 TROUBLESHOOTING

### Code not working?
```sql
-- Check if code exists and is valid
SELECT 
  code,
  is_active,
  valid_from,
  valid_until,
  times_used,
  usage_limit,
  min_order_amount
FROM discount_codes
WHERE code = 'YOUR_CODE_HERE';
```

### Reset a problematic code
```sql
UPDATE discount_codes
SET 
  is_active = true,
  times_used = 0,
  valid_until = '2026-12-31 23:59:59+00'
WHERE code = 'YOUR_CODE_HERE';
```

---

## 📞 QUICK COMMANDS

```sql
-- Count active codes
SELECT COUNT(*) FROM discount_codes WHERE is_active = true;

-- Total discount given
SELECT SUM(discount_amount) FROM orders WHERE discount_code IS NOT NULL;

-- Average discount
SELECT AVG(discount_amount) FROM orders WHERE discount_code IS NOT NULL;

-- Most recent discount code used
SELECT discount_code, created_at FROM orders 
WHERE discount_code IS NOT NULL 
ORDER BY created_at DESC LIMIT 1;
```

---

**Pro Tip:** Save these queries in your Supabase SQL Editor as "Saved Queries" for quick access!
