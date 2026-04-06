import { useState, useMemo, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const LANGS = {
  en: {
    name: "English", flag: "🇬🇧",
    appName: "Finova",
    overview: "Overview", transactions: "Transactions", insights: "Insights",
    financialOverview: "Financial Overview",
    netBalance: "Net Balance", totalIncome: "Total Income", totalExpenses: "Total Expenses",
    savingsRate: "savings rate", entriesRecorded: "entries recorded", acrossCategories: "across",
    categories: "categories",
    balanceTrend: "Balance Trend", balanceTrendSub: "Cumulative net balance over time",
    spendingBreakdown: "Spending Breakdown", spendingBreakdownSub: "By category (expenses only)",
    monthlyComparison: "Monthly Comparison", monthlyComparisonSub: "Income vs Expenses by month",
    allTransactions: "All Transactions", recordsFound: "records found",
    viewOnly: "View Only", addTransaction: "+ Add Transaction",
    searchPlaceholder: "Search transactions…", allTypes: "All Types", income: "Income",
    expense: "Expense", allCategories: "All Categories", clear: "Clear",
    date: "Date", category: "Category", type: "Type", amount: "Amount", note: "Note", actions: "Actions",
    edit: "Edit", del: "Delete", prev: "← Prev", next: "Next →", showing: "Showing", of: "of",
    financialInsights: "Financial Insights", insightsSub: "Key observations from your financial data",
    topSpending: "Top Spending Category", momExpenses: "Month-on-Month Expenses",
    savingsRateLabel: "Savings Rate", avgTransaction: "Avg. Transaction Size",
    expenseCategories: "Expense Categories", mostActiveMonth: "Most Active Month",
    categoryBreakdown: "Category Breakdown", categoryBreakdownSub: "Detailed expense analysis by category",
    accountsFor: "Accounts for", ofTotalSpending: "% of total spending.",
    expensesIncreased: "Expenses increased compared to the previous month.",
    expensesDecreased: "Expenses decreased compared to the previous month.",
    savingOut: "You're saving", outOf: "out of", totalIncomeLabel: "total income.",
    averageAcross: "Average across all", transactionsRecorded: "transactions recorded.",
    spendingSpread: "Spending spread across", uniqueCategories: "unique categories, most in",
    highestActivity: "Highest combined financial activity recorded in this month.",
    role: "Role", admin: "Admin", viewer: "Viewer",
    editTransaction: "Edit Transaction", newTransaction: "New Transaction",
    dateLabel: "Date", amountLabel: "Amount (₹)", categoryLabel: "Category", typeLabel: "Type", noteLabel: "Note",
    cancel: "Cancel", saveChanges: "Save Changes", addBtn: "Add Transaction",
    darkMode: "Dark", lightMode: "Light",
    txAdded: "Transaction added", txUpdated: "Transaction updated", txDeleted: "Transaction deleted",
    noMatch: "No transactions match your filters",
  },
  hi: {
    name: "हिंदी", flag: "🇮🇳",
    appName: "फिनोवा",
    overview: "अवलोकन", transactions: "लेन-देन", insights: "अंतर्दृष्टि",
    financialOverview: "वित्तीय अवलोकन",
    netBalance: "शुद्ध शेष", totalIncome: "कुल आय", totalExpenses: "कुल व्यय",
    savingsRate: "बचत दर", entriesRecorded: "प्रविष्टियाँ", acrossCategories: "में",
    categories: "श्रेणियाँ",
    balanceTrend: "शेष प्रवृत्ति", balanceTrendSub: "समय के साथ संचयी शुद्ध शेष",
    spendingBreakdown: "व्यय विश्लेषण", spendingBreakdownSub: "श्रेणी अनुसार (केवल खर्च)",
    monthlyComparison: "मासिक तुलना", monthlyComparisonSub: "माह अनुसार आय बनाम व्यय",
    allTransactions: "सभी लेन-देन", recordsFound: "रिकॉर्ड मिले",
    viewOnly: "केवल देखें", addTransaction: "+ लेन-देन जोड़ें",
    searchPlaceholder: "लेन-देन खोजें…", allTypes: "सभी प्रकार", income: "आय",
    expense: "व्यय", allCategories: "सभी श्रेणियाँ", clear: "साफ़ करें",
    date: "तारीख", category: "श्रेणी", type: "प्रकार", amount: "राशि", note: "नोट", actions: "क्रियाएँ",
    edit: "संपादित", del: "हटाएं", prev: "← पिछला", next: "अगला →", showing: "दिखा रहा है", of: "में से",
    financialInsights: "वित्तीय अंतर्दृष्टि", insightsSub: "आपके वित्तीय डेटा से मुख्य अवलोकन",
    topSpending: "शीर्ष व्यय श्रेणी", momExpenses: "मासिक व्यय परिवर्तन",
    savingsRateLabel: "बचत दर", avgTransaction: "औसत लेन-देन राशि",
    expenseCategories: "व्यय श्रेणियाँ", mostActiveMonth: "सबसे सक्रिय माह",
    categoryBreakdown: "श्रेणी विवरण", categoryBreakdownSub: "श्रेणी अनुसार विस्तृत व्यय विश्लेषण",
    accountsFor: "कुल", ofTotalSpending: "% कुल खर्च का।",
    expensesIncreased: "पिछले माह की तुलना में व्यय बढ़ा।",
    expensesDecreased: "पिछले माह की तुलना में व्यय घटा।",
    savingOut: "आप बचत कर रहे हैं", outOf: "कुल आय", totalIncomeLabel: "में से।",
    averageAcross: "कुल", transactionsRecorded: "लेन-देन का औसत।",
    spendingSpread: "खर्च", uniqueCategories: "श्रेणियों में, सबसे अधिक",
    highestActivity: "इस माह में सर्वाधिक संयुक्त वित्तीय गतिविधि।",
    role: "भूमिका", admin: "व्यवस्थापक", viewer: "दर्शक",
    editTransaction: "लेन-देन संपादित करें", newTransaction: "नया लेन-देन",
    dateLabel: "तारीख", amountLabel: "राशि (₹)", categoryLabel: "श्रेणी", typeLabel: "प्रकार", noteLabel: "नोट",
    cancel: "रद्द करें", saveChanges: "परिवर्तन सहेजें", addBtn: "लेन-देन जोड़ें",
    darkMode: "डार्क", lightMode: "लाइट",
    txAdded: "लेन-देन जोड़ा गया", txUpdated: "लेन-देन अपडेट किया", txDeleted: "लेन-देन हटाया गया",
    noMatch: "कोई लेन-देन नहीं मिला",
  },
  te: {
    name: "తెలుగు", flag: "🏳️",
    appName: "ఫినోవా",
    overview: "అవలోకనం", transactions: "లావాదేవీలు", insights: "అంతర్దృష్టి",
    financialOverview: "ఆర్థిక అవలోకనం",
    netBalance: "నికర నిల్వ", totalIncome: "మొత్తం ఆదాయం", totalExpenses: "మొత్తం వ్యయాలు",
    savingsRate: "పొదుపు రేటు", entriesRecorded: "నమోదులు", acrossCategories: "లో",
    categories: "వర్గాలు",
    balanceTrend: "నిల్వ ధోరణి", balanceTrendSub: "కాలక్రమేణా సంచిత నికర నిల్వ",
    spendingBreakdown: "వ్యయ విశ్లేషణ", spendingBreakdownSub: "వర్గం వారీగా (వ్యయాలు మాత్రమే)",
    monthlyComparison: "నెలవారీ పోలిక", monthlyComparisonSub: "నెల వారీ ఆదాయం vs వ్యయాలు",
    allTransactions: "అన్ని లావాదేవీలు", recordsFound: "రికార్డులు దొరికాయి",
    viewOnly: "చూడటానికి మాత్రమే", addTransaction: "+ లావాదేవీ జోడించు",
    searchPlaceholder: "లావాదేవీలు వెతకండి…", allTypes: "అన్ని రకాలు", income: "ఆదాయం",
    expense: "వ్యయం", allCategories: "అన్ని వర్గాలు", clear: "క్లియర్",
    date: "తేదీ", category: "వర్గం", type: "రకం", amount: "మొత్తం", note: "గమనిక", actions: "చర్యలు",
    edit: "సవరించు", del: "తొలగించు", prev: "← మునుపు", next: "తదుపరి →", showing: "చూపిస్తోంది", of: "లో",
    financialInsights: "ఆర్థిక అంతర్దృష్టి", insightsSub: "మీ ఆర్థిక డేటా నుండి ముఖ్యమైన పరిశీలనలు",
    topSpending: "అగ్రశ్రేణి వ్యయ వర్గం", momExpenses: "నెల-నెలకు వ్యయ మార్పు",
    savingsRateLabel: "పొదుపు రేటు", avgTransaction: "సగటు లావాదేవీ మొత్తం",
    expenseCategories: "వ్యయ వర్గాలు", mostActiveMonth: "అత్యంత చురుకైన నెల",
    categoryBreakdown: "వర్గ వివరణ", categoryBreakdownSub: "వర్గం వారీగా వివరణాత్మక వ్యయ విశ్లేషణ",
    accountsFor: "మొత్తం", ofTotalSpending: "% మొత్తం వ్యయం.",
    expensesIncreased: "గత నెలతో పోలిస్తే వ్యయాలు పెరిగాయి.",
    expensesDecreased: "గత నెలతో పోలిస్తే వ్యయాలు తగ్గాయి.",
    savingOut: "మీరు పొదుపు చేస్తున్నారు", outOf: "మొత్తం ఆదాయంలో", totalIncomeLabel: "నుండి.",
    averageAcross: "మొత్తం", transactionsRecorded: "లావాదేవీల సగటు.",
    spendingSpread: "వ్యయం", uniqueCategories: "వర్గాలలో, అత్యధికంగా",
    highestActivity: "ఈ నెలలో అత్యధిక ఆర్థిక కార్యకలాపాలు నమోదయ్యాయి.",
    role: "పాత్ర", admin: "నిర్వాహకుడు", viewer: "వీక్షకుడు",
    editTransaction: "లావాదేవీ సవరించు", newTransaction: "కొత్త లావాదేవీ",
    dateLabel: "తేదీ", amountLabel: "మొత్తం (₹)", categoryLabel: "వర్గం", typeLabel: "రకం", noteLabel: "గమనిక",
    cancel: "రద్దు చేయి", saveChanges: "మార్పులు సేవ్ చేయి", addBtn: "లావాదేవీ జోడించు",
    darkMode: "డార్క్", lightMode: "లైట్",
    txAdded: "లావాదేవీ జోడించబడింది", txUpdated: "లావాదేవీ నవీకరించబడింది", txDeleted: "లావాదేవీ తొలగించబడింది",
    noMatch: "ఫిల్టర్‌లకు సరిపోయే లావాదేవీలు లేవు",
  },
  ta: {
    name: "தமிழ்", flag: "🏳️",
    appName: "பினோவா",
    overview: "மேலோட்டம்", transactions: "பரிவர்த்தனைகள்", insights: "நுண்ணறிவு",
    financialOverview: "நிதி மேலோட்டம்",
    netBalance: "நிகர இருப்பு", totalIncome: "மொத்த வருமானம்", totalExpenses: "மொத்த செலவுகள்",
    savingsRate: "சேமிப்பு விகிதம்", entriesRecorded: "பதிவுகள்", acrossCategories: "இல்",
    categories: "வகைகள்",
    balanceTrend: "இருப்பு போக்கு", balanceTrendSub: "காலப்போக்கில் ஒட்டுமொத்த நிகர இருப்பு",
    spendingBreakdown: "செலவு பகுப்பாய்வு", spendingBreakdownSub: "வகை வாரியாக (செலவுகள் மட்டும்)",
    monthlyComparison: "மாதாந்திர ஒப்பீடு", monthlyComparisonSub: "மாத வாரியாக வருமானம் vs செலவு",
    allTransactions: "அனைத்து பரிவர்த்தனைகள்", recordsFound: "பதிவுகள் கிடைத்தன",
    viewOnly: "பார்க்க மட்டும்", addTransaction: "+ பரிவர்த்தனை சேர்க்கவும்",
    searchPlaceholder: "பரிவர்த்தனைகளை தேடுங்கள்…", allTypes: "அனைத்து வகைகள்", income: "வருமானம்",
    expense: "செலவு", allCategories: "அனைத்து வகைகள்", clear: "அழிக்க",
    date: "தேதி", category: "வகை", type: "வகை", amount: "தொகை", note: "குறிப்பு", actions: "செயல்கள்",
    edit: "திருத்து", del: "நீக்கு", prev: "← முந்தையது", next: "அடுத்தது →", showing: "காட்டுகிறது", of: "இல்",
    financialInsights: "நிதி நுண்ணறிவு", insightsSub: "உங்கள் நிதி தரவிலிருந்து முக்கிய கவனிப்புகள்",
    topSpending: "முதன்மை செலவு வகை", momExpenses: "மாதாந்திர செலவு மாற்றம்",
    savingsRateLabel: "சேமிப்பு விகிதம்", avgTransaction: "சராசரி பரிவர்த்தனை தொகை",
    expenseCategories: "செலவு வகைகள்", mostActiveMonth: "மிகவும் சுறுசுறுப்பான மாதம்",
    categoryBreakdown: "வகை விவரம்", categoryBreakdownSub: "வகை வாரியாக விரிவான செலவு பகுப்பாய்வு",
    accountsFor: "மொத்தம்", ofTotalSpending: "% மொத்த செலவு.",
    expensesIncreased: "கடந்த மாதத்துடன் ஒப்பிடும்போது செலவுகள் அதிகரித்தன.",
    expensesDecreased: "கடந்த மாதத்துடன் ஒப்பிடும்போது செலவுகள் குறைந்தன.",
    savingOut: "நீங்கள் சேமிக்கிறீர்கள்", outOf: "மொத்த வருமானத்தில்", totalIncomeLabel: "இருந்து.",
    averageAcross: "மொத்தம்", transactionsRecorded: "பரிவர்த்தனைகளின் சராசரி.",
    spendingSpread: "செலவு", uniqueCategories: "வகைகளில், மிகவும் அதிகமாக",
    highestActivity: "இந்த மாதத்தில் மிகவும் அதிகமான நிதி செயல்பாடு பதிவாகியது.",
    role: "பாத்திரம்", admin: "நிர்வாகி", viewer: "பார்வையாளர்",
    editTransaction: "பரிவர்த்தனையை திருத்து", newTransaction: "புதிய பரிவர்த்தனை",
    dateLabel: "தேதி", amountLabel: "தொகை (₹)", categoryLabel: "வகை", typeLabel: "வகை", noteLabel: "குறிப்பு",
    cancel: "ரத்து செய்", saveChanges: "மாற்றங்களை சேமி", addBtn: "பரிவர்த்தனை சேர்க்கவும்",
    darkMode: "இருள்", lightMode: "ஒளி",
    txAdded: "பரிவர்த்தனை சேர்க்கப்பட்டது", txUpdated: "பரிவர்த்தனை புதுப்பிக்கப்பட்டது", txDeleted: "பரிவர்த்தனை நீக்கப்பட்டது",
    noMatch: "வடிகட்டிகளுக்கு பொருந்தும் பரிவர்த்தனைகள் இல்லை",
  },
};

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
const makeCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       ${dark ? "#0A0A0B"              : "#F4F2EE"};
    --surface:  ${dark ? "#111113"              : "#FFFFFF"};
    --surface2: ${dark ? "#18181C"              : "#F0EDE8"};
    --surface3: ${dark ? "#1F1F24"              : "#E8E4DE"};
    --border:   ${dark ? "rgba(255,255,255,0.06)": "rgba(0,0,0,0.08)"};
    --border2:  ${dark ? "rgba(201,168,76,0.25)": "rgba(160,120,32,0.3)"};
    --gold:     ${dark ? "#C9A84C"              : "#9A6F1A"};
    --gold-light:${dark? "#E8C97D"              : "#C9A84C"};
    --gold-dim: ${dark ? "rgba(201,168,76,0.15)": "rgba(154,111,26,0.1)"};
    --text:     ${dark ? "#F0EDE8"              : "#1A1815"};
    --text-2:   ${dark ? "#9B9890"              : "#6B6560"};
    --text-3:   ${dark ? "#5A5855"              : "#A09890"};
    --green:    ${dark ? "#4CAF7D"              : "#2E7D52"};
    --red:      ${dark ? "#E05252"              : "#C0392B"};
    --green-dim:${dark ? "rgba(76,175,125,0.12)": "rgba(46,125,82,0.1)"};
    --red-dim:  ${dark ? "rgba(224,82,82,0.12)" : "rgba(192,57,43,0.1)"};
    --topbar-bg:${dark ? "rgba(10,10,11,0.85)"  : "rgba(244,242,238,0.9)"};
    --radius: 12px; --radius-lg: 18px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'Instrument Sans', sans-serif; min-height: 100vh; overflow-x: hidden; transition: background 0.3s, color 0.3s; }
  .app { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar { width: 220px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 28px 0; position: fixed; height: 100vh; z-index: 100; transition: all 0.3s ease; }
  .sidebar-logo { padding: 0 24px 32px; font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: var(--gold); display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); }
  .logo-dot { width: 8px; height: 8px; background: var(--gold); border-radius: 50%; }
  .nav { padding: 24px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s; color: var(--text-2); font-size: 13px; font-weight: 500; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--gold-dim); color: var(--gold); border: 1px solid var(--border2); }
  .nav-icon { font-size: 16px; }
  .sidebar-footer { padding: 16px 24px; border-top: 1px solid var(--border); }

  /* MAIN */
  .main { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* TOPBAR */
  .topbar { position: sticky; top: 0; z-index: 50; background: var(--topbar-bg); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 14px 32px; display: flex; align-items: center; justify-content: space-between; transition: background 0.3s; }
  .topbar-left { display: flex; flex-direction: column; }
  .topbar-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--text); }
  .topbar-sub { font-size: 12px; color: var(--text-3); margin-top: 1px; font-family: 'DM Mono', monospace; }
  .topbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  /* CONTROLS */
  .ctrl-pill { display: flex; align-items: center; gap: 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; font-size: 12px; color: var(--text-2); font-family: 'DM Mono', monospace; }
  .ctrl-pill select { background: transparent; border: none; color: var(--gold); font-size: 12px; font-family: 'DM Mono', monospace; cursor: pointer; outline: none; font-weight: 500; }
  .ctrl-pill select option { background: var(--surface2); color: var(--text); }

  /* DARK MODE TOGGLE */
  .theme-btn { display: flex; align-items: center; gap: 6px; padding: 6px 14px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; font-size: 12px; color: var(--text-2); font-family: 'DM Mono', monospace; transition: all 0.2s; }
  .theme-btn:hover { border-color: var(--border2); color: var(--gold); }

  /* USER */
  .user-badge { display: flex; align-items: center; gap: 10px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 6px 12px; font-size: 12px; }
  .user-avatar { width: 26px; height: 26px; border-radius: 50%; background: var(--gold-dim); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--gold); font-weight: 600; }
  .user-name { color: var(--text-2); }

  /* PAGE */
  .page { padding: 32px; display: flex; flex-direction: column; gap: 28px; }

  /* CARDS */
  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .summary-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 22px 24px; display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
  .summary-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .summary-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--border); }
  .summary-card.gold::before { background: linear-gradient(90deg, var(--gold), var(--gold-light)); }
  .summary-card.green::before { background: var(--green); }
  .summary-card.red::before { background: var(--red); }
  .summary-card.blue::before { background: #5B8BF4; }
  .card-header { display: flex; align-items: center; justify-content: space-between; }
  .card-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); font-weight: 500; }
  .card-icon { font-size: 18px; opacity: 0.4; }
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
  .chart-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; transition: background 0.3s; }
  .chart-title { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 600; margin-bottom: 4px; }
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
  .filter-input { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 8px 14px; font-size: 13px; color: var(--text); outline: none; font-family: 'Instrument Sans', sans-serif; transition: border-color 0.2s; min-width: 160px; }
  .filter-input:focus { border-color: var(--border2); }
  .filter-input::placeholder { color: var(--text-3); }
  .filter-input option { background: var(--surface2); }
  .filter-btn { padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); color: var(--text-2); font-size: 12px; cursor: pointer; font-family: 'Instrument Sans', sans-serif; transition: all 0.2s; }
  .filter-btn:hover { border-color: var(--border2); color: var(--text); }
  .filter-btn.active { background: var(--gold-dim); border-color: var(--border2); color: var(--gold); }

  /* TABLE */
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--surface2); }
  th { padding: 12px 20px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-3); font-weight: 500; font-family: 'DM Mono', monospace; cursor: pointer; user-select: none; white-space: nowrap; }
  th:hover { color: var(--text-2); }
  td { padding: 14px 20px; font-size: 13px; border-top: 1px solid var(--border); }
  tr:hover td { background: ${dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)"}; }
  .cat-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; background: var(--surface3); color: var(--text-2); font-weight: 500; }
  .type-pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; font-family: 'DM Mono', monospace; }
  .type-pill.income { background: var(--green-dim); color: var(--green); }
  .type-pill.expense { background: var(--red-dim); color: var(--red); }
  .amount-cell { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; }
  .amount-cell.income { color: var(--green); }
  .amount-cell.expense { color: var(--red); }
  .date-cell { color: var(--text-3); font-family: 'DM Mono', monospace; font-size: 12px; }

  /* INSIGHTS */
  .insights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .insight-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 22px 24px; transition: border-color 0.2s, transform 0.2s; }
  .insight-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .insight-icon { font-size: 24px; margin-bottom: 12px; }
  .insight-label { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; font-weight: 500; }
  .insight-value { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: var(--gold); margin-bottom: 6px; }
  .insight-desc { font-size: 12px; color: var(--text-2); line-height: 1.5; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 200; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); animation: fadeIn 0.2s ease; }
  .modal { background: var(--surface); border: 1px solid var(--border2); border-radius: var(--radius-lg); padding: 32px; width: 460px; max-width: 90vw; animation: slideUp 0.25s ease; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; margin-bottom: 24px; }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); margin-bottom: 6px; display: block; font-weight: 500; }
  .form-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 13px; color: var(--text); outline: none; font-family: 'Instrument Sans', sans-serif; transition: border-color 0.2s; }
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
  .add-btn { display: flex; align-items: center; gap: 6px; padding: 9px 18px; background: var(--gold); color: #0A0A0B; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-family: 'Instrument Sans', sans-serif; }
  .add-btn:hover { background: var(--gold-light); }

  /* PAGINATION */
  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--border); }
  .page-info { font-size: 12px; color: var(--text-3); font-family: 'DM Mono', monospace; }
  .page-btns { display: flex; gap: 6px; }
  .page-btn { padding: 5px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; background: var(--surface2); border: 1px solid var(--border); color: var(--text-2); font-family: 'DM Mono', monospace; transition: all 0.2s; }
  .page-btn:hover:not(:disabled) { border-color: var(--border2); color: var(--gold); }
  .page-btn:disabled { opacity: 0.3; cursor: default; }
  .page-btn.current { background: var(--gold-dim); border-color: var(--border2); color: var(--gold); }

  /* EMPTY */
  .empty-state { padding: 60px 20px; text-align: center; }
  .empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.3; }
  .empty-text { color: var(--text-3); font-size: 14px; }

  /* TOAST */
  .toast { position: fixed; top: 20px; right: 20px; z-index: 999; background: var(--surface2); border: 1px solid var(--border2); border-radius: 10px; padding: 14px 20px; font-size: 13px; color: var(--gold); animation: slideLeft 0.3s ease; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }

  /* VIEWER */
  .viewer-note { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: rgba(91,139,244,0.1); border: 1px solid rgba(91,139,244,0.2); border-radius: 6px; font-size: 12px; color: #5B8BF4; font-family: 'DM Mono', monospace; }

  /* TOOLTIP */
  .custom-tt { background: var(--surface2); border: 1px solid var(--border2); border-radius: 8px; padding: 10px 14px; font-size: 12px; }
  .tt-label { color: var(--text-3); margin-bottom: 4px; font-family: 'DM Mono', monospace; font-size: 11px; }
  .tt-value { color: var(--gold); font-family: 'DM Mono', monospace; font-weight: 500; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes slideLeft { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  @media (max-width: 1024px) {
    .summary-grid { grid-template-columns: repeat(2, 1fr); }
    .chart-row { grid-template-columns: 1fr; }
    .insights-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .main { margin-left: 0; }
    .summary-grid { grid-template-columns: 1fr 1fr; }
    .insights-grid { grid-template-columns: 1fr; }
    .page { padding: 20px; }
    .topbar { padding: 12px 16px; }
    .topbar-right { gap: 6px; }
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tt">
      <div className="tt-label">{label}</div>
      {payload.map((p, i) => <div key={i} className="tt-value" style={{ color: p.color }}>{fmt(p.value)}</div>)}
    </div>
  );
};

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState("en");
  const t = LANGS[lang];

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

  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach(tx => {
      const d = new Date(tx.date); const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      if (!map[key]) map[key] = { name: MONTHS[d.getMonth()], income: 0, expense: 0 };
      map[key][tx.type] += tx.amount;
    });
    return Object.values(map);
  }, [transactions]);

  const catData = useMemo(() => {
    const map = {};
    transactions.filter(tx=>tx.type==="expense").forEach(tx => { map[tx.category] = (map[tx.category]||0)+tx.amount; });
    return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  }, [transactions]);

  const trendData = useMemo(() => {
    let bal = 0;
    return [...transactions].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(tx => {
      bal += tx.type==="income" ? tx.amount : -tx.amount;
      return { name: fmtDate(tx.date), balance: bal };
    });
  }, [transactions]);

  const filtered = useMemo(() => {
    let r = transactions.filter(tx => {
      const s = search.toLowerCase();
      return (!s || tx.category.toLowerCase().includes(s) || tx.note.toLowerCase().includes(s) || String(tx.amount).includes(s))
        && (filterType==="all" || tx.type===filterType)
        && (filterCat==="all" || tx.category===filterCat);
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
      setTransactions(prev => prev.map(tx => tx.id===editTx.id ? { ...tx, ...form, amount:amt } : tx));
      showToast(t.txUpdated);
    } else {
      const id = Math.max(...transactions.map(tx=>tx.id))+1;
      setTransactions(prev => [{ id, ...form, amount:amt }, ...prev]);
      showToast(t.txAdded);
    }
    setShowModal(false);
  };
  const deleteTx = (id) => { setTransactions(prev=>prev.filter(tx=>tx.id!==id)); showToast(t.txDeleted); };

  const topCat = catData[0];
  const prevMonthExp = monthlyData.length >= 2 ? monthlyData[monthlyData.length-2]?.expense : 0;
  const currMonthExp = monthlyData.length >= 1 ? monthlyData[monthlyData.length-1]?.expense : 0;
  const expChangePct = prevMonthExp ? (((currMonthExp-prevMonthExp)/prevMonthExp)*100).toFixed(1) : 0;
  const savingsRate = totalIncome > 0 ? ((balance/totalIncome)*100).toFixed(1) : 0;

  const navItems = [
    { id:"dashboard", icon:"◈", label: t.overview },
    { id:"transactions", icon:"≡", label: t.transactions },
    { id:"insights", icon:"◎", label: t.insights },
  ];

  const tickColor = dark ? "#5A5855" : "#A09890";

  return (
    <>
      <style>{makeCSS(dark)}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-dot" />
            {t.appName}
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
            <div style={{ fontSize:11, color:"var(--text-3)", fontFamily:"'DM Mono', monospace", lineHeight:1.8 }}>
              <div>{transactions.length} {t.transactions.toLowerCase()}</div>
              <div style={{ color:"var(--gold)", opacity:0.7 }}>{t.appName} v2.0</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-left">
              <div className="topbar-title">
                {page==="dashboard" ? t.financialOverview : page==="transactions" ? t.transactions : t.insights}
              </div>
              <div className="topbar-sub">
                {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
              </div>
            </div>
            <div className="topbar-right">
              {/* Language selector */}
              <div className="ctrl-pill">
                🌐
                <select value={lang} onChange={e=>setLang(e.target.value)}>
                  {Object.entries(LANGS).map(([k,v]) => (
                    <option key={k} value={k}>{v.flag} {v.name}</option>
                  ))}
                </select>
              </div>
              {/* Dark/Light toggle */}
              <button className="theme-btn" onClick={()=>setDark(d=>!d)}>
                {dark ? "☀️" : "🌙"} {dark ? t.lightMode : t.darkMode}
              </button>
              {/* Role */}
              <div className="ctrl-pill">
                <span>{t.role}:</span>
                <select value={role} onChange={e=>setRole(e.target.value)}>
                  <option value="admin">{t.admin}</option>
                  <option value="viewer">{t.viewer}</option>
                </select>
              </div>
              {/* User */}
              <div className="user-badge">
                <div className="user-avatar">AA</div>
                <span className="user-name">Aastha A.</span>
              </div>
            </div>
          </div>

          {/* ── DASHBOARD ── */}
          {page==="dashboard" && (
            <div className="page">
              <div className="summary-grid">
                <div className="summary-card gold">
                  <div className="card-header"><span className="card-label">{t.netBalance}</span><span className="card-icon">◈</span></div>
                  <div className="card-value gold">{fmt(balance)}</div>
                  <div className="card-footer"><span className={`badge ${balance>=0?"up":"down"}`}>{balance>=0?"↑":"↓"} {Math.abs(savingsRate)}%</span>{t.savingsRate}</div>
                </div>
                <div className="summary-card green">
                  <div className="card-header"><span className="card-label">{t.totalIncome}</span><span className="card-icon">↑</span></div>
                  <div className="card-value green">{fmt(totalIncome)}</div>
                  <div className="card-footer">{transactions.filter(tx=>tx.type==="income").length} {t.entriesRecorded}</div>
                </div>
                <div className="summary-card red">
                  <div className="card-header"><span className="card-label">{t.totalExpenses}</span><span className="card-icon">↓</span></div>
                  <div className="card-value red">{fmt(totalExpense)}</div>
                  <div className="card-footer">{transactions.filter(tx=>tx.type==="expense").length} {t.entriesRecorded}</div>
                </div>
                <div className="summary-card blue">
                  <div className="card-header"><span className="card-label">{t.transactions}</span><span className="card-icon">≡</span></div>
                  <div className="card-value" style={{ color:"#5B8BF4" }}>{transactions.length}</div>
                  <div className="card-footer">{t.acrossCategories} {catData.length} {t.categories}</div>
                </div>
              </div>

              <div className="chart-row">
                <div className="chart-card">
                  <div className="chart-title">{t.balanceTrend}</div>
                  <div className="chart-sub">{t.balanceTrendSub}</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.06)"} />
                      <XAxis dataKey="name" tick={{ fill:tickColor, fontSize:10, fontFamily:"'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill:tickColor, fontSize:10, fontFamily:"'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="balance" stroke="#C9A84C" fill="url(#gold-grad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-card">
                  <div className="chart-title">{t.spendingBreakdown}</div>
                  <div className="chart-sub">{t.spendingBreakdownSub}</div>
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

              <div className="chart-card">
                <div className="chart-title">{t.monthlyComparison}</div>
                <div className="chart-sub">{t.monthlyComparisonSub}</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData} barGap={4} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke={dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.06)"} />
                    <XAxis dataKey="name" tick={{ fill:tickColor, fontSize:10, fontFamily:"'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:tickColor, fontSize:10, fontFamily:"'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)} width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="income" fill="#4CAF7D" radius={[4,4,0,0]} name={t.income} />
                    <Bar dataKey="expense" fill="#E05252" radius={[4,4,0,0]} name={t.expense} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── TRANSACTIONS ── */}
          {page==="transactions" && (
            <div className="page">
              <div className="section-header">
                <div>
                  <div className="section-title">{t.allTransactions}</div>
                  <div style={{ fontSize:12, color:"var(--text-3)", marginTop:4, fontFamily:"'DM Mono', monospace" }}>{filtered.length} {t.recordsFound}</div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  {role==="viewer" && <div className="viewer-note">◉ {t.viewOnly}</div>}
                  {role==="admin" && <button className="add-btn" onClick={openAdd}>{t.addTransaction}</button>}
                </div>
              </div>

              <div className="filters">
                <input className="filter-input" placeholder={t.searchPlaceholder} value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1);}} />
                <select className="filter-input" style={{ minWidth:120 }} value={filterType} onChange={e=>{setFilterType(e.target.value);setCurrentPage(1);}}>
                  <option value="all">{t.allTypes}</option>
                  <option value="income">{t.income}</option>
                  <option value="expense">{t.expense}</option>
                </select>
                <select className="filter-input" style={{ minWidth:130 }} value={filterCat} onChange={e=>{setFilterCat(e.target.value);setCurrentPage(1);}}>
                  <option value="all">{t.allCategories}</option>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <button className={`filter-btn ${filterType==="all"&&filterCat==="all"&&!search?"":"active"}`} onClick={()=>{setSearch("");setFilterType("all");setFilterCat("all");setCurrentPage(1);}}>{t.clear}</button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th onClick={()=>handleSort("date")}>{t.date} {sortKey==="date"?(sortDir==="asc"?"↑":"↓"):""}</th>
                      <th>{t.category}</th>
                      <th>{t.type}</th>
                      <th onClick={()=>handleSort("amount")}>{t.amount} {sortKey==="amount"?(sortDir==="asc"?"↑":"↓"):""}</th>
                      <th>{t.note}</th>
                      {role==="admin" && <th>{t.actions}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr><td colSpan={role==="admin"?6:5}>
                        <div className="empty-state">
                          <div className="empty-icon">⊘</div>
                          <div className="empty-text">{t.noMatch}</div>
                        </div>
                      </td></tr>
                    ) : paginated.map(tx => (
                      <tr key={tx.id}>
                        <td className="date-cell">{fmtDate(tx.date)}</td>
                        <td><span className="cat-pill">{catEmoji(tx.category)} {tx.category}</span></td>
                        <td><span className={`type-pill ${tx.type}`}>{tx.type==="income"?`↑ ${t.income}`:`↓ ${t.expense}`}</span></td>
                        <td><span className={`amount-cell ${tx.type}`}>{tx.type==="income"?"+":"-"}{fmt(tx.amount)}</span></td>
                        <td style={{ color:"var(--text-2)", fontSize:12 }}>{tx.note}</td>
                        {role==="admin" && (
                          <td style={{ display:"flex", gap:6 }}>
                            <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(tx)}>{t.edit}</button>
                            <button className="btn btn-danger btn-sm" onClick={()=>deleteTx(tx.id)}>{t.del}</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginated.length > 0 && (
                  <div className="pagination">
                    <div className="page-info">{t.showing} {((currentPage-1)*PER_PAGE)+1}–{Math.min(currentPage*PER_PAGE,filtered.length)} {t.of} {filtered.length}</div>
                    <div className="page-btns">
                      <button className="page-btn" disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}>{t.prev}</button>
                      {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                        <button key={p} className={`page-btn ${p===currentPage?"current":""}`} onClick={()=>setCurrentPage(p)}>{p}</button>
                      ))}
                      <button className="page-btn" disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}>{t.next}</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── INSIGHTS ── */}
          {page==="insights" && (
            <div className="page">
              <div className="section-title" style={{ marginBottom:4 }}>{t.financialInsights}</div>
              <div style={{ fontSize:12, color:"var(--text-3)", marginBottom:20, fontFamily:"'DM Mono', monospace" }}>{t.insightsSub}</div>
              <div className="insights-grid">
                <div className="insight-card">
                  <div className="insight-icon">🏆</div>
                  <div className="insight-label">{t.topSpending}</div>
                  <div className="insight-value">{topCat?.name || "—"}</div>
                  <div className="insight-desc">{t.accountsFor} {fmt(topCat?.value||0)} — {totalExpense ? ((topCat?.value/totalExpense)*100).toFixed(1) : 0}{t.ofTotalSpending}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">{parseFloat(expChangePct)>0?"📈":"📉"}</div>
                  <div className="insight-label">{t.momExpenses}</div>
                  <div className="insight-value" style={{ color: parseFloat(expChangePct)>0?"var(--red)":"var(--green)" }}>{expChangePct > 0 ? "+" : ""}{expChangePct}%</div>
                  <div className="insight-desc">{parseFloat(expChangePct)>0?t.expensesIncreased:t.expensesDecreased}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">💰</div>
                  <div className="insight-label">{t.savingsRateLabel}</div>
                  <div className="insight-value">{savingsRate}%</div>
                  <div className="insight-desc">{t.savingOut} {fmt(balance)} {t.outOf} {fmt(totalIncome)} {t.totalIncomeLabel}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">📊</div>
                  <div className="insight-label">{t.avgTransaction}</div>
                  <div className="insight-value">{fmt(Math.round((totalIncome+totalExpense)/transactions.length))}</div>
                  <div className="insight-desc">{t.averageAcross} {transactions.length} {t.transactionsRecorded}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">🎯</div>
                  <div className="insight-label">{t.expenseCategories}</div>
                  <div className="insight-value">{catData.length}</div>
                  <div className="insight-desc">{t.spendingSpread} {catData.length} {t.uniqueCategories} {topCat?.name}.</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">📅</div>
                  <div className="insight-label">{t.mostActiveMonth}</div>
                  <div className="insight-value">{monthlyData.reduce((a,b)=>(a.income+a.expense>b.income+b.expense)?a:b, monthlyData[0]||{})?.name||"—"}</div>
                  <div className="insight-desc">{t.highestActivity}</div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-title">{t.categoryBreakdown}</div>
                <div className="chart-sub">{t.categoryBreakdownSub}</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={catData} layout="vertical" barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke={dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.06)"} horizontal={false} />
                    <XAxis type="number" tick={{ fill:tickColor, fontSize:10, fontFamily:"'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)} />
                    <YAxis type="category" dataKey="name" tick={{ fill: dark?"#9B9890":"#6B6560", fontSize:11, fontFamily:"'Instrument Sans', sans-serif" }} axisLine={false} tickLine={false} width={90} />
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
            <div className="modal-title">{editTx ? t.editTransaction : t.newTransaction}</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t.dateLabel}</label>
                <input type="date" className="form-input" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">{t.amountLabel}</label>
                <input type="number" className="form-input" placeholder="0.00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t.categoryLabel}</label>
                <select className="form-input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t.typeLabel}</label>
                <select className="form-input" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  <option value="income">{t.income}</option>
                  <option value="expense">{t.expense}</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t.noteLabel}</label>
              <input className="form-input" placeholder="Short description…" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setShowModal(false)}>{t.cancel}</button>
              <button className="btn btn-primary" onClick={saveModal}>{editTx?t.saveChanges:t.addBtn}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">✦ {toast}</div>}
    </>
  );
}
