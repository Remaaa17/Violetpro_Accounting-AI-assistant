import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import TransactionList from './components/TransactionList'
import ChatbotPopup from './components/ChatbotPopup'
import { supabase } from './services/supabase'
import { AlertCircle, Loader2 } from 'lucide-react'

// Set to true to show UI preview without database connection
const PREVIEW_MODE = false

function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard') // New state for tab navigation

  useEffect(() => {
    console.log('App mounted')
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
    console.log('Groq Key:', import.meta.env.VITE_GROQ_API_KEY ? 'Set' : 'Missing')
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error

      setTransactions(data || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Professional Fintech Navbar */}
      <header className="sticky top-0 z-30 bg-brand-dark border-b border-brand-primary border-opacity-30">
        <nav className="max-w-7xl mx-auto px-[4%] sm:px-[5%] h-[88px] flex items-center justify-between">
          {/* Company Logo */}
          <div className="flex items-center">
            <img 
              src="/src/assets/logo.png" 
              alt="Finora AI" 
              className="h-16 sm:h-[72px] w-auto object-contain"
            />
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`
                relative px-5 py-2.5 rounded-lg font-medium text-sm tracking-wide
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-dark
                ${activeTab === 'dashboard'
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-mint hover:text-white hover:bg-brand-navy'
                }
              `}
              aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`
                relative px-5 py-2.5 rounded-lg font-medium text-sm tracking-wide
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-dark
                ${activeTab === 'transactions'
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-mint hover:text-white hover:bg-brand-navy'
                }
              `}
              aria-current={activeTab === 'transactions' ? 'page' : undefined}
            >
              Transactions
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container-custom py-8 lg:py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
            <div className="w-16 h-16 spinner mb-6" />
            <h3 className="text-xl font-bold text-brand-navy mb-2">Loading Financial Data</h3>
            <p className="text-sm text-brand-navy text-opacity-70">
              Fetching your transactions from the database...
            </p>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="card bg-red-50 border-red-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-900 mb-2">Connection Error</h3>
                  <p className="text-base text-red-700 mb-4">{error}</p>
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-sm text-red-800 mb-2 font-medium">
                      Please check your configuration:
                    </p>
                    <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                      <li>Supabase credentials are correct in .env file</li>
                      <li>Database schema has been created</li>
                      <li>Data has been imported to the transactions table</li>
                    </ul>
                  </div>
                  <button 
                    onClick={fetchTransactions}
                    className="btn btn-danger mt-4"
                  >
                    <Loader2 size={18} />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Conditional rendering based on active tab */}
            {activeTab === 'dashboard' ? (
              <Dashboard transactions={transactions} />
            ) : (
              <TransactionList transactions={transactions} />
            )}
            
            {/* Floating AI Chatbot */}
            <ChatbotPopup transactions={transactions} />
          </div>
        )}
      </main>

      {/* Footer with Brand Colors */}
      <footer className="border-t border-brand-navy border-opacity-20 bg-white mt-16">
        <div className="container-custom py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* About Section */}
            <div>
              <h3 className="text-sm font-bold text-brand-dark mb-3 uppercase tracking-wide">About</h3>
              <p className="text-sm text-brand-navy leading-relaxed mb-3">
                An intelligent financial management system that combines real-time data visualization with AI-powered insights.
              </p>
              <div className="space-y-2 text-xs text-brand-navy text-opacity-80">
                <p className="flex items-start gap-2">
                  <span className="text-brand-primary font-bold">•</span>
                  <span>Ask questions in natural language about your finances</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-brand-primary font-bold">•</span>
                  <span>Get instant AI-powered analysis and recommendations</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-brand-primary font-bold">•</span>
                  <span>View interactive charts showing income, expenses, and trends</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-brand-primary font-bold">•</span>
                  <span>Click the AI chat button to start asking questions</span>
                </p>
              </div>
            </div>

            {/* Technology Stack */}
            <div>
              <h3 className="text-sm font-bold text-brand-dark mb-3 uppercase tracking-wide">Technology Stack</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                  <span className="text-brand-navy text-opacity-80">Frontend: React 18 + Vite</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-brand-navy"></span>
                  <span className="text-brand-navy text-opacity-80">Backend: Supabase (PostgreSQL)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-brand-mint"></span>
                  <span className="text-brand-navy text-opacity-80">AI: Google Gemini API</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                  <span className="text-brand-navy text-opacity-80">UI: Tailwind CSS + Recharts</span>
                </div>
              </div>
            </div>

            {/* Data Source */}
            <div>
              <h3 className="text-sm font-bold text-brand-dark mb-3 uppercase tracking-wide">Data Source</h3>
              <p className="text-sm text-brand-navy text-opacity-80 mb-3">
                Synthetic accounting data generated for demonstration purposes.
              </p>
              <a 
                href="https://github.com/AbrarNafij/accounting-data-generator/blob/main/synthetic_journal_entries.csv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-brand-primary hover:text-brand-navy font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-brand-navy border-opacity-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Project Info */}
              <div className="text-center md:text-left">
                <h4 className="text-sm font-bold text-brand-dark mb-1">AI Accounting Assistant</h4>
                <p className="text-xs text-brand-navy text-opacity-70">
                  An intelligent financial management system leveraging AI for real-time insights and analytics
                </p>
              </div>
              
              {/* Author Info */}
              <div className="text-center md:text-right">
                <p className="text-xs text-brand-navy text-opacity-70">
                  <span className="font-semibold text-brand-dark">Developed by:</span> Eng. Reem Osama
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
