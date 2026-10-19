import React from 'react';
import { Transaction, Category, Budget, SavingsGoal, FinancialSummary, PeriodFilter } from '../../types';
import { formatKwacha, formatSignedKwacha, formatDate } from '../../lib/formatters';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  PieChart, 
  Target, 
  Receipt,
  Calendar
} from 'lucide-react';

interface OverviewTabProps {
  summary: FinancialSummary;
  period: PeriodFilter;
  onSelectPeriod: (period: PeriodFilter) => void;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  onOpenAddTransaction: (type?: 'EXPENSE' | 'INCOME') => void;
  onNavigateTab: (tab: 'overview' | 'transactions' | 'budgets' | 'savings' | 'reports') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  summary,
  period,
  onSelectPeriod,
  transactions,
  categories,
  budgets,
  savingsGoals,
  onOpenAddTransaction,
  onNavigateTab
}) => {
  const periodLabels: Record<PeriodFilter, string> = {
    THIS_MONTH: 'This Month',
    LAST_MONTH: 'Last Month',
    LAST_3_MONTHS: 'Last 3 Months',
    ALL_TIME: 'All Time'
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div>
      {/* Period Filter Selector Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#FFFFFF', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          {(['THIS_MONTH', 'LAST_MONTH', 'LAST_3_MONTHS', 'ALL_TIME'] as PeriodFilter[]).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => onSelectPeriod(p)}
              style={{
                background: period === p ? 'var(--color-navy)' : 'none',
                color: period === p ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: period === p ? 700 : 500,
                fontSize: '0.86rem',
                padding: '7px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Financial Hero Card: Available Balance & Net Cashflow */}
      <div style={{
        background: 'linear-gradient(135deg, #17243A 0%, #0F3E33 100%)',
        borderRadius: '20px',
        padding: '30px 32px',
        color: '#FFFFFF',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#A7F3D0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Available Balance
          </span>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={20} color="#6EE7B7" />
          </div>
        </div>

        <div style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '22px' }}>
          {formatKwacha(summary.totalCurrentBalance)}
        </div>

        {/* Row of Period Breakdown Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          paddingTop: '20px'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3px' }}>
              Period Income
            </div>
            <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#6EE7B7', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={16} /> {formatKwacha(summary.periodIncome)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3px' }}>
              Period Expenses
            </div>
            <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#FDA4AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowDownRight size={16} /> {formatKwacha(summary.periodExpenses)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3px' }}>
              Net Cashflow
            </div>
            <div style={{
              fontSize: '1.18rem',
              fontWeight: 800,
              color: summary.netCashflow >= 0 ? '#6EE7B7' : '#FDA4AF'
            }}>
              {formatSignedKwacha(summary.netCashflow, summary.netCashflow >= 0)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3px' }}>
              Opening Balance
            </div>
            <div style={{ fontSize: '1.18rem', fontWeight: 700, color: '#FFFFFF' }}>
              {formatKwacha(summary.openingBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Transactions + Budgets & Goals Widgets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Column: Recent Transactions */}
        <div className="white-card" style={{ padding: '24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Receipt size={20} color="var(--color-emerald)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                Recent Transactions
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('transactions')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-emerald)',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div style={{ padding: '36px 12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Receipt size={32} color="var(--border-subtle)" style={{ margin: '0 auto 10px auto' }} />
              <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem' }}>No transactions recorded for this period.</p>
              <button
                type="button"
                onClick={() => onOpenAddTransaction('EXPENSE')}
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '6px 14px' }}
              >
                + Add First Transaction
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentTransactions.map(tx => {
                const isIncome = tx.type === 'INCOME';
                const cat = categories.find(c => c.id === tx.category_id);
                return (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      backgroundColor: '#F8F7F3',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: isIncome ? '#D1FAE5' : '#FFE4E6',
                        color: isIncome ? '#059669' : '#E11D48',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800
                      }}>
                        {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.92rem' }}>
                          {tx.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span>{cat?.name || 'General'}</span>
                          <span>•</span>
                          <span>{formatDate(tx.transaction_date)}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      fontWeight: 800,
                      fontSize: '0.96rem',
                      color: isIncome ? '#059669' : '#E11D48'
                    }}>
                      {formatSignedKwacha(tx.amount, isIncome)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Budgets & Savings Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Budgets Widget */}
          <div className="white-card" style={{ padding: '24px 26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={20} color="var(--color-emerald)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                  Monthly Budgets
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('budgets')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-emerald)',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Manage <ArrowRight size={14} />
              </button>
            </div>

            {budgets.length === 0 ? (
              <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem' }}>No monthly budgets configured yet.</p>
                <button
                  type="button"
                  onClick={() => onNavigateTab('budgets')}
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                >
                  + Set Category Budget
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {budgets.slice(0, 3).map(b => {
                  const cat = categories.find(c => c.id === b.category_id);
                  const currentMonth = new Date().toISOString().substring(0, 7);
                  const spent = transactions
                    .filter(t => t.type === 'EXPENSE' && t.category_id === b.category_id && t.transaction_date.startsWith(currentMonth))
                    .reduce((sum, t) => sum + t.amount, 0);
                  const percentage = Math.min(100, Math.round((spent / b.monthly_limit) * 100));
                  const isOver = spent > b.monthly_limit;

                  return (
                    <div key={b.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{cat?.name || 'Category'}</span>
                        <span style={{ fontWeight: 700, color: isOver ? '#E11D48' : percentage > 80 ? '#D97706' : 'var(--color-emerald)' }}>
                          {formatKwacha(spent)} / {formatKwacha(b.monthly_limit)} ({percentage}%)
                        </span>
                      </div>
                      <div style={{ height: '7px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: isOver ? '#E11D48' : percentage > 80 ? '#F59E0B' : 'var(--color-emerald)',
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Savings Goals Widget */}
          <div className="white-card" style={{ padding: '24px 26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} color="var(--color-emerald)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                  Savings Goals
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('savings')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-emerald)',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Manage <ArrowRight size={14} />
              </button>
            </div>

            {savingsGoals.length === 0 ? (
              <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem' }}>No savings goals created yet.</p>
                <button
                  type="button"
                  onClick={() => onNavigateTab('savings')}
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                >
                  + Create Savings Goal
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {savingsGoals.slice(0, 3).map(s => {
                  const percentage = Math.min(100, Math.round((s.current_amount / s.target_amount) * 100));
                  return (
                    <div key={s.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{s.title}</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-emerald)' }}>
                          {formatKwacha(s.current_amount)} / {formatKwacha(s.target_amount)} ({percentage}%)
                        </span>
                      </div>
                      <div style={{ height: '7px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: 'linear-gradient(90deg, #10B981, #059669)',
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
