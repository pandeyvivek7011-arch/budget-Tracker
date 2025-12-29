import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Target, 
  Settings, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  IndianRupee, 
  Save, 
  Filter, 
  Sparkles, 
  Loader2, 
  X, 
  MessageSquareQuote, 
  Tags, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Moon, 
  Sun,
  AlertTriangle,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Info,
  Shield,
  FileText,
  Briefcase,
  PiggyBank, 
  Calculator
} from 'lucide-react';
import TrackerInfo from './pages/TrackerInfo.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query,
  writeBatch
} from 'firebase/firestore';

// --- UPDATED CONFIGURATION FOR VERCEL ---
// We use import.meta.env to access variables in Vite/Vercel
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const appId = 'Tracker-web'; // Fixed ID for your app

// Use a static ID or environment variable for the app namespace
const appId = 'budget-tracker-production';

// --- MOCK DATA ---
const INITIAL_CATEGORIES = [
  { id: 'inc1', name: 'Job', type: 'income', plan: 50000, priority: '1: Very important' },
  { id: 'inc2', name: 'Upwork', type: 'income', plan: 6000, priority: '2: Important' },
  { id: 'inc3', name: 'Website', type: 'income', plan: 10000, priority: '3: Neutral' },
  { id: 'sav1', name: 'College Fee', type: 'savings', plan: 25000, priority: '1: Very important' },
  { id: 'sav2', name: 'Mutual Funds', type: 'savings', plan: 15000, priority: '1: Very important' },
  { id: 'sav3', name: 'Emergency Fund', type: 'savings', plan: 20000, priority: '1: Very important' },
  { id: 'bill1', name: 'Electricity', type: 'bill', plan: 1000, priority: '1: Very important' },
  { id: 'bill2', name: 'House Rent', type: 'bill', plan: 15000, priority: '1: Very important' },
  { id: 'bill3', name: 'Cooking Gas', type: 'bill', plan: 900, priority: '1: Very important' },
  { id: 'bill4', name: 'Water', type: 'bill', plan: 2000, priority: '2: Important' },
  { id: 'bill5', name: 'Mobile Bill', type: 'bill', plan: 500, priority: '2: Important' },
  { id: 'bill6', name: 'Wifi', type: 'bill', plan: 1000, priority: '1: Very important' },
  { id: 'bill7', name: 'Vehicle Insurance', type: 'bill', plan: 4000, priority: '1: Very important' },
  { id: 'exp1', name: 'Groceries', type: 'expense', plan: 8000, priority: '1: Very important' },
  { id: 'exp2', name: 'Medicines', type: 'expense', plan: 1500, priority: '1: Very important' },
  { id: 'exp3', name: 'Clothes', type: 'expense', plan: 2000, priority: '4: Less important' },
  { id: 'exp4', name: 'Uber/Taxi', type: 'expense', plan: 1000, priority: '3: Neutral' },
  { id: 'exp5', name: 'Eating Out', type: 'expense', plan: 3000, priority: '4: Less important' },
  { id: 'debt1', name: 'Car Loan', type: 'debt', plan: 5000, priority: '1: Very important' },
  { id: 'debt2', name: 'Credit Card', type: 'debt', plan: 2000, priority: '1: Very important' },
];

const INITIAL_TRANSACTIONS = [
  { id: 'tx1', date: '2024-09-01', amount: 50000, categoryId: 'inc1', note: 'Salary' },
  { id: 'tx2', date: '2024-09-02', amount: 18000, categoryId: 'inc2', note: 'Freelance Project' },
  { id: 'tx3', date: '2024-09-05', amount: 1000, categoryId: 'bill1', note: 'August Bill' },
  { id: 'tx4', date: '2024-09-05', amount: 15000, categoryId: 'bill2', note: 'Rent' },
  { id: 'tx5', date: '2024-09-06', amount: 900, categoryId: 'bill3', note: 'Cylinder' },
  { id: 'tx6', date: '2024-09-10', amount: 150, categoryId: 'exp4', note: 'Trip to market' },
  { id: 'tx7', date: '2024-09-12', amount: 2500, categoryId: 'exp1', note: 'Big basket' },
  { id: 'tx8', date: '2024-09-15', amount: 2000, categoryId: 'exp3', note: 'Sale shopping' },
  { id: 'tx9', date: '2024-09-20', amount: 5000, categoryId: 'sav2', note: 'SIP' },
  { id: 'tx10', date: '2024-09-21', amount: 25000, categoryId: 'sav1', note: 'Semester fee' },
  { id: 'tx11', date: '2024-08-15', amount: 1500, categoryId: 'exp5', note: 'Independence Day Dinner' },
  { id: 'tx12', date: '2024-08-01', amount: 50000, categoryId: 'inc1', note: 'August Salary' },
];

