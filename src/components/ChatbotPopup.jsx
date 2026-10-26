import { useState } from 'react'
import { analyzeWithAI } from '../services/ai'
import { MessageSquare, Send, X, Loader2, DollarSign, PieChart, TrendingUp } from 'lucide-react'

function ChatbotPopup({ transactions }) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'Hello! I\'m your AI Accounting Assistant. Ask me anything about your financial data!'
    }
  ])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim() || loading) return

    const userMessage = question.trim()
    setQuestion('')
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Pass raw transactions array to AI (not the prepareAIContext summary)
      const response = await analyzeWithAI(userMessage, transactions)
      
      // Add assistant response
      setMessages(prev => [...prev, { type: 'assistant', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`
      }])
    } finally {
      setLoading(false)
    }
  }

  const suggestedQuestions = [
    { icon: <DollarSign size={18} />, text: 'What are my total expenses?' },
    { icon: <PieChart size={18} />, text: 'What is my current balance?' },
    { icon: <TrendingUp size={18} />, text: 'Which category has the highest expenses?' }
  ]

  return (
    <>
      {/* Floating Action Button (FAB) - Fitts' Law: Large target, corner positioned */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fab group"
          aria-label="Open AI Assistant"
        >
          <MessageSquare size={28} className="transition-transform duration-300 group-hover:scale-110" />
          
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-soft">
            AI
          </span>
        </button>
      )}

      {/* Popup Chat Window */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="modal-overlay"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Chat Container */}
          <div className="fixed bottom-6 right-6 w-full max-w-md h-[600px] max-h-[calc(100vh-3rem)] z-50 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-hard flex flex-col h-full overflow-hidden border border-brand-navy border-opacity-20">
              
              {/* Header with Brand Colors */}
              <div className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between border-b-2 border-brand-primary">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white">
                      Finora AI Assistant
                    </h3>
                    <p className="text-xs text-brand-mint font-medium">
                      {loading ? 'Analyzing...' : 'Online'}
                    </p>
                  </div>
                </div>
                
                {/* Close Button - Fitts' Law: Large clickable area */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-lg hover:bg-brand-navy transition-all duration-200 flex items-center justify-center focus-visible-ring"
                  aria-label="Close chat"
                >
                  <X size={22} className="text-white" />
                </button>
              </div>

              {/* Chat Messages - Custom Scrollbar */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-brand-light to-white px-4 py-4 space-y-4 custom-scrollbar">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`chat-bubble ${message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Loading Indicator */}
                {loading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="chat-bubble chat-bubble-assistant">
                      <div className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin text-brand-primary" />
                        <span className="text-sm text-brand-navy">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Questions */}
              {messages.length === 1 && !loading && (
                <div className="px-4 py-3 bg-white border-t border-brand-navy border-opacity-20">
                  <p className="text-xs font-bold text-brand-dark mb-2 uppercase tracking-wide">
                    Try asking:
                  </p>
                  <div className="space-y-2">
                    {suggestedQuestions.map((q, index) => (
                      <button
                        key={index}
                        onClick={() => setQuestion(q.text)}
                        className="w-full text-left px-3 py-2.5 text-sm bg-brand-light hover:bg-brand-mint hover:bg-opacity-40 border border-brand-navy border-opacity-10 hover:border-brand-primary hover:border-opacity-50 rounded-lg transition-all duration-200 flex items-center gap-2 group"
                      >
                        <span className="text-brand-primary group-hover:scale-110 transition-transform">{q.icon}</span>
                        <span className="text-brand-dark font-medium">
                          {q.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form - Enhanced UX */}
              <form onSubmit={handleSubmit} className="px-4 py-4 bg-white border-t border-brand-navy border-opacity-20">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about your finances..."
                    disabled={loading}
                    className="input flex-1 text-sm"
                    autoFocus
                  />
                  
                  {/* Send Button - Fitts' Law: Larger target */}
                  <button
                    type="submit"
                    disabled={!question.trim() || loading}
                    className={`btn btn-primary min-w-[44px] min-h-[44px] p-0 ${
                      question.trim() && !loading ? 'hover:scale-105' : 'opacity-50'
                    }`}
                    aria-label="Send message"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
                
                {/* Character count for UX feedback */}
                {question.length > 100 && (
                  <p className="text-xs text-brand-navy text-opacity-60 mt-2">
                    {question.length} characters
                  </p>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ChatbotPopup
