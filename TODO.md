# AdibFin - Complete TODO List

## Phase 1: Project Setup & Foundation

### 1.1 Next.js Project Initialization
- [ ] Initialize Next.js 14+ project with TypeScript
- [ ] Setup Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Setup ESLint and Prettier
- [ ] Configure `.gitignore`
- [ ] Create `.env.example` file

### 1.2 Database Setup
- [ ] Install Prisma
- [ ] Setup PostgreSQL (local or Neon/Supabase)
- [ ] Configure Prisma connection
- [ ] Create Prisma client instance in `src/lib/db.ts`

---

## Phase 2: Database Schema (Prisma)

### 2.1 Prisma Schema Design
- [ ] Define `User` model
- [ ] Define `Account` model
- [ ] Define `Category` model
- [ ] Define `Transaction` model
- [ ] Define `InvestmentProject` model
- [ ] Define `InvestmentCashflow` model
- [ ] Add enums (TransactionType, AccountType, ProjectStatus, FlowType)
- [ ] Add relations between models
- [ ] Add constraints (amount > 0, unique constraints)
- [ ] Add indexes for performance

### 2.2 Database Migration
- [ ] Run initial migration (`npx prisma migrate dev`)
- [ ] Verify schema in Prisma Studio
- [ ] Create seed script (`prisma/seed.ts`)
- [ ] Seed system categories
- [ ] Add seed script to `package.json`

---

## Phase 3: Authentication (NextAuth.js)

### 3.1 NextAuth Setup
- [ ] Install NextAuth.js
- [ ] Create `src/lib/auth.ts` config
- [ ] Create `/api/auth/[...nextauth]/route.ts`
- [ ] Configure credentials provider
- [ ] Setup session strategy
- [ ] Add middleware for protected routes

### 3.2 Auth Pages
- [ ] Create login page `/app/(auth)/login/page.tsx`
- [ ] Create registration page `/app/(auth)/register/page.tsx`
- [ ] Add auth layout with styling
- [ ] Implement login form with validation
- [ ] Implement register form with validation

---

## Phase 4: Core Business Logic (Services)

### 4.1 Account Service
- [ ] Create `src/services/accountService.ts`
- [ ] Implement create account function
- [ ] Implement update account function
- [ ] Implement delete account function (with validations)
- [ ] Implement get account balance calculation
- [ ] Implement list accounts function

### 4.2 Transaction Service
- [ ] Create `src/services/transactionService.ts`
- [ ] Implement create transaction function
- [ ] Implement update account balance on transaction
- [ ] Implement update transaction function
- [ ] Implement delete transaction (reverse balance)
- [ ] Implement list transactions with filters
- [ ] Add validation (amount > 0, account exists, etc.)

### 4.3 Investment Service
- [ ] Create `src/services/investmentService.ts`
- [ ] Implement create investment (project + transaction + cashflow)
- [ ] Implement add return (capital + profit logic)
- [ ] Implement close investment (validate capital fully returned)
- [ ] Implement get investment details with cashflows
- [ ] Use Prisma transactions for atomic operations

### 4.4 Report Service
- [ ] Create `src/services/reportService.ts`
- [ ] Implement monthly report (group by category)
- [ ] Implement yearly report
- [ ] Implement investment performance report
- [ ] Calculate ROI for investments
- [ ] Implement date range filtering

---

## Phase 5: API Routes

### 5.1 Account API Routes
- [ ] Create `/api/accounts/route.ts` (GET, POST)
- [ ] Create `/api/accounts/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Add Zod validation schemas
- [ ] Implement error handling
- [ ] Test with Postman/Thunder Client

### 5.2 Transaction API Routes
- [ ] Create `/api/transactions/route.ts` (GET, POST)
- [ ] Create `/api/transactions/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Add query filters (type, date range, account)
- [ ] Add Zod validation
- [ ] Test endpoints

### 5.3 Investment API Routes
- [ ] Create `/api/investments/route.ts` (GET, POST)
- [ ] Create `/api/investments/[id]/route.ts` (GET, PUT)
- [ ] Create `/api/investments/[id]/returns/route.ts` (POST)
- [ ] Create `/api/investments/[id]/close/route.ts` (POST)
- [ ] Add validations and error handling

### 5.4 Report API Routes
- [ ] Create `/api/reports/monthly/route.ts`
- [ ] Create `/api/reports/yearly/route.ts`
- [ ] Create `/api/reports/investments/route.ts`
- [ ] Add query parameters for date filtering

### 5.5 Category API Route
- [ ] Create `/api/categories/route.ts` (GET, POST)
- [ ] Prevent deletion of system categories

---

## Phase 6: UI Components

### 6.1 shadcn/ui Setup
- [ ] Install shadcn/ui components (button, input, card, dialog, etc.)
- [ ] Create custom components in `src/components/ui/`
- [ ] Setup theme and styling
- [ ] Configure mobile-first responsive design
- [ ] Set up touch-friendly tap targets (min 44px)

### 6.2 Layout Components
- [ ] Create `Navbar.tsx` (responsive: hamburger on mobile, full nav on desktop)
- [ ] Create `Sidebar.tsx` (collapsible on mobile, fixed on desktop)
- [ ] Create dashboard layout in `/app/(dashboard)/layout.tsx`
- [ ] Add logout button
- [ ] Implement bottom navigation for mobile (optional)
- [ ] Add mobile-friendly menu drawer

