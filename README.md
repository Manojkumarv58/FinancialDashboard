# Finance Dashboard UI

A simple finance dashboard built for a frontend UI assignment. It uses mock transaction data and focuses on clean UI, component structure, and state management (no backend).

## Features

- **Dashboard overview**
  - Summary cards: Total Balance, Income, Expenses
  - Time-based chart: monthly running balance trend
  - Categorical chart: spending breakdown by category
- **Transactions**
  - Table with date, amount, category, and type
  - Search + filtering + sorting
  - Empty-state handling
- **Role-based UI (simulated)**
  - Switch role via header dropdown
  - Viewer: read-only
  - Admin: add and edit transactions
- **Insights**
  - Highest spending category
  - Month-over-month expense comparison
- **State management**
  - Redux Toolkit (`finance` slice) for transactions, filters, sort, and role
  - Local storage persistence via `redux-persist`

## Tech stack

- React + JavaScript (Vite)
- Tailwind CSS
- Redux Toolkit + React Redux + redux-persist
- Recharts

## Getting started

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173/`).
