# AdibFin - System Architecture

## Overview

AdibFin is a **Next.js full stack** personal finance and investment tracking system. The system follows a transaction-first design where all money movements are recorded as transactions, and investment meaning is derived through cashflow records.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **UI**: Tailwind CSS + shadcn/ui (Mobile-first responsive design)
- **Validation**: Zod
- **Deployment**: Vercel (Free tier - perfect for single user)
- **Access**: Mobile browser + Desktop browser (responsive design)

---

## Folder Structure

```
AdibFin/
│
├── README.md                      # Project overview
├── TODO.md                        # Complete task list
├── ARCHITECTURE.md                # This file
│
├── prisma/                        # Database schema & migrations
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Migration files
│   └── seed.ts                   # Seed data (system categories)
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth layout group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/         # Main app layout group
│   │   │   ├── layout.tsx       # Dashboard layout with nav
│   │   │   ├── page.tsx         # Dashboard home
│   │   │   │
│   │   │   ├── accounts/
│   │   │   │   ├── page.tsx     # Accounts list
│   │   │   │   └── new/
│   │   │   │       └── page.tsx # Create account
│   │   │   │
│   │   │   ├── transactions/
│   │   │   │   ├── page.tsx     # Transactions list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx # Add transaction
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Edit transaction
│   │   │   │
│   │   │   ├── investments/
│   │   │   │   ├── page.tsx     # Investments list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx # Create investment
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx # Investment details
│   │   │   │       └── returns/
│   │   │   │           └── page.tsx # Add return
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── monthly/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── yearly/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── investments/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts  # NextAuth config
│   │   │   │
│   │   │   ├── accounts/
│   │   │   │   ├── route.ts      # GET, POST
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # GET, PUT, DELETE
│   │   │   │
│   │   │   ├── transactions/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── investments/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── returns/
│   │   │   │       │   └── route.ts
│   │   │   │       └── close/
│   │   │   │           └── route.ts
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   └── reports/
│   │   │       ├── monthly/
│   │   │       │   └── route.ts
│   │   │       ├── yearly/
│   │   │       │   └── route.ts
│   │   │       └── investments/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── accounts/
│   │   │   ├── AccountCard.tsx
│   │   │   ├── AccountForm.tsx
│   │   │   └── AccountList.tsx
│   │   │
│   │   ├── transactions/
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── TransactionItem.tsx
│   │   │
│   │   ├── investments/
│   │   │   ├── InvestmentCard.tsx
│   │   │   ├── InvestmentForm.tsx
│   │   │   ├── ReturnForm.tsx
│   │   │   └── CashflowTimeline.tsx
│   │   │
│   │   ├── reports/
│   │   │   ├── MonthlyChart.tsx
│   │   │   ├── InvestmentSummary.tsx
│   │   │   └── ExpenseBreakdown.tsx
│   │   │
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   │
│   ├── lib/                      # Utility functions & configs
│   │   ├── db.ts                 # Prisma client instance
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── utils.ts              # Helper functions
│   │   ├── validations.ts        # Zod schemas
│   │   └── calculations.ts       # Balance, ROI calculations
│   │
│   ├── services/                 # Business logic
│   │   ├── accountService.ts     # Account operations
│   │   ├── transactionService.ts # Transaction operations
│   │   ├── investmentService.ts  # Investment logic
│   │   └── reportService.ts      # Report generation
│   │
│   ├── types/                    # TypeScript types
│   │   └── index.ts              # All type definitions
│   │
│   └── middleware.ts             # Next.js middleware (auth)
│
├── public/                       # Static files
│   ├── images/
│   └── icons/
│
├── .env.example                  # Environment variables template
├── .gitignore
├── next.config.js                # Next.js configuration
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## Data Flow Architecture

### 1. Normal Transaction Flow (Expense/Income)

```
UI Page (Server Component)
         ↓
Form Submission → Server Action / API Route
         ↓
  Transaction Service (validates)
         ↓
    Prisma (Database)
         ├─ Create transaction record
         └─ Update account balance
         ↓
    Revalidate path
         ↓
    UI automatically updates
```

### 2. Investment Creation Flow

```
Investment Form → API Route /api/investments
         ↓
  Investment Service
         ├─ Create investment_project (OPEN)
         ├─ Create transaction (EXPENSE)
         ├─ Create cashflow (INVEST_PRINCIPAL)
         └─ Update account balance via Prisma transaction
         ↓
    Return project details
         ↓
    Redirect to investment details page
```

### 3. Investment Return Flow

```
Return Form → POST /api/investments/:id/returns
         ↓
  Investment Service
         ├─ Validate project exists and is OPEN
         ├─ Create transaction (INCOME) for capital
         ├─ Create cashflow (RETURN_OF_CAPITAL)
         ├─ Create transaction (INCOME) for profit
         ├─ Create cashflow (PROFIT)
         ├─ Check if total returned == total invested
         ├─ If yes, mark project CLOSED
         └─ All in single Prisma transaction
         ↓
    Revalidate & redirect
         ↓
    UI shows updated investment
```

### 4. Report Generation Flow

```
Report Page (Server Component)
         ↓
  Report Service (runs on server)
         ├─ Query transactions for date range
         ├─ Group by category
         ├─ Calculate totals (INCOME vs EXPENSE)
         ├─ Query investment cashflows
         └─ Compute ROI for investments
         ↓
  Return data as props
         ↓
  Render charts/tables (client components)
