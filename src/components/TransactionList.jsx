import { useState, useMemo } from 'react'
import { formatCurrency, formatDate } from '../utils/dataProcessor'
import { Search, ArrowUpCircle, ArrowDownCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react'

function TransactionList({ transactions }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = 
        t.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.account_debited.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.account_credited.toLowerCase().includes(searchTerm.toLowerCase())

      if (filterType === 'income') {
        return matchesSearch && getTransactionType(t) === 'income'
      } else if (filterType === 'expense') {
        return matchesSearch && getTransactionType(t) === 'expense'
      }
      return matchesSearch
    })
  }, [transactions, searchTerm, filterType])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Determine if transaction is income or expense
  const getTransactionType = (transaction) => {
    const accountCredited = transaction.account_credited
    const accountDebited = transaction.account_debited
    const transactionType = transaction.transaction_type

    // Income: Revenue accounts credited
    if (accountCredited === 'Sales Revenue' || accountCredited === 'Interest Income') {
      return 'income'
    }

    // Expense: Expense accounts debited
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

  const getCategory = (transaction) => {
    const type = transaction.transaction_type
    const accountDebited = transaction.account_debited
    const accountCredited = transaction.account_credited

    if (accountDebited === 'Rent Expense' || type === 'Rent') return 'Rent'
    if (accountDebited === 'Salaries Expense' || type === 'Payroll') return 'Salaries'
    if (accountDebited === 'Depreciation Expense' || type === 'Depreciation') return 'Depreciation'
    if (type === 'Loan Repayment') return 'Loan Repayment'
    if (accountCredited === 'Sales Revenue' || type === 'Sales' || type === 'Cash Sale') return 'Sales'
    if (accountCredited === 'Interest Income' || type === 'Interest Income') return 'Interest Income'
    if (type === 'Purchase') return 'Purchases'

    return type
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="mb-6">
        <h2 className="heading-3 mb-1">Transaction History</h2>
        <p className="text-small text-brand-navy text-opacity-70">
          Complete record of all financial transactions
        </p>
      </div>

      {/* Filters - Improved UX */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy text-opacity-40 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by description, category, or account..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="input pl-10 w-full"
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy text-opacity-40 pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value)
              setCurrentPage(1)
            }}
            className="input pl-10 w-full cursor-pointer appearance-none bg-white"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>
      </div>

      {/* Transaction Table - Responsive */}
      <div className="overflow-x-auto -mx-6 px-6 custom-scrollbar">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-brand-navy/20">
              <th className="px-4 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/5">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => {
                const transactionType = getTransactionType(transaction)
                const category = getCategory(transaction)
                const isIncome = transactionType === 'income'
                
                return (
                  <tr 
                    key={transaction.id} 
                    className="hover:bg-brand-mint/10 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 text-sm text-brand-navy whitespace-nowrap">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-dark font-medium">
                      <div className="truncate-2 max-w-md">
                        {transaction.narration}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-brand-navy">
                      {category}
                    </td>
                    <td className="px-4 py-3">
                      {isIncome ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-mint/30 text-brand-navy border border-brand-mint">
                          <ArrowUpCircle size={14} />
                          Income
                        </span>
                      ) : transactionType === 'expense' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
                          <ArrowDownCircle size={14} />
                          Expense
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-navy/10 text-brand-navy border border-brand-navy/20">
                          Other
                        </span>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold text-sm whitespace-nowrap ${
                      isIncome ? 'text-brand-mint-dark' : transactionType === 'expense' ? 'text-brand-primary' : 'text-brand-dark'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-12 text-center">
                  <div className="text-brand-navy/40">
                    <Search size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium text-brand-navy">No transactions found</p>
                    <p className="text-xs text-brand-navy/60 mt-1">
                      Try adjusting your search or filter
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Enhanced with Fitts' Law */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-brand-navy/10">
          <p className="text-sm text-brand-navy">
            Showing <span className="font-semibold text-brand-dark">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
            <span className="font-semibold text-brand-dark">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of{' '}
            <span className="font-semibold text-brand-dark">{filteredTransactions.length}</span> transactions
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary min-w-[100px]"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                        : 'bg-white text-brand-navy hover:bg-brand-mint/20 border border-brand-navy/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary min-w-[100px]"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionList
