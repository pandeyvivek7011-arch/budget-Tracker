import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
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
  AlertTriangle
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged 
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

// --- MOCK DATA (Used for seeding the DB only) ---

const INITIAL_CATEGORIES = [
  // Income
  { id: 'inc1', name: 'Job', type: 'income', plan: 50000, priority: '1: Very important' },
  { id: 'inc2', name: 'Upwork', type: 'income', plan: 6000, priority: '2: Important' },
  { id: 'inc3', name: 'Website', type: 'income', plan: 10000, priority: '3: Neutral' },
  
  // Savings
  { id: 'sav1', name: 'College Fee', type: 'savings', plan: 25000, priority: '1: Very important' },
  { id: 'sav2', name: 'Mutual Funds', type: 'savings', plan: 15000, priority: '1: Very important' },
  { id: 'sav3', name: 'Emergency Fund', type: 'savings', plan: 20000, priority: '1: Very important' },

  // Bills
  { id: 'bill1', name: 'Electricity', type: 'bill', plan: 1000, priority: '1: Very important' },
  { id: 'bill2', name: 'House Rent', type: 'bill', plan: 15000, priority: '1: Very important' },
  { id: 'bill3', name: 'Cooking Gas', type: 'bill', plan: 900, priority: '1: Very important' },
  { id: 'bill4', name: 'Water', type: 'bill', plan: 2000, priority: '2: Important' },
  { id: 'bill5', name: 'Mobile Bill', type: 'bill', plan: 500, priority: '2: Important' },
  { id: 'bill6', name: 'Wifi', type: 'bill', plan: 1000, priority: '1: Very important' },
  { id: 'bill7', name: 'Vehicle Insurance', type: 'bill', plan: 4000, priority: '1: Very important' },

  // Expenses
  { id: 'exp1', name: 'Groceries', type: 'expense', plan: 8000, priority: '1: Very important' },
  { id: 'exp2', name: 'Medicines', type: 'expense', plan: 1500, priority: '1: Very important' },
  { id: 'exp3', name: 'Clothes', type: 'expense', plan: 2000, priority: '4: Less important' },
  { id: 'exp4', name: 'Uber/Taxi', type: 'expense', plan: 1000, priority: '3: Neutral' },
  { id: 'exp5', name: 'Eating Out', type: 'expense', plan: 3000, priority: '4: Less important' },
  
  // Debt
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

const PRIORITIES = [
  '1: Very important',
  '2: Important',
  '3: Neutral',
  '4: Less important',
  '5: Not important'
];

const COLORS = {
  income: '#10b981', // emerald-500
  savings: '#3b82f6', // blue-500
  bill: '#f43f5e',    // rose-500
  expense: '#f59e0b', // amber-500
  debt: '#8b5cf6',    // violet-500
};

// --- GEMINI API CONFIG ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key provided by runtime environment

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

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

// --- MAIN APP COMPONENT ---

export default function BudgetApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date('2024-09-01'));
  const [currency] = useState('₹');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const [showMagicAdd, setShowMagicAdd] = useState(false);
  const [magicText, setMagicText] = useState("");
  const [magicError, setMagicError] = useState("");

  // Category Management State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // State for delete modal
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    type: 'expense', 
    plan: '', 
    priority: '3: Neutral' 
  });

  // --- FIREBASE AUTH & DATA SYNC ---

  useEffect(() => {
    const initAuth = async () => {
      // Try anonymous auth first as it's less restricted for this context
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
           await signInWithCustomToken(auth, __initial_auth_token);
        } else {
           await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
        // Fallback to anonymous if custom token fails
        try {
            await signInAnonymously(auth);
        } catch(e) {
            console.error("Fallback anonymous auth failed", e);
        }
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const hasSeededRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    // 1. Sync Categories
    const categoriesQuery = query(collection(db, 'artifacts', appId, 'users', user.uid, 'categories'));
    const unsubCategories = onSnapshot(categoriesQuery, (snapshot) => {
      if (snapshot.empty && !hasSeededRef.current) {
        hasSeededRef.current = true;
        const batch = writeBatch(db);
        INITIAL_CATEGORIES.forEach(cat => {
           const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'categories', cat.id);
           batch.set(docRef, cat);
        });
        batch.commit().catch(console.error);
      } else {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(data);
      }
    }, (error) => console.error("Category Sync Error", error));

    // 2. Sync Transactions
    const transactionsQuery = query(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'));
    const unsubTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      if (snapshot.empty && !hasSeededRef.current) {
         // Seeding moved to categories check to avoid double seed, but kept logic safe
         const batch = writeBatch(db);
         INITIAL_TRANSACTIONS.forEach(tx => {
            const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'transactions', tx.id);
            batch.set(docRef, tx);
         });
         batch.commit().catch(console.error);
      } else {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(data);
        setIsLoading(false);
      }
    }, (error) => console.error("Transaction Sync Error", error));

    return () => {
      unsubCategories();
      unsubTransactions();
    };
  }, [user]);


  // --- HELPER COMPONENTS ---

  const Card = ({ children, className = '', style = {} }) => (
    <div 
      className={`rounded-xl shadow-sm border transition-colors duration-200 ${
        darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-100'
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
          <h3 className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{value}</h3>
          {subtext && <p className={`text-sm mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </Card>
  );

  const ProgressBar = ({ value, max, color }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100)) || 0;
    return (
      <div className={`h-2 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    );
  };

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
      totalOut: 0 // calculated below
    };
  }, [categoryStats]);

  totals.totalOut = totals.bills.actual + totals.expenses.actual + totals.debt.actual;
  totals.remaining = totals.income.actual - totals.totalOut - totals.savings.actual;

  // --- ACTIONS ---

  const addTransaction = async (newTx) => {
    if (!user) return;
    const txData = { ...newTx, amount: parseFloat(newTx.amount) };
    try {
        await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'), txData);
    } catch (e) {
        console.error("Error adding transaction", e);
    }
  };

  const deleteTransaction = async (id) => {
    if (!user) return;
    try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'transactions', id));
    } catch (e) {
        console.error("Error deleting transaction", e);
    }
  };

  const updateCategoryPlan = async (id, newPlan) => {
    if (!user) return;
    try {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'categories', id), {
            plan: parseFloat(newPlan) || 0
        });
    } catch (e) {
        console.error("Error updating plan", e);
    }
  };

  const updateCategoryPriority = async (id, newPriority) => {
    if (!user) return;
    try {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'categories', id), {
            priority: newPriority
        });
    } catch (e) {
        console.error("Error updating priority", e);
    }
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
    } catch (e) {
        console.error("Error adding category", e);
    }
  };

  // REPLACED: Use modal instead of window.confirm
  const confirmDeleteCategory = async () => {
    if (!user || !categoryToDelete) return;
    try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'categories', categoryToDelete));
        setCategoryToDelete(null);
    } catch (e) {
        console.error("Error deleting category", e);
    }
  };

  // --- GEMINI FEATURES ---

  const generateInsights = async () => {
    setIsAiLoading(true);
    try {
      const topExpenses = categoryStats
        .filter(c => ['expense', 'bill'].includes(c.type) && c.actual > 0)
        .sort((a, b) => b.actual - a.actual)
        .slice(0, 3)
        .map(c => `${c.name} (${currency}${c.actual})`)
        .join(', ');

      const prompt = `
        You are a friendly financial advisor. Analyze this monthly budget data for ${currentMonthName} and provide 3 specific, actionable, and encouraging tips (max 1 sentence each) to improve financial health.
        
        Data:
        - Total Income: ${currency}${totals.income.actual}
        - Total Spending: ${currency}${totals.totalOut}
        - Total Savings: ${currency}${totals.savings.actual} (Goal: ${currency}${totals.savings.plan})
        - Top Expenses: ${topExpenses}
        - Remaining Budget: ${currency}${totals.remaining}
        
        Format output as a simple JSON object with a "tips" array of strings. Do not use Markdown.
        Example: { "tips": ["Tip 1", "Tip 2", "Tip 3"] }
      `;

      const response = await callGemini(prompt);
      const jsonStr = response.replace(/```json|```/g, '').trim();
      const result = JSON.parse(jsonStr);
      setAiInsight(result.tips);
    } catch (err) {
      console.error(err);
      setAiInsight(["Could not generate insights right now. Please try again later."]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleMagicAdd = async () => {
    if (!magicText) return;
    setIsAiLoading(true);
    setMagicError("");
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const categoriesList = categories.map(c => `${c.name} (ID: ${c.id})`).join(', ');
      
      const prompt = `
        Extract transaction details from this text: "${magicText}".
        Current Date: ${today}.
        Available Categories: ${categoriesList}.
        
        Return ONLY a valid JSON object with:
        {
          "amount": number (remove currency symbols),
          "categoryId": string (ID from the provided list. If unsure, pick the closest match or use "exp4" for general expense),
          "date": string (YYYY-MM-DD format),
          "note": string (short description)
        }
        Do not include markdown or explanations.
      `;

      const response = await callGemini(prompt);
      const jsonStr = response.replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);

      if (data.amount && data.categoryId) {
        await addTransaction(data);
        setShowMagicAdd(false);
        setMagicText("");
      } else {
        setMagicError("Could not understand the transaction. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMagicError("Failed to process with AI. Please try manual entry.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- VIEWS ---

  if (isLoading && !user) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
           <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
     );
  }

  const DashboardView = () => {
    const chartData = [
      { name: 'Income', Plan: totals.income.plan, Actual: totals.income.actual },
      { name: 'Savings', Plan: totals.savings.plan, Actual: totals.savings.actual },
      { name: 'Bills', Plan: totals.bills.plan, Actual: totals.bills.actual },
      { name: 'Expenses', Plan: totals.expenses.plan, Actual: totals.expenses.actual },
      { name: 'Debt', Plan: totals.debt.plan, Actual: totals.debt.actual },
    ];

    return (
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Income" 
            value={`${currency}${totals.income.actual.toLocaleString()}`} 
            subtext={`Planned: ${currency}${totals.income.plan.toLocaleString()}`}
            icon={TrendingUp}
            colorClass="bg-emerald-500 text-emerald-500"
          />
          <StatCard 
            title="Total Spending" 
            value={`${currency}${totals.totalOut.toLocaleString()}`} 
            subtext="Bills + Expenses + Debt"
            icon={TrendingDown}
            colorClass="bg-rose-500 text-rose-500"
          />
          <StatCard 
            title="Total Savings" 
            value={`${currency}${totals.savings.actual.toLocaleString()}`} 
            subtext={`Target: ${currency}${totals.savings.plan.toLocaleString()}`}
            icon={Wallet}
            colorClass="bg-blue-500 text-blue-500"
          />
          <StatCard 
            title="Remaining Budget" 
            value={`${currency}${totals.remaining.toLocaleString()}`} 
            subtext="Available to spend/save"
            icon={Target}
            colorClass={totals.remaining >= 0 ? "bg-slate-500 text-slate-500" : "bg-red-500 text-red-500"}
          />
        </div>

        {/* AI Insight Card */}
        <div className="w-full">
          {!aiInsight ? (
            <button 
              onClick={generateInsights}
              disabled={isAiLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white p-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all group"
            >
              {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
              <span className="font-semibold">Generate AI Insights for {currentMonthName}</span>
            </button>
          ) : (
            <Card className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-800' : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100'} p-6`}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-indigo-600" />
              </div>
              <div className="flex items-start gap-4 relative z-10">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                  <MessageSquareQuote className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>Gemini's Insights</h3>
                  <ul className="space-y-2">
                    {aiInsight.map((tip, idx) => (
                      <li key={idx} className={`flex items-start gap-2 text-sm ${darkMode ? 'text-indigo-100' : 'text-indigo-800'}`}>
                        <span className="mt-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setAiInsight(null)} 
                    className="mt-4 text-xs font-medium text-indigo-500 hover:text-indigo-600 underline"
                  >
                    Refresh Analysis
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Plan vs Actual ({currentMonthName})</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#e2e8f0'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: darkMode ? '#1e293b' : '#fff',
                      color: darkMode ? '#fff' : '#000'
                    }}
                    cursor={{ fill: darkMode ? '#334155' : '#f1f5f9' }}
                  />
                  <Legend wrapperStyle={{ color: darkMode ? '#fff' : '#000' }} />
                  <Bar dataKey="Plan" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Actual" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Spending Priorities</h3>
            <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Where is your money going based on importance?</p>
            <div className="space-y-4">
              {PRIORITIES.map(priority => {
                const priorityTotal = categoryStats
                  .filter(c => c.priority === priority && ['bill', 'expense', 'debt'].includes(c.type))
                  .reduce((sum, c) => sum + c.actual, 0);
                
                if (priorityTotal === 0) return null;

                // Simple color mapping for priority bars
                const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
                const idx = PRIORITIES.indexOf(priority);

                return (
                  <div key={priority}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{priority}</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{currency}{priorityTotal.toLocaleString()}</span>
                    </div>
                    <div className={`h-2 w-full rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                       <div className={`h-full rounded-full ${colors[idx]}`} style={{ width: `${(priorityTotal / totals.totalOut) * 100}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const TransactionsView = () => {
    const [newTx, setNewTx] = useState({ date: new Date().toISOString().split('T')[0], categoryId: '', amount: '', note: '' });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!newTx.categoryId || !newTx.amount) return;
      addTransaction(newTx);
      setNewTx({ ...newTx, amount: '', note: '' });
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* Magic Add Modal */}
        {showMagicAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-indigo-500">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Magic Transaction</h3>
                </div>
                <button onClick={() => setShowMagicAdd(false)} className={`hover:text-slate-500 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Type naturally like "Spent 500 on dinner yesterday" or "Paid 15000 rent". Gemini will fill in the details.
              </p>
              <textarea
                autoFocus
                className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32 ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                placeholder="e.g., Bought groceries for 2000 today..."
                value={magicText}
                onChange={(e) => setMagicText(e.target.value)}
              />
              {magicError && <p className="text-red-500 text-sm mt-2">{magicError}</p>}
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowMagicAdd(false)}
                  className={`px-4 py-2 font-medium rounded-lg ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleMagicAdd}
                  disabled={isAiLoading || !magicText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Log
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Transaction Form */}
        <Card className="p-6 h-fit lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
             <h3 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                <Plus className="w-5 h-5" /> Log Transaction
             </h3>
             <button 
                onClick={() => setShowMagicAdd(true)}
                className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full font-bold transition-colors ${darkMode ? 'bg-indigo-900 text-indigo-300 hover:bg-indigo-800' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                title="Use AI to add transaction"
             >
                <Sparkles className="w-3 h-3" /> Magic Add
             </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Date</label>
              <input 
                type="date" 
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                value={newTx.date}
                onChange={e => setNewTx({...newTx, date: e.target.value})}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Category</label>
              <select 
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                value={newTx.categoryId}
                onChange={e => setNewTx({...newTx, categoryId: e.target.value})}
              >
                <option value="">Select Category</option>
                <optgroup label="Income">
                  {categories.filter(c => c.type === 'income').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
                <optgroup label="Bills">
                  {categories.filter(c => c.type === 'bill').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
                <optgroup label="Expenses">
                  {categories.filter(c => c.type === 'expense').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
                 <optgroup label="Savings">
                  {categories.filter(c => c.type === 'savings').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
                 <optgroup label="Debt">
                  {categories.filter(c => c.type === 'debt').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Amount ({currency})</label>
              <input 
                type="number" 
                placeholder="0.00"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' : 'bg-white border-slate-200 placeholder-slate-400'}`}
                value={newTx.amount}
                onChange={e => setNewTx({...newTx, amount: e.target.value})}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Notes</label>
              <input 
                type="text" 
                placeholder="Optional description"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' : 'bg-white border-slate-200 placeholder-slate-400'}`}
                value={newTx.note}
                onChange={e => setNewTx({...newTx, note: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">
              Add Log
            </button>
          </form>
        </Card>

        {/* Transaction List */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className={`p-6 border-b sticky top-0 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Recent Logs ({currentMonthName})</h3>
          </div>
          <div className="overflow-y-auto max-h-[600px] p-6 pt-0">
            <table className="w-full text-sm text-left">
              <thead className={`text-xs uppercase sticky top-0 ${darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 rounded-tr-lg w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(tx => {
                  const cat = categories.find(c => c.id === tx.categoryId);
                  return (
                    <tr key={tx.id} className={`border-b last:border-0 transition-colors ${darkMode ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-50 hover:bg-slate-50'}`}>
                      <td className={`px-4 py-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{tx.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                          ${cat?.type === 'income' ? (darkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700') : 
                            cat?.type === 'savings' ? (darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700') : 
                            (darkMode ? 'bg-rose-900/50 text-rose-300' : 'bg-rose-100 text-rose-700')}`}>
                          {cat?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className={`px-4 py-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tx.note || '-'}</td>
                      <td className={`px-4 py-3 text-right font-medium ${cat?.type === 'income' ? 'text-emerald-500' : (darkMode ? 'text-slate-200' : 'text-slate-700')}`}>
                        {cat?.type === 'income' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => deleteTransaction(tx.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <div className={`text-center py-10 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                No transactions for {currentMonthName}. <br/>
                <span className="text-sm">Log one or switch months!</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const BudgetView = () => {
    const groups = [
      { id: 'income', title: 'Income', icon: TrendingUp, color: 'emerald' },
      { id: 'bill', title: 'Bills', icon: Receipt, color: 'rose' },
      { id: 'expense', title: 'Expenses', icon: Wallet, color: 'amber' },
      { id: 'debt', title: 'Debt', icon: AlertCircle, color: 'violet' },
      { id: 'savings', title: 'Savings', icon: Save, color: 'blue' },
    ];

    return (
      <div className="space-y-8 relative">
        {/* Delete Category Confirmation Modal */}
        {categoryToDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
              <div className="flex items-center gap-3 mb-4 text-red-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-bold text-lg">Delete Category?</h3>
              </div>
              <p className={`text-sm mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Are you sure you want to delete this category? Past transactions will remain, but it will be removed from your budget plan.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setCategoryToDelete(null)}
                  className={`px-4 py-2 font-medium rounded-lg ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteCategory}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Tags className="w-5 h-5" /> New Category
                </h3>
                <button onClick={() => setShowCategoryModal(false)} className={`hover:text-slate-500 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Name</label>
                  <input 
                    type="text" 
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' : 'bg-white border-slate-200'}`}
                    placeholder="e.g. Gym, Netflix..."
                    value={newCategory.name}
                    onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Type</label>
                  <select 
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                    value={newCategory.type}
                    onChange={e => setNewCategory({...newCategory, type: e.target.value})}
                  >
                    <option value="income">Income</option>
                    <option value="bill">Bill</option>
                    <option value="expense">Expense</option>
                    <option value="debt">Debt</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Planned Amount</label>
                  <input 
                    type="number" 
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' : 'bg-white border-slate-200'}`}
                    placeholder="0.00"
                    value={newCategory.plan}
                    onChange={e => setNewCategory({...newCategory, plan: e.target.value})}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Priority</label>
                  <select 
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                    value={newCategory.priority}
                    onChange={e => setNewCategory({...newCategory, priority: e.target.value})}
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <button 
                  onClick={handleAddCategory}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors mt-2"
                >
                  Create Category
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
            <div>
                 <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Budget Planner</h2>
                 <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Set your monthly targets and prioritize spending.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCategoryModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
              <div className={`px-4 py-2 rounded-lg text-sm font-medium border hidden sm:block ${darkMode ? 'bg-blue-900/20 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                  Month: {currentMonthName}
              </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {groups.map(group => (
            <Card key={group.id} className="p-0 overflow-hidden border-t-4" style={{ borderTopColor: COLORS[group.id] }}>
              <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <group.icon className={`w-5 h-5 text-${group.color}-500`} />
                  <h3 className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{group.title}</h3>
                </div>
                <div className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Total Plan: {currency}
                  {categoryStats
                    .filter(c => c.type === group.id)
                    .reduce((sum, c) => sum + c.plan, 0)
                    .toLocaleString()}
                </div>
              </div>
              <div className="p-4 space-y-4">
                {categoryStats
                  .filter(c => c.type === group.id)
                  .map(cat => (
                    <div key={cat.id} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg transition-colors border border-transparent group ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50 hover:border-slate-100'}`}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{cat.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border 
                            ${cat.priority.includes('1') ? (darkMode ? 'bg-emerald-900/50 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-100') : 
                              cat.priority.includes('4') || cat.priority.includes('5') ? (darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200') : 
                              (darkMode ? 'bg-blue-900/50 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-100')}`}>
                            {cat.priority.split(':')[1]}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span>Actual: {currency}{cat.actual.toLocaleString()}</span>
                            <span className="text-slate-300">|</span>
                            <span>Diff: {currency}{(cat.plan - cat.actual).toLocaleString()}</span>
                        </div>
                        <div className="mt-2">
                            <ProgressBar value={cat.actual} max={cat.plan} color={COLORS[cat.type]} />
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-2 sm:border-l sm:pl-4 ${darkMode ? 'sm:border-slate-700' : 'sm:border-slate-100'}`}>
                         <div className="flex flex-col">
                            <label className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Plan</label>
                            <input 
                            type="number"
                            className={`w-24 p-1.5 text-right text-sm border rounded focus:ring-1 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'border-slate-200'}`}
                            value={cat.plan}
                            onChange={(e) => updateCategoryPlan(cat.id, e.target.value)}
                            />
                         </div>
                         <div className="flex flex-col">
                            <label className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Priority</label>
                            <div className="flex items-center gap-2">
                               <select
                                  className={`w-32 p-1.5 text-sm border rounded focus:ring-1 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                  value={cat.priority}
                                  onChange={(e) => updateCategoryPriority(cat.id, e.target.value)}
                                  >
                                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                              <button 
                                onClick={() => setCategoryToDelete(cat.id)}
                                className={`p-2 transition-colors opacity-0 group-hover:opacity-100 ${darkMode ? 'text-slate-600 hover:text-red-400' : 'text-slate-300 hover:text-red-500'}`}
                                title="Delete Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                         </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // --- NAVIGATION ---

  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : `${darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-indigo-400' : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Sidebar */}
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
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="log" label="Transactions" icon={Receipt} />
          <NavItem id="budget" label="Budget Planner" icon={Target} />
        </nav>

        <div className={`rounded-xl p-4 mt-auto ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Monthly Status</p>
          <div className="flex justify-between text-sm mb-1">
            <span>Spent</span>
            <span className="font-bold">{Math.round((totals.totalOut / totals.income.actual) * 100) || 0}%</span>
          </div>
          <ProgressBar value={totals.totalOut} max={totals.income.actual} color="#6366f1" />
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-50 flex justify-around p-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
         <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400'}`}><LayoutDashboard className="w-6 h-6"/></button>
         <button onClick={() => setActiveTab('log')} className={`p-2 rounded-lg ${activeTab === 'log' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400'}`}><Receipt className="w-6 h-6"/></button>
         <button onClick={() => setActiveTab('budget')} className={`p-2 rounded-lg ${activeTab === 'budget' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400'}`}><Target className="w-6 h-6"/></button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 lg:p-10 mb-20 md:mb-0 overflow-y-auto min-h-screen">
        <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h2 className={`text-2xl font-bold capitalize ${darkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab}</h2>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Welcome back! Here's your financial overview.</p>
          </div>
          <div className="flex items-center gap-3">
             {/* Improved Date Navigator */}
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
             
             {/* Dark Mode Toggle */}
             <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg border shadow-sm transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:text-yellow-300' : 'bg-white border-slate-200 text-slate-500 hover:text-indigo-600'}`}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

             <div className={`hidden sm:block px-4 py-2 rounded-lg border text-sm font-medium shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                INR (₹)
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'log' && <TransactionsView />}
        {activeTab === 'budget' && <BudgetView />}
      </main>
    </div>
  );
}