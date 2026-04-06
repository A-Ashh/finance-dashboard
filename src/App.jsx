import { useState, useMemo, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const INITIAL_TRANSACTIONS = [
  { id: 1, date: "2025-01-05", amount: 5200, category: "Salary", type: "income", note: "Monthly salary" },
  { id: 2, date: "2025-01-08", amount: 1200, category: "Rent", type: "expense", note: "Jan rent" },
  { id: 3, date: "2025-01-12", amount: 340, category: "Groceries", type: "expense", note: "Weekly groceries" },
  { id: 4, date: "2025-01-15", amount: 180, category: "Utilities", type: "expense", note: "Electricity bill" },
  { id: 5, date: "2025-01-18", amount: 95, category: "Transport", type: "expense", note: "Monthly metro pass" },
  { id: 6, date: "2025-01-22", amount: 420, category: "Dining", type: "expense", note: "Restaurant visits" },
  { id: 7, date: "2025-01-25", amount: 800, category: "Freelance", type: "income", note: "Design project" },
  { id: 8, date: "2025-02-05", amount: 5200, category: "Salary", type: "income", note: "Monthly salary" },
  { id: 9, date: "2025-02-09", amount: 1200, category: "Rent", type: "expense", note: "Feb rent" },
  { id: 10, date: "2025-02-13", amount: 290, category: "Groceries", type: "expense", note: "Weekly groceries" },
  { id: 11, date: "2025-02-17", amount: 210, category: "Utilities", type: "expense", note: "Water + electricity" },
  { id: 12, date: "2025-02-20", amount: 550, category: "Entertainment", type: "expense", note: "Streaming + events" },
  { id: 13, date: "2025-02-23", amount: 1500, category: "Freelance", type: "income", note: "Web dev contract" },
  { id: 14, date: "2025-02-26", amount: 340, category: "Dining", type: "expense", note: "Dining out" },
  { id: 15, date: "2025-03-05", amount: 5200, category: "Salary", type: "income", note: "Monthly salary" },
  { id: 16, date: "2025-03-07", amount: 1200, category: "Rent", type: "expense", note: "Mar rent" },
  { id: 17, date: "2025-03-10", amount: 670, category: "Shopping", type: "expense", note: "Clothes + gadgets" },
  { id: 18, date: "2025-03-14", amount: 160, category: "Utilities", type: "expense", note: "Gas bill" },
  { id: 19, date: "2025-03-18", amount: 120, category: "Transport", type: "expense", note: "Cab rides" },
  { id: 20, date: "2025-03-22", amount: 480, category: "Dining", type: "expense", note: "Client lunch" },
  { id: 21, date: "2025-03-27", amount: 2200, category: "Freelance", type: "income", note: "App design project" },
  { id: 22, date: "2025-03-29", amount: 390, category: "Groceries", type: "expense", note: "Month-end restock" },
];

const CATEGORIES = ["Salary","Rent","Groceries","Utilities","Transport","Dining","Freelance","Entertainment","Shopping"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const PIE_COLORS = ["#C9A84C","#E8C97D","#8B6914","#F0D89A","#A07820","#D4AF5A","#6B5010","#F5E4B5","#7A5C18"];

// ─── STYLES ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0A0A0B;
    --surface: #111113;
    --surface2: #18181C;
    --surface3: #1F1F24;
    --border: rgba(255,255,255,0.06);
    --border2: rgba(201,168,76,0.2);
    --gold: #C9A84C;
    --gold-light: #E8C97D;
    --gold-dim: rgba(201,168,76,0.15);
    --text: #F0EDE8;
    --text-2: #9B9890;
    --text-3: #5A5855;
    --green: #4CAF7D;
    --red: #E05252;
    --green-dim: rgba(76,175,125,0.12);
    --red-dim: rgba(224,82,82,0.12);
    --radius: 12px;
    --radius-lg: 18px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Instrument Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }

  .app { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 220px; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 28px 0; position: fixed;
    height: 100vh; z-index: 100; transition: transform 0.3s ease;
  }
  .sidebar-logo {
    padding: 0 24px 32px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 700; color: var(--gold);
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid var(--border);
  }
  .logo-dot { width: 8px; height: 8px; background: var(--gold); border-radius: 50%; }
  .nav { padding: 24px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 14px;
    border-radius: 8px; cursor: pointer; transition: all 0.2s;
    color: var(--text-2); font-size: 13px; font-weight: 500; letter-spacing: 0.01em;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--gold-dim); color: var(--gold); border: 1px solid var(--border2); }
  .nav-icon { font-size: 16px; }
  .sidebar-footer { padding: 16px 24px; border-top: 1px solid var(--border); }

  /* MAIN */
  .main { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* TOPBAR */
  .topbar {
    position: sticky; top: 0; z-index: 50;
    background: rgba(10,10,11,0.85); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 14px 32px; display: flex; align-items: center; justify-content: space-between;
  }
  .topbar-left { display: flex; flex-direction: column; }
  .topbar-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--text); }
  .topbar-sub { font-size: 12px; color: var(--text-3); margin-top: 1px; font-family: 'DM Mono', monospace; }
  .topbar-right { display: flex; align-items: center; gap: 16px; }

  .role-toggle {
    display: flex; align-items: center; gap: 8px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px;
    font-size: 12px; cursor: pointer; color: var(--text-2);
    font-family: 'DM Mono', monospace; transition: all 0.2s;
  }
  .role-toggle select {
    background: transparent; border: none; color: var(--gold); font-size: 12px;
    font-family: 'DM Mono', monospace; cursor: pointer; outline: none;
    font-weight: 500;
  }
  .role-toggle select option { background: var(--surface2); color: var(--text); }

  .user-badge {
    display: flex; align-items: center; gap: 10px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 6px 12px; font-size: 12px;
  }
  .user-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--gold-dim); border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: var(--gold); font-weight: 600;
  }
  .user-name { color: var(--text-2); }

  /* PAGE */
  .page { padding: 32px; display: flex; flex-direction: column; gap: 28px; }

  /* CARDS */
  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .summary-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 22px 24px;
    display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
  }
  .summary-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .summary-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--border);
  }
  .summary-card.gold::before { background: linear-gradient(90deg, var(--gold), var(--gold-light)); }
  .summary-card.green::before { background: var(--green); }
  .summary-card.red::before { background: var(--red); }
  .summary-card.blue::before { background: #5B8BF4; }

  .card-header { display: flex; align-items: center; justify-content: space-between; }
  .card-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); font-weight: 500; }
  .card-icon { font-size: 18px; opacity: 0.5; }
  .card-value { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
  .card-value.green { color: var(--green); }
  .card-value.red { color: var(--red); }
  .card-value.gold { color: var(--gold); }
  .card-footer { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-3); font-family: 'DM Mono', monospace; }
  .badge { padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 500; font-family: 'DM Mono', monospace; }
  .badge.up { background: var(--green-dim); color: var(--green); }
  .badge.down { background: var(--red-dim); color: var(--red); }

  /* CHARTS */
  .chart-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  .chart-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 24px;
  }
  .chart-title {
    font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 600;
    margin-bottom: 4px;
  }
  .chart-sub { font-size: 11px; color: var(--text-3); margin-bottom: 20px; font-family: 'DM Mono', monospace; }
  .pie-legend { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
  .legend-item { display: flex; align-items: center; gap: 10px; font-size: 12px; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .legend-name { color: var(--text-2); flex: 1; }
  .legend-val { color: var(--text); font-family: 'DM Mono', monospace; font-size: 11px; }

  /* SECTION */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; }

  /* FILTERS */
  .filters { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .filter-input {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    padding: 8px 14px; font-size: 13px; color: var(--text); outline: none;
    font-family: 'Instrument Sans', sans-serif; transition: border-color 0.2s;
    min-width: 180px;
  }
  .filter-input:focus { border-color: var(--border2); }
  .filter-input::placeholder { color: var(--text-3); }
  .filter-input option { background: var(--surface2); }
  .filter-btn {
    padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--text-2); font-size: 12px; cursor: pointer;
    font-family: 'Instrument Sans', sans-serif; transition: all 0.2s; white-space: nowrap;
  }
  .filter-btn:hover { border-color: var(--border2); color: var(--text); }
  .filter-btn.active { background: var(--gold-dim); border-color: var(--border2); color: var(--gold); }

  /* TABLE */
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--surface2); }
  th {
    padding: 12px 20px; text-align: left; font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--text-3); font-weight: 500; font-family: 'DM Mono', monospace;
    cursor: pointer; user-select: none; white-space: nowrap;
  }
  th:hover { color: var(--text-2); }
  td { padding: 14px 20px; font-size: 13px; border-top: 1px solid var(--border); }
  tr:hover td { background: rgba(255,255,255,0.015); }

  .cat-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-size: 11px;
    background: var(--surface3); color: var(--text-2); font-weight: 500;
  }
  .type-pill {
    display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; font-family: 'DM Mono', monospace;
  }
  .type-pill.income { background: var(--green-dim); color: var(--green); }
  .type-pill.expense { background: var(--red-dim); color: var(--red); }
  .amount-cell { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; }
  .amount-cell.income { color: var(--green); }
  .amount-cell.expense { color: var(--red); }
  .date-cell { color: var(--text-3); font-family: 'DM Mono', monospace; font-size: 12px; }

  /* INSIGHTS */
  .insights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .insight-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 22px 24px; transition: border-color 0.2s, transform 0.2s;
  }
  .insight-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .insight-icon { font-size: 24px; margin-bottom: 12px; }
  .insight-label { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; font-weight: 500; }
  .insight-value { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: var(--gold); margin-bottom: 6px; }
  .insight-desc { font-size: 12px; color: var(--text-2); line-height: 1.5; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200;
    display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: var(--radius-lg); padding: 32px; width: 460px; max-width: 90vw;
    animation: slideUp 0.25s ease;
  }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; margin-bottom: 24px; }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); margin-bottom: 6px; display: block; font-weight: 500; }
  .form-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 14px; font-size: 13px; color: var(--text);
    outline: none; font-family: 'Instrument Sans', sans-serif; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--border2); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
  .btn { padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; font-family: 'Instrument Sans', sans-serif; }
  .btn-primary { background: var(--gold); color: #0A0A0B; }
  .btn-primary:hover { background: var(--gold-light); }
  .btn-ghost { background: var(--surface2); color: var(--text-2); border: 1px solid var(--border); }
  .btn-ghost:hover { color: var(--text); }
  .btn-danger { background: var(--red-dim); color: var(--red); border: 1px solid rgba(224,82,82,0.2); }
  .btn-danger:hover { background: rgba(224,82,82,0.2); }
  .btn-sm { padding: 6px 12px; font-size: 11px; }
  .add-btn {
    display: flex; align-items: center; gap: 6px; padding: 9px 18px;
    background: var(--gold); color: #0A0A0B; border: none; border-radius: 8px;
    font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s;
    font-family: 'Instrument Sans', sans-serif;
  }
  .add-btn:hover { background: var(--gold-light); }

  /* PAGINATION */
  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--border); }
  .page-info { font-size: 12px; color: var(--text-3); font-family: 'DM Mono', monospace; }
  .page-btns { display: flex; gap: 6px; }
  .page-btn {
    padding: 5px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;
    background: var(--surface2); border: 1px solid var(--border); color: var(--text-2);
    font-family: 'DM Mono', monospace; transition: all 0.2s;
  }
  .page-btn:hover:not(:disabled) { border-color: var(--border2); color: var(--gold); }
  .page-btn:disabled { opacity: 0.3; cursor: default; }
  .page-btn.current { background: var(--gold-dim); border-color: var(--border2); color: var(--gold); }

  /* EMPTY */
  .empty-state { padding: 60px 20px; text-align: center; }
  .empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.3; }
  .empty-text { color: var(--text-3); font-size: 14px; }

  /* MONTHLY CHART */
  .monthly-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* NOTIFICATION */
  .toast {
    position: fixed; top: 20px; right: 20px; z-index: 999;
    background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px;
    padding: 14px 20px; font-size: 13px; color: var(--gold);
    animation: slideLeft 0.3s ease; display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  /* VIEWER BADGE */
  .viewer-note {
    display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px;
    background: rgba(91,139,244,0.1); border: 1px solid rgba(91,139,244,0.2);
    border-radius: 6px; font-size: 12px; color: #5B8BF4; font-family: 'DM Mono', monospace;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes slideLeft { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  /* CUSTOM TOOLTIP */
  .custom-tt { background: var(--surface2); border: 1px solid var(--border2); border-radius: 8px; padding: 10px 14px; font-size: 12px; }
  .tt-label { color: var(--text-3); margin-bottom: 4px; font-family: 'DM Mono', monospace; font-size: 11px; }
  .tt-value { color: var(--gold); font-family: 'DM Mono', monospace; font-weight: 500; }

  /* RESPONSIVE */
  @media (max-width: 1024px) {
    .summary-grid { grid-template-columns: repeat(2, 1fr); }
    .chart-row { grid-template-columns: 1fr; }
    .insights-grid { grid-template-columns: repeat(2, 1fr); }
    .monthly-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .main { margin-left: 0; }
    .summary-grid { grid-template-columns: 1fr 1fr; }
    .insights-grid { grid-template-columns: 1fr; }
    .page { padding: 20px; }
    .topbar { padding: 12px 20px; }
    .monthly-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .summary-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n) => "₹" + n.toLocaleString("en-IN");
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"2-digit" });
const catEmoji = (c) => ({ Salary:"💼", Rent:"🏠", Groceries:"🛒", Utilities:"⚡", Transport:"🚌", Dining:"🍽️", Freelance:"💻", Entertainment:"🎬", Shopping:"🛍️" }[c] || "💳");

