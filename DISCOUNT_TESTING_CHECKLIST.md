# Discount Code Feature - Testing Checklist

## Pre-Testing Setup
- [ ] Run `scripts/create-discount-codes.sql` in Supabase
- [ ] Run `scripts/update-orders-for-discounts.sql` in Supabase
- [ ] Verify `discount_codes` table exists with 4 codes
- [ ] Verify `orders` table has new columns: original_price, discount_code, discount_amount
- [ ] Start development server: `npm run dev`

---

## Test 1: Basic Discount Application ⭐

### Test NEERA10 (10% off, no restrictions)

**Cart Setup:**
- [ ] Add any saree to cart (e.g., ₹2,999)

**Steps:**
1. [ ] Navigate to checkout
2. [ ] Locate discount code input field (below order items)
3. [ ] Type: `neera10` (lowercase to test auto-uppercase)
4. [ ] Click "APPLY" button
5. [ ] Wait for validation

**Expected Results:**
- [ ] Code is converted to uppercase: NEERA10
- [ ] Green success badge appears with checkmark ✓
- [ ] Shows "NEERA10" with "Remove" button
- [ ] Discount line appears: "Discount (10%)" in green
- [ ] Discount amount shows: - ₹299.90 (10% of ₹2,999)
- [ ] Total is reduced: ₹2,699.10
- [ ] "Remove" button is visible and clickable

**Actions:**
6. [ ] Click "Remove" button

**Expected After Remove:**
- [ ] Discount badge disappears
- [ ] Input field reappears
- [ ] Discount line removed from summary
- [ ] Total returns to original: ₹2,999.00

---

## Test 2: Invalid Code Handling

**Steps:**
1. [ ] Type: `INVALID123`
2. [ ] Click "APPLY"

**Expected Results:**
- [ ] Red error message: "Invalid or expired discount code"
- [ ] Input field remains visible
- [ ] No discount applied
- [ ] Total unchanged
- [ ] Can try entering another code

---

## Test 3: Empty Input Validation

**Steps:**
1. [ ] Leave input field empty
2. [ ] Click "APPLY"

**Expected Results:**
- [ ] Red error message: "Please enter a discount code"
- [ ] Button should be disabled when input is empty (verify this)
- [ ] No API call made

---

## Test 4: Minimum Order Amount (SAVE20)

### Test with insufficient order amount

**Cart Setup:**
- [ ] Cart total: ₹1,500 (less than ₹2,000 minimum)

**Steps:**
1. [ ] Type: `SAVE20`
2. [ ] Click "APPLY"

**Expected Results:**
- [ ] Red error message: "Minimum order amount of ₹2000 required"
- [ ] No discount applied
- [ ] Total unchanged

### Test with sufficient order amount

**Cart Setup:**
- [ ] Cart total: ₹4,000 (more than ₹2,000 minimum)

**Steps:**
1. [ ] Type: `SAVE20`
2. [ ] Click "APPLY"

**Expected Results:**
- [ ] Green success badge appears
- [ ] Discount (20%) line shows
- [ ] Discount amount: - ₹500.00 (capped at max ₹500)
- [ ] Total: ₹3,500.00

**Note:** Even though 20% of ₹4,000 = ₹800, it's capped at ₹500 maximum

---

## Test 5: Fixed Amount Discount (FLAT500)

**Cart Setup:**
- [ ] Cart total: ₹5,000 (more than ₹3,000 minimum)

**Steps:**
1. [ ] Type: `FLAT500`
2. [ ] Click "APPLY"

**Expected Results:**
- [ ] Green success badge appears
- [ ] Discount line shows: "Discount (Flat)"
- [ ] Discount amount: - ₹500.00
- [ ] Total: ₹4,500.00

---

## Test 6: Complete Order with Discount

**Cart Setup:**
- [ ] Add saree worth ₹2,999 to cart
- [ ] Be logged in

**Steps:**
1. [ ] Go to checkout
2. [ ] Apply discount code: `NEERA10`
3. [ ] Verify discount is applied: - ₹299.90
4. [ ] Fill in shipping address (if not pre-filled)
5. [ ] Click "PROCEED TO PAYMENT"
6. [ ] Complete payment (test mode)
7. [ ] Order confirmation should appear

**Verify Order Save:**
8. [ ] Go to Profile → Order History
9. [ ] Click on the recent order

**Expected Results:**
- [ ] Order detail page shows discount section
- [ ] Subtotal shows: ₹2,999.00 (original price)
- [ ] Discount line shows: "Discount (NEERA10): - ₹299.90" in green
- [ ] Total Paid shows: ₹2,699.10

**Verify Database:**
10. [ ] Open Supabase → orders table
11. [ ] Find the latest order

**Expected in Database:**
- [ ] original_price: 2999
- [ ] discount_code: "NEERA10"
- [ ] discount_amount: 299.90
- [ ] total_price: 2699.10
- [ ] payment_status: "paid"