// --- CONSTANTS ---
const PRIORITIES = [
  '1: Very important',
  '2: Important',
  '3: Neutral',
  '4: Less important',
  '5: Not important'
];

const COLORS = {
  income: '#10b981', 
  savings: '#3b82f6',
  bill: '#f43f5e',
  expense: '#f59e0b',
  debt: '#8b5cf6',
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

// --- API ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Gemini API Error: ${response.statusText}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API call failed", error);
    throw error;
  }
}

// --- CONTENT ---
const PAGES_CONTENT = {
  info: `
    <div class="space-y-6">
      <h2 class="text-xl font-bold text-slate-800 mb-2">Welcome to Budget Tracker</h2>
      <p class="text-slate-600">Take control of your finances through intuitive tracking and AI-powered insights.</p>
      <h3 class="text-lg font-semibold text-indigo-600 mb-3">🚀 Key Features</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600">
        <li><strong>Dashboard:</strong> Visual analytics.</li>
        <li><strong>Investments:</strong> AI-powered recommendations.</li>
        <li><strong>Transaction Log:</strong> Record earnings and expenses.</li>
        <li><strong>✨ Magic Add:</strong> Use AI to add transactions naturally.</li>
        <li><strong>Calculators:</strong> Tools for EMI, SIP, and Inflation.</li>
      </ul>
    </div>
  `,
  privacy: `
    <div class="space-y-6">
      <p class="text-slate-600">Your privacy is important to us. Data is stored securely in Google Firestore.</p>
      <h3 class="text-lg font-semibold text-indigo-600 mb-2">Data Collection</h3>
      <ul class="list-disc pl-5 space-y-1 text-slate-600">
        <li>Financial transactions and budget data.</li>
        <li>Authentication data via Google Firebase.</li>
      </ul>
    </div>
  `,
  terms: `
    <div class="space-y-6">
      <p class="text-slate-600">By using this application, you agree to the terms.</p>
      <h3 class="text-lg font-semibold text-indigo-600 mb-2">Disclaimer</h3>
      <p class="text-slate-600"><strong>This app does not provide professional financial advice.</strong></p>
    </div>
  `
};

// --- COMPONENTS ---

const Card = ({ children, className = '', style = {}, darkMode }) => (
  <div className={`rounded-xl shadow-sm border transition-colors duration-200 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-100'} ${className}`} style={style}>{children}</div>
);

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, darkMode }) => (
  <Card className="p-6" darkMode={darkMode}>
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
        <h3 className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{value}</h3>
        {subtext && <p className={`text-sm mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}><Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} /></div>
    </div>
  </Card>
);

const ProgressBar = ({ value, max, color, darkMode }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100)) || 0;
  return (
    <div className={`h-2 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} />
    </div>
  );
};

