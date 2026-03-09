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

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);

-- Enable Row Level Security
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active discount codes (to validate them)
DROP POLICY IF EXISTS "Anyone can read active discount codes" ON discount_codes;
CREATE POLICY "Anyone can read active discount codes"
ON discount_codes FOR SELECT
USING (is_active = true);

-- Insert sample discount codes
INSERT INTO discount_codes (code, discount_type, discount_value, min_order_amount, max_discount_amount, is_active, usage_limit, valid_until)
VALUES 
  ('NEERA10', 'percentage', 10, 0, NULL, true, NULL, '2026-12-31 23:59:59+00'),
  ('SAVE20', 'percentage', 20, 2000, 500, true, 100, '2026-06-30 23:59:59+00'),
  ('FLAT500', 'fixed', 500, 3000, NULL, true, 50, '2026-12-31 23:59:59+00'),
  ('WELCOME15', 'percentage', 15, 0, 1000, true, NULL, '2026-12-31 23:59:59+00')
ON CONFLICT (code) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_discount_codes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_discount_codes_updated_at ON discount_codes;
CREATE TRIGGER trigger_update_discount_codes_updated_at
BEFORE UPDATE ON discount_codes
FOR EACH ROW
EXECUTE FUNCTION update_discount_codes_updated_at();