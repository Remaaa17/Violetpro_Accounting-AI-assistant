import { useMemo } from 'react'
import { processTransactions, formatCurrency } from '../utils/dataProcessor'
import StatCard from './StatCard'
import { DollarSign, TrendingDown, Wallet, Receipt } from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

function Dashboard({ transactions }) {
  const metrics = useMemo(() => processTransactions(transactions), [transactions])

  // Prepare data for pie chart
  const expensePieData = useMemo(() => {
    return Object.entries(metrics.expenseByCategory).map(([name, value]) => ({
      name,
      value
    }))
  }, [metrics.expenseByCategory])

  // Prepare data for bar chart
  const categoryBarData = useMemo(() => {
    const categories = new Set([
      ...Object.keys(metrics.incomeByCategory),
      ...Object.keys(metrics.expenseByCategory)
    ])
    
    return Array.from(categories).map(category => ({
      category,
      income: metrics.incomeByCategory[category] || 0,
      expenses: metrics.expenseByCategory[category] || 0
    }))
  }, [metrics.incomeByCategory, metrics.expenseByCategory])

  // Colors for pie chart - Using design system colors
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Description */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold mb-1 text-brand-dark">Financial Overview</h1>
        <p className="text-sm text-brand-navy text-opacity-70">
          Real-time insights into your financial performance
        </p>
      </div>

      {/* Stats Cards - Responsive Grid with compact sizing */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(metrics.totalIncome)}
          icon={<DollarSign size={24} strokeWidth={2.5} />}
          color="#10b981"
          bgColor="#EBFEF3"
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(metrics.totalExpenses)}
          icon={<TrendingDown size={24} strokeWidth={2.5} />}
          color="#ef4444"
          bgColor="#fef2f2"
          trend="down"
          trendValue="5%"
        />
        <StatCard
          title="Current Balance"
          value={formatCurrency(metrics.currentBalance)}
          icon={<Wallet size={24} strokeWidth={2.5} />}
          color={metrics.currentBalance >= 0 ? '#089ACC' : '#ef4444'}
          bgColor={metrics.currentBalance >= 0 ? '#EBFEF3' : '#fef2f2'}
        />
        <StatCard
          title="Total Transactions"
          value={metrics.transactionCount.toLocaleString()}
          icon={<Receipt size={24} strokeWidth={2.5} />}
          color="#089ACC"
          bgColor="#A8FBD2"
        />
      </div>

      {/* Charts Grid - Responsive Layout with compact sizing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        
        {/* Line Chart - Income vs Expenses Over Time */}
        <div className="card p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-0.5 text-brand-dark">Income vs Expenses Trend</h2>
            <p className="text-xs text-brand-navy text-opacity-70">Monthly comparison over time</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={metrics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A8FBD2" strokeOpacity={0.3} />
              <XAxis
                dataKey="month"
                stroke="#044B65"
                style={{ fontSize: '0.7rem' }}
              />
              <YAxis
                stroke="#044B65"
                style={{ fontSize: '0.7rem' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #A8FBD2',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(2, 32, 44, 0.1)',
                  fontSize: '0.75rem'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Expense Breakdown */}
        <div className="card p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-0.5 text-brand-dark">Expense Breakdown</h2>
            <p className="text-xs text-brand-navy text-opacity-70">Distribution by category</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={expensePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                style={{ fontSize: '0.7rem' }}
              >
                {expensePieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #A8FBD2',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(2, 32, 44, 0.1)',
                  fontSize: '0.75rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Category Comparison */}
        <div className="card p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-0.5 text-brand-dark">Category Comparison</h2>
            <p className="text-xs text-brand-navy text-opacity-70">Income vs expenses per category</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A8FBD2" strokeOpacity={0.3} />
              <XAxis 
                dataKey="category" 
                stroke="#044B65"
                style={{ fontSize: '0.7rem' }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis
                stroke="#044B65"
                style={{ fontSize: '0.7rem' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #A8FBD2',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(2, 32, 44, 0.1)',
                  fontSize: '0.75rem'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              <Bar dataKey="income" fill="#10b981" name="Income" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart - Cumulative Balance */}
        <div className="card p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-0.5 text-brand-dark">Balance Trend</h2>
            <p className="text-xs text-brand-navy text-opacity-70">Cumulative balance over time</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={metrics.monthlyData.map((item, index, arr) => {
              const cumulativeBalance = arr.slice(0, index + 1).reduce((sum, curr) => 
                sum + (curr.income - curr.expenses), 0
              )
              return { ...item, balance: cumulativeBalance }
            })}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#089ACC" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#A8FBD2" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#A8FBD2" strokeOpacity={0.3} />
              <XAxis
                dataKey="month"
                stroke="#044B65"
                style={{ fontSize: '0.7rem' }}
              />
              <YAxis
                stroke="#044B65"
                style={{ fontSize: '0.7rem' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #A8FBD2',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(2, 32, 44, 0.1)',
                  fontSize: '0.75rem'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#089ACC"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorBalance)"
                name="Cumulative Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