12. [ ] Open Supabase → discount_codes table
13. [ ] Find NEERA10 code

**Expected:**
- [ ] times_used: incremented by 1

---

## Test 7: WELCOME15 with Max Cap

**Cart Setup:**
- [ ] Cart total: ₹10,000

**Steps:**
1. [ ] Apply code: `WELCOME15`

**Expected Results:**
- [ ] 15% of ₹10,000 = ₹1,500
- [ ] But max_discount_amount is ₹1,000
- [ ] Discount shown: - ₹1,000.00 (capped)
- [ ] Total: ₹9,000.00

---

## Test 8: Multiple Code Attempts

**Steps:**
1. [ ] Apply: `NEERA10` → Success
2. [ ] Remove discount
3. [ ] Apply: `SAVE20` with ₹1,000 cart → Error (min order)
4. [ ] Add more items to reach ₹2,500
5. [ ] Apply: `SAVE20` → Success
6. [ ] Remove discount
7. [ ] Apply: `FLAT500` with ₹4,000 cart → Success

**Expected Results:**
- [ ] Each transition works smoothly
- [ ] No errors or crashes
- [ ] Calculations are always accurate
- [ ] UI updates correctly each time

---

## Test 9: Case Insensitivity

**Steps:**
1. [ ] Try: `neera10` (lowercase)
2. [ ] Try: `NeErA10` (mixed case)
3. [ ] Try: `NEERA10` (uppercase)

**Expected Results:**
- [ ] All three variations work
- [ ] Code is always displayed as uppercase: NEERA10
- [ ] Same discount applied in all cases

---

## Test 10: UI/UX Testing

### Visual Check:
- [ ] Input field is properly styled
- [ ] Apply button is visible and clickable
- [ ] Success badge has green background and checkmark icon
- [ ] Error messages are in red and clearly visible
- [ ] Discount amount is in green color
- [ ] Total price is prominently displayed
- [ ] Remove button is easy to find

### Responsive Check:
- [ ] Test on desktop view (width > 1024px)
- [ ] Test on tablet view (width 768-1024px)
- [ ] Test on mobile view (width < 768px)
- [ ] All elements are properly aligned
- [ ] No text overflow or cut-off
- [ ] Buttons are touch-friendly on mobile

### Loading States:
- [ ] "APPLYING..." shows when button is clicked
- [ ] Button is disabled during validation
- [ ] No double-click issues

---

## Test 11: Edge Cases

### Very Small Cart Amount:
**Cart:** ₹50
**Code:** NEERA10 (10% off)
**Expected:** Discount = ₹5.00, Total = ₹45.00

### Discount Greater Than Cart:
**Cart:** ₹200
**Code:** FLAT500
**Expected:** Discount = ₹200 (capped at subtotal), Total = ₹0.00

### Exact Minimum Order Amount:
**Cart:** ₹2,000
**Code:** SAVE20
**Expected:** Discount applies (meets minimum exactly)

---

## Test 12: Browser Testing

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

**Check in each browser:**
- [ ] Input field works
- [ ] Apply button responds
- [ ] Discount calculation is correct
- [ ] Visual styling is consistent

---

## Test 13: Network Error Handling

**Simulate:**
1. [ ] Disconnect internet
2. [ ] Try to apply code: `NEERA10`

**Expected:**
- [ ] Error message appears
- [ ] No crash
- [ ] Can retry after reconnecting

---

## Test 14: Cart Changes After Discount

**Steps:**
1. [ ] Add ₹5,000 worth of items
2. [ ] Apply: `FLAT500`
3. [ ] Total shows: ₹4,500
4. [ ] Navigate back to cart
5. [ ] Remove some items (new total: ₹2,000)
6. [ ] Return to checkout

**Expected:**
- [ ] Discount might need revalidation
- [ ] System handles cart changes gracefully

**Note:** This scenario depends on implementation - document actual behavior

---

## Test 15: Performance Check

**Steps:**
1. [ ] Apply discount code
2. [ ] Measure response time

**Expected:**
- [ ] Validation completes in < 2 seconds
- [ ] UI updates immediately after validation
- [ ] No lag or freezing

---

## Success Criteria

All tests should pass with:
- ✅ Correct calculations
- ✅ Appropriate error messages
- ✅ Smooth UI transitions
- ✅ Data saved correctly in database
- ✅ No console errors
- ✅ Responsive design works
- ✅ Accessible to keyboard navigation

---

## Bugs Found During Testing

Document any issues here:

| Test # | Issue Description | Severity | Status |
|--------|------------------|----------|--------|
|        |                  |          |        |

---

## Final Approval

- [ ] All critical tests passed
- [ ] UI/UX is polished
- [ ] Database records are accurate
- [ ] No major bugs found
- [ ] Feature is ready for production

**Tester Name:** _________________

**Date:** _________________

**Sign-off:** _________________
