import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserProfile, Transaction, Category, Budget, SavingsGoal, PeriodFilter, FinancialSummary, TransactionType } from '../types';
import { formatKwacha, getDateRangeForPeriod, getAvatarInitial, exportTransactionsToCsv } from '../lib/formatters';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  BarChart3, 
  Plus, 
  RefreshCw, 
  ShieldCheck,
  Wallet
} from 'lucide-react';

import { OverviewTab } from './dashboard/OverviewTab';
import { TransactionsTab } from './dashboard/TransactionsTab';
import { BudgetsTab } from './dashboard/BudgetsTab';
import { SavingsGoalsTab } from './dashboard/SavingsGoalsTab';
import { ReportsTab } from './dashboard/ReportsTab';
import { TransactionModal } from './dashboard/TransactionModal';
import { BudgetModal } from './dashboard/BudgetModal';
import { SavingsGoalModal } from './dashboard/SavingsGoalModal';
import { AddSavingsDepositModal } from './dashboard/AddSavingsDepositModal';

interface DashboardViewProps {
  user: UserProfile;
  isDemoMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user, isDemoMode = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'savings' | 'reports'>('overview');
  const [period, setPeriod] = useState<PeriodFilter>('THIS_MONTH');

  // Core financial state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [initialTxType, setInitialTxType] = useState<TransactionType>('EXPENSE');

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositingGoal, setDepositingGoal] = useState<SavingsGoal | null>(null);

  // Initial Data Load & Realtime Subscription
  useEffect(() => {
    loadAllData();

    if (!isDemoMode) {
      const channel = supabase
        .channel(`kwacha-portal-${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, () => {
          loadTransactions();
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'budgets', filter: `user_id=eq.${user.id}` }, () => {
          loadBudgets();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'savings_goals', filter: `user_id=eq.${user.id}` }, () => {
          loadSavingsGoals();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user.id, isDemoMode]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadCategories(),
      loadTransactions(),
      loadBudgets(),
      loadSavingsGoals()
    ]);
    setLoading(false);
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const loadCategories = async () => {
    if (isDemoMode) {
      setCategories(getDemoCategories());
      return;
    }
    const { data } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.eq.${user.id},is_default.eq.true`)
      .order('name');
    if (data) setCategories(data);
  };

  const loadTransactions = async () => {
    if (isDemoMode) {
      setTransactions(getDemoTransactions(user.id));
      return;
    }
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false });
    if (data) setTransactions(data);
  };

  const loadBudgets = async () => {
    if (isDemoMode) {
      setBudgets(getDemoBudgets(user.id));
      return;
    }
    const { data } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setBudgets(data);
  };

  const loadSavingsGoals = async () => {
    if (isDemoMode) {
      setSavingsGoals(getDemoSavingsGoals(user.id));
      return;
    }
    const { data } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setSavingsGoals(data);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await loadAllData();
    setIsSyncing(false);
  };

  // Available Balance Calculation
  const availableBalance = useMemo(() => {
    const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    return Math.max(0, income - expense);
  }, [transactions]);

  // Financial summary computation according to selected period
  const summary: FinancialSummary = useMemo(() => {
    const { start, end } = getDateRangeForPeriod(period);
    let openingBalance = 0;
    let periodIncome = 0;
    let periodExpenses = 0;
    let allTimeIncome = 0;
    let allTimeExpenses = 0;

    transactions.forEach(tx => {
      const txDate = tx.transaction_date;
      if (tx.type === 'INCOME') allTimeIncome += tx.amount;
      else allTimeExpenses += tx.amount;

      if (start && end) {
        if (txDate < start) {
          if (tx.type === 'INCOME') openingBalance += tx.amount;
          else openingBalance -= tx.amount;
        } else if (txDate >= start && txDate <= end) {
          if (tx.type === 'INCOME') periodIncome += tx.amount;
          else periodExpenses += tx.amount;
        }
      } else {
        if (tx.type === 'INCOME') periodIncome += tx.amount;
        else periodExpenses += tx.amount;
      }
    });

    const totalCurrentBalance = allTimeIncome - allTimeExpenses;
    const netCashflow = periodIncome - periodExpenses;

    const budgetLimit = budgets.reduce((acc, b) => acc + b.monthly_limit, 0);
    const currentMonthExpenses = transactions
      .filter(t => t.type === 'EXPENSE' && t.transaction_date.startsWith(new Date().toISOString().substring(0, 7)))
      .reduce((acc, t) => acc + t.amount, 0);

    const savingsTarget = savingsGoals.reduce((acc, s) => acc + s.target_amount, 0);
    const savingsCurrent = savingsGoals.reduce((acc, s) => acc + s.current_amount, 0);

    return {
      totalCurrentBalance,
      periodIncome,
      periodExpenses,
      openingBalance,
      netCashflow,
      budgetLimit,
      budgetSpent: currentMonthExpenses,
      savingsTarget,
      savingsCurrent
    };
  }, [transactions, budgets, savingsGoals, period]);

  // Filtered transactions for the current period view
  const periodTransactions = useMemo(() => {
    const { start, end } = getDateRangeForPeriod(period);
    if (!start || !end) return transactions;
    return transactions.filter(t => t.transaction_date >= start && t.transaction_date <= end);
  }, [transactions, period]);

  // Action handlers
  const handleOpenAddTx = (type: TransactionType = 'EXPENSE') => {
    setEditingTransaction(null);
    setInitialTxType(type);
    setIsTxModalOpen(true);
  };

  const handleOpenEditTx = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  const handleDeleteTx = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction record?')) return;
    if (isDemoMode) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      return;
    }
    const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleOpenCreateBudget = () => {
    setEditingBudget(null);
    setIsBudgetModalOpen(true);
  };

  const handleOpenEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setIsBudgetModalOpen(true);
  };

  const handleDeleteBudget = async (id: string) => {
    if (!confirm('Are you sure you want to remove this category budget?')) return;
    if (isDemoMode) {
      setBudgets(prev => prev.filter(b => b.id !== id));
      return;
    }
    const { error } = await supabase.from('budgets').delete().eq('id', id).eq('user_id', user.id);
    if (!error) {
      setBudgets(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleOpenCreateGoal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleOpenDepositModal = (goal: SavingsGoal) => {
    setDepositingGoal(goal);
    setIsDepositModalOpen(true);
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Are you sure you want to remove this savings goal?')) return;
    if (isDemoMode) {
      setSavingsGoals(prev => prev.filter(g => g.id !== id));
      return;
    }
    const { error } = await supabase.from('savings_goals').delete().eq('id', id).eq('user_id', user.id);
    if (!error) {
      setSavingsGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '28px 0 40px 0' }}>
      <div className="responsive-container">
        {/* User Profile Header Bar & Sync Control */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-emerald)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-sm)'
            }}>
              {getAvatarInitial(user.full_name, user.email)}
            </div>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.02em' }}>
                Muli Bwanji, {user.full_name ? user.full_name.split(' ')[0] : 'User'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                <span>{user.email}</span>
                <span>•</span>
                <span style={{ color: 'var(--color-emerald)', fontWeight: 600 }}>Zambian Kwacha (ZMW)</span>
                {isDemoMode && <span style={{ color: '#D97706', fontWeight: 700 }}>• Demo Mode</span>}
              </div>
            </div>
          </div>

          {/* Quick Actions & Sync */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: '#D1FAE5',
              fontSize: '0.8rem',
              color: '#065F46',
              fontWeight: 600
            }}>
              <ShieldCheck size={14} />
              <span>Synced ({lastSyncTime})</span>
            </div>

            <button
              type="button"
              onClick={handleManualSync}
              className="btn-secondary"
              disabled={isSyncing}
              style={{ padding: '8px 14px', fontSize: '0.86rem' }}
              title="Refresh and sync data with cloud"
            >
              <RefreshCw size={14} className={isSyncing ? 'pulse-glow' : ''} />
              Sync
            </button>

            <button
              type="button"
              onClick={() => handleOpenAddTx('EXPENSE')}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.86rem' }}
            >
              <Plus size={16} /> Record Transaction
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Bar (Pill Tabs) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          marginBottom: '26px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'transactions', label: 'Transactions', icon: Receipt },
            { id: 'budgets', label: 'Budgets', icon: PieChart },
            { id: 'savings', label: 'Savings Goals', icon: Target },
            { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? 'var(--color-navy)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  borderBottom: isActive ? '2px solid var(--color-emerald)' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={17} color={isActive ? 'var(--color-emerald)' : 'currentColor'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Module Content */}
        {activeTab === 'overview' && (
          <OverviewTab
            summary={summary}
            period={period}
            onSelectPeriod={setPeriod}
            transactions={periodTransactions}
            categories={categories}
            budgets={budgets}
            savingsGoals={savingsGoals}
            onOpenAddTransaction={handleOpenAddTx}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsTab
            transactions={transactions}
            categories={categories}
            onOpenAddModal={handleOpenAddTx}
            onOpenEditModal={handleOpenEditTx}
            onDeleteTransaction={handleDeleteTx}
            onExportCsv={() => exportTransactionsToCsv(transactions)}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetsTab
            budgets={budgets}
            categories={categories}
            transactions={transactions}
            onOpenCreateBudget={handleOpenCreateBudget}
            onOpenEditBudget={handleOpenEditBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsGoalsTab
            savingsGoals={savingsGoals}
            onOpenCreateGoal={handleOpenCreateGoal}
            onOpenEditGoal={handleOpenEditGoal}
            onOpenDepositModal={handleOpenDepositModal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            transactions={periodTransactions}
            categories={categories}
            budgets={budgets}
            savingsGoals={savingsGoals}
            period={period}
            onSelectPeriod={setPeriod}
          />
        )}

        {/* Clean Application Footer */}
        <footer style={{
          marginTop: '56px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: '0.84rem'
        }}>
          © {new Date().getFullYear()} KwachaTrack. Personal Finance Management in Zambian Kwacha.
        </footer>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSaved={loadTransactions}
        userId={user.id}
        isDemoMode={isDemoMode}
        categories={categories}
        editingTransaction={editingTransaction}
        initialType={initialTxType}
        availableBalance={availableBalance}
      />

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSaved={loadBudgets}
        userId={user.id}
        isDemoMode={isDemoMode}
        categories={categories}
        editingBudget={editingBudget}
      />

      {/* Savings Goal Modal */}
      <SavingsGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSaved={loadSavingsGoals}
        userId={user.id}
        isDemoMode={isDemoMode}
        editingGoal={editingGoal}
      />

      {/* Add Savings Deposit Modal */}
      <AddSavingsDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSaved={loadSavingsGoals}
        userId={user.id}
        isDemoMode={isDemoMode}
        goal={depositingGoal}
      />
    </div>
  );
};

// =========================================================================
// Demo Initializers
// =========================================================================

function getDemoCategories(): Category[] {
  return [
    { id: 'c1', name: 'Food & Groceries', type: 'EXPENSE', icon: 'restaurant', color_hex: '#FF5722', is_default: true },
    { id: 'c2', name: 'Transport & Fuel', type: 'EXPENSE', icon: 'directions_bus', color_hex: '#0288D1', is_default: true },
    { id: 'c3', name: 'Utilities & Electricity (ZESCO)', type: 'EXPENSE', icon: 'bolt', color_hex: '#FBC02D', is_default: true },
    { id: 'c4', name: 'Airtime & Data bundles', type: 'EXPENSE', icon: 'phone_android', color_hex: '#7B1FA2', is_default: true },
    { id: 'c5', name: 'Education & School Fees', type: 'EXPENSE', icon: 'school', color_hex: '#00796B', is_default: true },
    { id: 'c6', name: 'Salary & Wages', type: 'INCOME', icon: 'payments', color_hex: '#2E7D32', is_default: true },
    { id: 'c7', name: 'Business & Trade', type: 'INCOME', icon: 'storefront', color_hex: '#00897B', is_default: true },
    { id: 'c8', name: 'Freelance & Side Gigs', type: 'INCOME', icon: 'laptop_mac', color_hex: '#1E88E5', is_default: true }
  ];
}

function getDemoTransactions(userId: string): Transaction[] {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const fourDaysAgo = new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0];

  return [
    {
      id: 'tx-1',
      user_id: userId,
      category_id: 'c6',
      title: 'Net Salary Deposit',
      amount: 18500,
      type: 'INCOME',
      transaction_date: fourDaysAgo,
      payment_method: 'Bank Transfer',
      notes: 'Monthly employer transfer'
    },
    {
      id: 'tx-2',
      user_id: userId,
      category_id: 'c1',
      title: 'Shoprite Groceries',
      amount: 1450,
      type: 'EXPENSE',
      transaction_date: yesterday,
      payment_method: 'MTN Mobile Money',
      notes: 'Monthly pantry & food'
    },
    {
      id: 'tx-3',
      user_id: userId,
      category_id: 'c3',
      title: 'ZESCO Prepaid Units',
      amount: 500,
      type: 'EXPENSE',
      transaction_date: today,
      payment_method: 'Airtel Money',
      notes: 'Prepaid electricity meter token'
    },
    {
      id: 'tx-4',
      user_id: userId,
      category_id: 'c2',
      title: 'Total Fuel Lusaka',
      amount: 800,
      type: 'EXPENSE',
      transaction_date: today,
      payment_method: 'Debit/Credit Card',
      notes: 'Fuel refill'
    }
  ];
}

function getDemoBudgets(userId: string): Budget[] {
  const currentMonth = new Date().toISOString().substring(0, 7);
  return [
    { id: 'b1', user_id: userId, category_id: 'c1', monthly_limit: 3500, month_year: currentMonth },
    { id: 'b2', user_id: userId, category_id: 'c2', monthly_limit: 2000, month_year: currentMonth },
    { id: 'b3', user_id: userId, category_id: 'c3', monthly_limit: 1000, month_year: currentMonth }
  ];
}

function getDemoSavingsGoals(userId: string): SavingsGoal[] {
  return [
    { id: 's1', user_id: userId, title: 'Emergency Fund', target_amount: 30000, current_amount: 12500, target_date: '2026-12-31', notes: '6 months buffer' },
    { id: 's2', user_id: userId, title: 'Chongwe Plot Deposit', target_amount: 60000, current_amount: 22000, target_date: '2027-06-30', notes: 'Residential plot land' }
  ];
}