```

---

## Database Schema (PostgreSQL)

### Entity Relationship

```
users
  ├─── accounts (1:N)
  ├─── transactions (1:N)
  ├─── investment_projects (1:N)
  └─── categories (1:N)

accounts
  └─── transactions (1:N)

categories
  └─── transactions (1:N)

investment_projects
  ├─── transactions (1:N)
  └─── investment_cashflows (1:N)

transactions
  ├─── investment_cashflows (1:1)
  ├─── account (N:1)
  ├─── category (N:1)
  └─── investment_project (N:1, nullable)
```

### Key Constraints

1. `transactions.amount` must be > 0
2. `transactions.type` must be ENUM('EXPENSE', 'INCOME')
3. `categories.is_system = true` prevents deletion
4. `investment_projects.status` must be ENUM('OPEN', 'CLOSED')
5. `investment_cashflows.flow_type` must be ENUM('INVEST_PRINCIPAL', 'RETURN_OF_CAPITAL', 'PROFIT', 'LOSS')

---

## API Routes (Next.js App Router)

### Authentication
```
/api/auth/[...nextauth] - NextAuth.js handles login/register
```

### Accounts
```
GET    /api/accounts          - List all accounts
POST   /api/accounts          - Create account
GET    /api/accounts/[id]     - Get account details
PUT    /api/accounts/[id]     - Update account
DELETE /api/accounts/[id]     - Delete account
```

### Transactions
```
GET    /api/transactions          - List (filter: type, date range)
POST   /api/transactions          - Create transaction
GET    /api/transactions/[id]     - Get details
PUT    /api/transactions/[id]     - Update
DELETE /api/transactions/[id]     - Delete
```

### Investments
```
GET    /api/investments              - List (filter: status)
POST   /api/investments              - Create investment
GET    /api/investments/[id]         - Get details
PUT    /api/investments/[id]         - Update
POST   /api/investments/[id]/returns - Add return
POST   /api/investments/[id]/close   - Close investment
```

### Reports
```
GET    /api/reports/monthly?date=2024-01
GET    /api/reports/yearly?year=2024
GET    /api/reports/investments
```

### Response Format

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }
```

---

## Security

1. **Authentication**: NextAuth.js with session
2. **Authorization**: Middleware checks auth on all routes
3. **Input Validation**: Zod schemas validate all inputs
4. **SQL Injection**: Prisma ORM prevents SQL injection
5. **Password Security**: NextAuth handles hashing
6. **HTTPS**: Enforced in production (Vercel)

---

## Deployment

### Vercel Free Tier (Perfect for Single User!)

**What you get FREE on Vercel:**
- Unlimited deployments
- 100GB bandwidth/month (more than enough for personal use)
- Serverless functions
- Automatic HTTPS
- GitHub integration with auto-deploy
- No credit card required

```
Next.js App → Vercel (Free)
       ↓
PostgreSQL → Neon/Supabase (Free tier)
```

- **Frontend & API**: Vercel free tier (automatic from GitHub)
- **Database**: Neon (3GB free) or Supabase (500MB free)
- **Environment Variables**: Set in Vercel dashboard
- **Custom Domain**: Supported on free tier (optional)

### Local Development

```bash
npm run dev                 # Start dev server (localhost:3000)
npx prisma migrate dev      # Run migrations
npx prisma studio           # View database GUI
```

### Mobile Browser Access

The app will be fully responsive and work perfectly on:
- Mobile browsers (Chrome, Safari, Firefox)
- Tablet browsers
- Desktop browsers

No app store, no installation needed - just visit the URL!

---

## Development Workflow

1. **Schema Changes**
   - Update `prisma/schema.prisma`
   - Run `npx prisma migrate dev`
   - Prisma Client auto-updates

2. **Add Feature**
   - Create API route in `src/app/api/`
   - Add service logic in `src/services/`
   - Create UI page in `src/app/(dashboard)/`
   - Build components in `src/components/`

3. **Deploy**
   - Push to GitHub
   - Vercel auto-deploys
   - Run migrations on production DB

---

## Key Next.js Patterns

### Server Components (Default)
- Fetch data directly from database
- No API route needed for read operations
- Faster performance

### Client Components
- Forms with user interaction
- Charts and interactive UI
- Use `'use client'` directive

### Server Actions
- Form submissions without API routes
- Can be used for mutations
- Type-safe with TypeScript

---

## Mobile-First Responsive Design

### Design Principles
- **Mobile-first**: Design for mobile, enhance for desktop
- **Touch-friendly**: Large tap targets (min 44px)
- **Readable**: Appropriate font sizes (16px+ for body text)
- **Fast**: Optimized images and minimal JS

### Tailwind Breakpoints
```typescript
// Mobile-first approach
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops
```

### Responsive Components
- Stack vertically on mobile, grid on desktop
- Collapsible sidebar/navigation on mobile
- Bottom sheet modals on mobile, centered modals on desktop
- Swipeable cards on mobile
- Touch-friendly forms and buttons

### PWA Features (Optional)
- Add to home screen capability
- Offline support with service workers
- App-like experience on mobile browsers

---

## Testing Strategy

- **Unit Tests**: Vitest for services
- **Integration Tests**: Test API routes
- **E2E Tests**: Playwright (optional for personal use)

---

## Conclusion

This Next.js architecture ensures:
- **Simple**: One codebase, no separate backend/frontend
- **Type-safe**: TypeScript everywhere
- **Fast**: Server components, optimized builds
- **Secure**: NextAuth + middleware
- **Easy Deploy**: Push to GitHub → Auto-deploy on Vercel
- **Transaction-first**: Every taka traceable forever