### 6.3 Account Components
- [ ] Create `AccountCard.tsx` to display account info
- [ ] Create `AccountForm.tsx` for add/edit
- [ ] Create `AccountList.tsx` to show all accounts

### 6.4 Transaction Components
- [ ] Create `TransactionForm.tsx` (expense/income)
- [ ] Create `TransactionList.tsx` with filters
- [ ] Create `TransactionItem.tsx` for list display
- [ ] Add category and account selectors

### 6.5 Investment Components
- [ ] Create `InvestmentCard.tsx`
- [ ] Create `InvestmentForm.tsx` for new investment
- [ ] Create `ReturnForm.tsx` for adding returns
- [ ] Create `CashflowTimeline.tsx` to visualize cashflows

### 6.6 Report Components
- [ ] Create `MonthlyChart.tsx` (expense/income chart)
- [ ] Create `ExpenseBreakdown.tsx` (pie chart by category)
- [ ] Create `InvestmentSummary.tsx` (ROI, profit summary)

---

## Phase 7: Pages (UI)

### 7.1 Dashboard Page
- [ ] Create `/app/(dashboard)/page.tsx`
- [ ] Show account balances summary
- [ ] Display recent transactions
- [ ] Show monthly expense/income stats
- [ ] Add quick action buttons

### 7.2 Account Pages
- [ ] Create `/app/(dashboard)/accounts/page.tsx` (list)
- [ ] Create `/app/(dashboard)/accounts/new/page.tsx` (create)
- [ ] Implement account CRUD operations

### 7.3 Transaction Pages
- [ ] Create `/app/(dashboard)/transactions/page.tsx` (list with filters)
- [ ] Create `/app/(dashboard)/transactions/new/page.tsx` (add)
- [ ] Create `/app/(dashboard)/transactions/[id]/page.tsx` (edit)
- [ ] Add delete functionality with confirmation

### 7.4 Investment Pages
- [ ] Create `/app/(dashboard)/investments/page.tsx` (list with tabs: Open/Closed)
- [ ] Create `/app/(dashboard)/investments/new/page.tsx` (create)
- [ ] Create `/app/(dashboard)/investments/[id]/page.tsx` (details)
- [ ] Create `/app/(dashboard)/investments/[id]/returns/page.tsx` (add return)
- [ ] Show cashflow timeline on details page

### 7.5 Report Pages
- [ ] Create `/app/(dashboard)/reports/monthly/page.tsx`
- [ ] Create `/app/(dashboard)/reports/yearly/page.tsx`
- [ ] Create `/app/(dashboard)/reports/investments/page.tsx`
- [ ] Add date pickers and filters
- [ ] Display charts and summaries

### 7.6 Settings Page
- [ ] Create `/app/(dashboard)/settings/page.tsx`
- [ ] Add profile update form
- [ ] Add password change option

---

## Phase 8: Validation & Error Handling

### 8.1 Zod Schemas
- [ ] Create validation schemas in `src/lib/validations.ts`
- [ ] Account validation schema
- [ ] Transaction validation schema
- [ ] Investment validation schema
- [ ] User registration/login schemas

### 8.2 Error Handling
- [ ] Create error handling utilities
- [ ] Add try-catch blocks in API routes
- [ ] Display user-friendly error messages
- [ ] Add toast notifications for errors/success

---

## Phase 9: Testing

### 9.1 Manual Testing
- [ ] Test all user flows (create account, add transaction, etc.)
- [ ] Test investment creation and return flow
- [ ] Test report generation
- [ ] Test edge cases (delete, validation errors)
- [ ] **Test on mobile browsers** (Chrome Android, Safari iOS)
- [ ] **Test on tablet browsers**
- [ ] **Test on desktop browsers**
- [ ] Test touch interactions (tap, swipe, scroll)
- [ ] Test responsive layouts at different breakpoints

### 9.2 Automated Testing (Optional)
- [ ] Setup Vitest for unit tests
- [ ] Write tests for service functions
- [ ] Write tests for API routes
- [ ] Setup Playwright for E2E tests (optional)

---

## Phase 10: Deployment

### 10.1 Prepare for Deployment
- [ ] Setup production database (Neon or Supabase)
- [ ] Configure environment variables in Vercel
- [ ] Run production migrations
- [ ] Test production build locally

### 10.2 Deploy to Vercel
- [ ] Connect GitHub repo to Vercel
- [ ] Configure build settings
- [ ] Deploy to production
- [ ] Verify all features work in production
- [ ] Setup custom domain (optional)

### 10.3 Post-Deployment
- [ ] Monitor application logs
- [ ] Setup database backups
- [ ] Document deployment process
- [ ] Plan future enhancements

---

## Future Enhancements (Optional)

- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Budget planning
- [ ] Financial goals tracking
- [ ] Receipt image upload
- [ ] Notifications and reminders
- [ ] Multi-user support (family accounts)
- [ ] Data export/import
- [ ] Dark mode
- [ ] Web dashboard version
