import React, { useMemo } from 'react';
import { Transaction, Category, Budget, SavingsGoal, PeriodFilter } from '../../types';
import { formatKwacha, formatSignedKwacha, exportTransactionsToCsv } from '../../lib/formatters';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Download, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Receipt,
  Wallet
} from 'lucide-react';

interface ReportsTabProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  period: PeriodFilter;
  onSelectPeriod: (p: PeriodFilter) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  transactions,
  categories,
  budgets,
  savingsGoals,
  period,
  onSelectPeriod
}) => {
  const periodLabels: Record<PeriodFilter, string> = {
    THIS_MONTH: 'This Month',
    LAST_MONTH: 'Last Month',
    LAST_3_MONTHS: 'Last 3 Months',
    ALL_TIME: 'All Time'
  };

  // 1. KPI Calculations
  const metrics = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach(t => {
      if (t.type === 'INCOME') income += t.amount;
      else expenses += t.amount;
    });

    const net = income - expenses;
    const savingsRate = income > 0 ? Math.max(0, Math.round((net / income) * 100)) : 0;

    return { income, expenses, net, savingsRate };
  }, [transactions]);

  // 2. Category Spending Breakdown
  const categoryExpenses = useMemo(() => {
    const map: Record<string, { name: string; amount: number; color: string }> = {};

    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const cat = categories.find(c => c.id === t.category_id);
      const name = cat?.name || 'General & Other';
      const color = cat?.color_hex || '#00796B';

      if (!map[name]) {
        map[name] = { name, amount: 0, color };
      }
      map[name].amount += t.amount;
    });

    const list = Object.values(map).sort((a, b) => b.amount - a.amount);
    const totalExp = metrics.expenses || 1;

    return list.map(item => ({
      ...item,
      percentage: Math.round((item.amount / totalExp) * 100)
    }));
  }, [transactions, categories, metrics.expenses]);

  // 3. Income Breakdown by Category
  const categoryIncomes = useMemo(() => {
    const map: Record<string, { name: string; amount: number; color: string }> = {};

    transactions.filter(t => t.type === 'INCOME').forEach(t => {
      const cat = categories.find(c => c.id === t.category_id);
      const name = cat?.name || 'General Income';
      const color = cat?.color_hex || '#2E7D32';

      if (!map[name]) {
        map[name] = { name, amount: 0, color };
      }
      map[name].amount += t.amount;
    });

    const list = Object.values(map).sort((a, b) => b.amount - a.amount);
    const totalInc = metrics.income || 1;

    return list.map(item => ({
      ...item,
      percentage: Math.round((item.amount / totalInc) * 100)
    }));
  }, [transactions, categories, metrics.income]);

  // 4. Payment Method Distribution
  const paymentMethods = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach(t => {
      const method = t.payment_method || 'Cash';
      map[method] = (map[method] || 0) + t.amount;
    });

    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(map).map(([method, amount]) => ({
      method,
      amount,
      percentage: Math.round((amount / total) * 100)
    })).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const handleExport = () => {
    exportTransactionsToCsv(transactions, `kwachatrack_report_${period.toLowerCase()}.csv`);
  };

  return (
    <div>
      {/* Top Controls: Period Filter & Export */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
            Financial Reports & Analytics
          </h2>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Deep-dive into your cash-flow trends, spending categories, and savings performance.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Period Pills */}
          <div style={{ display: 'flex', gap: '6px', background: '#FFFFFF', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            {(['THIS_MONTH', 'LAST_MONTH', 'LAST_3_MONTHS', 'ALL_TIME'] as PeriodFilter[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => onSelectPeriod(p)}
                style={{
                  background: period === p ? 'var(--color-navy)' : 'none',
                  color: period === p ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: period === p ? 700 : 500,
                  fontSize: '0.84rem',
                  padding: '6px 14px',
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

          <button
            type="button"
            onClick={handleExport}
            className="btn-secondary"
            disabled={transactions.length === 0}
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="white-card" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <BarChart3 size={44} color="var(--border-subtle)" style={{ margin: '0 auto 14px auto' }} />
          <h3 style={{ color: 'var(--color-navy)', fontSize: '1.2rem', marginBottom: '6px' }}>
            No Financial Records for this Period
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
            To view analytical reports, record transactions or switch the period filter to 'All Time' or 'This Month'.
          </p>
        </div>
      ) : (
        <>
          {/* Top KPI Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '18px',
            marginBottom: '26px'
          }}>
            <div className="white-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Period Income</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                {formatKwacha(metrics.income)}
              </div>
            </div>

            <div className="white-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Period Expenses</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFE4E6', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowDownRight size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E11D48' }}>
                {formatKwacha(metrics.expenses)}
              </div>
            </div>

            <div className="white-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Net Cashflow</span>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: metrics.net >= 0 ? '#D1FAE5' : '#FFE4E6',
                  color: metrics.net >= 0 ? '#059669' : '#E11D48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: metrics.net >= 0 ? '#059669' : '#E11D48' }}>
                {formatSignedKwacha(metrics.net, metrics.net >= 0)}
              </div>
            </div>

            <div className="white-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Net Savings Rate</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--color-mint)', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wallet size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                {metrics.savingsRate}%
              </div>
            </div>
          </div>

          {/* Visualization 1: Cash Flow Comparison Bar Chart */}
          <div className="white-card" style={{ padding: '26px', marginBottom: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                Income vs. Expense Balance
              </h3>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#059669' }} /> Income
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E11D48' }} /> Expenses
                </span>
              </div>
            </div>

            {/* Visual comparative bar display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>Total Inflow</span>
                  <strong style={{ color: '#059669' }}>{formatKwacha(metrics.income)}</strong>
                </div>
                <div style={{ height: '14px', backgroundColor: '#F1EFEA', borderRadius: '7px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${metrics.income + metrics.expenses > 0 ? Math.round((metrics.income / (metrics.income + metrics.expenses)) * 100) : 0}%`,
                    backgroundColor: '#059669',
                    borderRadius: '7px'
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>Total Outflow</span>
                  <strong style={{ color: '#E11D48' }}>{formatKwacha(metrics.expenses)}</strong>
                </div>
                <div style={{ height: '14px', backgroundColor: '#F1EFEA', borderRadius: '7px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${metrics.income + metrics.expenses > 0 ? Math.round((metrics.expenses / (metrics.income + metrics.expenses)) * 100) : 0}%`,
                    backgroundColor: '#E11D48',
                    borderRadius: '7px'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Visualization 2 & 3: Category Expenses vs Category Incomes Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '26px'
          }}>
            {/* Category Expenses Breakdown */}
            <div className="white-card" style={{ padding: '24px 26px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 18px 0' }}>
                Spending by Category
              </h3>

              {categoryExpenses.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  No expense records in this period.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {categoryExpenses.map(item => (
                    <div key={item.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                          {item.name}
                        </span>
                        <span>
                          <strong style={{ color: 'var(--color-navy)' }}>{formatKwacha(item.amount)}</strong>
                          <span style={{ color: 'var(--text-secondary)', marginLeft: '6px' }}>({item.percentage}%)</span>
                        </span>
                      </div>
                      <div style={{ height: '7px', backgroundColor: '#F1EFEA', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Income Sources Breakdown */}
            <div className="white-card" style={{ padding: '24px 26px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 18px 0' }}>
                Income Sources
              </h3>

              {categoryIncomes.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  No income records in this period.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {categoryIncomes.map(item => (
                    <div key={item.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                          {item.name}
                        </span>
                        <span>
                          <strong style={{ color: '#059669' }}>{formatKwacha(item.amount)}</strong>
                          <span style={{ color: 'var(--text-secondary)', marginLeft: '6px' }}>({item.percentage}%)</span>
                        </span>
                      </div>
                      <div style={{ height: '7px', backgroundColor: '#F1EFEA', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${item.percentage}%`,
                          backgroundColor: '#059669',
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Visualization 4: Payment Channel Distribution */}
          <div className="white-card" style={{ padding: '24px 26px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 18px 0' }}>
              Payment Channel Usage
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {paymentMethods.map(pm => (
                <div
                  key={pm.method}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: '#F8F7F3',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.9rem' }}>{pm.method}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-emerald)' }}>{pm.percentage}%</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>
                    {formatKwacha(pm.amount)}
                  </div>
                  <div style={{ height: '5px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pm.percentage}%`,
                      backgroundColor: 'var(--color-emerald)',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
