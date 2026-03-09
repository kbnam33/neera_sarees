-- Add discount-related columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS original_price NUMERIC,
ADD COLUMN IF NOT EXISTS discount_code TEXT,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;

-- Create index on discount_code for analytics
CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders(discount_code);

-- Update existing orders to have original_price same as total_price
UPDATE orders 
SET original_price = total_price 
WHERE original_price IS NULL;