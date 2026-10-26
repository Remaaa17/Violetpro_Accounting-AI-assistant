# Technology Stack

## Build System
- **Bundler**: Vite 5.4.2
- **Package Manager**: npm
- **Development Server Port**: 3000 (auto-opens in browser)

## Frontend Stack
- **Framework**: React 18.3.1
- **Language**: JavaScript (JSX)
- **Module System**: ES Modules (`"type": "module"` in package.json)
- **UI Library**: Lucide React (icons)
- **Charts**: Recharts 2.12.7
- **Styling**: CSS (inline styles + CSS variables in index.css)

## Backend & Services
- **Database**: Supabase (PostgreSQL)
  - Client: @supabase/supabase-js 2.45.4
- **AI**: Google Gemini API
  - Package: @google/generative-ai 0.21.0
  - Model: gemini-flash-latest
  - Access: Direct REST API calls

## Environment Configuration
Required environment variables in `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

All environment variables must use `VITE_` prefix to be accessible in the app via `import.meta.env`.

## Common Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint on src files
```

### Database Setup
1. Run `supabase/schema.sql` in Supabase SQL Editor
2. Import `synthetic_journal_entries.csv` or `transactions_import.csv` via Supabase Table Editor

## Code Conventions

### API Integration
- **Supabase**: Use the exported `supabase` client from `src/services/supabase.js`
- **Gemini**: Use `analyzeWithAI(question, transactionsData)` from `src/services/gemini.js`
- All API calls use async/await with try/catch error handling

### Environment Variable Access
Always use `import.meta.env.VITE_*` (Vite convention, not `process.env`)

### Error Handling Pattern
```javascript
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

try {
  setLoading(true)
  const { data, error } = await supabase.from('table').select('*')
  if (error) throw error
  setData(data || [])
} catch (err) {
  console.error('Error message:', err)
  setError(err.message)
} finally {
  setLoading(false)
}
```

## Styling Approach
- CSS variables defined in `src/index.css` for theming
- Inline styles using JavaScript objects (React convention in this project)
- Responsive design via container classes
- No CSS modules or styled-components

## Data Fetching
- Supabase queries use `.select()`, `.from()`, `.order()` methods
- Always order transactions by date descending
- Row Level Security (RLS) enabled with public read access policy
