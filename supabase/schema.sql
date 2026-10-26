-- Create transactions table with snake_case column names
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  entry_id INTEGER NOT NULL,
  date DATE NOT NULL,
  transaction_type VARCHAR(100) NOT NULL,
  account_debited VARCHAR(100) NOT NULL,
  account_credited VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  narration TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_amount ON transactions(amount);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for all users (adjust based on your needs)
CREATE POLICY "Allow public read access" ON transactions
  FOR SELECT
  USING (true);

-- Optional: Create a view for income transactions
CREATE OR REPLACE VIEW income_transactions AS
SELECT *
FROM transactions
WHERE account_credited IN ('Sales Revenue', 'Interest Income')
   OR transaction_type IN ('Sales', 'Cash Sale', 'Interest Income');

-- Optional: Create a view for expense transactions
CREATE OR REPLACE VIEW expense_transactions AS
SELECT *
FROM transactions
WHERE account_debited IN ('Rent Expense', 'Salaries Expense', 'Depreciation Expense')
   OR transaction_type IN ('Rent', 'Payroll', 'Depreciation', 'Loan Repayment');

-- Function to get financial summary
CREATE OR REPLACE FUNCTION get_financial_summary()
RETURNS TABLE (
  total_income DECIMAL,
  total_expenses DECIMAL,
  current_balance DECIMAL,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE 
      WHEN account_credited IN ('Sales Revenue', 'Interest Income') 
      THEN amount 
      ELSE 0 
    END), 0) as total_income,
    COALESCE(SUM(CASE 
      WHEN account_debited IN ('Rent Expense', 'Salaries Expense', 'Depreciation Expense')
        OR transaction_type IN ('Loan Repayment')
        OR account_credited = 'Bank Account'
      THEN amount 
      ELSE 0 
    END), 0) as total_expenses,
    COALESCE(SUM(CASE 
      WHEN account_credited IN ('Sales Revenue', 'Interest Income') 
      THEN amount 
      WHEN account_debited IN ('Rent Expense', 'Salaries Expense', 'Depreciation Expense')
        OR transaction_type IN ('Loan Repayment')
        OR account_credited = 'Bank Account'
      THEN -amount
      ELSE 0 
    END), 0) as current_balance,
    COUNT(*) as transaction_count
  FROM transactions;
END;
$$ LANGUAGE plpgsql;

-- Comment on table
COMMENT ON TABLE transactions IS 'Journal entries for the accounting system';
