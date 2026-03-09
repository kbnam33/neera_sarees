# Discount Code UI - Visual Guide

## Where the Discount Feature Appears

### 1. Checkout Page - Discount Input Section

**Location:** Right side panel, below the order items list, in the "Your Order" section

```
┌─────────────────────────────────────────┐
│          YOUR ORDER                      │
├─────────────────────────────────────────┤
│                                         │
│  [Product 1]  ₹2,999.00                │
│  [Product 2]  ₹3,499.00                │
│                                         │
├─────────────────────────────────────────┤
│  Subtotal             ₹6,498.00        │
│                                         │
│  ┌────────────────┐  ┌──────┐         │
│  │ DISCOUNT CODE  │  │APPLY │         │  ← NEW FEATURE
│  └────────────────┘  └──────┘         │
│                                         │
│  Shipping        Based on location     │
├─────────────────────────────────────────┤
│  Total                ₹6,498.00        │
└─────────────────────────────────────────┘
```

### 2. After Applying Discount Code

```
┌─────────────────────────────────────────┐
│          YOUR ORDER                      │
├─────────────────────────────────────────┤
│                                         │
│  [Product 1]  ₹2,999.00                │
│  [Product 2]  ₹3,499.00                │
│                                         │
├─────────────────────────────────────────┤
│  Subtotal             ₹6,498.00        │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ ✓ NEERA10         [Remove]      │  │  ← Applied Code
│  └─────────────────────────────────┘  │
│                                         │
│  Discount (10%)      - ₹649.80        │  ← Discount Amount
│  Shipping        Based on location     │
├─────────────────────────────────────────┤
│  Total                ₹5,848.20        │  ← Reduced Total
└─────────────────────────────────────────┘
```

### 3. Error State

```
┌─────────────────────────────────────────┐
│  ┌────────────────┐  ┌──────┐         │
│  │ INVALID123     │  │APPLY │         │
│  └────────────────┘  └──────┘         │
│  ❌ Invalid or expired discount code   │  ← Error Message
└─────────────────────────────────────────┘
```

### 4. Order Detail Page - Discount Display

**Location:** Payment Summary section on order detail page

```
┌─────────────────────────────────────────┐
│       PAYMENT SUMMARY                    │
├─────────────────────────────────────────┤
│                                         │
│  Subtotal           ₹6,498.00          │  ← Original Price
│  Discount (NEERA10) - ₹649.80         │  ← Discount Applied
│  Shipping      Based on location       │
├─────────────────────────────────────────┤
│  Total Paid         ₹5,848.20          │  ← Final Amount
└─────────────────────────────────────────┘
```

## UI States

### State 1: Empty Input (Default)
- Input field: "Discount code" placeholder
- Apply button: Enabled
- No error or success message

### State 2: Typing Code
- Input field: Shows typed code in UPPERCASE
- Apply button: Enabled
- No messages

### State 3: Applying (Loading)
- Apply button: Shows "APPLYING..."
- Button disabled during validation

### State 4: Valid Code Applied
- Green badge with checkmark icon
- Shows applied code name
- "Remove" button appears
- Discount amount shown in green
- Total recalculated and displayed

### State 5: Invalid Code
- Input field remains
- Red error message below input
- Apply button enabled (can try again)

### State 6: Minimum Order Not Met
- Red error message: "Minimum order amount of ₹X required"
- Input field remains

## Color Scheme

### Applied Discount (Success):
- Background: Light green (#F0FDF4 / green-50)
- Border: Green (#BBF7D0 / green-200)
- Text: Dark green (#166534 / green-800)
- Icon: Green (#16A34A / green-600)

### Error Messages:
- Text: Red (#DC2626 / red-600)
- Size: Small (text-xs)

### Input Field:
- Background: White
- Border: Gray (#D1D5DB / gray-300)
- Focus ring: Deep maroon (theme color)
- Text: Uppercase, small size

### Apply Button:
- Background: Charcoal gray (#36454F)
- Text: White, uppercase, bold
- Hover: Slightly darker gray
- Disabled: Light gray (#9CA3AF / gray-400)

## Responsive Behavior

### Desktop (lg screens):
- Discount section appears in right sidebar
- Full width within order summary box
- Input and button side by side

### Mobile (sm screens):
- Order summary stacks below shipping form
- Discount input full width
- Apply button maintains minimum size
- Touch-friendly button size (py-2, px-4)

## User Flow

```
1. User enters checkout page
   ↓
2. Sees discount code input field
   ↓
3. Types discount code (auto-uppercase)
   ↓
4. Clicks "APPLY" button
   ↓
5. System validates code
   ↓
6a. VALID → Show green badge, update total
6b. INVALID → Show error message
   ↓
7. User can remove code and try another
   OR proceed to payment with discount
   ↓
8. Order is saved with discount details
   ↓
9. Order history shows applied discount
```

## Accessibility Features

- Input has proper label and placeholder
- Button has clear text ("APPLY" / "APPLYING...")
- Error messages are clearly visible
- Success state uses both color and icon
- High contrast text colors
- Keyboard accessible (tab navigation)
- Screen reader friendly

## Animation & Transitions

- Button hover: Smooth color transition
- Success badge: Appears smoothly
- Error message: Fades in
- Total price update: Instant recalculation
- No jarring movements or delays

## Integration Points

### Frontend Components:
1. **CheckoutPage.jsx**
   - Discount input form
   - Apply/Remove handlers
   - Discount calculation logic
   - Order submission with discount

2. **OrderDetailPage.jsx**
   - Display discount in payment summary
   - Show original price vs final price

### Backend/Database:
1. **discount_codes table**
   - Stores all discount codes
   - Validates code parameters

2. **orders table**
   - Stores discount information per order
   - Links to applied discount code

### API Calls:
- Query discount_codes table (Supabase)
- Validate code existence and status
- Check validity dates and limits
- Update times_used counter
- Save discount to order record
