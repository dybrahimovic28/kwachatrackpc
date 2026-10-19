import React, { useState, useMemo } from 'react';
import { Budget, Category, Transaction } from '../../types';
import { formatKwacha } from '../../lib/formatters';
import { 
  PieChart, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface BudgetsTabProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  onOpenCreateBudget: () => void;
  onOpenEditBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetsTab: React.FC<BudgetsTabProps> = ({
  budgets,
  categories,
  transactions,
  onOpenCreateBudget,
  onOpenEditBudget,
  onDeleteBudget
}) => {
  const currentMonthYear = new Date().toISOString().substring(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthYear);

  // Compute spending per budget for the selected month
  const budgetsWithSpending = useMemo(() => {
    return budgets.map(b => {
      const cat = categories.find(c => c.id === b.category_id);
      const spent = transactions
        .filter(t => t.type === 'EXPENSE' && t.category_id === b.category_id && t.transaction_date.startsWith(b.month_year))
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = Math.max(0, b.monthly_limit - spent);
      const percentage = b.monthly_limit > 0 ? Math.round((spent / b.monthly_limit) * 100) : 0;
      const isExceeded = spent > b.monthly_limit;
      const isApproaching = percentage >= 80 && !isExceeded;

      return {
        ...b,
        category_name: cat?.name || 'Category',
        category_color: cat?.color_hex || '#00796B',
        category_icon: cat?.icon || 'category',
        spent,
        remaining,
        percentage,
        isExceeded,
        isApproaching
      };
    });
  }, [budgets, categories, transactions]);

  // Overall monthly budget summary
  const summary = useMemo(() => {
    const totalLimit = budgetsWithSpending.reduce((acc, b) => acc + b.monthly_limit, 0);
    const totalSpent = budgetsWithSpending.reduce((acc, b) => acc + b.spent, 0);
    const totalRemaining = Math.max(0, totalLimit - totalSpent);
    const overallPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

    return { totalLimit, totalSpent, totalRemaining, overallPercentage };
  }, [budgetsWithSpending]);

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
            Category Budgets
          </h2>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Plan monthly expense thresholds and monitor live spending progress in Zambian Kwacha.
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenCreateBudget}
          className="btn-primary"
          style={{ padding: '9px 18px', fontSize: '0.9rem' }}
        >
          <Plus size={16} /> Create Budget
        </button>
      </div>

      {/* Top Aggregated Summary Card */}
      {budgets.length > 0 && (
        <div className="white-card" style={{ padding: '24px 28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-navy)' }}>
              Overall Budget Utilization ({selectedMonth})
            </span>
            <span style={{
              fontSize: '0.84rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: summary.overallPercentage >= 100 ? '#FFE4E6' : summary.overallPercentage >= 80 ? '#FEF3C7' : '#D1FAE5',
              color: summary.overallPercentage >= 100 ? '#E11D48' : summary.overallPercentage >= 80 ? '#D97706' : '#059669'
            }}>
              {summary.overallPercentage}% Total Used
            </span>
          </div>

          <div style={{ height: '10px', backgroundColor: '#F1EFEA', borderRadius: '5px', overflow: 'hidden', marginBottom: '18px' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, summary.overallPercentage)}%`,
              backgroundColor: summary.overallPercentage >= 100 ? '#E11D48' : summary.overallPercentage >= 80 ? '#F59E0B' : 'var(--color-emerald)',
              borderRadius: '5px',
              transition: 'width 0.3s ease'
            }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>Total Budget Limit</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-navy)' }}>{formatKwacha(summary.totalLimit)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>Total Spent to Date</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: summary.overallPercentage >= 100 ? '#E11D48' : 'var(--color-navy)' }}>
                {formatKwacha(summary.totalSpent)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>Remaining Available</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{formatKwacha(summary.totalRemaining)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Budgets Grid / Empty State */}
      {budgetsWithSpending.length === 0 ? (
        <div className="white-card" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <PieChart size={44} color="var(--border-subtle)" style={{ margin: '0 auto 14px auto' }} />
          <h3 style={{ color: 'var(--color-navy)', fontSize: '1.2rem', marginBottom: '6px' }}>
            No Budgets Configured
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            Create category budgets to set monthly spending limits (e.g. Food & Groceries, Transport, ZESCO electricity) and keep expenses controlled.
          </p>
          <button
            type="button"
            onClick={onOpenCreateBudget}
            className="btn-primary"
            style={{ fontSize: '0.9rem', padding: '10px 22px' }}
          >
            <Plus size={16} /> Create Your First Budget
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {budgetsWithSpending.map(b => (
            <div key={b.id} className="white-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Card Header: Category & Warning Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: `${b.category_color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: b.category_color,
                      fontWeight: 800
                    }}>
                      <PieChart size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                        {b.category_name}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                        Month: {b.month_year}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => onOpenEditBudget(b)}
                      title="Edit budget limit"
                      style={{
                        background: '#F1EFEA',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '6px'
                      }}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBudget(b.id)}
                      title="Delete budget"
                      style={{
                        background: '#FEE2E2',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#DC2626',
                        cursor: 'pointer',
                        padding: '6px'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Status Alert Banner if Approaching or Exceeded */}
                {b.isExceeded && (
                  <div style={{
                    backgroundColor: '#FFE4E6',
                    border: '1px solid #FECDD3',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#9F1239',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    <AlertTriangle size={15} color="#E11D48" />
                    <span>Budget exceeded by {formatKwacha(b.spent - b.monthly_limit)}</span>
                  </div>
                )}

                {b.isApproaching && (
                  <div style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#92400E',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    <AlertCircle size={15} color="#D97706" />
                    <span>Approaching monthly limit ({b.percentage}%)</span>
                  </div>
                )}

                {/* Progress Bar */}
                <div style={{ height: '8px', backgroundColor: '#F1EFEA', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, b.percentage)}%`,
                    backgroundColor: b.isExceeded ? '#E11D48' : b.isApproaching ? '#F59E0B' : 'var(--color-emerald)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              {/* Card Footer: Metrics */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.86rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Spent</span>
                  <div style={{ fontWeight: 800, color: b.isExceeded ? '#E11D48' : 'var(--color-navy)' }}>
                    {formatKwacha(b.spent)}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Limit</span>
                  <div style={{ fontWeight: 800, color: 'var(--color-navy)' }}>
                    {formatKwacha(b.monthly_limit)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