// ─── COMPONENTS ────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tt">
      <div className="tt-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tt-value" style={{ color: p.color }}>{fmt(p.value)}</div>
      ))}
    </div>
  );
};

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [role, setRole] = useState("admin");
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ date:"", amount:"", category:"Salary", type:"income", note:"" });
  const PER_PAGE = 8;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const totalIncome = useMemo(() => transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0), [transactions]);
  const balance = totalIncome - totalExpense;

  // Monthly data
  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const d = new Date(t.date); const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      if (!map[key]) map[key] = { name: MONTHS[d.getMonth()], income: 0, expense: 0 };
      map[key][t.type] += t.amount;
    });
    return Object.values(map);
  }, [transactions]);

  // Spending by category
  const catData = useMemo(() => {
    const map = {};
    transactions.filter(t=>t.type==="expense").forEach(t => { map[t.category] = (map[t.category]||0)+t.amount; });
    return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  }, [transactions]);

  // Balance trend
  const trendData = useMemo(() => {
    let bal = 0;
    return [...transactions].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(t => {
      bal += t.type==="income" ? t.amount : -t.amount;
      return { name: fmtDate(t.date), balance: bal };
    });
  }, [transactions]);

  // Filtered transactions
  const filtered = useMemo(() => {
    let r = transactions.filter(t => {
      const s = search.toLowerCase();
      return (!s || t.category.toLowerCase().includes(s) || t.note.toLowerCase().includes(s) || String(t.amount).includes(s))
        && (filterType==="all" || t.type===filterType)
        && (filterCat==="all" || t.category===filterCat);
    });
    r.sort((a,b) => {
      let v = sortKey==="amount" ? a.amount-b.amount : new Date(a.date)-new Date(b.date);
      return sortDir==="asc" ? v : -v;
    });
    return r;
  }, [transactions, search, filterType, filterCat, sortKey, sortDir]);

  const paginated = filtered.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filtered.length/PER_PAGE));

  const handleSort = (key) => { if (sortKey===key) setSortDir(d=>d==="asc"?"desc":"asc"); else { setSortKey(key); setSortDir("desc"); }};

  const openAdd = () => { setForm({ date: new Date().toISOString().split("T")[0], amount:"", category:"Salary", type:"income", note:"" }); setEditTx(null); setShowModal(true); };
  const openEdit = (tx) => { setForm({ date:tx.date, amount:String(tx.amount), category:tx.category, type:tx.type, note:tx.note }); setEditTx(tx); setShowModal(true); };
  const saveModal = () => {
    if (!form.amount || !form.date) return;
    const amt = parseFloat(form.amount);
    if (editTx) {
      setTransactions(prev => prev.map(t => t.id===editTx.id ? { ...t, ...form, amount:amt } : t));
      showToast("✓ Transaction updated");
    } else {
      const id = Math.max(...transactions.map(t=>t.id))+1;
      setTransactions(prev => [{ id, ...form, amount:amt }, ...prev]);
      showToast("✓ Transaction added");
    }
    setShowModal(false);
  };
  const deleteTx = (id) => { setTransactions(prev=>prev.filter(t=>t.id!==id)); showToast("Transaction deleted"); };

  // Insights
  const topCat = catData[0];
  const prevMonthExp = monthlyData.length >= 2 ? monthlyData[monthlyData.length-2]?.expense : 0;
  const currMonthExp = monthlyData.length >= 1 ? monthlyData[monthlyData.length-1]?.expense : 0;
  const expChangePct = prevMonthExp ? (((currMonthExp-prevMonthExp)/prevMonthExp)*100).toFixed(1) : 0;
  const savingsRate = totalIncome > 0 ? ((balance/totalIncome)*100).toFixed(1) : 0;

  const navItems = [
    { id:"dashboard", icon:"◈", label:"Overview" },
    { id:"transactions", icon:"≡", label:"Transactions" },
    { id:"insights", icon:"◎", label:"Insights" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-dot" />
            Finova
          </div>
          <nav className="nav">
            {navItems.map(n => (
              <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div style={{ fontSize:11, color:"var(--text-3)", fontFamily:"'DM Mono', monospace", lineHeight:1.6 }}>
              <div>{transactions.length} transactions</div>
              <div style={{ color:"var(--gold)", opacity:0.7 }}>Finova v1.0</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-left">
              <div className="topbar-title">
                {page==="dashboard" ? "Financial Overview" : page==="transactions" ? "Transactions" : "Insights"}
              </div>
              <div className="topbar-sub">
                {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
              </div>
            </div>
            <div className="topbar-right">
              <div className="role-toggle">
                <span>Role:</span>
                <select value={role} onChange={e=>setRole(e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="user-badge">
                <div className="user-avatar">AA</div>
                <span className="user-name">Aastha A.</span>
              </div>
            </div>
          </div>

          {/* DASHBOARD */}
          {page==="dashboard" && (
            <div className="page">
              {/* SUMMARY CARDS */}
              <div className="summary-grid">
                <div className="summary-card gold">
                  <div className="card-header">
                    <span className="card-label">Net Balance</span>
                    <span className="card-icon">◈</span>
                  </div>
                  <div className="card-value gold">{fmt(balance)}</div>
                  <div className="card-footer">
                    <span className={`badge ${balance>=0?"up":"down"}`}>{balance>=0?"↑":"↓"} {Math.abs(savingsRate)}%</span>
                    savings rate
                  </div>
                </div>
                <div className="summary-card green">
                  <div className="card-header">
                    <span className="card-label">Total Income</span>
                    <span className="card-icon">↑</span>
                  </div>
                  <div className="card-value green">{fmt(totalIncome)}</div>
                  <div className="card-footer">
                    {transactions.filter(t=>t.type==="income").length} entries recorded
                  </div>
                </div>
                <div className="summary-card red">
                  <div className="card-header">
                    <span className="card-label">Total Expenses</span>
                    <span className="card-icon">↓</span>
                  </div>
                  <div className="card-value red">{fmt(totalExpense)}</div>
                  <div className="card-footer">
                    {transactions.filter(t=>t.type==="expense").length} entries recorded
                  </div>
                </div>
                <div className="summary-card blue">
                  <div className="card-header">
                    <span className="card-label">Transactions</span>
                    <span className="card-icon">≡</span>
                  </div>
                  <div className="card-value" style={{ color:"#5B8BF4" }}>{transactions.length}</div>
                  <div className="card-footer">
                    across {catData.length} categories
                  </div>
                </div>
              </div>

              {/* CHARTS ROW 1 */}
              <div className="chart-row">
                <div className="chart-card">
                  <div className="chart-title">Balance Trend</div>
                  <div className="chart-sub">Cumulative net balance over time</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={{ fill:"#5A5855", fontSize:10, fontFamily:"'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill:"#5A5855", fontSize:10, fontFamily:"'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="balance" stroke="#C9A84C" fill="url(#gold-grad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-card">
                  <div className="chart-title">Spending Breakdown</div>
                  <div className="chart-sub">By category (expenses only)</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={catData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                        {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-legend">
                    {catData.slice(0,4).map((d,i) => (
                      <div key={i} className="legend-item">
                        <div className="legend-dot" style={{ background: PIE_COLORS[i] }} />
                        <span className="legend-name">{d.name}</span>
                        <span className="legend-val">{fmt(d.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MONTHLY */}
              <div className="chart-card">
                <div className="chart-title">Monthly Comparison</div>
                <div className="chart-sub">Income vs Expenses by month</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData} barGap={4} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fill:"#5A5855", fontSize:10, fontFamily:"'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:"#5A5855", fontSize:10, fontFamily:"'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)} width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="income" fill="#4CAF7D" radius={[4,4,0,0]} />
                    <Bar dataKey="expense" fill="#E05252" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TRANSACTIONS */}
          {page==="transactions" && (
            <div className="page">
              <div className="section-header">
                <div>
                  <div className="section-title">All Transactions</div>
                  <div style={{ fontSize:12, color:"var(--text-3)", marginTop:4, fontFamily:"'DM Mono', monospace" }}>
                    {filtered.length} records found
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  {role==="viewer" && <div className="viewer-note">◉ View Only</div>}
                  {role==="admin" && <button className="add-btn" onClick={openAdd}>+ Add Transaction</button>}
                </div>
              </div>

              {/* FILTERS */}
              <div className="filters">
                <input className="filter-input" placeholder="Search transactions…" value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1);}} />
                <select className="filter-input" style={{ minWidth:120 }} value={filterType} onChange={e=>{setFilterType(e.target.value);setCurrentPage(1);}}>
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select className="filter-input" style={{ minWidth:130 }} value={filterCat} onChange={e=>{setFilterCat(e.target.value);setCurrentPage(1);}}>
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <button className={`filter-btn ${filterType==="all"&&filterCat==="all"&&!search?"":"active"}`} onClick={()=>{setSearch("");setFilterType("all");setFilterCat("all");setCurrentPage(1);}}>
                  Clear
                </button>
              </div>

              {/* TABLE */}
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th onClick={()=>handleSort("date")}>Date {sortKey==="date"?(sortDir==="asc"?"↑":"↓"):""}</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th onClick={()=>handleSort("amount")}>Amount {sortKey==="amount"?(sortDir==="asc"?"↑":"↓"):""}</th>
                      <th>Note</th>
                      {role==="admin" && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr><td colSpan={role==="admin"?6:5}>
                        <div className="empty-state">
                          <div className="empty-icon">⊘</div>
                          <div className="empty-text">No transactions match your filters</div>
                        </div>
                      </td></tr>
                    ) : paginated.map(t => (
                      <tr key={t.id}>
                        <td className="date-cell">{fmtDate(t.date)}</td>
                        <td><span className="cat-pill">{catEmoji(t.category)} {t.category}</span></td>
                        <td><span className={`type-pill ${t.type}`}>{t.type==="income"?"↑ Income":"↓ Expense"}</span></td>
                        <td><span className={`amount-cell ${t.type}`}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span></td>
                        <td style={{ color:"var(--text-2)", fontSize:12 }}>{t.note}</td>
                        {role==="admin" && (
                          <td style={{ display:"flex", gap:6 }}>
                            <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(t)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={()=>deleteTx(t.id)}>Del</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginated.length > 0 && (
                  <div className="pagination">
                    <div className="page-info">Showing {((currentPage-1)*PER_PAGE)+1}–{Math.min(currentPage*PER_PAGE,filtered.length)} of {filtered.length}</div>
                    <div className="page-btns">
                      <button className="page-btn" disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}>← Prev</button>
                      {Array.from({length:totalPages},(_, i)=>i+1).map(p=>(
                        <button key={p} className={`page-btn ${p===currentPage?"current":""}`} onClick={()=>setCurrentPage(p)}>{p}</button>
                      ))}
                      <button className="page-btn" disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}>Next →</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INSIGHTS */}
          {page==="insights" && (
            <div className="page">
              <div className="section-title" style={{ marginBottom:4 }}>Financial Insights</div>
              <div style={{ fontSize:12, color:"var(--text-3)", marginBottom:20, fontFamily:"'DM Mono', monospace" }}>
                Key observations from your financial data
              </div>

              <div className="insights-grid">
                <div className="insight-card">
                  <div className="insight-icon">🏆</div>
                  <div className="insight-label">Top Spending Category</div>
                  <div className="insight-value">{topCat?.name || "—"}</div>
                  <div className="insight-desc">Accounts for {fmt(topCat?.value||0)} — {totalExpense ? ((topCat?.value/totalExpense)*100).toFixed(1) : 0}% of total spending.</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">{parseFloat(expChangePct)>0?"📈":"📉"}</div>
                  <div className="insight-label">Month-on-Month Expenses</div>
                  <div className="insight-value" style={{ color: parseFloat(expChangePct)>0?"var(--red)":"var(--green)" }}>
                    {expChangePct > 0 ? "+" : ""}{expChangePct}%
                  </div>
                  <div className="insight-desc">Expenses {parseFloat(expChangePct)>0?"increased":"decreased"} compared to the previous month.</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">💰</div>
                  <div className="insight-label">Savings Rate</div>
                  <div className="insight-value">{savingsRate}%</div>
                  <div className="insight-desc">You're saving {fmt(balance)} out of {fmt(totalIncome)} total income.</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">📊</div>
                  <div className="insight-label">Avg. Transaction Size</div>
                  <div className="insight-value">{fmt(Math.round((totalIncome+totalExpense)/transactions.length))}</div>
                  <div className="insight-desc">Average across all {transactions.length} transactions recorded.</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">🎯</div>
                  <div className="insight-label">Expense Categories</div>
                  <div className="insight-value">{catData.length}</div>
                  <div className="insight-desc">Spending spread across {catData.length} unique categories, most in {topCat?.name}.</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">📅</div>
                  <div className="insight-label">Most Active Month</div>
                  <div className="insight-value">{monthlyData.reduce((a,b)=>(a.income+a.expense>b.income+b.expense)?a:b, monthlyData[0] || {})?.name || "—"}</div>
                  <div className="insight-desc">Highest combined financial activity recorded in this month.</div>
                </div>
              </div>

              {/* Category breakdown table */}
              <div className="chart-card" style={{ marginTop:4 }}>
                <div className="chart-title">Category Breakdown</div>
                <div className="chart-sub">Detailed expense analysis by category</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={catData} layout="vertical" barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tick={{ fill:"#5A5855", fontSize:10, fontFamily:"'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)} />
                    <YAxis type="category" dataKey="name" tick={{ fill:"#9B9890", fontSize:11, fontFamily:"'Instrument Sans', sans-serif" }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[0,4,4,0]}>
                      {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">{editTx ? "Edit Transaction" : "New Transaction"}</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" className="form-input" placeholder="0.00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Note</label>
              <input className="form-input" placeholder="Short description…" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveModal}>{editTx?"Save Changes":"Add Transaction"}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">✦ {toast}</div>}
    </>
  );
}
