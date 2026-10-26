// Groq AI API Integration
import { getSystemPrompt } from './systemPrompt'
import { processTransactions } from '../utils/dataProcessor'

const apiKey = import.meta.env.VITE_GROQ_API_KEY

if (!apiKey) {
  console.error('Missing Groq API key')
}

export const analyzeWithAI = async (question, transactionsData) => {
  try {
    const url = 'https://api.groq.com/openai/v1/chat/completions'
    
    console.log('API Key present:', !!apiKey)
    console.log('Transaction data length:', transactionsData.length)
    
    // Use the EXACT same calculation logic as the Dashboard
    const metrics = processTransactions(transactionsData)
    
    // Get recent transaction samples for context
    const recentTransactions = transactionsData.slice(0, 10).map(t => ({
      date: t.date,
      type: t.transaction_type,
      amount: parseFloat(t.amount),
      narration: t.narration.substring(0, 60)
    }))
    
    // Prepare financial data for system prompt using SAME metrics as Dashboard
    const financialData = {
      totalTransactions: metrics.transactionCount,
      totalIncome: metrics.totalIncome,
      totalExpenses: metrics.totalExpenses,
      netBalance: metrics.currentBalance,
      expensesByCategory: metrics.expenseByCategory,
      incomeByCategory: metrics.incomeByCategory
    }
    
    // Get comprehensive system prompt
    const systemPrompt = getSystemPrompt(financialData)
    
    // Add recent transactions and additional context
    const contextWithTransactions = `${systemPrompt}

# ADDITIONAL CONTEXT

Monthly Trends (Last 12 months):
${JSON.stringify(metrics.monthlyData)}

Recent Transaction Samples (Last 10):
${JSON.stringify(recentTransactions)}

# DEEPER ANALYSIS CAPABILITIES

You have access to:
- Complete financial summary with exact calculations
- Category-wise breakdowns with percentages
- Monthly trend data for pattern recognition
- Recent transactions for specific queries

When answering:
- Provide numerical comparisons (percentages, ratios)
- Identify trends and patterns from monthly data
- Explain financial implications
- Give context about what's normal or concerning
- Suggest areas for improvement when relevant`
    
    const userPrompt = `User Question: ${question}

Provide a clear, insightful response with bullet points.`

    console.log('Calling Groq API...')
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: contextWithTransactions },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1200,
        top_p: 0.95,
        stream: false
      })
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Groq API Error:', errorData)
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log('Response received')
    
    let text = data.choices?.[0]?.message?.content || 'No response generated'
    
    // Clean up any markdown formatting that slips through
    text = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/`{1,3}/g, '')
      .trim()
    
    return text
  } catch (error) {
    console.error('Error calling Groq API:', error)
    console.error('Error details:', error.message)
    throw new Error(`Failed to get AI response: ${error.message}`)
  }
}

