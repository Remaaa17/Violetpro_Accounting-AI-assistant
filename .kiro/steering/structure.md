# Project Structure

## Root Layout
```
violetpro_Internship/
├── src/                    # Main application source code
├── supabase/              # Database schema and migrations
├── accounting-ai-assistant/ # Separate sub-project (appears unused in main app)
├── .env                   # Environment variables (never commit)
├── .env.example           # Template for environment setup
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite bundler configuration
└── index.html             # HTML entry point
```

## Source Code Organization (`src/`)
```
src/
├── components/            # React UI components
│   ├── Dashboard.jsx      # Main dashboard with financial metrics
│   ├── StatCard.jsx       # Reusable stat display cards
│   ├── TransactionList.jsx # Transaction table/list view
│   ├── AIAssistant.jsx    # AI chat interface component
│   ├── ChatbotPopup.jsx   # Floating chatbot UI
│   └── UIPreview.jsx      # Preview/demo mode component
│
├── services/              # External API integrations
│   ├── supabase.js        # Supabase client and DB helpers
│   └── gemini.js          # Google Gemini AI integration
│
├── utils/                 # Helper functions and utilities
│   └── dataProcessor.js   # Transaction data processing logic
│
├── App.jsx                # Root application component
├── main.jsx               # Application entry point (renders App)
└── index.css              # Global styles and CSS variables
```

## Database Structure (`supabase/`)
- **schema.sql**: Complete database setup including:
  - `transactions` table with snake_case columns
  - Indexes for performance (date, type, amount)
  - Row Level Security (RLS) policies
  - Views for income/expense transactions
  - `get_financial_summary()` function

## Data Files
- **synthetic_journal_entries.csv**: Sample accounting data for import
- **transactions_import.csv**: Alternative transaction dataset

## Documentation Files
Project includes several markdown guides:
- `README.md`: Main setup and usage guide
- `SETUP_GUIDE.md`: Detailed setup instructions
- `QUICK_START.md`: Quick start guide
- `REQUIREMENTS_CHECKLIST.md`: Project requirements tracking
- `CSV_IMPORT_GUIDE.md`: CSV data import instructions
- `DATA_MAPPING.md`: Data structure mapping reference
- `UI_PREVIEW_GUIDE.md`: UI preview mode documentation
- `FIX_SUPABASE_IMPORT.md`: Troubleshooting guide

## Component Architecture Conventions

### Component Files
- Each component is a separate `.jsx` file in `src/components/`
- Use functional components with React hooks (useState, useEffect)
- Export as default: `export default ComponentName`

### Data Flow Pattern
1. **App.jsx** fetches transactions from Supabase on mount
2. Transactions passed as props to child components
3. Components are presentation-focused (receive data, display UI)
4. Services handle all external API calls

### Component Responsibilities
- **App.jsx**: Main layout, data fetching, loading/error states
- **Dashboard.jsx**: Aggregate financial metrics display
- **TransactionList.jsx**: Transaction data table
- **ChatbotPopup.jsx**: AI chatbot overlay/modal
- **StatCard.jsx**: Reusable metric card (used by Dashboard)

## Service Layer Pattern
Services in `src/services/` are:
- Pure JavaScript modules (not React components)
- Export client instances and helper functions
- Handle authentication, API configuration, and error handling
- Used by components via imports: `import { supabase } from './services/supabase'`

## Environment Configuration
- **Never commit** `.env` to version control
- Use `.env.example` as template for required variables
- All Vite env vars must start with `VITE_` prefix
- Access via `import.meta.env.VITE_*` in code

## CSS Architecture
- Global styles in `src/index.css` define CSS custom properties:
  - Color scheme: `--primary`, `--text-primary`, `--bg-card`, etc.
  - Spacing and shadows: `--shadow`, container classes
- Component styles use inline style objects referencing CSS variables
- Responsive utilities via container classes

## Preview Mode
The app supports a `PREVIEW_MODE` flag in App.jsx to display UI without database connection (useful for demos/testing).
