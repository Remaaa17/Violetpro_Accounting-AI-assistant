# Finora AI - Accounting Assistant

A modern accounting system with an intelligent AI assistant powered by Groq AI that can analyze your financial data and answer questions in natural language.

## Features

- **Interactive Dashboard**: View total income, expenses, balance, and transaction count
- **Visual Analytics**: Multiple chart types (line, bar, pie, area charts)
- **AI Chat Assistant**: Natural language queries with concise, clear responses
- **Smart Analysis**: AI reads and analyzes your accounting data
- **Responsive Design**: Professional fintech UI on all devices
- **Custom Branding**: Finora AI brand colors and logo

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS 3
- **Backend**: Supabase (PostgreSQL)
- **AI**: Groq AI (qwen/qwen3.8-27b model - completely free)
- **Charts**: Recharts
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the setup script from `supabase/schema.sql`
3. Copy your project URL and anon key

### 3. Get Groq API Key (Free - No Credit Card)

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Create an API key
4. Copy the key (starts with `gsk_`)

### 4. Configure Environment Variables

Create a \`.env\` file in the root directory:

\`\`\`env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
\`\`\`

**Important:** All environment variables must use the `VITE_` prefix.

### 5. Import Data to Supabase

1. Go to your Supabase project dashboard
2. Navigate to Table Editor > transactions
3. Click "Insert" > "Import data from CSV"
4. Upload the \`synthetic_journal_entries.csv\` file
5. Map the columns correctly

### 6. Run the Application

\`\`\`bash
npm run dev
\`\`\`

The app will open at \`http://localhost:3000\`

## AI Assistant Examples

### Basic Queries
- "What are my total expenses?"
- "What is my current balance?"
- "How much income do I have?"
- "Show me expense breakdown"

### Category Analysis
- "How much did I spend on salaries?"
- "What's my largest expense category?"
- "Show me rent expenses"
- "How much interest income did I earn?"

### Financial Insights
- "Am I profitable?"
- "What's my profit margin?"
- "How do expenses compare to income?"
- "Which expense should I reduce?"

### Natural Language (with typos)
- "whay is my totl expnses?" - Works!
- "shw me balanc" - Understands!
- "wat categry has highst expnse?" - Smart!

## Project Structure

\`\`\`
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Financial metrics dashboard
│   │   ├── StatCard.jsx           # Reusable stat cards
│   │   ├── TransactionList.jsx    # Transaction table
│   │   └── ChatbotPopup.jsx       # AI chat interface
│   ├── services/
│   │   ├── supabase.js            # Supabase client
│   │   ├── ai.js                  # Groq AI integration
│   │   └── systemPrompt.js        # AI configuration
│   ├── utils/
│   │   └── dataProcessor.js       # Financial calculations
│   ├── assets/
│   │   └── logo.png               # Finora AI logo
│   ├── App.jsx                    # Main app
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Styles
├── supabase/
│   └── schema.sql                 # Database schema
├── package.json
└── README.md
\`\`\`

## Security Notes

- Never commit your \`.env\` file
- API keys are stored as environment variables
- Use Supabase Row Level Security (RLS) for production
- The AI assistant only has read access to your data
- **Compressed archive excludes `.env`** - Your API keys are safe

## Key Implementation Details

### Unified Data Source
- Dashboard and AI use the **same calculation function** (`processTransactions()`)
- Guarantees identical numbers in both places
- No discrepancies between displayed metrics and AI responses

### AI Response Format
- **Concise answers**: 100-150 words maximum
- **Structure**: Direct answer → 4-5 bullet points → Brief tip
- **Simple language**: No complex accounting jargon
- **Spelling tolerance**: Understands queries with typos

### Data Processing
- **Transaction categorization**: Automatically identifies income vs expenses
- **Monthly aggregation**: Calculates trends for charts
- **Real-time metrics**: Live updates from Supabase

## Presentation Date

**Deadline**: October 27, 2026  
**Presentation**: 10:30 AM (5-10 minutes)

## License

MIT License - Feel free to use this for your internship presentation!