const NavItem = ({ id, label, icon: Icon, activeTab, setActiveTab, darkMode }) => (
  <button onClick={() => setActiveTab(id)} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : `${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-indigo-400' : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`}`}>
    <Icon className="w-5 h-5" />{label}
  </button>
);

const StaticPage = ({ title, content }) => (
  <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
      <h1 className="text-3xl font-bold text-indigo-600 border-b border-slate-100 pb-6 mb-8">{title}</h1>
      <div>
        {typeof content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          content
        )}
      </div>
      <footer className="mt-12 text-center text-slate-400 text-sm border-t border-slate-100 pt-8">&copy; {new Date().getFullYear()} Budget Tracker App.</footer>
    </div>
  </div>
);

const Footer = ({ darkMode }) => (
  <footer className={`mt-12 py-8 border-t text-center ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
    <div className="flex justify-center gap-6 mb-4 text-sm font-medium">
      <a href="/tracker-info" onClick={(e) => { e.preventDefault(); history.pushState({}, '', '/tracker-info'); window.dispatchEvent(new PopStateEvent('popstate')); }} className={`flex items-center gap-1 hover:underline ${darkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}><Info className="w-4 h-4" /> Info & Guide</a>
      <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); history.pushState({}, '', '/privacy-policy'); window.dispatchEvent(new PopStateEvent('popstate')); }} className={`flex items-center gap-1 hover:underline ${darkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}><Shield className="w-4 h-4" /> Privacy Policy</a>
      <a href="/terms-and-conditions" onClick={(e) => { e.preventDefault(); history.pushState({}, '', '/terms-and-conditions'); window.dispatchEvent(new PopStateEvent('popstate')); }} className={`flex items-center gap-1 hover:underline ${darkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}><FileText className="w-4 h-4" /> Terms & Conditions</a>
    </div>
    <p className="text-xs">&copy; {new Date().getFullYear()} Budget Tracker.</p>
  </footer>
);

// --- VIEW COMPONENTS ---

const DashboardView = ({ totals, currency, aiInsight, isAiLoading, generateInsights, setAiInsight, categoryStats, transactions, currentMonthName, darkMode }) => {
  const barChartData = [
    { name: 'Income', Plan: totals.income.plan, Actual: totals.income.actual },
    { name: 'Savings', Plan: totals.savings.plan, Actual: totals.savings.actual },
    { name: 'Bills', Plan: totals.bills.plan, Actual: totals.bills.actual },
    { name: 'Expenses', Plan: totals.expenses.plan, Actual: totals.expenses.actual },
    { name: 'Debt', Plan: totals.debt.plan, Actual: totals.debt.actual },
  ];

  const pieChartData = useMemo(() => categoryStats.filter(c => ['expense', 'bill'].includes(c.type) && c.actual > 0).map(c => ({ name: c.name, value: c.actual })), [categoryStats]);

  const lineChartData = useMemo(() => {
    const dailyData = {};
    transactions.forEach(tx => {
      const day = new Date(tx.date).getDate();
      const cat = categoryStats.find(c => c.id === tx.categoryId);
      if (cat && cat.type !== 'income' && cat.type !== 'savings') {
        dailyData[day] = (dailyData[day] || 0) + tx.amount;
      }
    });
    return Object.keys(dailyData).sort((a, b) => a - b).map(day => ({ day: `Day ${day}`, amount: dailyData[day] }));
  }, [transactions, categoryStats]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Income" value={`${currency}${totals.income.actual.toLocaleString()}`} subtext={`Planned: ${currency}${totals.income.plan.toLocaleString()}`} icon={TrendingUp} colorClass="bg-emerald-500 text-emerald-500" darkMode={darkMode} />
        <StatCard title="Total Spending" value={`${currency}${totals.totalOut.toLocaleString()}`} subtext="Bills + Expenses + Debt" icon={TrendingDown} colorClass="bg-rose-500 text-rose-500" darkMode={darkMode} />
        <StatCard title="Total Savings" value={`${currency}${totals.savings.actual.toLocaleString()}`} subtext={`Target: ${currency}${totals.savings.plan.toLocaleString()}`} icon={Wallet} colorClass="bg-blue-500 text-blue-500" darkMode={darkMode} />
        <StatCard title="Remaining Budget" value={`${currency}${totals.remaining.toLocaleString()}`} subtext="Available to spend/save" icon={Target} colorClass={totals.remaining >= 0 ? "bg-slate-500 text-slate-500" : "bg-red-500 text-red-500"} darkMode={darkMode} />
      </div>

      <div className="w-full">
        {!aiInsight ? (
          <button onClick={generateInsights} disabled={isAiLoading} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white p-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all group">
            {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            <span className="font-semibold">Generate AI Insights for {currentMonthName}</span>
          </button>
        ) : (
          <Card className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-800' : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100'} p-6`} darkMode={darkMode}>
            <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="w-24 h-24 text-indigo-600" /></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}><MessageSquareQuote className="w-6 h-6" /></div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>Gemini's Insights</h3>
                <ul className="space-y-2">{aiInsight.map((tip, idx) => (<li key={idx} className={`flex items-start gap-2 text-sm ${darkMode ? 'text-indigo-100' : 'text-indigo-800'}`}><span className="mt-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />{tip}</li>))}</ul>
                <button onClick={() => setAiInsight(null)} className="mt-4 text-xs font-medium text-indigo-500 hover:text-indigo-600 underline">Refresh Analysis</button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" darkMode={darkMode}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Plan vs Actual</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000' }} cursor={{ fill: darkMode ? '#334155' : '#f1f5f9' }} />
                <Legend wrapperStyle={{ color: darkMode ? '#fff' : '#000' }} />
                <Bar dataKey="Plan" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6" darkMode={darkMode}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Expense Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000' }} />
                <Legend wrapperStyle={{ color: darkMode ? '#fff' : '#000' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="p-6" darkMode={darkMode}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Daily Spending Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000' }} />
                <Line type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6" darkMode={darkMode}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Spending Priorities</h3>
          <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Where is your money going based on importance?</p>
          <div className="space-y-4">
            {PRIORITIES.map(priority => {
              const priorityTotal = categoryStats.filter(c => c.priority === priority && ['bill', 'expense', 'debt'].includes(c.type)).reduce((sum, c) => sum + c.actual, 0);
              if (priorityTotal === 0) return null;
              const idx = PRIORITIES.indexOf(priority);
              return (
                <div key={priority}>
                  <div className="flex justify-between text-sm mb-1"><span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{priority}</span><span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{currency}{priorityTotal.toLocaleString()}</span></div>
                  <div className={`h-2 w-full rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}><div className={`h-full rounded-full bg-indigo-500`} style={{ width: `${(priorityTotal / totals.totalOut) * 100}%`, opacity: 1 - (idx * 0.15) }}></div></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

const InvestmentsView = ({ totals, currency, darkMode }) => {
  const [riskProfile, setRiskProfile] = useState('Moderate');
  const [goal, setGoal] = useState('Retirement');
  const [investmentAdvice, setInvestmentAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInvestmentAdvice = async () => {
    setLoading(true);
    try {
      const prompt = `Financial investment advice. User: Savings ${currency}${totals.savings.actual}, Risk: ${riskProfile}, Goal: ${goal}. Provide asset allocation, vehicles, and strategy. HTML format.`;
      const response = await callGemini(prompt);
      setInvestmentAdvice(response);
    } catch (e) {
      setInvestmentAdvice("<p>Could not generate advice at this time.</p>");
    } finally {
      setLoading(false);
    }
  };

  const projectedSavings = totals.savings.actual * 12;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6" darkMode={darkMode}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}><Settings className="w-5 h-5 text-indigo-500" /> Investment Profile</h3>
          <div className="space-y-4">
            <div><label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Risk Tolerance</label><select className={`w-full p-2 border rounded-lg outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} value={riskProfile} onChange={(e) => setRiskProfile(e.target.value)}><option value="Conservative">Conservative</option><option value="Moderate">Moderate</option><option value="Aggressive">Aggressive</option></select></div>
            <div><label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Primary Goal</label><input type="text" className={`w-full p-2 border rounded-lg outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Buying a House" /></div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}><p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Current Monthly Savings</p><p className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{currency}{totals.savings.actual.toLocaleString()}</p></div>
            <button onClick={generateInvestmentAdvice} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}Get AI Advice</button>
          </div>
        </Card>
        <Card className="p-6" darkMode={darkMode}>
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}><PiggyBank className="w-5 h-5 text-emerald-500" /> Savings Projection</h3>
          <div className="flex flex-col justify-center h-full space-y-6">
             <div className="text-center"><p className={`text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Projected 1 Year Savings</p><h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{currency}{projectedSavings.toLocaleString()}</h2><p className="text-xs text-slate-400 mt-2">*Excluding interest</p></div>
             <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}><h4 className={`font-semibold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Quick Tip</h4><p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Investing just 20% of your monthly savings can beat inflation.</p></div>
          </div>
        </Card>
      </div>
      {investmentAdvice && (
        <Card className="p-6 border-indigo-100 bg-gradient-to-br from-white to-indigo-50 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700" darkMode={darkMode}>
           <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}><Briefcase className="w-6 h-6 text-indigo-600" /> Recommendation</h3>
           <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`} dangerouslySetInnerHTML={{ __html: investmentAdvice }} />
        </Card>
      )}
    </div>
  );
};

const CalculatorsView = ({ darkMode }) => {
  const [activeCalc, setActiveCalc] = useState('emi'); 
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [emiResult, setEmiResult] = useState(null);
  const [monthlyInvest, setMonthlyInvest] = useState('');
  const [returnRate, setReturnRate] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [sipResult, setSipResult] = useState(null);
  const [currentCost, setCurrentCost] = useState('');
  const [inflationRate, setInflationRate] = useState('');
  const [years, setYears] = useState('');
  const [inflationResult, setInflationResult] = useState(null);

  const calculateEMI = () => { const P = parseFloat(loanAmount), R = parseFloat(interestRate)/12/100, N = parseFloat(loanTenure)*12; if(P&&R&&N) setEmiResult(Math.round((P*R*Math.pow(1+R,N))/(Math.pow(1+R,N)-1))); };
  const calculateSIP = () => { const P = parseFloat(monthlyInvest), i = parseFloat(returnRate)/12/100, n = parseFloat(timePeriod)*12; if(P&&i&&n) setSipResult(Math.round(P*((Math.pow(1+i,n)-1)/i)*(1+i))); };
  const calculateInflation = () => { const P = parseFloat(currentCost), R = parseFloat(inflationRate)/100, N = parseFloat(years); if(P&&R&&N) setInflationResult(Math.round(P*Math.pow(1+R,N))); };

  const inputClass = `w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' : 'bg-white border-slate-200 placeholder-slate-400'}`;
  const labelClass = `block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4 mb-6">
        {['emi', 'sip', 'inflation'].map(calc => (
          <button key={calc} onClick={() => setActiveCalc(calc)} className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${activeCalc === calc ? 'bg-indigo-600 text-white' : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100')}`}>{calc === 'emi' ? 'Loan EMI' : calc === 'sip' ? 'SIP Planner' : 'Inflation'}</button>
        ))}
      </div>
      <div className="max-w-xl mx-auto">
        <Card className="p-6" darkMode={darkMode}>
          {activeCalc === 'emi' && (
            <div className="space-y-4">
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Loan EMI Calculator</h3>
              <div><label className={labelClass}>Loan Amount</label><input type="number" className={inputClass} value={loanAmount} onChange={e => setLoanAmount(e.target.value)} placeholder="e.g. 500000" /></div>
              <div><label className={labelClass}>Interest Rate (%)</label><input type="number" className={inputClass} value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="e.g. 8.5" /></div>
              <div><label className={labelClass}>Tenure (Years)</label><input type="number" className={inputClass} value={loanTenure} onChange={e => setLoanTenure(e.target.value)} placeholder="e.g. 5" /></div>
              <button onClick={calculateEMI} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg mt-2">Calculate EMI</button>
              {emiResult && (<div className={`mt-4 p-4 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}><p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Monthly EMI</p><p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>₹{emiResult.toLocaleString()}</p></div>)}
            </div>
          )}
          {activeCalc === 'sip' && (
            <div className="space-y-4">
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>SIP Calculator</h3>
              <div><label className={labelClass}>Monthly Investment</label><input type="number" className={inputClass} value={monthlyInvest} onChange={e => setMonthlyInvest(e.target.value)} placeholder="e.g. 5000" /></div>
              <div><label className={labelClass}>Return Rate (%)</label><input type="number" className={inputClass} value={returnRate} onChange={e => setReturnRate(e.target.value)} placeholder="e.g. 12" /></div>
              <div><label className={labelClass}>Time Period (Years)</label><input type="number" className={inputClass} value={timePeriod} onChange={e => setTimePeriod(e.target.value)} placeholder="e.g. 10" /></div>
              <button onClick={calculateSIP} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg mt-2">Calculate Value</button>
              {sipResult && (<div className={`mt-4 p-4 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}><p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Future Value</p><p className={`text-3xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>₹{sipResult.toLocaleString()}</p></div>)}
            </div>
          )}
          {activeCalc === 'inflation' && (
            <div className="space-y-4">
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Inflation Calculator</h3>
              <div><label className={labelClass}>Current Cost</label><input type="number" className={inputClass} value={currentCost} onChange={e => setCurrentCost(e.target.value)} placeholder="e.g. 100000" /></div>
              <div><label className={labelClass}>Inflation Rate (%)</label><input type="number" className={inputClass} value={inflationRate} onChange={e => setInflationRate(e.target.value)} placeholder="e.g. 6" /></div>
              <div><label className={labelClass}>Years Later</label><input type="number" className={inputClass} value={years} onChange={e => setYears(e.target.value)} placeholder="e.g. 20" /></div>
              <button onClick={calculateInflation} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg mt-2">Calculate Future Cost</button>
              {inflationResult && (<div className={`mt-4 p-4 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}><p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Future Cost</p><p className={`text-3xl font-bold ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>₹{inflationResult.toLocaleString()}</p></div>)}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// --- AUTH MODAL ---
const AuthModal = ({ isOpen, onClose, authMode, setAuthMode, darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            {authMode === 'signup' ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            {authMode === 'signup' ? 'Create Account' : 'Sign In'}
          </h3>
          <button onClick={onClose} className={`hover:text-slate-500 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Email</label>
            <input 
              type="email" 
              required
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' : 'bg-white border-slate-200 placeholder-slate-400'}`}
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Password</label>
            <input 
              type="password" 
              required
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' : 'bg-white border-slate-200 placeholder-slate-400'}`}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors flex justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'signup' ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>
            {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button 
            onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
            className="ml-1 text-indigo-500 hover:underline font-medium"
          >
            {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN FUNCTIONAL COMPONENT ---
const MainTracker = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currency] = useState('₹');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); 

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const [showMagicAdd, setShowMagicAdd] = useState(false);
  const [magicText, setMagicText] = useState("");
  const [magicError, setMagicError] = useState("");

  // Category Management State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    type: 'expense', 
    plan: '', 
    priority: '3: Neutral' 
  });

  // --- FIREBASE AUTH & DATA SYNC ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
           await signInWithCustomToken(auth, __initial_auth_token);
        } else {
           await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
        try { await signInAnonymously(auth); } catch(e) { console.error("Fallback auth failed", e); }
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });
    return () => unsubscribe();
  }, []);

  const hasSeededRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    const categoriesQuery = query(collection(db, 'artifacts', appId, 'users', user.uid, 'categories'));
    const unsubCategories = onSnapshot(categoriesQuery, (snapshot) => {
      if (snapshot.empty && !hasSeededRef.current) {
        hasSeededRef.current = true;
        const batch = writeBatch(db);
        INITIAL_CATEGORIES.forEach(cat => {
           const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'categories', cat.id);
           batch.set(docRef, cat);
        });
        INITIAL_TRANSACTIONS.forEach(tx => {
           const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'transactions', tx.id);
           batch.set(docRef, tx);
        });
        batch.commit().catch(console.error);
      } else {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(data);
      }
    });

    const transactionsQuery = query(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'));
    const unsubTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      unsubCategories();
      unsubTransactions();
    };
  }, [user]);

  // --- DERIVED STATE ---
  const currentMonthName = useMemo(() => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentDate.getMonth() && 
             tDate.getFullYear() === currentDate.getFullYear();
    });
  }, [transactions, currentDate]);

  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const actual = filteredTransactions
        .filter(t => t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...cat, actual };
    });
  }, [categories, filteredTransactions]);

  const totals = useMemo(() => {
    const calc = (type) => categoryStats
      .filter(c => c.type === type)
      .reduce((acc, curr) => ({ 
        plan: acc.plan + curr.plan, 
        actual: acc.actual + curr.actual 
      }), { plan: 0, actual: 0 });

    return {
      income: calc('income'),
      savings: calc('savings'),
      bills: calc('bill'),
      expenses: calc('expense'),
      debt: calc('debt'),
      totalOut: 0
    };
  }, [categoryStats]);

  totals.totalOut = totals.bills.actual + totals.expenses.actual + totals.debt.actual;
  totals.remaining = totals.income.actual - totals.totalOut - totals.savings.actual;

  // --- ACTIONS ---
  const addTransaction = async (newTx) => {
    if (!user) return;
    try {
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'), {
            ...newTx, amount: parseFloat(newTx.amount)
        });
    } catch (e) { console.error("Error adding transaction", e); }
  };

  const deleteTransaction = async (id) => {
    if (!user) return;
    try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'transactions', id));
    } catch (e) { console.error("Error deleting transaction", e); }
  };

  const updateCategoryPlan = async (id, newPlan) => {
    if (!user) return;
    try {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'categories', id), {
            plan: parseFloat(newPlan) || 0
        });
    } catch (e) { console.error("Error updating plan", e); }
  };

  const updateCategoryPriority = async (id, newPriority) => {
    if (!user) return;
    try {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'categories', id), {
            priority: newPriority
        });
    } catch (e) { console.error("Error updating priority", e); }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.type || !user) return;
    try {
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'categories'), {
            ...newCategory,
            plan: parseFloat(newCategory.plan) || 0
        });
        setNewCategory({ name: '', type: 'expense', plan: '', priority: '3: Neutral' });
        setShowCategoryModal(false);
    } catch (e) { console.error("Error adding category", e); }
  };

  const confirmDeleteCategory = async () => {
    if (!user || !categoryToDelete) return;
    try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'categories', categoryToDelete));
        setCategoryToDelete(null);
    } catch (e) { console.error("Error deleting category", e); }
  };

  const generateInsights = async () => {
    setIsAiLoading(true);
    try {
      const topExpenses = categoryStats
        .filter(c => ['expense', 'bill'].includes(c.type) && c.actual > 0)
        .sort((a, b) => b.actual - a.actual)
        .slice(0, 3)
        .map(c => `${c.name} (${currency}${c.actual})`)
        .join(', ');

      const prompt = `Financial advice for ${currentMonthName}: Income ${currency}${totals.income.actual}, Spend ${currency}${totals.totalOut}, Savings ${currency}${totals.savings.actual} (Goal: ${currency}${totals.savings.plan}), Top Exp: ${topExpenses}. Remaining: ${currency}${totals.remaining}. 3 short tips in JSON { "tips": [] }`;

      const response = await callGemini(prompt);
      const jsonStr = response.replace(/```json|```/g, '').trim();
      const result = JSON.parse(jsonStr);
      setAiInsight(result.tips);
    } catch (err) {
      console.error(err);
      setAiInsight(["Could not generate insights right now."]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleMagicAdd = async () => {
    if (!magicText) return;
    setIsAiLoading(true);
    setMagicError("");
    try {
      const prompt = `Extract transaction from: "${magicText}". Date: ${new Date().toISOString().split('T')[0]}. Cats: ${categories.map(c => `${c.name}(${c.id})`).join(',')}. Return JSON: {amount: number, categoryId: string, date: string, note: string}`;
      const response = await callGemini(prompt);
      const data = JSON.parse(response.replace(/```json|```/g, '').trim());
      if (data.amount && data.categoryId) {
        await addTransaction(data);
        setShowMagicAdd(false);
        setMagicText("");
      } else {
        setMagicError("Could not understand.");
      }
    } catch (err) {
      console.error(err);
      setMagicError("Failed to process.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut(auth).catch(console.error);
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  if (isLoading && !user) {
     return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>;
  }

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <aside className={`w-64 fixed h-full border-r hidden md:flex flex-col p-6 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">My Budget</h1>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Monthly Tracker</p>
          </div>
        </div>
        <nav className="space-y-2 flex-1">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
          <NavItem id="log" label="Transactions" icon={Receipt} activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
          <NavItem id="budget" label="Budget Planner" icon={Target} activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
          <div className={`my-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}></div>
          <NavItem id="investments" label="Investments" icon={Briefcase} activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
          <NavItem id="calculators" label="Calculators" icon={Calculator} activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
        </nav>
        <div className={`rounded-xl p-4 mt-auto ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Monthly Status</p>
          <div className="flex justify-between text-sm mb-1">
            <span>Spent</span>
            <span className="font-bold">{Math.round((totals.totalOut / (totals.income.actual || 1)) * 100)}%</span>
          </div>
          <ProgressBar value={totals.totalOut} max={totals.income.actual || 1} color="#6366f1" darkMode={darkMode} />
        </div>
      </aside>

      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-50 flex justify-around p-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
         <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400'}`}><LayoutDashboard className="w-6 h-6"/></button>
         <button onClick={() => setActiveTab('log')} className={`p-2 rounded-lg ${activeTab === 'log' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400'}`}><Receipt className="w-6 h-6"/></button>
         <button onClick={() => setActiveTab('budget')} className={`p-2 rounded-lg ${activeTab === 'budget' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400'}`}><Target className="w-6 h-6"/></button>
         <button onClick={() => setActiveTab('investments')} className={`p-2 rounded-lg ${activeTab === 'investments' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400'}`}><Briefcase className="w-6 h-6"/></button>
         <button onClick={() => setActiveTab('calculators')} className={`p-2 rounded-lg ${activeTab === 'calculators' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400'}`}><Calculator className="w-6 h-6"/></button>
      </div>

      <main className="flex-1 md:ml-64 p-6 lg:p-10 mb-20 md:mb-0 overflow-y-auto min-h-screen">
        <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h2 className={`text-2xl font-bold capitalize ${darkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab}</h2>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {activeTab === 'investments' ? 'Grow your wealth with AI insights.' : activeTab === 'calculators' ? 'Essential financial tools.' : "Welcome back! Here's your financial overview."}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className={`flex items-center rounded-lg border shadow-sm p-1 gap-1 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="pl-2">
                   <Calendar className="w-4 h-4 text-indigo-500" />
                </div>
                <select 
                  value={currentDate.getMonth()}
                  onChange={(e) => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(parseInt(e.target.value));
                    setCurrentDate(newDate);
                  }}
                  className={`bg-transparent py-1 px-2 font-medium outline-none cursor-pointer appearance-none ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i} className={darkMode ? 'bg-slate-800' : 'bg-white'}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <div className={`w-px h-4 ${darkMode ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
                <select 
                  value={currentDate.getFullYear()}
                  onChange={(e) => {
                    const newDate = new Date(currentDate);
                    newDate.setFullYear(parseInt(e.target.value));
                    setCurrentDate(newDate);
                  }}
                  className={`bg-transparent py-1 px-2 font-medium outline-none cursor-pointer appearance-none ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}
                >
                  {Array.from({ length: 11 }, (_, i) => {
                    const year = 2020 + i;
                    return <option key={year} value={year} className={darkMode ? 'bg-slate-800' : 'bg-white'}>{year}</option>
                  })}
                </select>
             </div>
             
             {user && !user.isAnonymous ? (
               <div className="flex items-center gap-2">
                 <div className={`p-2 rounded-lg border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-indigo-400' : 'bg-white border-slate-200 text-indigo-600'}`} title={user.email}>
                   <User className="w-5 h-5" />
                 </div>
                 <button onClick={handleSignOut} className={`p-2 rounded-lg border shadow-sm transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-red-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-red-500 hover:bg-slate-50'}`} title="Sign Out">
                    <LogOut className="w-5 h-5" />
                 </button>
               </div>
             ) : (
               <div className="flex items-center gap-2">
                 <button onClick={() => openAuthModal('signin')} className={`px-3 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors`}>Sign In</button>
               </div>
             )}

             <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg border shadow-sm transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:text-yellow-300' : 'bg-white border-slate-200 text-slate-500 hover:text-indigo-600'}`} title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <DashboardView 
            totals={totals} currency={currency} aiInsight={aiInsight} 
            isAiLoading={isAiLoading} generateInsights={generateInsights} 
            setAiInsight={setAiInsight} categoryStats={categoryStats} 
            transactions={filteredTransactions}
            currentMonthName={currentMonthName} darkMode={darkMode} 
          />
        )}
        {activeTab === 'log' && (
          <TransactionsView 
            transactions={filteredTransactions} categories={categories} 
            currency={currency} currentMonthName={currentMonthName} 
            addTransaction={addTransaction} deleteTransaction={deleteTransaction}
            showMagicAdd={showMagicAdd} setShowMagicAdd={setShowMagicAdd}
            magicText={magicText} setMagicText={setMagicText}
            magicError={magicError} isAiLoading={isAiLoading}
            handleMagicAdd={handleMagicAdd} darkMode={darkMode}
          />
        )}
        {activeTab === 'budget' && (
          <BudgetView 
            categories={categories} categoryStats={categoryStats} 
            currency={currency} totals={totals} 
            updateCategoryPlan={updateCategoryPlan} updateCategoryPriority={updateCategoryPriority}
            setShowCategoryModal={setShowCategoryModal} currentMonthName={currentMonthName}
            setCategoryToDelete={setCategoryToDelete} darkMode={darkMode}
          />
        )}
        {activeTab === 'investments' && (
          <InvestmentsView 
            totals={totals}
            currency={currency}
            darkMode={darkMode}
          />
        )}
        {activeTab === 'calculators' && (
          <CalculatorsView darkMode={darkMode} />
        )}

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} authMode={authMode} setAuthMode={setAuthMode} darkMode={darkMode} />

        {categoryToDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
              <div className="flex items-center gap-3 mb-4 text-red-500"><AlertTriangle className="w-6 h-6" /><h3 className="font-bold text-lg">Delete Category?</h3></div>
              <p className={`text-sm mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Are you sure? This will remove it from your budget plan.</p>
              <div className="flex justify-end gap-3"><button onClick={() => setCategoryToDelete(null)} className={`px-4 py-2 font-medium rounded-lg ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}>Cancel</button><button onClick={confirmDeleteCategory} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg">Delete</button></div>
            </div>
          </div>
        )}

        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
              <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg flex items-center gap-2"><Tags className="w-5 h-5" /> New Category</h3><button onClick={() => setShowCategoryModal(false)} className={`hover:text-slate-500 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}><X className="w-5 h-5" /></button></div>
              <div className="space-y-4">
                <div><label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Name</label><input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} placeholder="e.g. Gym..." value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} /></div>
                <div><label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Type</label><select className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} value={newCategory.type} onChange={e => setNewCategory({...newCategory, type: e.target.value})}><option value="income">Income</option><option value="bill">Bill</option><option value="expense">Expense</option><option value="debt">Debt</option><option value="savings">Savings</option></select></div>
                <div><label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Planned Amount</label><input type="number" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} placeholder="0.00" value={newCategory.plan} onChange={e => setNewCategory({...newCategory, plan: e.target.value})} /></div>
                <div><label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Priority</label><select className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} value={newCategory.priority} onChange={e => setNewCategory({...newCategory, priority: e.target.value})}>{PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <button onClick={handleAddCategory} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors mt-2">Create Category</button>
              </div>
            </div>
          </div>
        )}

        <Footer darkMode={darkMode} />
      </main>
    </div>
  );
};

export default function BudgetApp() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (currentPath === '/tracker-info') return <StaticPage title="Tracker Info & Guide" content={<TrackerInfo />} />;
  if (currentPath === '/privacy-policy') return <StaticPage title="Privacy Policy" content={<PrivacyPolicy />} />;
  if (currentPath === '/terms-and-conditions') return <StaticPage title="Terms and Conditions" content={<TermsAndConditions />} />;
  return <MainTracker />;
}