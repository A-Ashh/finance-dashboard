# Finova — Finance Dashboard UI

> A clean, interactive finance dashboard built with React. Supports dark/light mode, multi-language UI (English, Hindi, Telugu, Tamil), role-based access control, and real-time transaction management.

---

## 🚀 Live Demo

> Run locally using the steps below.

---

## 📸 Features

### 🏠 Dashboard Overview
- Summary cards: Net Balance, Total Income, Total Expenses, Transaction Count
- Balance trend chart (area chart over time)
- Spending breakdown by category (donut chart)
- Monthly income vs expense comparison (bar chart)

### 💳 Transactions
- Full transaction list with date, category, type, amount, and notes
- Search by keyword, filter by type (income/expense) and category
- Sort by date or amount (ascending/descending)
- Pagination (8 per page)
- Add, edit, and delete transactions (Admin only)

### 👥 Role-Based UI
| Feature | Admin | Viewer |
|---|---|---|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |

Switch roles from the dropdown in the topbar.

### 📊 Insights
- Top spending category with percentage share
- Month-on-month expense change
- Savings rate
- Average transaction size
- Most active month
- Category breakdown (horizontal bar chart)

### 🌙 Dark / Light Mode
- Toggle between dark and light themes
- Full UI adapts including charts, cards, and backgrounds

### 🌐 Multi-Language Support
| Language | Code |
|---|---|
| English | `en` |
| Hindi (हिंदी) | `hi` |
| Telugu (తెలుగు) | `te` |
| Tamil (தமிழ்) | `ta` |

All labels, buttons, insights, and notifications translate fully.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| Recharts | Charts and visualizations |
| CSS-in-JS (inline) | Custom styling with CSS variables |

No backend. All data is mock/static and managed in React state.

---

## 📁 Project Structure

```
finance-dashboard/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx       # React entry point
    ├── index.css      # Global reset (minimal)
    └── App.jsx        # Entire application (components, styles, data, logic)
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v16 or above
- npm

### Steps

```bash
# 1. Extract the zip and open the folder
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## 🧠 Approach

### State Management
All state is handled using React's built-in `useState` and `useMemo` hooks:
- `transactions` — source of truth for all financial data
- `role` — controls which UI elements are shown or hidden
- `dark` — controls the active theme via CSS variables
- `lang` — controls the active language object used across all text
- `search`, `filterType`, `filterCat`, `sortKey`, `sortDir` — control filtered/sorted transaction view
- `currentPage` — pagination state

### Design Decisions
- Single-file architecture (`App.jsx`) for simplicity and portability
- CSS variables for theming — switching dark/light just swaps the variable values
- Translation object (`LANGS`) maps every UI string to all four languages — no external library needed
- `useMemo` used for derived data (totals, chart data, filtered list) to avoid unnecessary recalculation

### Role-Based UI
Roles are simulated on the frontend using a dropdown. The `role` state controls:
- Visibility of Add/Edit/Delete buttons
- A "View Only" badge shown to Viewer role users

---

## ✅ Assignment Requirements Checklist

| Requirement | Status |
|---|---|
| Dashboard with summary cards | ✅ |
| Time-based visualization | ✅ Balance trend area chart |
| Categorical visualization | ✅ Spending donut + bar chart |
| Transaction list with date, amount, category, type | ✅ |
| Search and filter | ✅ |
| Sorting | ✅ By date and amount |
| Role-based UI (Admin / Viewer) | ✅ |
| Insights section | ✅ 6 insight cards + chart |
| State management | ✅ useState + useMemo |
| Responsive design | ✅ |
| Empty/no data state | ✅ |
| Dark mode | ✅ |
| Multi-language support | ✅ EN, HI, TE, TA |

---

## 📝 Assumptions

- All data is static/mock — no backend or API integration
- Currency is Indian Rupee (₹)
- Roles are toggled via UI for demonstration purposes only
- Language switching is instant with no page reload required

---

*Built by Aastha Agnihotri — Frontend Developer Intern Assignment, Zorvyn FinTech*
