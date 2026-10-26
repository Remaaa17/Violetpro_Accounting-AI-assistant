import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Helper function to normalize transaction data from Supabase
export const normalizeTransaction = (transaction) => {
  return {
    id: transaction.id,
    entry_id: transaction['Entry ID'],
    date: transaction['Date'],
    transaction_type: transaction['Transaction Type'],
    account_debited: transaction['Account Debited'],
    account_credited: transaction['Account Credited'],
    amount: transaction['Amount'],
    narration: transaction['Narration'],
    created_at: transaction.created_at
  }
}
