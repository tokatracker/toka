# Toka — Personal Expense & Subscription Tracker

## What it does
- Add recurring expenses (Netflix, Gym, School Fees, Rent, etc.)
- See total monthly burn, upcoming renewals, category breakdown
- Renew / Snooze / Cancel subscriptions
- Manage button opens the app's cancel/manage page directly
- UPI Pay button (PhonePe, GPay, Paytm, BHIM, Amazon Pay, WhatsApp)
- Payment history tab
- Push notification settings
- No login required — just open and add expenses

## Run it

```bash
npm install
npm start
```

Then open http://localhost:3000 in your browser.

## Tech Stack
- Frontend: HTML/CSS/JS (single page, no framework)
- Backend: Express.js + better-sqlite3
- Database: SQLite (toka.db file, created automatically)

## API Endpoints

### Expenses
- GET    /api/expenses       — list all
- POST   /api/expenses       — create {name, amount, category, type, cycle, nextDue, link?, upiId?}
- PATCH  /api/expenses/:id   — update {status?, nextDue?}
- DELETE /api/expenses/:id   — delete

### Payments
- GET    /api/payments       — payment history
- POST   /api/payments       — record {name, amount, category, method, expenseId?}

### Settings
- GET    /api/settings       — get all settings
- PUT    /api/settings       — update settings

### Stats
- GET    /api/stats          — aggregate stats (total monthly, counts, etc.)
