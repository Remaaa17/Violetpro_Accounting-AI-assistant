// Determine transaction type from journal entry
const determineTransactionType = (transaction) => {
  const accountCredited = transaction.account_credited
  const accountDebited = transaction.account_debited
  const transactionType = transaction.transaction_type

  // Income transactions (Revenue accounts credited)
  if (accountCredited === 'Sales Revenue' || accountCredited === 'Interest Income') {
    return 'income'
  }

  // Expense transactions (Expense accounts debited)
  if (
    accountDebited === 'Rent Expense' ||
    accountDebited === 'Salaries Expense' ||
    accountDebited === 'Depreciation Expense' ||
    transactionType === 'Loan Repayment'
  ) {
    return 'expense'
  }

  return 'other'
}

// Get category for transaction
const getTransactionCategory = (transaction) => {
  const type = transaction.transaction_type
  const accountDebited = transaction.account_debited
  const accountCredited = transaction.account_credited

  // Map to simplified categories for display
  if (accountDebited === 'Rent Expense' || type === 'Rent') return 'Rent'
  if (accountDebited === 'Salaries Expense' || type === 'Payroll') return 'Salaries'
  if (accountDebited === 'Depreciation Expense' || type === 'Depreciation') return 'Depreciation'
  if (type === 'Loan Repayment') return 'Loan Repayment'
  if (accountCredited === 'Sales Revenue' || type === 'Sales' || type === 'Cash Sale') return 'Sales'
  if (accountCredited === 'Interest Income' || type === 'Interest Income') return 'Interest Income'
  if (type === 'Purchase') return 'Purchases'

  return type
}

// Process transactions to calculate financial metrics
export const processTransactions = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      currentBalance: 0,
      transactionCount: 0,
      incomeByCategory: {},
      expenseByCategory: {},
      monthlyData: [],
      transactionsByType: []
    }
  }

  let totalIncome = 0
  let totalExpenses = 0
  const incomeByCategory = {}
  const expenseByCategory = {}
  const monthlyDataMap = {}
  const processedTransactions = []

  transactions.forEach(transaction => {
    const amount = parseFloat(transaction.amount) || 0
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const type = determineTransactionType(transaction)
    const category = getTransactionCategory(transaction)

    // Initialize monthly data if needed
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = { month: monthKey, income: 0, expenses: 0 }
    }

    // Process as income
    if (type === 'income') {
      totalIncome += amount
      incomeByCategory[category] = (incomeByCategory[category] || 0) + amount
      monthlyDataMap[monthKey].income += amount
    }
    
    // Process as expense
    if (type === 'expense') {
      totalExpenses += amount
      expenseByCategory[category] = (expenseByCategory[category] || 0) + amount
      monthlyDataMap[monthKey].expenses += amount
    }

    // Add to processed list with enhanced info
    processedTransactions.push({
      ...transaction,
      type: type === 'income' ? 'Income' : type === 'expense' ? 'Expense' : 'Other',
      category: category,
      displayAmount: amount
    })
  })

  const currentBalance = totalIncome - totalExpenses
  const monthlyData = Object.values(monthlyDataMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12) // Last 12 months only

  return {
    totalIncome,
    totalExpenses,
    currentBalance,
    transactionCount: transactions.length,
    incomeByCategory,
    expenseByCategory,
    monthlyData,
    transactionsByType: processedTransactions
  }
}

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Prepare data summary for AI
export const prepareAIContext = (transactions) => {
  const metrics = processTransactions(transactions)
  
  // Get top 10 expenses by amount
  const expenseTransactions = transactions
    .map(t => {
      const type = determineTransactionType(t)
      const category = getTransactionCategory(t)
      return { ...t, type, category }
    })
    .filter(t => t.type === 'expense')
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    .slice(0, 10)

  const topExpenses = expenseTransactions.map(t => ({
    date: t.date,
    category: t.category,
    amount: parseFloat(t.amount),
    description: t.narration
  }))

  // Get expense categories sorted by total
  const expenseCategories = Object.entries(metrics.expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({ 
      category, 
      amount,
      percentage: ((amount / metrics.totalExpenses) * 100).toFixed(1)
    }))

  // Get income categories sorted by total
  const incomeCategories = Object.entries(metrics.incomeByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({ 
      category, 
      amount,
      percentage: ((amount / metrics.totalIncome) * 100).toFixed(1)
    }))

  return {
    summary: {
      totalIncome: metrics.totalIncome,
      totalExpenses: metrics.totalExpenses,
      currentBalance: metrics.currentBalance,
      transactionCount: metrics.transactionCount,
      netProfitMargin: metrics.totalIncome > 0 
        ? ((metrics.currentBalance / metrics.totalIncome) * 100).toFixed(1)
        : 0
    },
    topExpenses,
    expenseCategories,
    incomeCategories,
    monthlyTrends: metrics.monthlyData,
    dateRange: {
      from: transactions[transactions.length - 1]?.date,
      to: transactions[0]?.date
    }
  }
}
